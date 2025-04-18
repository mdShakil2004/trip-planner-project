import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import React from 'react';
import styled from 'styled-components';

const Navbar = () => {
  const navigate = useNavigate();
  const { 
    isSidebarOpen, 
    setIsSidebarOpen,
    login,
    setShowLogin,
    loginData, 
    isCreateTripPlan, 
    hasCreatedTrip,
    setCreateTripPlan 
  } = useContext(AppContext);
  
  // State for notification dropdown
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Default notification data
  const [notifications] = useState([
    {
      id: 1,
      message: "Welcome to the platform! Start planning your first trip.",
      time: "5 minutes ago",
      unread: true
    }
  ]);

  const handleTripButtonClick = () => {
    if (loginData == null) {
      setShowLogin(true);
      return;
    }
    if (hasCreatedTrip) {
      navigate("/"); // Adjust the route as needed
    } else {
      // Toggle create trip plan when no trip exists
      setCreateTripPlan(!isCreateTripPlan);
    }
  };

  const menu_handle = () => {
    if (loginData == null) {
      setShowLogin(true);
      return;
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="relative flex items-center justify-between w-full py-4 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-600 border-b-[0.5px] z-[1000]">
      {/* Sidebar Toggle */}
      <button 
        className="flex-shrink-0"
        onClick={() => menu_handle()}
      >
        <img 
          src={assets.menu_icon} 
          alt="menu" 
          className="w-6 sm:w-7 md:w-8"
        />
      </button>

      {/* Navigation Content */}
      <div className="flex items-center justify-end w-full">
        {login ? (
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <button
              onClick={() => handleTripButtonClick()}
              className="bg-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                {hasCreatedTrip ? "My Trips" : "Create Trip"}
              </p>
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="bg-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                Explore
              </p>
            </button>
            <button
              onClick={() => navigate("/event")}
              className="bg-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                Events
              </p>
            </button>
            <div className="relative z-[9999]">
              <button 
                className="sm:p-2 hover:scale-110 transition-all duration-300"
                onClick={toggleNotification}
              >
                <StyledWrapper>
                  <div className="notification">
                    <div className="bell-container">
                      <div className="bell" />
                    </div>
                  </div>
                </StyledWrapper>
              </button>
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                

                <NotificationDropdown>
                  <div className="notification-header relative z-[9999999]">Notifications</div>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        <p className="message">{notification.message}</p>
                        <p className="time">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="notification-item">
                      <p className="message">No new notifications</p>
                    </div>
                  )}
                  
                </NotificationDropdown>
                
               
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <button
              onClick={() => handleTripButtonClick()}
              className="bg-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                {hasCreatedTrip ? "My Trips" : "Create Trip"}
              </p>
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="bg-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                Explore
              </p>
            </button>
            <button 
              onClick={() => setShowLogin(true)} 
              className="bg-zinc-800 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <p className="text-xs sm:text-sm lg:text-base font-medium text-white">
                Login 
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .bell {
    border: 2.17px solid white;
    border-radius: 8px 8px 0 0;
    width: 15px;
    height: 17px;
    background: transparent;
    display: block;
    position: relative;
    top: -3px;
  }
  .bell::before,
  .bell::after {
    content: "";
    background: white;
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 2.17px;
  }
  .bell::before {
    top: 100%;
    width: 20px;
  }
  .bell::after {
    top: calc(100% + 4px);
    width: 7px;
  }
  /*container main styling*/
  .notification {
    background: black;
    border: none;
    padding: 15px 15px;
    border-radius: 50px;
    cursor: pointer;
    transition: 300ms;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /*notifications number with before*/
  .notification::before {
    content: "1";
    color: white;
    font-size: 10px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    right: 8px;
    top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  /*container background hover effect*/
  .notification:hover {
    background: rgba(170, 170, 170, 0.062);
  }
  /*container animations*/
  .notification:hover > .bell-container {
    animation: bell-animation 650ms ease-out 0s 1 normal both;
  }
  /*bell ring and scale animation*/
  @keyframes bell-animation {
    20% {
      transform: rotate(15deg);
    }
    40% {
      transform: rotate(-15deg);
      scale: 1.1;
    }
    60% {
      transform: rotate(10deg);
      scale: 1.1;
    }
    80% {
      transform: rotate(-10deg);
    }
    0%,
    100% {
      transform: rotate(0deg);
    }
  }

  /* Responsive Design */
  /* Mobile Devices (max-width: 320px) */
  @media (max-width: 320px) {
    .notification {
      padding: 8px 8px;
      border-radius: 20px;
    }
    .notification::before {
      font-size: 6px;
      width: 8px;
      height: 8px;
      right: 4px;
      top: 4px;
    }
    .bell {
      width: 10px;
      height: 12px;
    }
    .bell::before {
      width: 14px;
    }
    .bell::after {
      width: 5px;
    }
  }

  /* Mobile Devices (max-width: 480px) */
  @media (max-width: 480px) {
    .notification {
      padding: 10px 10px;
      border-radius: 25px;
    }
    .notification::before {
      font-size: 7px;
      width: 9px;
      height: 9px;
      right: 5px;
      top: 5px;
    }
    .bell {
      width: 11px;
      height: 13px;
    }
    .bell::before {
      width: 16px;
    }
    .bell::after {
      width: 6px;
    }
  }

  /* Tablet Devices (max-width: 768px) */
  @media (max-width: 768px) {
    .notification {
      padding: 12px 12px;
      border-radius: 30px;
    }
    .notification::before {
      font-size: 8px;
      width: 10px;
      height: 10px;
      right: 6px;
      top: 6px;
    }
    .bell {
      width: 12px;
      height: 14px;
    }
    .bell::before {
      width: 18px;
    }
    .bell::after {
      width: 7px;
    }
  }

  /* Desktop Devices (min-width: 1024px) */
  @media (min-width: 1024px) {
    .notification {
      padding: 15px 15px;
      border-radius: 50px;
    }
    .notification::before {
      font-size: 10px;
      width: 12px;
      height: 12px;
      right: 8px;
      top: 8px;
    }
    .bell {
      width: 15px;
      height: 17px;
    }
    .bell::before {
      width: 20px;
    }
    .bell::after {
      width: 7px;
    }
  }
`;

const NotificationDropdown = styled.div`
 position: absolute;
  right: 0;
  top: 100%;
  margin-top: 10px;
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 101;


  
  .notification-header {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
  }

  .notification-item {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background 0.2s;
    z-index: 9999;


    &:hover {
      background: #f5f5f5;
    }

    &.unread {
      background: #f8faff;
    }

    .message {
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
    }

    .time {
      font-size: 12px;
      color: #666;
    }
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    width: 240px;
    
    .notification-header {
      padding: 8px 12px;
      font-size: 14px;
    }

    .notification-item {
      padding: 8px 12px;
      
      .message {
        font-size: 12px;
      }
      
      .time {
        font-size: 10px;
      }
    }
  }

  @media (max-width: 320px) {
    width: 200px;
    
    .notification-header {
      padding: 6px 10px;
      font-size: 12px;
    }

    .notification-item {
      padding: 6px 10px;
      
      .message {
        font-size: 11px;
      }
      
      .time {
        font-size: 9px;
      }
    }
  }
`;

export default Navbar;