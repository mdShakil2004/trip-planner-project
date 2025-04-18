import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast, ToastContainer } from 'react-toastify';

const FoodTestingEventSession = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(10);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addBudgetHistory } = useContext(AppContext);

  // Hero images for slideshow
  const heroImages = [
    'https://media-cdn.tripadvisor.com/media/photo-s/13/2e/5f/d6/presenting-food-from.jpg',
    'https://lightoflove.com.ph/wp-content/uploads/2024/05/reasons-why-attend-food-tasting-event-servers-table-768x439.jpg',
    'https://thumbs.dreamstime.com/b/front-view-friends-group-tasting-christmas-sweets-food-ha-having-fun-home-drinking-champagne-sparkling-wine-winter-132803383.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRioPk3KcvwZqdEfLr5VVp5v0b4k8vNRiBN8Q&s',
    'https://lightoflove.com.ph/wp-content/uploads/2024/05/reasons-why-attend-food-tasting-event-catering-768x768.jpg',
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

  const foodEvents = [
    {
      name: "Sushi Sampling",
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/19/56/a7/52/nigiri-sushi-sample-photo.jpg',
      date: "Mar 10, 2025",
      description: "Taste exquisite sushi varieties from top chefs.",
      entryFee: 25,
      discount: 0.15, // 15% discount
      location: "Sushi Haven, 123 Ocean Dr",
      rating: 4.7
    },
    {
      name: "Pasta Palooza",
      image: 'https://lightoflove.com.ph/wp-content/uploads/2024/05/reasons-why-attend-food-tasting-event-servers-table-768x439.jpg',
      date: "Mar 15, 2025",
      description: "Enjoy a range of artisanal pasta dishes.",
      entryFee: 20,
      discount: 0.2, // 20% discount
      location: "Pasta Palace, 456 Italiano St",
      rating: 4.6
    },
    {
      name: "Dessert Delight",
      image: 'https://thumbs.dreamstime.com/b/front-view-friends-group-tasting-christmas-sweets-food-ha-having-fun-home-drinking-champagne-sparkling-wine-winter-132803383.jpg',
      date: "Mar 20, 2025",
      description: "Indulge in sweet treats and pastries.",
      entryFee: 18,
      discount: 0.25, // 25% discount
      location: "Sweet Spot, 789 Sugar Ln",
      rating: 4.8
    },
    {
      name: "Beverage Bash",
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRioPk3KcvwZqdEfLr5VVp5v0b4k8vNRiBN8Q&s',
      date: "Mar 25, 2025",
      description: "Sample craft cocktails and unique drinks.",
      entryFee: 30,
      discount: 0.1, // 10% discount
      location: "Mixology Lounge, 321 Drink Ave",
      rating: 4.5
    },
    {
      name: "Global Flavors",
      image: 'https://lightoflove.com.ph/wp-content/uploads/2024/05/reasons-why-attend-food-tasting-event-catering-768x768.jpg',
      date: "Mar 30, 2025",
      description: "Explore cuisines from around the world.",
      entryFee: 35,
      discount: 0.2, // 20% discount
      location: "World Taste Center, 654 Globe Rd",
      rating: 4.9
    }
  ];

  const chefProfiles = [
    {
      name: "Chef Maria",
      image: 'https://images.squarespace-cdn.com/content/v1/6397faf7e736777555909340/59d43267-d29d-4b1d-9941-c4676277acac/Chef+Loi+TLOL+212.jpg',
      description: "Renowned sushi master with 20 years of experience crafting authentic Japanese cuisine."
    },
    {
      name: "Chef Antonio",
      image: 'https://www.flavoursholidays.co.uk/wp-content/uploads/2014/11/italian-chef-presenting-dish.jpg',
      description: "Italian pasta expert known for innovative flavor combinations."
    },
    {
      name: "Chef Sophie",
      image: 'https://www.eatwithellen.com/wp-content/uploads/2020/10/IMG_6028.jpg',
      description: "Pastry chef famous for her delectable dessert creations."
    }
  ];

  // const handleBuyTickets = (event) => {
  //   navigate('/ticket-purchase', { state: { event, quantity } });
  //   alert(`Purchasing ${quantity} tickets for ${event.name}! Original: $${event.entryFee}, Discounted: $${(event.entryFee * (1 - event.discount)).toFixed(2)} each`);
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





  const handleReserveSpot = (event) => {
    try {
      const discountedPrice = calculateDiscountedPrice(event.entryFee, event.discount);
      const data = {
        type: 'booking',
        venue: event.name,
        price: event.entryFee,
        discountedPrice: discountedPrice,
        date: event.date,
        location: event.location,
        description: event.description,
        roomType: '', // You can add room type if needed
        roomNumber: '', // You can add room number if needed
      };
      addBudgetHistory(data);
      toast.success('Your budget has been generated!');
      handleLetsGoClick1(event.name, event.location, event.date, event.entryFee, event.discount);
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">Savor the Experience</h1>
            <p className="text-base sm:text-lg md:text-xl mt-2">Join our food testing event session</p>
            <p className="text-gray-200 text-sm sm:text-lg font-semibold mt-2 hidden md:block">Taste the world's finest flavors.</p>
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-6 text-center">Upcoming Tasting Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {foodEvents.map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition bg-transparent">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="p-4 backdrop-blur-lg">
                  <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{event.date}</p>
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">{event.description}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    <span className="line-through">${event.entryFee}</span>
                    <span className="text-green-400 ml-2">${(event.entryFee * (1 - event.discount)).toFixed(2)}</span>
                    <span className="text-xs ml-1">({(event.discount * 100)}% off)</span>
                  </p>
                  <p className="text-gray-300 text-sm mt-1">{event.location}</p>
                  <p className="text-gray-300 text-sm mt-1 flex items-center">
                    Rating: {renderStars(event.rating)} ({event.rating}/5)
                  </p>
                  <button
                    onClick={() => handleReserveSpot(event)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                  >
                    Reserve Spot
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Featured Chefs</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:gap-8">
            {chefProfiles.map((chef, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-3 border border-blue-400 sm:gap-6">
                <img src={chef.image} alt={chef.name} className="w-full md:w-60 h-40 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-600 mb-2">{chef.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base">{chef.description}</p>
                  <a href="#profile" className="text-purple-600 text-xs sm:text-sm md:text-base mt-2 inline-block hover:underline">
                    View Recipes
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-6 sm:py-10 relative text-white">
        <div className="absolute inset-0 backdrop-blur-md blur-sm z-0"></div>
        <div className="relative z-[1] max-w-7xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Join Our Foodie Newsletter</h2>
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

export default FoodTestingEventSession;