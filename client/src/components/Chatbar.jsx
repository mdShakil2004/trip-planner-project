// Chatbar.jsx
  // Import necessary React hooks and libraries for state, effects, refs, and context
import { useState, useEffect, useRef, useContext } from "react";
// Import static assets (icons, images) from the assets file
import { assets } from "../assets/assets";
// Import Avatar component and configuration generator for user avatars
import Avatar, { genConfig } from "react-nice-avatar";
// Import WaveSurfer for rendering and playing voice message waveforms
import WaveSurfer from "wavesurfer.js";
// Import custom CSS for microphone animation
import "../animation/mic.css";
// Import App context to access login data and token
import { AppContext } from "../context/AppContext"; // Import AppContext for authentication
import {toast} from "react-toastify"
// Define the Chatbar component
function Chatbar() {
    // Access loginData and Token from LoginContext using useContext
  const { login, loginData, Token,  selectedAvatar,
    setSelectedAvatar,setGroupLink,
    defaultAvatars, setShowLogin,backendUrl } = useContext(AppContext); // Use AppContext

    // State variables for managing chat functionality and UI
  const [userId, setUserId] = useState(""); // // Unique ID for the current user 
  const [userName, setUserName] = useState(""); // display the name of current user 
  const [message, setMessage] = useState(""); // text input from  the user 
  const [messages, setMessages] = useState([]); // array of chat messages 
  const [isConnected, setIsConnected] = useState(false);  // WebSocket connection status
  const [isRecording, setIsRecording] = useState(false); // voice recording status 
  const [replyTo, setReplyTo] = useState(null);  // messages being replied to 
  const [userAvatarConfig, setUserAvatarConfig] = useState(null); // Number of online users
  const [avatars, setAvatars] = useState({});   //  user avatars 
  const [onlineCount, setOnlineCount] = useState(0);  // list of online users 
  const [onlineUsers, setOnlineUsers] = useState([]);  //
  const [showOnlineList, setShowOnlineList] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [typingCount, setTypingCount] = useState(0);
  const [inviteLink, setInviteLink] = useState("");
  const [groupId, setGroupId] = useState(null); // Track current group
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [playingState, setPlayingState] = useState({});
  const [showAvatarList, setShowAvatarList] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const fileInputRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const avatarInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const waveformRefs = useRef({});







  useEffect(() => {
    
    const storedGroupId = localStorage.getItem("groupId");
    if (storedGroupId) {
      setGroupId(storedGroupId); // Restore group from local storage
    }

    // console.log("Initializing WebSocket");
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      // console.log("WebSocket connected");
      setIsConnected(true);
      ws.current.send(
        JSON.stringify({
          type: "auth",
          token: Token,
          groupId: storedGroupId || null,
          avatar: userAvatarConfig ? JSON.stringify(selectedAvatar) : JSON.stringify(defaultAvatars[0]),
          userName: loginData?.name || "Anonymous",
        })
      );
    };




    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // console.log("Received:.... ", data);
      if (data.type === "init") {
        setUserId(data.userId || loginData._id);
        setMessages(data.messages || []);
        setUserName(loginData.name);
        setGroupId(data.groupId);
        localStorage.setItem("groupId", data.groupId); // Persist group ID
        const initialAvatar = selectedAvatar;
        setUserAvatarConfig(initialAvatar);
        setAvatars((prev) => ({
          ...prev,
          [data.userId || loginData._id]: initialAvatar, 
        }));
        setOnlineCount(data.onlineCount);
        setInviteLink(data.groupInviteLink);
        setGroupLink(data.groupInviteLink);
      } else if (data.type === "message" && data.groupId === groupId) {
        setMessages((prev) => {
          if (!prev.some((msg) => msg.id === data.message.id)) {
            const senderAvatar = avatars[data.message.userId] || data.message.avatar || defaultAvatars[Math.floor(Math.random() * 25)];
            setAvatars((prevAvatars) => ({
              ...prevAvatars,
              [data.message.userId]: senderAvatar,
            }));
            return [
              ...prev,
              { ...data.message, avatar: senderAvatar, readBy: data.message.readBy || [] },
            ];
          }
          return prev;
        });
        if (data.message.userId !== userId && messagesEndRef.current) {
          ws.current.send(
            JSON.stringify({
              type: "read",
              messageId: data.message.id,
              groupId,
            })
          );
        }
      } else if (data.type === "onlineUpdate") {
        setOnlineCount(data.onlineCount);
        setOnlineUsers(data.onlineUsers);
      } else if (data.type === "readStatus") {
        setOnlineCount(data.onlineCount);
        setOnlineUsers(data.onlineUsers);
      } else if (data.type === "typingStatus") {
        setTypingCount(data.typingCount);
      } 
      
      else if (data.type === "deleteMessage" && data.groupId === groupId) {
        // console.log("Delete event received:", data);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, content: "Message deleted", deleted: true } : msg
          )
        );
      }
    };

    ws.current.onerror = (error) => {
      // console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      // console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      // console.log("Cleaning up WebSocket");
      if (ws.current) ws.current.close();
      Object.values(waveformRefs.current).forEach((waveform) => waveform.destroy());
      waveformRefs.current = {};
    };
  }, [login, loginData, Token, groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const createGroup = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "createGroup",
          userId: loginData._id,
          token: Token,
        })
      );
    }
  };








  const handleJoinGroup = () => {
    if (joinLink && ws.current && ws.current.readyState === WebSocket.OPEN) {
      const groupCode = joinLink.split("/join/")[1];
      ws.current.send(
        JSON.stringify({
          type: "joinGroup",
          inviteCode: groupCode,
          userId: loginData._id,
          token: Token,
        })
      );
      setJoinLink("");
      setShowGroupOptions(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !isConnected) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", userId);

    const response = await fetch(backendUrl+"/api/avatar", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

   
    setUserAvatarConfig(data.url);
    setAvatars((prev) => ({ ...prev, [userId]: data.url }));
  };

  const handleAvatarSelect = (config) => {
    setUserAvatarConfig(config);
    setAvatars((prev) => ({ ...prev, [userId]: config }));
    setShowAvatarList(false);
  };

  const getUserAvatar = (userId) => {
    return avatars[userId] ;
  };

  const sendMessage = (e, type, content) => {
    e?.preventDefault();
    if (!content || (!content.trim() && type === "text") || !isConnected || !groupId) return;

    const newMessage = {
      type,
      userId,
      userName: loginData.name,
      content,
      groupId,
      avatar: userAvatarConfig ? JSON.stringify(selectedAvatar) : JSON.stringify(defaultAvatars[0]),
      replyTo: replyTo ? { id: replyTo.id, userName: replyTo.userName, content: replyTo.content } : null,
      timestamp: new Date().toISOString(),
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newMessage));
      setMessage("");
      setReplyTo(null);
      if (type === "voice") setIsRecording(false);
      ws.current.send(JSON.stringify({ type: "typing", isTyping: false, groupId }));
    }
  };

  const sendTextMessage = (e) => sendMessage(e, "text", message);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !isConnected) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(backendUrl+"/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    sendMessage(null, "image", data.url);
  };

  const toggleRecording = async () => {
    if (!isConnected) return;

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];

        audioRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
        audioRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", blob, "voice.webm");

          const response = await fetch(backendUrl+"/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          sendMessage(null, "voice", data.url);
        };

        audioRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
              toast.error('Failed to create trip. Please try again later.');
        
      }
    } else {
      audioRecorderRef.current.stop();
      audioRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
    document.querySelector('input[type="text"]').focus();
  };

  const handleSelectMessage = (msgId) => {
    setSelectedMessageId(msgId);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "getReadStatus",
          messageId: msgId,
          groupId,
        })
      );
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "typing", isTyping: true, groupId }));

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        ws.current.send(JSON.stringify({ type: "typing", isTyping: false, groupId }));
      }, 2000);
    }
  };

  const handlePlayPause = (msgId) => {
    const waveform = waveformRefs.current[msgId];
    if (waveform) {
      if (waveform.isPlaying()) {
        waveform.pause();
        setPlayingState((prev) => ({ ...prev, [msgId]: false }));
      } else {
        waveform.play();
        setPlayingState((prev) => ({ ...prev, [msgId]: true }));
      }
    }
  };

  const handleLeaveGroup = () => {
    setIsConnected(false);
    setMessages([]);
    setOnlineCount(0);
    setOnlineUsers([]);
    setInviteLink("");
    setGroupId(null);
    setShowAvatarPicker(false);
    localStorage.removeItem("groupId");
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "leaveGroup",
          userId,
          groupId,
        })
      );
    }
  };

  const handleDeleteMessage = (msgId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) 
      {
      // console.log("Sending delete request:", { messageId: msgId, groupId });
      ws.current.send(
        JSON.stringify({
          type: "deleteMessage",
          messageId: msgId,
          groupId,
        })
      );
    }
    // else {
    //   console.error("WebSocket is not connected");
    // }
  };

  const renderMessageContent = (msg) => {
    if (msg.deleted) {
      return <span className="text-red-800/70 italic text-xs sm:text-sm">Message deleted</span>;
    }
    switch (msg.contentType || msg.type) {
      case "text":
        return <span className="mb-0 whitespace-pre-wrap text-xs sm:text-sm">{msg.content}</span>;
      case "image":
        return <img src={msg.content} alt="Shared" className="max-w-[150px] sm:max-w-[200px] rounded-lg shadow" />;
      case "voice":
        return (
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              className="w-24 sm:w-32 h-8 sm:h-10"
              ref={(el) => {
                if (el && !waveformRefs.current[msg.id]) {
                  waveformRefs.current[msg.id] = WaveSurfer.create({
                    container: el,
                    waveColor: "#4B5EAA",
                    progressColor: "#2A3F7B",
                    height: window.innerWidth < 640 ? 32 : 40,
                    barWidth: 2,
                    cursorWidth: 0,
                    responsive: true,
                  });
                  waveformRefs.current[msg.id].load(msg.content);
                  waveformRefs.current[msg.id].on("finish", () => {
                    setPlayingState((prev) => ({ ...prev, [msg.id]: false }));
                  });
                }
              }}
            />
            <button
              onClick={() => handlePlayPause(msg.id)}
              className="p-1 bg-gray-300 rounded-full hover:bg-gray-400"
            >
              <img
                src={playingState[msg.id] ? assets.pause_icon : assets.play_icon}
                alt={playingState[msg.id] ? "Pause" : "Play"}
                className="w-3 h-3 sm:w-4 sm:h-4"
              />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderReplyPreview = (reply) => (
    <div className="bg-gray-300 p-2 rounded-t-lg border-l-4 border-blue-500 flex items-start gap-1 sm:gap-2">
      <Avatar style={{ width: "20px", height: "16px" }} {...getUserAvatar(reply.id)} />
      <div className="flex flex-col">
        <span className="text-[10px] sm:text-xs text-gray-800 font-semibold">{reply.userName}</span>
        <span className="text-xs sm:text-sm text-gray-800 truncate">{reply.content}</span>
      </div>
    </div>
  );

  const renderReadStatus = (msg) => {
    if (msg.userId !== userId) return null;
    const readCount = msg.readBy ? msg.readBy.length - 1 : 0;
    const unreadCount = onlineCount - readCount - 1;
    return (
      <div className="flex gap-2 items-start justify-start sm:gap-2">
        <p className="text-[10px] sm:text-xs text-gray-900 mt-1">
          {readCount > 0 ? `Read by ${readCount}` : ""}
          {unreadCount > 0 && ` Unread by ${unreadCount}`}
        </p>
        {!msg.deleted && (
          <button
            onClick={() => handleDeleteMessage(msg.id)}
            className="text-[10px] sm:text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const renderTypingStatus = () => {
    if (typingCount === 0) return null;
    let typingText = typingCount === 1 ? "Someone is Typing..." : "2+ Typing...";
    return <p className="text-xs sm:text-sm text-red-500 italic animate-pulse">{typingText}</p>;
  };

  const renderGroupOptions = () => (
    <div className="absolute top-14 left-10 mt-1 sm:mt-2 bg-gray-400 rounded-lg shadow-lg p-2 sm:p-2 z-30 md:w-auto sm:w-auto">
      <div className="flex justify-end pr-0">
        <button className="z-50" onClick={() => setShowGroupOptions(false)}>
          <img src={assets.cross_icon} width={20} alt="close" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800">Create New Group</p>
          <button
            onClick={createGroup}
            className="text-[12px] sm:text-xs text-blue-500 underline"
          >
          Generate Group Link
          </button>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800">Group Link</p>
          <button
            onClick={() => navigator.clipboard.writeText(inviteLink)}
            className="text-[11px] sm:text-xs text-blue-500 underline break-all"
          >
            {inviteLink || "No group joined"}
          </button>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-700">Join Group</p>
          <input
            type="text"
            value={joinLink}
            onChange={(e) => setJoinLink(e.target.value)}
            placeholder="Paste group link here"
            className="w-full p-1 border border-gray-300 rounded text-[10px] sm:text-sm"
          />
          <button
            onClick={handleJoinGroup}
            className="mt-1 text-[12px] sm:text-xs no-underline   hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-[2px] px-3 border border-blue-500 hover:border-transparent rounded "
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );

 

  // if (!groupId) {
  //   return (
  //     <div className="flex relative z-20  flex-col  items-center justify-center h-[550px] bg-slate-700">
  //       <p className="text-white mb-4">Join or create a group to start chatting!</p>
  //       {/* <button
  //         onClick={() => setShowGroupOptions(true)}
  //         className="text-white justify-center  items-center  bg-blue-500  px-4 py-2 rounded"
  //       >
  //         Group Options
  //       </button> */}
  //       {showGroupOptions && renderGroupOptions()}
  //     </div>
  //   );
  // }



  const optionHandle=()=>{
    if(loginData==null)
    {
      setShowLogin(true);
    }
    setShowGroupOptions(!showGroupOptions)
  }
  return (
    <div className="flex flex-col  h-[550px]">
      <div className="relative z-[1] flex bg-slate-700 flex-col h-full">
        <div className="p-1 sm:p-4 flex h-[70px] bg-blue-500 justify-between items-center sticky z-10">
          <div className=" flex-col items-center gap-1 sm:gap-2">
            <h3 className="text-base sm:text-2xl font-semibold text-white">
              {/* Group Chat {groupId} */}
              Group Chat
            </h3>
            <button
              onClick={() => optionHandle()} 
              className="text-[10px]  sm:text-sm text-white mt-0.5 sm:mt-1"
            >
              <span className="text-base sm:text-sm md:text-sm italic">options</span>
            </button>
          </div>
          {loginData==null?" ":(
          <div className="flex items-center gap-1 sm:gap-2">
           
            <button
              onClick={() => setShowOnlineList(!showOnlineList)}
              className={`text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              } text-white`}
            >
              {isConnected ? `${onlineCount} Online` : "Offline"}
            </button>
            {isConnected && (
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="text-white hover:text-gray-200"
              >
                <Avatar style={{ width: "28px", height: "28px" }} {...userAvatarConfig} />
              </button>
            )}
         
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              hidden
            />
          </div>
           )} 
          {showGroupOptions && renderGroupOptions()}
          {showOnlineList && (<div className="absolute top-12 right-6 mt-1 sm:mt-2 md:mt-4 lg:mt-6 bg-gray-400 rounded-lg shadow-lg p-2 sm:p-4 md:p-6 lg:p-8 z-10 max-h-[50vh] overflow-y-auto w-40 sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4">
              <button className="z-40" onClick={() => setShowOnlineList(false)}>
                <img src={assets.cross_icon} width={20} className="mt-[-8px] z-40" alt="close" />
              </button>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-800">
                {selectedMessageId ? "Message Read Status" : `Online Users (${onlineCount})`}
              </h4>
              {selectedMessageId ? (
                <>
                  <div className="mt-1 sm:mt-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-green-600">Seen</p>
                    <ul className="mt-0.5 sm:mt-1 space-y-1 sm:space-y-2">
                      {onlineUsers
                        .filter((user) => user.hasRead)
                        .map((user) => (
                          <li key={user.userId} className="flex items-center gap-1 sm:gap-2">
                            <Avatar style={{ width: "16px", height: "16px" }} {...getUserAvatar(user.userId)} />
                            <span className="text-[10px] sm:text-sm text-gray-800">
                              {user.userName  }
                              <span className="ml-1 sm:ml-2 text-[8px] sm:text-xs text-gray-500">
                                {formatTimestamp(user.readTimestamp)}
                              </span>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="mt-2 sm:mt-4">
                    <p className="text-[10px] sm:text-xs font-semibold text-red-600">Unseen</p>
                    <ul className="mt-0.5 sm:mt-1 space-y-1 sm:space-y-2">
                      {onlineUsers
                        .filter((user) => !user.hasRead)
                        .map((user) => (
                          <li key={user.userId} className="flex items-center gap-1 sm:gap-2">
                            <Avatar style={{ width: "16px", height: "16px" }} {...getUserAvatar(user.userId)} />
                            <span className="text-[10px] sm:text-sm text-gray-800">{user.userName}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setSelectedMessageId(null)}
                    className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-blue-500 hover:underline"
                  >
                    Clear Selection
                  </button>
                </>
              ) : (
                <ul className="mt-1 sm:mt-2 space-y-1 sm:space-y-2">
                  {onlineUsers.map((user) => (
                    <li key={user.userId} className="flex items-center gap-1 sm:gap-2">
                      <Avatar style={{ width: "16px", height: "16px" }} {...getUserAvatar(user.userId)} />
                      <span className="text-[10px] sm:text-sm text-gray-800">{user.userName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
          )}
          {showAvatarPicker && (
            <div className="absolute top-12 right-1   bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-gray-500 relative  w-52 md:ml-80  p-2 sm:p-4 rounded-lg max-h-[85vh] overflow-y-auto sm:w-auto md:w-1/2 lg:w-1/2 xl:w-1/3">
                <button className="z-40" onClick={() => setShowAvatarPicker(false)}>
                  <img src={assets.cross_icon} width={20} className="absolute right-2 top-4" alt="close" />
                </button>
                <h4 className="text-sm sm:text-lg font-semibold mb-1 text-center uppercase sm:mb-2">Profile</h4>
                <div className="flex justify-center mb-2">
                  <Avatar style={{ width: "48px", height: "48px" }} {...userAvatarConfig} />
                </div>
                <button
                  onClick={() => setShowAvatarList(!showAvatarList)}
                  className="w-full text-[10px] sm:text-sm text-black py-[3px] border rounded-full hover:underline mb-2"
                >
                 {showAvatarList==true?" close Avatar":" Edit Avatar"}
                </button>
                {showAvatarList && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2 mb-2">
                    {defaultAvatars.map((config, index) => (
                      <Avatar
                        key={index}
                        style={{ width: "32px", height: "32px" }}
                        {...config}
                        className="cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-full"
                        onClick={() => handleAvatarSelect(config)}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={handleLeaveGroup}
                  className="w-full text-[10px] sm:text-sm border py-[3px] rounded-full text-black hover:underline mb-2"
                >
                  Leave Group
                </button>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="w-full text-[10px] sm:text-sm text-gray-800 border py-[3px] rounded-full hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        {renderTypingStatus()}
        <div
          className="flex-1 relative z-[1] overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 scrollbar-hide"
          ref={messagesEndRef}
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-5 sm:mt-10 text-xs sm:text-base"> {loginData==null?"Please log in to start conversation! ":<h2 className="text-xl">Start the conversation!</h2>}</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"} items-end group ${
                  selectedMessageId === msg.id ? " border rounded-lg border-gray-500" : ""
                }`}
                onClick={() => handleSelectMessage(msg.id)}
              >
                {msg.userId !== userId && (
                  <Avatar
                    style={{ width: "24px", height: "24px" }}
                    {...getUserAvatar(msg.userId)}
                    className="mr-1 sm:mr-2 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[80%] sm:max-w-[70%] ${msg.userId === userId ? "items-end" : "items-start"} flex flex-col`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                    {msg.userId === userId && (
                      <Avatar
                        style={{ width: "16px", height: "16px" }}
                        {...getUserAvatar(msg.userId)}
                        className="order-1"
                      />
                    )}
                    <div className="text-[10px] gap-3 pl-1 flex flex-row sm:text-xs text-black">
                      {msg.userName} <p className="italic text-[12px]">{msg.time}</p>
                    </div>
                  </div>
                  <div
                    className={`p-2 sm:p-3 rounded-2xl shadow-md min-w-36 cursor-pointer hover:shadow-lg transition-shadow ${
                      msg.userId === userId
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-500 text-gray-900 rounded-bl-none"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(msg);
                    }}
                  >
                    {msg.replyTo && renderReplyPreview(msg.replyTo)}
                    {renderMessageContent(msg)}
                  </div>
                  {renderReadStatus(msg)}
                  <button
                    className="text-[10px] sm:text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 sm:mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReply(msg);
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 sm:p-3 border-t border-gray-900 sticky bottom-0 z-30">
          {replyTo && (
            <div className="bg-slate-600 relative border border-blue-400 rounded-lg p-1 sm:p-2 mb-1 sm:mb-2 flex justify-between items-center">
              <div className="flex items-start gap-1 sm:gap-2">
                <Avatar style={{ width: "16px", height: "16px" }} {...getUserAvatar(replyTo.id)} />
                <div>
                  <p className="text-[10px] sm:text-xs text-black font-semibold">Replying to {replyTo.userName}</p>
                  <p className="text-[10px] sm:text-sm text-gray-800 truncate max-w-[70%] sm:max-w-[80%]">{replyTo.content}</p>
                </div>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="text-gray-200 hover:text-blue-700 absolute top-1 right-1"
              >
                <img src={assets.cross_icon} width={20} alt="close" />
              </button>
            </div>
          )}
          <div className="items-center gap-1 sm:gap-2 flex-wrap flex">
            <div className="float-left relative flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendTextMessage(e)}
                  placeholder="Type a message..."
                  disabled={!isConnected
                    || !loginData
                  }
                  className="w-full pl-4 pr-10 py-2.5 cursor-pointer  border placeholder-black border-gray-300 rounded-full text-black bg-transparent focus:outline-none transition-all focus:ring-2 focus:ring-blue-300 disabled:opacity-50 text-xs sm:text-sm"
                />
                <button
                  onClick={sendTextMessage}
                  disabled={!isConnected || !message.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                >
                  <img src={assets.send_icon} alt="Send" className="w-6 h-6 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            <div className="justify-end float-right flex gap-1 sm:gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={!isConnected || !loginData}
                className="p-1 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <img src={assets.image_icon} alt="Image" className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                hidden
              />
              <button
                onClick={toggleRecording}
                disabled={!isConnected || !loginData}
                className={`p-1 sm:p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 ${
                  isRecording ? "heartbeat bg-red-200" : "bg-gray-200"
                }`}
              >
                <img
                  src={isRecording ? assets.stop_icon : assets.mic_icon}
                  alt={isRecording ? "Stop" : "Mic"}
                  className="w-4 h-4 sm:w-6 sm:h-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbar;