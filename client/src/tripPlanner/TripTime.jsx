import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const TripTime = () => {
  const { locationNamesEvery1km, tripData,locationAt2km,locationAt1km, locationNamesEvery2km } = useContext(AppContext);
  //  console.log("the data after one 1km ",locationNamesEvery1km[0])

  // Time formatting functions
  const formatTime = (date, timeZone) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone,
    }).format(date);
  };

  const generateTripTimes = (baseTime, timeZone, count = 2) => {
    const times = [];
    for (let i = 0; i < count; i++) {
      const newTime = new Date(baseTime);
      newTime.setHours(baseTime.getHours() + i * 3);
      times.push(formatTime(newTime, timeZone));
    }
    return times;
  };

  const timeZone = "Asia/Kolkata";

  // Initial state with fallback defaults
  const [tripPlans, setTripPlans] = useState(() => {
    const now = new Date();
    const initialTimes = generateTripTimes(now, timeZone, 2);
    return [
      {
        id: 0,
        time: initialTimes[0],
        title: tripData==null?"Next: awaiting for trip data... ":"Next : rani bag city" ,
        location: (locationAt1km.street&&locationAt1km.area)==''?("awaiting for trip data..."):(locationAt1km.street+","+locationAt1km.area+","+locationAt1km.city),
        status: "Pending",
        confirmedVotes: 0,
      },
      {
        id: 1,
        time: initialTimes[1],
        title: tripData==null?"Next: awaiting for trip data... ":"Next : YC coffee point",
        location:(locationAt2km.street&&locationAt2km.area)==''?("awaiting for trip data..."):(locationAt2km.street+","+locationAt2km.area+","+locationAt2km.city),
        status: "Pending",
        confirmedVotes: 0,
      },
    ];
  });

  const [votedClients, setVotedClients] = useState(new Set());
  const [clientVoteCount, setClientVoteCount] = useState(0);

  // Define and update default located points in useEffect


 
 
  // Update times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTimes = generateTripTimes(now, timeZone, 2);
      setTripPlans((prevPlans) =>
        prevPlans.map((plan, index) => ({
          ...plan,
          time: updatedTimes[index],
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const handleVote = (tripId, clientId = "client" + (clientVoteCount + 1)) => {

    if(tripData==null)
    {
      alert("create trip first...");
      return;
    }




    
    if (votedClients.has(clientId)) {
      alert("This client has already voted!");
      return;
    }

    setTripPlans((prevPlans) => {
      let newPlans = prevPlans.map((plan) => ({ ...plan }));
      const planIndex = newPlans.findIndex((plan) => plan.id === tripId);
      const voteIncrement = clientVoteCount + 1;
      newPlans[planIndex].confirmedVotes += voteIncrement;
      newPlans[planIndex].status = newPlans[planIndex].confirmedVotes > 0 ? "Confirmed" : "Pending";
      return newPlans;
    });

    setVotedClients((prev) => new Set(prev).add(clientId));
    setClientVoteCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col bg-gray-500 md:flex-col items-center gap-2 p-4 bg-transparent w-full max-w-4xl">
    {/* Display Meeting Points */}
    

    {/* Trip Plans */}
    {tripPlans.map((plan) => (
      <div key={plan.id} className="w-full">
        <div className="text-black text-center justify-center items-center text-sm">{plan.time}</div>
        <div className="bg-gray-400 transition-transform transform hover:scale-95 rounded-lg p-4 flex flex-col w-full">
          
          <div className="flex justify-between items-center">
             {/* Display "Start" or "Next" below the time */}
          
            <div>
            <div className="text-gray-600 text-start top-0 text-sm font-semibold">
            {plan.id === 0 ? "Current" : "Next"}
          </div>
              <h3 className="text-lg font-medium">{plan.title}</h3>
              
              <p className="text-gray-800 text-sm"> <span className='text-lg font-semibold'>meeting point:</span> {plan.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`${
                  plan.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                } text-xs font-medium px-3 py-1 rounded`}
              >
                {plan.status}
              </span>
              <div className="flex z-50 gap-2">
                <button
                  onClick={() => handleVote(plan.id)}
                  style={{ position: "relative", pointerEvents: "auto", zIndex: 9999 }}
                  className="px-2  py-1 text-sm rounded  transition-colors bg-green-50 text-green-600 hover:bg-green-100"
                >
                  Vote ({plan.confirmedVotes})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
};

export default TripTime;