import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const InteractiveGamesSession = () => {
  const { addBudgetHistory } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);


  // Hero images for slideshow
  const heroImages = [
    'https://images.stockcake.com/public/1/f/c/1fc717af-364e-4bf5-b2ff-12b782810efb_large/arcade-night-fun-stockcake.jpg',
    'https://meetspacevr.co.uk/wp-content/uploads/2021/03/ZL_Group_Players4_WEB-800x600.jpg',
    'https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/7/2016/10/28102016_boardgamebash02.jpg',
    'https://media.licdn.com/dms/image/C4E12AQG2fk46LjYHHQ/article-cover_image-shrink_720_1280/0/1563894791754?e=2147483647&v=beta&t=GvhZh0uvobpTzM4wY30cr6dKKHK7GkdBSyw3jf_oAd8',
    'https://www.gamesear.com/images/2020/9/Chips-Challenge-1-screenshot.jpg',
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

  const gameEvents = [
    {
      name: "Arcade Night",
      image: 'https://images.stockcake.com/public/1/f/c/1fc717af-364e-4bf5-b2ff-12b782810efb_large/arcade-night-fun-stockcake.jpg',
      date: "Apr 5, 2025",
      description: "Relive the classics with retro arcade games.",
      entryFee: 20,
      discount: 0.2, // 20% discount
      location: "Downtown Gaming Center, 123 Retro St",
      rating: 4.8
    },
    {
      name: "VR Experience",
      image: 'https://meetspacevr.co.uk/wp-content/uploads/2021/03/ZL_Group_Players4_WEB-800x600.jpg',
      date: "Apr 10, 2025",
      description: "Immerse yourself in virtual reality adventures.",
      entryFee: 35,
      discount: 0.15, // 15% discount
      location: "Tech Hub, 456 Virtual Ave",
      rating: 4.9
    },
    {
      name: "Board Game Bash",
      image: 'https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/7/2016/10/28102016_boardgamebash02.jpg',
      date: "Apr 15, 2025",
      description: "Enjoy strategic fun with friends.",
      entryFee: 15,
      discount: 0.25, // 25% discount
      location: "Community Center, 789 Boardwalk Rd",
      rating: 4.6
    },
    {
      name: "Esports Tournament",
      image: 'https://media.licdn.com/dms/image/C4E12AQG2fk46LjYHHQ/article-cover_image-shrink_720_1280/0/1563894791754?e=2147483647&v=beta&t=GvhZh0uvobpTzM4wY30cr6dKKHK7GkdBSyw3jf_oAd8',
      date: "Apr 20, 2025",
      description: "Compete in thrilling digital battles.",
      entryFee: 30,
      discount: 0.1, // 10% discount
      location: "Esports Arena, 321 Digital Dr",
      rating: 4.7
    },
    {
      name: "Puzzle Challenge",
      image: 'https://www.gamesear.com/images/2020/9/Chips-Challenge-1-screenshot.jpg',
      date: "Apr 25, 2025",
      description: "Test your wits with mind-bending puzzles.",
      entryFee: 25,
      discount: 0.2, // 20% discount
      location: "Mind Space, 654 Puzzle Ln",
      rating: 4.5
    }
  ];

  const gameMasters = [
    {
      name: "Alex 'The Arcade King'",
      image: 'https://nmgprod.s3.amazonaws.com/media/editorial/2024/05/28/chris-king-monster-golf.jpg',
      description: "Expert in retro gaming with a knack for high scores."
    },
    {
      name: "Vera 'VR Wizard'",
      image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2009460/ss_9346e6826246aa47257362401c118507c159599f.1920x1080.jpg?t=1693891720',
      description: "VR enthusiast who crafts immersive experiences."
    },
    {
      name: "Ben 'Board Game Guru'",
      image: 'https://play-lh.googleusercontent.com/NDwrx3kM3RnYvBsdC9rdPGkkchktE1UaMa5AR-pYOmGX4Uk7rY7vwDN5yvY_po_OQZn-=w240-h480-rw',
      description: "Master strategist in tabletop gaming."
    }
  ];

  // const handleJoinSession = (event) => {
  //   // navigate('/session-registration', { state: { event, quantity } });
    
  // };

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
  
  const handleJoinSession = (session) => {
    try {
      const discountedPrice = calculateDiscountedPrice(session.entryFee, session.discount);
      const data = {
        type: 'booking',
        venue: session.name,
        price: session.entryFee,
        discountedPrice: discountedPrice,
        date: session.date,
        location: session.location,
        description: session.description,
        roomType: '', // You can add room type if needed
        roomNumber: '', // You can add room number if needed
      };
      addBudgetHistory(data);
      toast.success('Your budget has been generated!');
      handleLetsGoClick1(session.name, session.location, session.date, session.entryFee, session.discount);
    } catch (error) {
      console.error('Error generating budget:', error);
      toast.error('Error generating budget. Please try again.');
    }
  };
  const calculateDiscountedPrice = (fee, discount) => {
    return (fee * (1 - discount)).toFixed(2);
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">½</span>);
    }
    while (stars.length < 5) {
      stars.push(<span key={stars.length} className="text-gray-400">★</span>);
    }
    return stars;
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">Play the Day Away</h1>
            <p className="text-base sm:text-lg md:text-xl mt-2">Join the ultimate interactive games session</p>
            <p className="text-gray-200 text-sm sm:text-lg font-semibold mt-2 hidden md:block">
              Experience fun and competition like never before.
            </p>
            <button
              onClick={() => navigate('/ticket-purchase')}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-md text-lg hover:bg-purple-700 transition"
            >
              Join Now
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-6 text-center">Upcoming Game Sessions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {gameEvents.map((band, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition bg-transparent">
                <img src={band.image} alt={band.name} className="w-full h-48 object-cover" />
                <div className="p-4 backdrop-blur-lg">
                  <h3 className="text-lg font-semibold text-white">{band.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{band.date}</p>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">{band.description}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    <span className="line-through">${band.entryFee}</span>
                    <span className="text-green-400 ml-2">${(band.entryFee * (1 - band.discount)).toFixed(2)}</span>
                    <span className="text-xs ml-1">({(band.discount * 100)}% off)</span>
                  </p>
                  <p className="text-gray-300 text-sm mt-1">{band.location}</p>
                  <p className="text-gray-300 text-sm mt-1 flex items-center">
                    Rating: {renderStars(band.rating)} ({band.rating}/5)
                  </p>
                  <button
                    onClick={() => handleJoinSession(band)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                  >
                    Join Session
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Game Masters</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:gap-8">
            {gameMasters.map((band, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-3 border border-blue-400 sm:gap-6">
                <img src={band.image} alt={band.name} className="w-full md:w-60 h-40 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-600 mb-2">{band.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">{band.description}</p>
                  <a href="#profile" className="text-purple-600 text-xs sm:text-sm md:text-base mt-2 inline-block hover:underline">
                    Learn more
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 relative text-white">
        <div className="absolute inset-0 backdrop-blur-md blur-sm z-0"></div>
        <div className="relative z-[1] max-w-7xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Join Our Gaming Newsletter</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full max-w-[300px] px-3 sm:px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 text-sm sm:text-base"
            />
            <button className="bg-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base hover:bg-purple-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
            <ToastContainer position="bottom-right" autoClose={1000} />
      
    </div>
  );
};

export default InteractiveGamesSession;