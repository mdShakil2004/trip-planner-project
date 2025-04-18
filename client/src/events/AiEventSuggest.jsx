import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets, program } from '../assets/assets';

const venues = [
    {
        name: program.Grand_hall.title,
        image: program.Grand_hall.img,
        description: program.Grand_hall.description,
        location: program.Grand_hall.location,
        date: program.Grand_hall.date,
        price: program.Grand_hall.prices,
        discount: program.Grand_hall.discount,
        capacity: program.Grand_hall.capacity,
        booked: program.Grand_hall.booked,
        remaining: program.Grand_hall.remaining
    },
    {
        name: program.musicFestival.title,
        image: program.musicFestival.img,
        description: program.musicFestival.description,
        location: program.musicFestival.location,
        date: program.musicFestival.date,
        price: program.musicFestival.prices,
        discount: program.musicFestival.discount,
        capacity: program.musicFestival.capacity,
        booked: program.musicFestival.booked,
        remaining: program.musicFestival.remaining
    },
    {
        name: program.musicFestival.title,
        image: program.musicFestival.img,
        description: program.musicFestival.description,
        location: program.musicFestival.location,
        date: program.musicFestival.date,
        price: program.musicFestival.prices,
        discount: program.musicFestival.discount,
        capacity: program.musicFestival.capacity,
        booked: program.musicFestival.booked,
        remaining: program.musicFestival.remaining
    }
];

const viewEvent = [
    {
        name: "Beach Resort",
        image: program.beachImages.beach1,
        description: "Enjoy a luxury beachfront experience.",
        book: "view and book"
    },
    {
        name: "Water Park",
        image: program.beachImages.beach1,
        description: "Book a private water park pass today!",
        book: "view and book"
    },
    {
        name: "Book a Room",
        image: program.beachImages.beach1,
        description: "Reserve a comfortable stay for your trip!",
        book: "view and book"
    },
    {
        name: "Event",
        image: program.beachImages.beach1,
        description: "Find the perfect venue for your event",
        book: "view and book"
    }
];

const AiEventSuggest = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEventData = () => {
          // Simulate a delay in loading the event data
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        };
        loadEventData();
      }, []);
    










    React.useEffect(() => {
        return () => {};
    }, []);

    const navigate = useNavigate();

    const handleLetsGoClick = (venue) => {
        navigate('/details-event', {
            state: { 
                image: venue.image,
                name: venue.name,
                description: venue.description,
                location: venue.location,
                date: venue.date,
                price: venue.price,
                discount: venue.discount,
                capacity: venue.capacity,
                booked: venue.booked,
                remaining: venue.remaining,
            }
        });
    };

    if (isLoading) {
        return (null);
      }


    return (
        <div className="relative w-[487px] h-full border rounded-sm border-blue-400 flex flex-col p-6 gap-6">
            {/* Blurred background layer */}
            <div className="absolute inset-0 backdrop-blur-[50px] bg-gray-500 blur-sm z-0"></div>
            
           
            <div className="relative z-[1]">
                {/* AI Recommendations Section */}
                <div className="w-full">
                    <h2 className="text-black font-roboto text-xl font-semibold mb-4">🎯 AI Recommendations</h2>
                    <div className="space-y-4 flex-1 items-center justify-center overflow-y-auto scrollbar-hide" style={{ maxHeight: '1000px', scrollbarWidth: 'none' }}>
                        {venues.map((venue, index) => (
                            <div key={index} className="h-auto border border-gray-800 bg-slate-600 rounded-lg p-4 flex flex-col gap-1 backdrop-blur-[200px] ">
                                <div className="text-gray-300 font-roboto text-base font-medium">Venue Suggestion</div>
                                <div className="text-gray-300 font-roboto text-sm">Based on your group&#39;s preferences:</div>
                                <div className="relative w-full h-[140px] rounded-md bg-cover bg-center" 
                                     style={{ backgroundImage: `url(${venue.image})` }}>
                                </div>
                                <div className="text-black font-roboto text-sm font-medium mt-1">{venue.name}</div>
                                <div className="text-gray-300 font-roboto text-base">{venue.description.split(" ").slice(0, 20).join(" ") + "..."}</div>
                                <div className="text-gray-300 font-roboto text-[14px]">📍 <strong>Location:</strong> {venue.location}</div>
                                <div className="text-gray-300 font-roboto text-[14px]">📅 <strong>Date:</strong> {venue.date}</div>
                                <div className="text-gray-300 font-roboto text-[14px]">💰 <strong>Price:</strong>$ {venue.price} <span className="text-green-600">({venue.discount}%off)</span></div>
                                <div className="flex justify-end mt-3">
                                    <button 
                                        onClick={() => handleLetsGoClick(venue)}
                                        className="border border-gray-300 py-1 px-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                    >
                                        Let&#39;s book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-indigo-600 my-4"></div>

                {/* Activity Ideas */}
                <div className="w-full border border-gray-300 rounded-lg p-4 bg-gray-600/90">
                    <h3 className="text-black font-roboto text-[20px] font-medium">🎭 Activity Ideas</h3>
                    <div className="mt-1 flex flex-col text-gray-700 space-y-2">
                    <Link to="/event/live-band-performance" className="w-full h-[50px] rounded-lg border border-[#03045e] text-center   relative overflow-hidden transition-all duration-500 ease-in hover:bg-gradient-to-r hover:from-[#240046] hover:to-[#5a189a] group flex justify-center items-center">
                          <span className="text-[#03045e] font-roboto text-lg transition-colors duration-300 group-hover:text-[#e0aaff]">🎸 Live Band Performance</span>
                    </Link>
                    <Link to="/event/food-testing" className="w-full h-[50px] rounded-lg border border-[#03045e] text-center   relative overflow-hidden transition-all duration-500 ease-in hover:bg-gradient-to-r hover:from-[#240046] hover:to-[#5a189a] group flex justify-center items-center">
                          <span className="text-[#03045e] font-roboto text-lg transition-colors duration-300 group-hover:text-[#e0aaff]">🎸 Food Testing Event</span>
                    </Link>
                    <Link to="/event/game-session" className="w-full h-[50px] rounded-lg border border-[#03045e] text-center   relative overflow-hidden transition-all duration-500 ease-in hover:bg-gradient-to-r hover:from-[#240046] hover:to-[#5a189a] group flex justify-center items-center">
                          <span className="text-[#03045e] font-roboto text-lg transition-colors duration-300 group-hover:text-[#e0aaff]">🎸 Live game Session</span>
                    </Link>
                    </div>
                </div>

                {/* Explore More Options */}
                <div className="w-full mt-[1px] space-y-4">
                    {viewEvent.map((event, index) => (
                        <div key={index} className="flex items-start bg-gray-600/90 p-4 rounded-lg shadow-md transition-transform transform hover:scale-95">
                            <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="ml-5 flex-1">
                                <h3 className="text-md font-medium text-black">{event.name}</h3>
                                <p className="text-sm text-gray-300">{event.description}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500 text-lg">{event.book}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invite More Button */}
                <div>
                    <button className="mt-4 border border-gray-700 w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#77530a] hover:to-[#ffd277] transition-all duration-500 bg-gray-400/90">
                        <span className="font-roboto text-base text-black hover:text-[#6090f7] transition-colors duration-300">Invite More</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiEventSuggest;