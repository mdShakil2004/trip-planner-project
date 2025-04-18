const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const { addMessage } = require("../controllers/chatController");
const Message = require("../models/Message");
const UserAvatar = require("../models/UserAvatar");
const Group = require("../models/Group");

const users = new Map();
const typingUsers = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws) => {
    let userId = null;
    let currentGroupId = null;

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        if (!data.type) return;

        // Authentication on connection
        if (data.type === "auth") {
          const { token, groupId, avatar, userName } = data;
          if (!token) {
            console.error("Error: Token is missing");
            return;
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          currentGroupId = groupId;
          // Use userName from client, fallback to default if not provided
          users.set(userId, {
            ws,
            userName: userName || `User_${userId.slice(-4)}`,
            groupId: currentGroupId,
            avatar,
          });
          // console.log("User authenticated:", users.get(userId)); // Debug log

          const userAvatar = await UserAvatar.findOne({ userId });
          const group = currentGroupId ? await Group.findOne({ groupId: currentGroupId }) : null;
          const messages = currentGroupId
            ? await Message.find({ groupId: currentGroupId }).sort({ timestamp: 1 })
            : [];

          if (group && !group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
          }

          ws.send(
            JSON.stringify({
              type: "init",
              userId,
              userName: users.get(userId).userName, // Send back the stored userName
              messages,
              groupId: currentGroupId,
              avatar: userAvatar ? userAvatar.avatarUrl : avatar || "http://localhost:5000/uploads/default-avatar.jpg",
              onlineCount: getOnlineCount(currentGroupId),
              groupInviteLink: group ? `http://localhost:5000/join/${group.inviteLink}` : null,
            })
          );
          broadcastOnlineCount(wss, currentGroupId);
          broadcastTypingStatus(wss, currentGroupId);
          return;
        }

        // Handle group creation
        if (data.type === "createGroup" && userId) {
          const groupId = Date.now().toString();
          const inviteCode = Math.random().toString(36).substring(2, 10);
          const newGroup = new Group({
            groupId,
            inviteLink: inviteCode,
            members: [userId],
          });
          await newGroup.save();
          currentGroupId = groupId;
          users.get(userId).groupId = groupId;

          ws.send(
            JSON.stringify({
              type: "init",
              userId,
              userName: users.get(userId).userName,
              messages: [],
              groupId,
              avatar: users.get(userId).avatar,
              onlineCount: 1,
              groupInviteLink: `http://localhost:5000/join/${inviteCode}`,
            })
          );
          broadcastOnlineCount(wss, groupId);
          return;
        }

        // Handle group joining
        if (data.type === "joinGroup" && data.inviteCode && userId) {
          const group = await Group.findOne({ inviteLink: data.inviteCode });
          if (group) {
            currentGroupId = group.groupId;
            users.get(userId).groupId = currentGroupId;
            if (!group.members.includes(userId)) {
              group.members.push(userId);
              await group.save();
            }
            const messages = await Message.find({ groupId: currentGroupId }).sort({ timestamp: 1 });
            const userAvatar = await UserAvatar.findOne({ userId });

            ws.send(
              JSON.stringify({
                type: "init",
                userId,
                userName: users.get(userId).userName,
                messages,
                groupId: currentGroupId,
                avatar: userAvatar ? userAvatar.avatarUrl : users.get(userId).avatar,
                onlineCount: getOnlineCount(currentGroupId),
                groupInviteLink: `http://localhost:5000/join/${group.inviteLink}`,
              })
            );
            broadcastOnlineCount(wss, currentGroupId);
          }
          return;
        }

        // Handle group leaving
        if (data.type === "leaveGroup" && userId && data.groupId) {
          const group = await Group.findOne({ groupId: data.groupId });
          if (group && group.members.includes(userId)) {
            group.members = group.members.filter((member) => member !== userId);
            await group.save();
            users.get(userId).groupId = null;
            currentGroupId = null;
            ws.send(
              JSON.stringify({
                type: "init",
                userId,
                userName: users.get(userId).userName,
                messages: [],
                groupId: null,
                avatar: users.get(userId).avatar,
                onlineCount: 0,
                groupInviteLink: null,
              })
            );
            broadcastOnlineCount(wss, data.groupId);
          }
          return;
        }

        // Handle username update (optional, if you want explicit updates)
        if (data.type === "updateUserName" && data.userName && userId) {
          users.get(userId).userName = data.userName;
          broadcastOnlineCount(wss, currentGroupId);
          return;
        }

        // Handle read status request
        if (data.type === "getReadStatus" && data.messageId && data.groupId) {
          broadcastReadStatus(wss, data.messageId, data.groupId);
          return;
        }

        // Handle typing status
        if (data.type === "typing" && userId && data.groupId) {
          const groupTypingUsers = typingUsers.get(data.groupId) || new Set();
          if (data.isTyping) {
            groupTypingUsers.add(userId);
          } else {
            groupTypingUsers.delete(userId);
          }
          typingUsers.set(data.groupId, groupTypingUsers);
          broadcastTypingStatus(wss, data.groupId);
          return;
        }

        // Handle message deletion
        if (data.type === "deleteMessage" && data.messageId && data.groupId) {
          const messageId = Number(data.messageId);
          // console.log("Received delete request:", { messageId, groupId: data.groupId, userId });
          const msg = await Message.findOne({ id: messageId, groupId: data.groupId });
          // console.log("Message found:", msg);
          if (msg && msg.userId === userId) {
            // console.log("Deleting message:", { messageId, groupId: data.groupId, userId });
            await Message.updateOne(
              { id: messageId, groupId: data.groupId },
              { content: "Something deleted", deleted: true }
            ).catch((err) => console.error("Update failed:", err));
            broadcastDeleteMessage(wss, messageId, data.groupId);
            // console.log("Delete broadcast sent for message:", messageId);
          }
          //  else {
          //   console.log("Delete failed: Message not found or unauthorized", { msg, userId });
          // }
          return;
        }

        // Handle messages (text, image, voice, read)
        if (!currentGroupId) return;
        const newMessage = {
          id: Date.now(),
          userId: userId || data.userId,
          userName: data.userName || users.get(userId)?.userName || `User_${userId.slice(-4)}`, // Prefer client-sent userName
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
          status: "Delivered",
          groupId: currentGroupId,
          replyTo: data.replyTo || null,
          readBy: [{ userId: userId || data.userId, timestamp: new Date().toISOString() }],
          avatar: users.get(userId)?.avatar || data.avatar,
        };

        // Update userName in users Map if provided in message
        if (data.userName && data.userName !== users.get(userId)?.userName) {
          users.get(userId).userName = data.userName;
          broadcastOnlineCount(wss, currentGroupId); // Update online users with new name
        }

        switch (data.type) {
          case "text":
            newMessage.contentType = "text";
            newMessage.content = data.content;
            break;
          case "image":
            newMessage.contentType = "image";
            newMessage.content = data.content;
            break;
          case "voice":
            newMessage.contentType = "voice";
            newMessage.content = data.content;
            break;
          case "read":
            const msg = await Message.findOne({ id: data.messageId, groupId: data.groupId });
            if (msg && !msg.readBy.some((r) => r.userId === userId)) {
              msg.readBy.push({ userId, timestamp: new Date().toISOString() });
              await msg.save();
              broadcastMessage(wss, msg, data.groupId);
            }
            return;
          default:
            return;
        }

        await addMessage(newMessage);
        broadcastMessage(wss, newMessage, currentGroupId);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      if (userId) {
        users.delete(userId);
        if (currentGroupId) {
          const groupTypingUsers = typingUsers.get(currentGroupId) || new Set();
          groupTypingUsers.delete(userId);
          typingUsers.set(currentGroupId, groupTypingUsers);
          broadcastOnlineCount(wss, currentGroupId);
          broadcastTypingStatus(wss, currentGroupId);
        }
      }
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error);
  });

  return wss;
}

function broadcastMessage(wss, message, groupId) {
  wss.clients.forEach((client) => {
    const user = Array.from(users.entries()).find(([_, u]) => u.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user[1].groupId === groupId) {
      client.send(
        JSON.stringify({
          type: "message",
          message,
          groupId,
        })
      );
    }
  });
}

function broadcastOnlineCount(wss, groupId) {
  const onlineUsers = Array.from(users.entries())
    .filter(([_, user]) => user.groupId === groupId)
    .map(([userId, { userName }]) => ({ userId, userName }));
  wss.clients.forEach((client) => {
    const user = Array.from(users.entries()).find(([_, u]) => u.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user[1].groupId === groupId) {
      client.send(
        JSON.stringify({
          type: "onlineUpdate",
          onlineCount: onlineUsers.length,
          onlineUsers,
          groupId,
        })
      );
    }
  });
}

async function broadcastReadStatus(wss, messageId, groupId) {
  const message = await Message.findOne({ id: messageId, groupId });
  if (!message) return;

  const onlineUsers = Array.from(users.entries())
    .filter(([_, user]) => user.groupId === groupId)
    .map(([userId, { userName }]) => {
      const readEntry = message.readBy.find((r) => r.userId === userId);
      return {
        userId,
        userName,
        hasRead: !!readEntry,
        readTimestamp: readEntry ? readEntry.timestamp : null,
      };
    });

  wss.clients.forEach((client) => {
    const user = Array.from(users.entries()).find(([_, u]) => u.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user[1].groupId === groupId) {
      client.send(
        JSON.stringify({
          type: "readStatus",
          messageId,
          onlineCount: onlineUsers.length,
          onlineUsers,
          groupId,
        })
      );
    }
  });
}

function broadcastTypingStatus(wss, groupId) {
  const groupTypingUsers = typingUsers.get(groupId) || new Set();
  const typingCount = groupTypingUsers.size;
  wss.clients.forEach((client) => {
    const user = Array.from(users.entries()).find(([_, u]) => u.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user[1].groupId === groupId) {
      client.send(
        JSON.stringify({
          type: "typingStatus",
          typingCount,
          groupId,
        })
      );
    }
  });
}

function broadcastDeleteMessage(wss, messageId, groupId) {
  wss.clients.forEach((client) => {
    const user = Array.from(users.entries()).find(([_, u]) => u.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user[1].groupId === groupId) {
      client.send(
        JSON.stringify({
          type: "deleteMessage",
          messageId,
          groupId,
        })
      );
    }
  });
}

function getOnlineCount(groupId) {
  return Array.from(users.values()).filter((user) => user.groupId === groupId).length;
}

module.exports = { setupWebSocket };