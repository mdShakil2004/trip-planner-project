import { useState, useEffect, useRef, useContext } from "react";
import { assets } from "../assets/assets";
import Weathers from "../components/Weathers";
import { AppContext } from "../context/AppContext";
import Avatar from "react-nice-avatar";


function TripColleburation() {
  const {tripData,setShowLogin,groupLink,loginData,selectedAvatar} =useContext(AppContext)
  const [messages, setMessages] = useState([]);
const start =tripData==null?"start point":tripData.start;
const endPoint=tripData==null?" destination point":tripData.destination;
  const [destinations, setDestinations] = useState([
    { name:  start, votes: 0 },
    { name: endPoint, votes: 0 },
  ]);
  const [userVote, setUserVote] = useState(null);
  const messagesEndRef = useRef(null);

  

  const handleVote = (destinationName) => {

    if(loginData==null)
    {
      setShowLogin(true)
    }
    setDestinations((prevDestinations) => {
      let newDestinations = prevDestinations.map((dest) => ({ ...dest }));
      if (userVote) {
        newDestinations = newDestinations.map((dest) =>
          dest.name === userVote && dest.votes > 0 ? { ...dest, votes: dest.votes - 1 } : dest
        );
      }
      newDestinations = newDestinations.map((dest) =>
        dest.name === destinationName ? { ...dest, votes: dest.votes + 1 } : dest
      );
      return newDestinations;
    });
    setUserVote(destinationName);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(groupLink).then(() => {
      if(loginData==null)
      {
        setShowLogin(true);
      }
      else{
        alert("Group link copied to clipboard!");

      }
      
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[1200px] mr-20 z-20 rounded-tr-md border bg-gray-600 border-gray-200 w-full max-w-[520px] 
      sm:px-4 
      md:max-w-[450px] 
      lg:max-w-[496px]">
      <div className="flex flex-col w-full p-2 
        sm:p-3 
        md:p-4 
        lg:p-5">
        <h2 className="text-base font-semibold mb-2 
          sm:text-lg 
          md:text-xl 
          lg:text-2xl 
          sm:mb-3">Trip Collaboration</h2>

        {/* Trip Members Section */}
        <div className="mb-2 
          sm:mb-3 
          md:mb-4">
          <h3 className="text-xs font-medium text-gray-900 mb-1 
            sm:text-sm 
            sm:mb-2">Trip Members</h3>
          <div className="flex items-center">
            <div className="flex -space-x-2 
              sm:-space-x-3">
              
             {loginData ? (
                             <Avatar
                               style={{ width: "40px", height: "40px" }}
                               className="rounded-full"
                               {...selectedAvatar}
                             />
                           ) : (
                            <img
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm 
                  sm:w-8 sm:h-8 
                  md:w-10 md:h-10"
                src={assets.profile_icon}
                alt="Mike"
              />
                           )}
              
              <div className="relative group">
                <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-gray-300 hover:bg-gray-600 transition-colors cursor-pointer 
                  sm:w-8 sm:h-8 
                  md:w-10 md:h-10 
                  sm:text-sm">
                  +2
                </div>
                <button
                  onClick={copyLinkToClipboard}
                  className="absolute hidden group-hover:block bottom-5 left-6 z-10 text-white 
                    sm:bottom-6 sm:left-8 
                    md:bottom-8 md:left-9"
                >
                  <ul className="list-none m-0 bg-black rounded-se-xl rounded-ss-xl rounded-ee-xl p-1 border text-xs 
                    sm:text-sm">
                    <li className="h-5 w-20 text-center cursor-pointer 
                      sm:h-6 sm:w-28"> {loginData==null?"create account ":"share group link"} </li>
                  </ul>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="mb-2 
          sm:mb-3">
          <h3 className="text-xs font-medium text-gray-900 mb-1 
            sm:text-sm 
            sm:mb-2">Vote on Next Stop</h3>
          <div className="space-y-2 
            sm:space-y-3">
            {destinations.map((destination) => (
              <button
                key={destination.name}
                onClick={() => handleVote(destination.name)}
                className="w-full border border-gray-200 rounded-lg p-2 flex flex-col justify-between items-start hover:bg-gray-500 duration-300 transition-colors group text-left 
                  sm:p-3 sm:flex-row sm:items-center"
              >
                <h4 className="text-sm text-gray-900 font-medium mb-1 
                  sm:text-base 
                  sm:mb-0">{destination.name}</h4>
                <div className="flex items-center gap-1 w-full justify-between 
                  sm:gap-2 sm:w-auto sm:justify-start">
                  <span className="text-xs text-gray-900 
                    sm:text-sm">{destination.votes} votes</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors group-hover:bg-blue-400 
                      sm:px-3 sm:py-1.5 sm:text-sm 
                      ${userVote === destination.name ? "bg-gray-400 text-blue-600" : "bg-gray-400 text-blue-600"}`}
                  >
                    {userVote === destination.name ? "Voted" : "Vote"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weather Section */}
        <div className="w-full">
          <Weathers />
        </div>
      </div>
    </div>
  );
}

export default TripColleburation;