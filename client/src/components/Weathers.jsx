import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext"; // Adjust the import path
import { assets } from "../assets/assets";

const Weathers = () => {
  const { locationNamesEvery1km, locationNamesEvery2km, tripData, setSkyCondition, totalDistance } = useContext(AppContext);

  const [weatherData, setWeatherData] = useState({
    place1: { name: "Delhi", condition: "Sunny", temp: 25, precip: 0, humidity: 36, wind: 6 },
    place2: { name: "Mumbai", condition: "Sunny", temp: 28, precip: 0, humidity: 36, wind: 6 },
    nextDay: { condition: "Partly Cloudy", temp: 26 },
  });

  const API_KEY = "##################"; // Your provided key
  const DEFAULT_PLACE1 = "Current Area";
  const DEFAULT_PLACE2 = "Next Area";

  const finalPoint = tripData?.destination || "final point";

  useEffect(() => {
    const place1Name = locationNamesEvery1km?.length > 0 ? locationNamesEvery1km[0] : DEFAULT_PLACE1;
    const place2Name = locationNamesEvery2km?.length > 0 ? locationNamesEvery2km[0] : DEFAULT_PLACE2;
   
    fetchWeatherData([{ name: place1Name }, { name: place2Name }]);
  }, [locationNamesEvery1km, locationNamesEvery2km]);

  useEffect(() => {
    // Update sky condition based on fetched weather data
    const conditions = [weatherData.place1.condition.toLowerCase(), weatherData.place2.condition.toLowerCase()];
    // console.log("Current Weather Conditions:", conditions);
    if (conditions.some(condition => condition.includes("rain"))) {
      setSkyCondition("Raining along your route");
    } else if (conditions.some(condition => condition.includes("cloud"))) {
      setSkyCondition("Cloudy skies along your route");
    } else {
      // console.log("trip....".tripData)
      tripData!=null ?setSkyCondition("Clear skies along your route"):setSkyCondition("Awaiting trip data...")
      
    }
  }, [weatherData, setSkyCondition]);

  const fetchWeatherData = async (places) => {
    try {
      const geocode = async (placeName) => {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(placeName)}&limit=1&appid=${API_KEY}`
        );
        // console.log(`Geocode Response Status for ${placeName}:`, response.status);
        if (!response.ok) throw new Error(`Geocode failed with status: ${response.status}`);
        const data = await response.json();
        // console.log(`Geocode Data for ${placeName}:`, data);
        if (data.length > 0) return { name: placeName, lat: data[0].lat, lon: data[0].lon };
        throw new Error(`No coordinates found for ${placeName}`);
      };

      const [place1Coords, place2Coords] = await Promise.all([geocode(places[0].name), geocode(places[1].name)]);
      // console.log("Place 1 Coords:", place1Coords);
      // console.log("Place 2 Coords:", place2Coords);

      const fetchWeather = async (coords) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
        );
        // console.log(`Weather Response Status for ${coords.name}:`, response.status);
        if (!response.ok) throw new Error(`Weather fetch failed with status: ${response.status}`);
        const data = await response.json();
        // console.log(`Weather Data for ${coords.name}:`, data);
        return data;
      };

      const fetchForecast = async (coords) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
        );
        // console.log(`Forecast Response Status for ${coords.name}:`, response.status);
        if (!response.ok) throw new Error(`Forecast fetch failed with status: ${response.status}`);
        const data = await response.json();
        // console.log(`Forecast Data for ${coords.name}:`, data);
        return data.list[8]; // Approx 24 hours ahead
      };

      const [place1Data, place2Data, nextDayData] = await Promise.all([
        fetchWeather(place1Coords),
        fetchWeather(place2Coords),
        fetchForecast(place1Coords),
      ]);

      setWeatherData({
        place1: {
          name: place1Coords.name,
          condition: place1Data.weather[0].main,
          temp: Math.round(place1Data.main.temp),
          precip: place1Data.rain?.["1h"] || 0,
          humidity: place1Data.main.humidity,
          wind: Math.round(place1Data.wind.speed * 3.6),
        },
        place2: {
          name: place2Coords.name,
          condition: place2Data.weather[0].main,
          temp: Math.round(place2Data.main.temp),
          precip: place2Data.rain?.["1h"] || 0,
          humidity: place2Data.main.humidity,
          wind: Math.round(place2Data.wind.speed * 3.6),
        },
        nextDay: {
          condition: nextDayData.weather[0].main,
          temp: Math.round(nextDayData.main.temp),
        },
      });
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      setWeatherData({
        place1: { name: places[0].name, condition: "Sunny", temp: 25, precip: 0, humidity: 36, wind: 6 },
        place2: { name: places[1].name, condition: "Sunny", temp: 28, precip: 0, humidity: 36, wind: 6 },
        nextDay: { condition: "Partly Cloudy", temp: 26 },
      });
    }
  };

  return (
    <div className="flex flex-col w-full space-y-2 
      sm:space-y-3">
      <div className="bg-gray-400 border border-gray-300 rounded-md shadow-md p-2 w-full transition-transform transform hover:scale-95 
        sm:p-3 
        md:p-4">
        <h2 className="text-xs font-semibold mb-1 
          sm:text-sm 
          md:text-base">{weatherData.place1.name} </h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-xs text-gray-500 
            sm:text-sm">
            <p className="text-sm text-gray-800">Humidity: {weatherData.place1.humidity}%</p>
            <p className="text-sm text-gray-700">Wind: {weatherData.place1.wind} km/h</p>
          </div>
          <div className="flex flex-col  items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.place1.condition.toLowerCase()}@2x.png`}
              alt={weatherData.place1.condition}
              className="w-8 h-8 
                sm:w-10 sm:h-10 
                md:w-12 md:h-12"
              onError={(e) => (e.target.src = 'https://img.icons8.com/?size=100&id=8LM7-CYX4BPD&format=png&color=000000')}
            />
            <p className="text-xs mt-1 
              sm:text-sm">{weatherData.place1.temp}°C {weatherData.place1.condition}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-400 border border-gray-300 rounded-md shadow-md p-2 w-full transition-transform transform hover:scale-95 
        sm:p-3 
        md:p-4">
        <h2 className="text-xs font-semibold mb-1 
          sm:text-sm 
          md:text-base">{weatherData.place2.name} </h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-xs text-gray-500 
            sm:text-sm">
            <p className="text-sm text-gray-800">Humidity: {weatherData.place2.humidity}%</p>
            <p className="text-sm text-gray-800">Wind: {weatherData.place2.wind} km/h</p>
          </div>
          <div className="flex flex-col  items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.place2.condition.toLowerCase()}@2x.png`}
              alt={weatherData.place2.condition}
              className="w-8 h-8 
                sm:w-10 sm:h-10 
                md:w-12 md:h-12"
              onError={(e) => (e.target.src = 'https://img.icons8.com/?size=100&id=sUeaDmjgiIBI&format=png&color=000000')}
            />
            <p className="text-lg sm:text-sm absolute mr-20 top-1/2 -translate-y-1/2 ">{weatherData.place2.temp}°C {weatherData.place2.condition}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-400 border border-gray-300 rounded-md shadow-md p-2 w-full transition-transform transform hover:scale-95 
        sm:p-3 
        md:p-4">
     
      <div className="flex flex-col gap-2 
          sm:flex-row sm:items-center sm:gap-3 
          md:gap-4">
  <p className="text-xs font-semibold flex items-center 
            sm:text-sm 
            md:text-base">
    <img className="w-4 h-4 mr-1 
                sm:w-5 sm:h-5 sm:mr-2 
                md:w-6 md:h-6" src={assets.finalpoint_icon} alt="Final point" />
    <span className="ml-2">{finalPoint}</span>
  </p>
  <p className="text-xs ml-14 
            sm:text-sm 
            md:text-base">{weatherData.nextDay.temp}°C {weatherData.nextDay.condition}</p>
</div>


        <div className="flex items-center justify-between">
          <div className="flex flex-row">
    {totalDistance != null ? (
  <>
    {Math.floor(totalDistance)}
    <span className="text-gray-700"> .KM</span>
  </>
) : (
  <p className="text-red-600">status</p>
)}


          </div>

          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.nextDay.condition.toLowerCase()}@2x.png`}
              alt={weatherData.nextDay.condition}
              className="w-12 h-12"
              onError={(e) => (e.target.src = 'https://img.icons8.com/?size=100&id=72jK8a9VDKgF&format=png&color=000000')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weathers;
