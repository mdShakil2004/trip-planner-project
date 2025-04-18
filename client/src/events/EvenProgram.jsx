import { useEffect, lazy, Suspense, useState } from "react";
const Venue = lazy(() => import('./Venue'));
import Activities from "./Activities";
import Loading from "../components/Loading";
import { assets, program } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import './cssevent.css';
import Loader from "../animation/Loader";

function EventProgram() {
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const loadVenues = () => {
      const venuesData = [
        {
          name: program.techConferences.title,
          image: program.techConferences.img,
          description: program.techConferences.description,
          location: program.techConferences.location,
          date: program.techConferences.date,
          price: program.techConferences.prices,
          discount: program.techConferences.discount,
          capacity: program.techConferences.capacity,
          booked: program.techConferences.booked,
          remaining: program.techConferences.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 100
        },
        {
          name: program.techConferences1.title,
          image: program.techConferences1.img,
          description: program.techConferences1.description,
          location: program.techConferences1.location,
          date: program.techConferences1.date,
          price: program.techConferences1.prices,
          discount: program.techConferences1.discount,
          capacity: program.techConferences1.capacity,
          booked: program.techConferences1.booked,
          remaining: program.techConferences1.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 102
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
          remaining: program.musicFestival.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 100
        },
        {
          name: program.musicFestival1.title,
          image: program.musicFestival1.img,
          description: program.musicFestival1.description,
          location: program.musicFestival1.location,
          date: program.musicFestival1.date,
          price: program.musicFestival1.prices,
          discount: program.musicFestival1.discount,
          capacity: program.musicFestival1.capacity,
          booked: program.musicFestival1.booked,
          remaining: program.musicFestival1.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 100
        },
        {
          name: program.BigFair1.title,
          image: program.BigFair1.img,
          description: program.BigFair1.description,
          location: program.BigFair1.location,
          date: program.BigFair1.date,
          price: program.BigFair1.prices,
          discount: program.BigFair1.discount,
          capacity: program.BigFair1.capacity,
          booked: program.BigFair1.booked,
          remaining: program.BigFair1.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 100
        },
        {
          name: program.BigFair.title,
          image: program.BigFair.img,
          description: program.BigFair.description,
          location: program.BigFair.location,
          date: program.BigFair.date,
          price: program.BigFair.prices,
          discount: program.BigFair.discount,
          capacity: program.BigFair.capacity,
          booked: program.BigFair.booked,
          remaining: program.BigFair.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 100
        },
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
          remaining: program.Grand_hall.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 50
        },
        {
          name: "AP big point",
          image: "https://vmnk.gumlet.io/assets/delhi/grand-affairs-banquet-kirti-nagar/images/original/grand-affairs-banquet-kirti-nagar-qy0rj.PNG",
          description: program.Grand_hall.description,
          location: program.Grand_hall.location,
          date: program.Grand_hall.date,
          price: program.Grand_hall.prices,
          discount: program.Grand_hall.discount,
          capacity: program.Grand_hall.capacity,
          booked: program.Grand_hall.booked,
          remaining: program.Grand_hall.remaining,
          participants: [assets.profile_icon, assets.famale_profile_icon, assets.profile_icon],
          additionalParticipants: 50
        },
      ];
      setVenues(venuesData);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    loadVenues();
  }, [])

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

  const [selectedSection, setSelectedSection] = useState("date");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [venueLoaded, setVenueLoaded] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const [budgetLoaded, setBudgetLoaded] = useState(false);

  useEffect(() => {
    if (selectedSection === "venue") {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setVenueLoaded(true);
      }, 2000);
      return () => clearTimeout(timeoutId);
    } else {
      setVenueLoaded(false);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection === "activities") {
      if (!activitiesLoaded) {
        setLoading(true);
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setActivitiesLoaded(true);
        }, 2000);
        return () => clearTimeout(timeoutId);
      }
    } else {
      setActivitiesLoaded(false);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection === "budget") {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setBudgetLoaded(true);
      }, 2000);
      return () => clearTimeout(timeoutId);
    } else {
      setBudgetLoaded(false);
    }
  }, [selectedSection]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 86400000);
    return () => clearInterval(intervalId);
  }, []);

  return (

    <div>
       {isLoading ? (
         <div className="fixed inset-0 flex justify-center items-center">
         <Loader/>
       </div>
       ):(

    <div className="relative min-h-screen w-[950px] border rounded-sm border-blue-400 z-20 flex flex-col gap-4 xs:gap-6 sm:gap-8 px-3 xs:px-4 sm:px-2 md:px-4">
      {/* Blurred background layer */}
      <div className="absolute inset-0 bg-gray-500 backdrop-blur-[50px] blur-sm z-0"></div>

      {/* Content above blur */}
      <div className="relative z-[1]">
        {/* Upcoming Events Section */}
        <div className="w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl shadow-sm rounded-lg p-3 xs:p-4 sm:p-6 ">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-2 xs:mb-3 sm:mb-4">
            Events at your next stopping
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3   xs:gap-4 sm:gap-6">
            {venues.map((event, index) => (
              <div 
                key={index} 
                className="border border-gray-700 backdrop-blur-[200px] bg-slate-600 hover:scale-95 duration-300 rounded-lg overflow-hidden"
              >
                <div
                  className="h-32 xs:h-40 sm:h-48 md:h-52 lg:h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="p-2 xs:p-3 sm:p-4">
                  <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold truncate text-black">{event.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
                    {event.description.split(" ").slice(0, 15).join(" ") + "..."}
                  </p>
                  <div className="text-gray-300 font-roboto text-xs sm:text-sm">
                    💰 <strong>Price:</strong> ${event.price} 
                    <span className="text-green-600"> ({event.discount}%off)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 truncate">📅 {event.date}</p>
                  <p className="text-xs sm:text-sm text-gray-300 truncate">📍 {event.location}</p>
                  <div className="flex items-center mt-1 xs:mt-2">
                    <div className="flex -space-x-1 xs:-space-x-2">
                      {event.participants.map((participant, i) => (
                        <img
                          key={i}
                          className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white"
                          src={participant}
                          alt={`Participant ${i + 1}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs sm:text-sm text-gray-900">
                      +{event.additionalParticipants}
                    </span>
                  </div>
                </div>
                <div className="p-2 xs:p-3 sm:p-4 flex justify-end mt-[-50px] xs:mt-[-60px] sm:mt-[-70px]">
                  <button 
                    onClick={() => handleLetsGoClick(event)} 
                    className="bg-blue-500 text-white font-semibold px-2 py-1 xs:px-3 xs:py-1 sm:px-4 sm:py-2 rounded-lg text-xs xs:text-sm sm:text-base hover:bg-blue-600 transition"
                  >
                    Let&#39;s Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Planning Section */}
        <div className="w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl border border-gray-800 shadow-sm rounded-lg p-3 xs:p-4 sm:p-6 bg-white/90 mt-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-2 xs:mb-3 sm:mb-4">
            Active Planning
          </h2>
          <div className="mt-3 xs:mt-4 border-b border-gray-200 flex flex-wrap gap-3 xs:gap-4 sm:gap-6 md:gap-8 text-gray-600 text-xs xs:text-sm sm:text-base">
            <span
              className={`cursor-pointer pb-1 xs:pb-2 ${selectedSection === "date" ? "text-black font-medium border-b-2 border-black" : ""}`}
              onClick={() => setSelectedSection("date")}
            >
              Date Selection
            </span>
            <span
              className={`cursor-pointer pb-1 xs:pb-2 ${selectedSection === "venue" ? "text-black font-medium border-b-2 border-black" : ""}`}
              onClick={() => setSelectedSection("venue")}
            >
              Venue
            </span>
            <span
              className={`cursor-pointer pb-1 xs:pb-2 ${selectedSection === "activities" ? "text-black font-medium border-b-2 border-black" : ""}`}
              onClick={() => setSelectedSection("activities")}
            >
              Activities
            </span>
            
          </div>
          <div className="mt-3 xs:mt-4 sm:mt-6">
            {selectedSection === "date" && (
              <div className="grid grid-cols-7 gap-1 xs:gap-2 sm:gap-3 text-center">
                {Array.from({ length: 7 }, (_, index) => {
                  const currentDate = new Date();
                  const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
                  const date = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + index));
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-gray-800 text-[10px] xs:text-xs sm:text-sm">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]}
                      </span>
                      <button className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded bg-gray-300 mt-1 xs:mt-2 text-[10px] xs:text-xs sm:text-sm">
                        {date.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedSection === "venue" && (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  venueLoaded ? (
                    <Suspense fallback={null}>
                      <Venue />
                    </Suspense>
                  ) : null
                )}
              </div>
            )}
            {selectedSection === "activities" && (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  activitiesLoaded ? (
                    <Activities />
                  ) : null
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
       )}



    </div>

  )
}

export default EventProgram;