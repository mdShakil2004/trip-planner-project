import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiPieChart, FiActivity, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { MdOutlineBedroomChild } from "react-icons/md";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MdEventNote } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import Avatar from "react-nice-avatar";
import "../animation/Logo_css.css"

// SVG Logo Component
const TripPlannerLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#4F46E5" />
    <path 
      d="M16 8L22 16L16 24L10 16L16 8Z" 
      fill="white" 
      stroke="#4F46E5" 
      strokeWidth="2"
    />
    <path 
      d="M16 12V20" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

const Slidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAvatarList, setShowAvatarList] = useState(false);
  const navigate = useNavigate();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    loginData,
    logout,
    selectedAvatar,
    setSelectedAvatar,
    defaultAvatars,
  } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiPieChart, label: "Explore", path: "/explore" },
    { icon: MdEventNote, label: "Events", path: "/event" },
    { icon: FiActivity, label: "Activities", path: "/event/activities" },
    { icon: TbMoneybag, label: "Budget", path: "/event/budget" },
    { icon: MdOutlineBedroomChild, label: "Book a room", path: "/event/book-hostel" },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAvatarSelect = (avatarConfig) => {
    setSelectedAvatar(avatarConfig);
    setShowAvatarList(false);
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="transition duration-700 z-[9999] relative ease-in-out">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-screen backdrop-blur-sm bg-gray-800 shadow-sm z-30 w-[260px]
          transform transition-transform duration-[4000ms] ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Animated Logo Section */}
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2 animate-[spinFade_1s_ease-out]">
              <TripPlannerLogo />
              <p className="text-xl font-bold text-gray-500 tracking-wide">TRIP PLANNER</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-gradient-to-b hover:from-indigo-500 to from-gray-800 duration-300"
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-500">
            <div className="flex items-center space-x-4 mb-4">
              {loginData ? (
                <Avatar
                  style={{ width: "40px", height: "40px" }}
                  className="rounded-full"
                  {...selectedAvatar}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-300">
                  {loginData ? loginData.name : "Guest"}
                </p>
                <p className="text-sm text-gray-400">
                  {loginData ? loginData.email : "Not logged in"}
                </p>
              </div>
            </div>

            {loginData && (
              <>
                <button
                  onClick={() => setShowAvatarList(!showAvatarList)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:bg-gradient-to-b hover:from-indigo-500 to from-gray-800 duration-200 rounded-lg transition-colors"
                >
                  <span className="ml-3">Change Avatar</span>
                </button>
                {showAvatarList && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {defaultAvatars.map((config, index) => (
                        <Avatar
                          key={index}
                          style={{ width: "32px", height: "32px" }}
                          {...config}
                          className={`cursor-pointer rounded-full ${
                            JSON.stringify(config) === JSON.stringify(selectedAvatar)
                              ? "ring-2 ring-blue-500"
                              : "hover:ring-2 hover:ring-blue-300"
                          }`}
                          onClick={() => handleAvatarSelect(config)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:bg-gradient-to-b hover:from-indigo-500 to from-gray-800 duration-200 rounded-lg transition-colors"
            >
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              <span className="ml-3">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm text-gray-400 hover:bg-gradient-to-b hover:from-indigo-500 to from-gray-800 duration-200 rounded-lg transition-colors"
            >
              <FiLogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

     
    </div>
  );
};

export default Slidebar;