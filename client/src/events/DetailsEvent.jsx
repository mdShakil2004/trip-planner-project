import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';

const DetailsEvent = () => {
 const navigate=useNavigate();
    const { addBudgetHistory } = useContext(AppContext);
    const location = useLocation();
    const { 
        image, 
        name, 
        description, 
        location: venueLocation, 
        date, 
        price, 
        discount, 
        booked, 
        remaining,
        
        room_number,
        roomType,

       
       
      
        isBooked 
    } = location.state || {};



    const handleLetsGoClick1 = () => {
        navigate('/event/check-out', {
          state: { 
            
            
            name:name,
            Location: venueLocation,
            date: date,
            price: price,
            discount: discount,
            
            booked: booked,
            remaining: remaining,
          }
        });
      };




    const payableAmount = price - (price * discount / 100);
    const isOpen = remaining > 0; // Check if event is open or closed


    //   const remainingRooms = Array.from({ length: remaining }, (_, i) => i + 1);
    //   const randomRoomNumber = remainingRooms[Math.floor(Math.random() * remainingRooms.length)];
   
    const handleLetsGoClick = () => {
        try {
          addBudgetHistory({
            type: 'booking',
            venue: name,
            price: price,
            date: date,
            location:venueLocation ,
            description: description,
            roomType: roomType,
            roomNumber: room_number,
          });
          toast.success('Your budget has been generated!');
        } catch (error) {
          console.error('Error generating budget:', error);
          toast.error('Error generating budget. Please try again.');
        }
      }



const bookHandle=()=>{
    
    handleLetsGoClick();
    handleLetsGoClick1()

}










    return (
        <div className="flex flex-col items-center p-6 min-h-screen relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }} 

                className="relative max-w-2xl w-full bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                {/* Status Indicator at the Top-Right Corner */}
                
   {/* Status Indicator - Animated Ping */}
<div className="absolute top-2 right-3">
    <div className="relative">
        {/* White Box (Background for Status) */}
        <div className="w-16 h-6 bg-white shadow-xl rounded-md flex items-center justify-center">
            <span className="text-sm  text-gray-800">{isOpen ? "Open" : "Closed"}</span>
        </div>
        
        {/* Animated Ping Effect */}
        <div className={`absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full ${isOpen ? "bg-green-300 animate-ping" : "bg-red-300 animate-ping"}`}></div>
        
        {/* Solid Circle */}
        <div className={`absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
    </div>
</div>


                {/* Event Image */}
                <motion.img 
                    src={image} 
                    alt={name} 
                    className="w-full h-64 object-cover"
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                />

                {/* Event Details */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    <p className="text-gray-400 mt-1">
                        {isBooked ? "You have already booked this event." : "You could not book yet."}
                    </p>

                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700"><strong>📍 Location:</strong> {venueLocation}</p>
                        <p className="text-gray-700"><strong>📅 Date:</strong> {date}</p>
                        <p className="text-gray-700">
                            <strong>💰 Price:</strong>$ {price}. <span className="text-green-600">({discount}% off)</span>
                        </p>
                        <p className="text-gray-700"><strong>💸 Payable Amount:</strong> ${payableAmount}</p>
                        <p className="text-gray-700"><strong>🏟️ Capacity:</strong> {booked + remaining}</p>
                        <p className="text-gray-700">
                            <strong>🎟️ Booked:</strong> {booked} | <strong>🟢 Remaining:</strong> {remaining}
                        </p>
                    </div>
                    <p className="text-gray-600 hover:text-slate-700 mt-2">{description}</p>

                    {/* "Book Now" Button */}
                    <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button  onClick={()=>bookHandle()}
                            className={`group relative inline-flex items-center justify-start overflow-hidden rounded border-2 py-2 w-full font-medium transition-all ${
                                isOpen 
                                    ? "border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600" 
                                    : "border-gray-400 bg-gray-400 text-white cursor-not-allowed"
                            }`}
                            disabled={!isOpen}
                        >
                            <span className="absolute inset-0 rounded border-0 border-white transition-all duration-100 ease-linear group-hover:border-[15px]"></span>
                            <span className="relative w-full text-center transition-colors duration-200 ease-in-out">
                                {isOpen ? "Book Now" : "Closed"}
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>
            <ToastContainer position="bottom-right" autoClose={1000} />
        </div>
    );
};

export default DetailsEvent;
