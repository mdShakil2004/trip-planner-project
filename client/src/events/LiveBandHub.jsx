import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {  program } from '../assets/assets'; // Adjust import path as needed
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const LiveBandHub = () => {
  const navigate = useNavigate();
 
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addBudgetHistory } = useContext(AppContext);






  const heroImages = [
    program.liveBandImages.hero,
    program.liveBandImages.rollingStones,
    program.liveBandImages.coldplay,
    program.liveBandImages.norahJones,
    program.liveBandImages.daftPunk,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Austin, TX",
    "Seattle, WA"
  ];

  const bands = [
    {
      name: "The Rolling Stones",
      image: program.liveBandImages.rollingStones,
      date: "Dec 15, 2023",
      description: "Experience unforgettable, electrifying performances.",
      location: locations[Math.floor(Math.random() * locations.length)],
      entryFee: 75.00,
      discount: 0.15 // 15% discount
    },
    {
      name: "Coldplay",
      image: program.liveBandImages.coldplay,
      date: "Jan 5, 2024",
      description: "Enjoy an unforgettable night with Coldplay's mesmerizing tunes.",
      location: locations[Math.floor(Math.random() * locations.length)],
      entryFee: 65.00,
      discount: 0.10 // 10% discount
    },
    {
      name: "Norah Jones",
      image: program.liveBandImages.norahJones,
      date: "Jan 20, 2024",
      description: "Immerse in the soulful tunes of Norah Jones.",
      location: locations[Math.floor(Math.random() * locations.length)],
      entryFee: 55.00,
      discount: 0.20 // 20% discount
    },
    {
      name: "Daft Punk",
      image: program.liveBandImages.daftPunk,
      date: "Feb 10, 2024",
      description: "Dance the night away with electrifying beats.",
      location: locations[Math.floor(Math.random() * locations.length)],
      entryFee: 85.00,
      discount: 0.12 // 12% discount
    },
    {
      name: "Lady A",
      image: program.liveBandImages.ladyA,
      date: "Mar 15, 2024",
      description: "Enjoy an evening with Lady A's harmonious melodies.",
      location: locations[Math.floor(Math.random() * locations.length)],
      entryFee: 60.00,
      discount: 0.15 // 15% discount
    }
  ];

  const bandProfiles = [
    {
      name: "The Band",
      image: program.liveBandImages.theBand,
      description: "A dynamic group of musicians creating waves in the music scene, with a unique sound and energetic performances, captivating audiences worldwide."
    },
    {
      name: "Ensemble",
      image: program.liveBandImages.ensemble,
      description: "Bringing together a fusion of styles and influences, Ensemble mesmerizes with melodies and powerful rhythms that resonate with fans across the globe."
    },
    {
      name: "The Artists",
      image: program.liveBandImages.theArtists,
      description: "Known for their innovative approach to music, The Artists blend different genres to create a distinctive sound, capturing the essence of modern artistry."
    }
  ];

  
const handleLetsGoClick1 = (name, location, date, price, discount) => {
  navigate('/event/check-out', {
    state: { 
      name,
      location,
      date,
      price,
      discount,
    }
  });
};




  const handleBuyTickets = (band) => {
    try {
      const discountedPrice = calculateDiscountedPrice(band.entryFee, band.discount);
      const data = {
        type: 'booking',
        venue: band.name,
        price: band.entryFee,
        discountedPrice: discountedPrice,
        date: band.date,
        location: band.location,
        description: band.description,
        roomType: '', // You can add room type if needed
        roomNumber: '', // You can add room number if needed
      };
      addBudgetHistory(data);
      toast.success('Your budget has been generated!');
      handleLetsGoClick1(band.name, band.location, band.date, band.entryFee, band.discount);
    } catch (error) {
      
      toast.error('Error generating budget. Please try again.');
    }
  };


  const calculateDiscountedPrice = (fee, discount) => {
    return (fee * (1 - discount)).toFixed(2);
  };

  return (
    <div className="z-20 relative font-roboto min-h-screen">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Hero Section */}
      <div className="border border-gray-400 rounded-lg mx-auto max-w-7xl">
        <section className="relative w-full overflow-hidden sm:h-[400px] md:h-[470px] h-[470px]">
          <div className="absolute inset-0 backdrop-blur-sm blur-sm z-0"></div>
          <div className="relative max-w-[550px] w-full h-full z-[1]">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full bg-no-repeat h-full bg-cover bg-center transition-all duration-500 object-fill ${
                  index === currentSlide 
                    ? 'opacity-100 rotate-0' 
                    : 'opacity-0 rotate-[360deg]'
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            <button 
              onClick={goToPreviousSlide}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer text-2xl z-10 hover:bg-black/80 transition-colors"
            >
              ←
            </button>
            <button 
              onClick={goToNextSlide}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer text-2xl z-10 hover:bg-black/80 transition-colors"
            >
              →
            </button>
          </div>
          <div className="absolute top-0 w-full sm:ml-10 lg:first:ml-60 xl:ml-64 h-full flex flex-col items-center justify-center text-center text-white z-[2]">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">Feel the Beat Live</h1>
            <p className="text-base sm:text-lg md:text-xl mt-2">Join the ultimate live band experience</p>
            <p className="text-gray-200 text-sm sm:text-lg font-semibold mt-2 hidden md:block">Experience unforgettable, electrifying performances.</p>
            <button
              onClick={() => handleLetsGoClick1}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-md text-lg hover:bg-purple-700 transition"
            >
              Get Tickets
            </button>
          </div>
          <div className="absolute bottom-5 left-1/2 sm:ml-10 lg:ml-60 xl:ml-64 -translate-x-1/2 flex gap-2.5 z-[3]">
            {heroImages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-blue-500'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Upcoming Shows */}
      <section id="upcoming" className="py-10 px-4 sm:px-6 md:px-8 relative">
        <div className="absolute inset-0 blur-sm z-0"></div>
        <div className="relative z-[1]">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-6 text-center">Upcoming Shows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {bands.map((band, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition bg-transparent">
                <img src={band.image} alt={band.name} className="w-full h-48 object-cover" />
                <div className="p-4 backdrop-blur-lg">
                  <h3 className="text-lg font-semibold text-white">{band.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{band.date} - {band.location}</p>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">{band.description}</p>
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm line-through">${band.entryFee.toFixed(2)}</p>
                    <p className="text-green-400 text-sm">
                      Now ${calculateDiscountedPrice(band.entryFee, band.discount)} 
                      ({(band.discount * 100)}% off)
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyTickets(band)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                  >
                    Buy Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bios" className="py-6 sm:py-10 relative">
        <div className="absolute inset-0 backdrop-blur-md z-0"></div>
        <div className="relative z-[1]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Band Bios</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:gap-8">
            {bandProfiles.map((band, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-3 border border-blue-400 sm:gap-6">
                <img src={band.image} alt={band.name} className="w-full md:w-60 h-40 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-600 mb-2">{band.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">{band.description}</p>
                  <a href="#profile" className="text-purple-600 text-xs sm:text-sm md:text-base mt-2 inline-block hover:underline">
                    Full Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-10 px-4 sm:px-6 md:px-8 relative border rounded-sm text-white">
        <div className="absolute inset-0 backdrop-blur-md blur-sm z-0"></div>
        <div className="relative z-[1] max-w-7xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Subscribe to our Newsletter</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              placeholder="Input your email"
              className="w-full sm:w-72 px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            />
            <button className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default LiveBandHub;