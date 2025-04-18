import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  { room,assets } from '../assets/assets';
import Loader from '../animation/Loader';

const Hotel = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoomData = () => {
      const roomData = Object.keys(room).map((key, index) => ({
        id: index + 1,
        name: room[key].title,
        img: room[key].img,
        date: room[key].date,
        location: room[key].location,
        description: room[key].description,
        booked: room[key].booked,
        remaining: room[key].remaining,
        price: room[key].price,
        discount: room[key].discount,
        roomType: room[key].room_type,
        room_number: room[key].room_number,
        isBooked: room[key].bookedRoom,
      }));
      setRoomData(roomData);
    setTimeout(() => {
      setIsLoading(false);
    }, 825);
    };
    loadRoomData();
  }, []);

  const handleLetsGoClick = (venue) => {
 

    navigate("/details-event", {
      state: {
        image: venue.img,
        name: venue.name,
        description: venue.description,
        location: venue.location,
        date: venue.date,
        price: venue.price,
        discount: venue.discount,
        booked: venue.booked,
        roomType:venue.roomType,
        roomNumber: venue.room_number,
        remaining: venue.remaining,
        isBooked: venue.isBooked,
        room_number: venue.room_number,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
  <Loader/>
</div>
    );
  }

  return (
    <div className="w-full min-h-screen z-30 relative py-6 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto max-w-7xl">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6 md:mb-8 text-start">
        Book your living room at next stopping
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {roomData.map((roomItem) => (
          <div 
            key={roomItem.id} 
            className="bg-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col
              w-full mx-auto
              max-w-[20rem] sm:max-w-[22rem] md:max-w-[24rem] lg:max-w-[26rem]"
          >
            <div
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${roomItem.img})` }}
            />
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">
                {roomItem.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {roomItem.date}
              </p>
              <div className="flex items-center gap-2 mt-1 sm:mt-2">
                <img 
                  className="w-3 h-3 sm:w-4 sm:h-4" 
                  src={assets.location_icon} 
                  alt="location" 
                />
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                  {roomItem.location}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mt-2 line-clamp-2 flex-1">
                {roomItem.description}
              </p>
              <p className="text-sm sm:text-md md:text-lg font-bold text-gray-900 mt-2 sm:mt-3">
                ${roomItem.price}
                <span className="text-green-600 text-xs sm:text-sm"> ({roomItem.discount}% off)</span>
                <span className="text-gray-600 text-xs sm:text-sm"> / day</span>
              </p>
              
              <button 
                onClick={() => handleLetsGoClick(roomItem)}
                className="mt-3 sm:mt-4 w-full bg-blue-600 text-white 
                  py-1.5 sm:py-2 px-3 sm:px-4 
                  text-sm sm:text-base
                  rounded-lg border-2 border-blue-600
                  hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Hotel;