import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import "../animation/bg_animation.css"
import axios from "axios";
import {  toast } from "react-toastify";

const CreateTripPlan = () => {
  const { setCreateTripPlan, setTripData,setHasCreatedTrip,backendUrl,Token } = useContext(AppContext);
  
  const [formData, setFormData] = React.useState({
    start: "",
    destination: "",
    date: "",
    travelers: 1,
    preferences: { scenic: false, avoidHighways: false, restStops: false },
  });
  

  // Handle form input changes and checkbox state changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const createTrip = async () => {
    try {

      const data = await axios.post(backendUrl+"/trips", { 
        start: formData.start,
        destination: formData.destination,
        date: formData.date,
        travelers: formData.travelers,
        preferences: formData.preferences,
        },
        {headers:{ Authorization: `Bearer ${Token}`}}
      );


      
    } catch (error) {
      toast.error('Failed to create trip. Please try again later.');
      
    }
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    setTripData(formData); // Save trip data to context
    createTrip();
    setHasCreatedTrip(true); // Set hasCreatedTrip to true
    toast.success("added your trip! (sometimes this may generate Inaccurate info)");   // toast notification


    //

    
    setCreateTripPlan(false); // Switch to map view

   




  };

  return (
    <div className="flex p-4 w-96 z-[999] relative   rounded-md gradient-background flex-col">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">Plan Your Trip</h2>
      <form onSubmit={handleSubmit} className="flex-1 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Starting Point</label>
          <div className="relative">
            <img src={assets.location_icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" alt="Location" />
            <input
              type="text"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border bg-gray-500 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter starting location"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
          <div className="relative">
            <img src={assets.flag_icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" alt="Destination" />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter destination"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Travel Dates</label>
          <div className="relative">
            <img src={assets.date_icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" alt="Calendar" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border bg-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Number of Travelers</label>
          <div className="relative">
            <img src={assets.group_icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" alt="Travelers" />
            <input
              type="number"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border bg-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Route Preferences</label>
          <div className="space-y-3">
            <label className="flex items-center p-2 hover:bg-gray-400 rounded-lg">
              <input
                type="checkbox"
                name="scenic"
                checked={formData.preferences.scenic}
                onChange={handleChange}
                className="rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
              />
              <span className="ml-3 text-sm">Scenic Routes</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-400 rounded-lg">
              <input
                type="checkbox"
                name="avoidHighways"
                checked={formData.preferences.avoidHighways}
                onChange={handleChange}
                className="rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
              />
              <span className="ml-3 text-sm">Avoid Highways</span>
            </label>
            <label className="flex items-center p-2 hover:bg-gray-400 rounded-lg">
              <input
                type="checkbox"
                name="restStops"
                checked={formData.preferences.restStops}
                onChange={handleChange}
                className="rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
              />
              <span className="ml-3 text-sm">Include Rest Stops</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 rounded-lg transition-colors"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
};

export default CreateTripPlan;