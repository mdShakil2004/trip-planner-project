import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LiveBandHub from './LiveBandHub';
import FoodTestingEventSession from './FoodTestingEventSession';
import InteractiveGamesSession from './InteractiveGamesSession';
import Loader from '../animation/Loader';

const ActivitieBar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(1); // Default to Live Band Performance
  const [activeTab, setActiveTab] = useState('Live Band'); // Default tab
  const [activityPreferences, setActivityPreferences] = useState({
    "Live Music": false,
    "Food Experience": false,
    "Group Games": false,
  });

  const activities = [
    {
      id: 1,
      title: '🎸 Live Band Performance',
      link: '/event/live-band-performance',
      description: 'Enjoy an evening of live music featuring local bands playing various genres from rock to jazz.',
      details: 'Duration: 2 hours | Time: 7:00 PM - 9:00 PM | Location: Main Stage',
      component: <LiveBandHub />,
      tab: 'Live Band'
    },
    {
      id: 2,
      title: '🍽️ Food Tasting Session',
      link: '/event/food-testing',
      description: 'Sample a variety of delicious dishes from different cuisines prepared by local chefs.',
      details: 'Duration: 1.5 hours | Time: 6:00 PM - 7:30 PM | Location: Food Court',
      component: <FoodTestingEventSession />,
      tab: 'Food Tasting'
    },
    {
      id: 3,
      title: '🎲 Interactive Games',
      link: '/event/game-session',
      description: 'Participate in fun group games and activities suitable for all ages.',
      details: 'Duration: 2 hours | Time: 3:00 PM - 5:00 PM | Location: Activity Zone',
      component: <InteractiveGamesSession />,
      tab: 'Games'
    }
  ];

  useEffect(() => {
    const loadData = () => {
      // Simulate a delay in loading the data
      setTimeout(() => {
        setIsLoading(false);
      }, 825);
    };
    loadData();
  }, []);

  const handleDisplayClick = (activityId) => {
    setSelectedActivity(selectedActivity === activityId ? null : activityId);
    const selected = activities.find(activity => activity.id === activityId);
    if (selected) setActiveTab(selected.tab);
  };

  const handlePreferenceChange = (preference) => {
    setActivityPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const renderTabContent = () => {
    const activeActivity = activities.find(activity => activity.tab === activeTab);
    return activeActivity ? (
      <div className="p-4 sm:p-6">
        {activeActivity.component}
      </div>
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div 
      className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-4 sm:px-6 flex flex-col lg:flex-row flex-1 justify-center py-5">
          {/* Left Sidebar */}
          <div className="layout-content-container bg-gray-900 border rounded-lg flex flex-col w-full lg:w-80">
            {/* Event Details */}  
            <h2 className="text-[#84a4b6] text-[18px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Event Details</h2>
            {[
              "Summer Festival 2025",
              "Date: Sat, March 15th",
              "Location: City Center",
              "Attendees: 500+",
              "Type: Outdoor Event"
            ].map((text, index) => (
              <div key={index} className="flex items-center px-4 sm:px-12 min-h-12 sm:min-h-14">
                <p className="text-[#b3b9bc] text-sm sm:text-base font-normal leading-normal flex-1 truncate">{text}</p>
              </div>
            ))}

            {/* Activity Ideas */}
            <span className="border border-gray-400"></span>
            <h2 className="text-[#c5ccd0] text-[18px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Activity Ideas</h2>
            <div className="mt-1 mb-3 px-4 flex flex-col space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="w-full">
                  {activity.link ? (
                    <Link
                      to={activity.link}
                      className="w-full h-12 sm:h-[50px] rounded-lg border border-[#676782] text-center relative overflow-hidden transition-all duration-500 ease-in hover:bg-gradient-to-r hover:from-[#83768f] hover:to-[#9d75c5] group flex justify-center items-center"
                    >
                      <span className="text-[#afb0cd] font-roboto text-base sm:text-lg transition-colors duration-300 group-hover:text-[#e0aaff]">
                        {activity.title}
                      </span>
                    </Link>
                  ) : (
                    <button
                      className="w-full h-12 sm:h-[50px] rounded-lg border border-[#999ac9] relative overflow-hidden transition-all duration-500 ease-in hover:bg-gradient-to-r hover:from-[#240046] hover:to-[#5a189a] group"
                      onClick={() => handleDisplayClick(activity.id)}
                    >
                      <span className="text-[#b3b3c7] font-roboto text-base sm:text-lg transition-colors duration-300 group-hover:text-[#e0aaff]">
                        {activity.title}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Choose Activities */}
            <span className="border border-gray-400"></span>
            <h2 className="text-[#b7cdd8] text-[18px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Choose Activities</h2>
            <div className="mt-4 mb-2 cursor-pointer px-4">
              <div className="p-4 flex items-center mb-4">
                <img
                  loading="lazy"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  src="https://cdn.pixabay.com/photo/2023/03/31/18/44/mountains-7890734_960_720.jpg"
                  alt="Hiking"
                />
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg text-blue-300 font-semibold">Hiking</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Explore nature trails</p>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <img
                  loading="lazy"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Yoga"
                />
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg text-blue-300 font-semibold">Yoga Sessions</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Relax with guided meditation</p>
                </div>
              </div>
            </div>

            {/* Activity Preferences */}
            <span className="border border-gray-400"></span>
            <h2 className="text-[#606d74] text-[18px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Activity Preferences</h2>
            <div className="flex gap-3 mb-2 p-3 flex-wrap pr-4 flex-col">
              {Object.entries(activityPreferences).map(([preference, isSelected]) => (
                <label key={preference} className="flex ml-4 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePreferenceChange(preference)}
                    className="h-4 w-4 rounded border-[#63757e] text-[#39a0dc] focus:ring-[#4997c4]"
                  />
                  <span className="text-[#b8c5cc] text-xs sm:text-sm font-medium leading-normal">{preference}</span>
                </label>
              ))}
            </div>

            {/* Recommended Add-ons */}
            <span className="border border-gray-400"></span>
            <h2 className="text-[#7f898f] text-[18px] sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recommended Add-ons</h2>
            {[
              { name: "VIP Lounge Access", desc: "Exclusive seating area" },
              { name: "Photo Package", desc: "Professional event photos" }
            ].map((item, index) => (
              <div key={index} className="flex ml-4 items-center gap-4 px-4 min-h-12 sm:min-h-14">
                <div className="flex flex-col">
                  <p className="text-[#a4b4bc] text-sm sm:text-base font-normal leading-normal">{item.name}</p>
                  <p className="text-[#4c7d9a] text-xs sm:text-sm font-normal leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="layout-content-container flex flex-col w-full max-w-[1160px] flex-1">
            <div className="pb-3">
              <div className="flex border-b border-[#b3bdc2] px-4 gap-4 sm:gap-8 overflow-x-auto">
                {['Live Band', 'Food Tasting', 'Games'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-col items-center justify-center border-b-[3px] ${
                      activeTab === tab 
                        ? 'border-b-[#139cec] text-[#b138cc]' 
                        : 'border-b-transparent text-[#4c7d9a]'
                    } pb-[13px] pt-4 whitespace-nowrap`}
                  >
                    <p className="text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">{tab}</p>
                  </button>
                ))}
              </div>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Custom Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .layout-content-container.w-80 {
            width: 100%;
            max-width: none;
          }
          .layout-container {
            padding-left: 0;
            padding-right: 0;
          }
        }

        @media (max-width: 640px) {
          .layout-content-container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .group\\/design-root {
            padding: 0;
          }
          .min-h-14 {
            min-height: 2.5rem;
          }
          .min-h-12 {
            min-height: 2.5rem;
          }
          .h-12 {
            height: 2.5rem;
          }
          .px-12 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivitieBar;