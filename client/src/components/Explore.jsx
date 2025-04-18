import axios from 'axios';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import styled from 'styled-components';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Route');
  const [stops, setStops] = useState([]);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const editButtonRef = useRef(null); // Ref to position the edit form
  const {
    setTripData,
    tripData,
    backendUrl,
    Token,
    login,
   
    setTotalDistance,
    updateTrip,
    deleteTrip,
    setHasCreatedTrip,
  } = useContext(AppContext);
  const [newStop, setNewStop] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [editFormData, setEditFormData] = useState({
    start: '',
    destination: '',
    date: '',
    travelers: 1,
  });
  const [routePreferences, setRoutePreferences] = useState({
    "Fastest route": false,
    "Scenic route": false,
    "Avoid tolls": false,
    "Avoid highways": false,
  });

  const handleAddStop = () => setIsAddingStop(true);

  const handleStopSubmit = (e) => {
    e.preventDefault();
    if (newStop.trim()) {
      const updatedStops = [...stops, { name: newStop.trim(), url: 'https://cdn.usegalileo.ai/sdxl10/0e50c596-e0f3-4227-8134-652c1312dfac.png' }];
      setStops(updatedStops);
      setNewStop('');
      setIsAddingStop(false);
      if (tripData) {
        updateTrip(tripData._id, { ...tripData, stops: updatedStops });
      }
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${backendUrl}/trips`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      // console.log("trip data 1 .. ", response.data[0].userId);
      if (response.data.length > 0) {
        setTripData(response.data[0]);
        setHasCreatedTrip(true);
        setTotalDistance(response.data[0].totalDistance || '380 miles');
      } else {
        setTripData(null);
        setHasCreatedTrip(false);
        setTotalDistance(null);
      }
    } catch (error) {
      console.log('Error fetching trips:');
    }
  };

  useEffect(() => {
    if (login && Token) {
      fetchTrips();
    }
  }, [login, Token]);

  useEffect(() => {
    if (tripData) {
      setDestinationInput(tripData.destination || '');
      setStops(tripData.stops || []);
      setRoutePreferences({
        "Fastest route": tripData.preferences?.fastest || false,
        "Scenic route": tripData.preferences?.scenic || false,
        "Avoid tolls": tripData.preferences?.avoidTolls || false,
        "Avoid highways": tripData.preferences?.avoidHighways || false,
      });
      setEditFormData({
        start: tripData.start || '',
        destination: tripData.destination || '',
        date: tripData.date ? new Date(tripData.date).toISOString().split('T')[0] : '',
        travelers: tripData.travelers || 1,
      });
    }
  }, [tripData]);

  const handlePreferenceChange = (preference) => {
    setRoutePreferences((prev) => {
      const updatedPreferences = { ...prev, [preference]: !prev[preference] };
      if (tripData) {
        updateTrip(tripData._id, {
          ...tripData,
          preferences: {
            ...tripData.preferences,
            fastest: updatedPreferences["Fastest route"],
            scenic: updatedPreferences["Scenic route"],
            avoidTolls: updatedPreferences["Avoid tolls"],
            avoidHighways: updatedPreferences["Avoid highways"],
          },
        });
      }
      return updatedPreferences;
    });
  };

  const handleDestinationSubmit = (e) => {
    e.preventDefault();
    if (destinationInput.trim() && tripData) {
      updateTrip(tripData._id, { ...tripData, destination: destinationInput.trim() });
      setIsEditingDestination(false);
    }
  };

  const handleEditTrip = () => {
    setIsEditingTrip(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    if (tripData) {
      updateTrip(tripData._id, {
        ...tripData,
        ...editFormData,
        travelers: parseInt(editFormData.travelers, 10),
      });
      setIsEditingTrip(false);
    }
  };

  const handleDropTrip = () => {
    if (tripData && window.confirm('Are you sure you want to drop this trip?')) {
      setIsEditingTrip(false);
      setTripData(null);
      setHasCreatedTrip(false);
      deleteTrip(tripData._id);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Route':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col xl:flex-row gap-4">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/a6f31cc9-0997-4aec-b4c8-f5538d8dcde3.png")' }}
              />
              <div className="flex flex-col w-full min-w-[18rem] gap-2 py-4 xl:px-4">
                <p className="text-[#ccdae2] text-sm">
                  {tripData ? `${tripData.totalDistance || '380'} miles` : 'Distance TBD'}
                </p>
                <p className="text-[#0d161b] text-lg sm:text-xl font-bold">Route</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 justify-between">
                  <p className="text-[#cfdde6] text-base">
                    {tripData ? `The fastest route from ${tripData.start} to ${tripData.destination} via I-5 S` : 'Route TBD'}
                  </p>
                  <Link
                    to="/"
                    className="flex min-w-[84px] items-center justify-center rounded-xl h-8 px-4 bg-[#0a0c0d] text-slate-50 text-sm font-medium"
                  >
                    <span className="truncate">View directions</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Weather':
        return (
          <>
            <h2 className="text-[#c5d1d8] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Weather along the route
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {[
                { city: tripData?.start || "San Francisco", weather: "70°F, mostly cloudy", url: "https://cdn.usegalileo.ai/sdxl10/31afe777-49a1-4103-8b5e-23e25663e9a2.png" },
                { city: "Paso Robles", weather: "90°F, sunny", url: "https://cdn.usegalileo.ai/sdxl10/e5420513-5246-4810-bbf4-0ef5f9762fa7.png" },
                { city: "Santa Barbara", weather: "78°F, partly cloudy", url: "https://cdn.usegalileo.ai/sdxl10/8f320251-5d15-4959-9bdc-dfeea8e7c066.png" },
                { city: tripData?.destination || "Los Angeles", weather: "85°F, partly cloudy", url: "https://cdn.usegalileo.ai/sdxl10/22f34818-52ec-46e6-b0bb-88699efed582.png" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${item.url}")` }}
                  />
                  <div>
                    <p className="text-[#d4e1e9] text-base font-medium leading-normal">{item.city}</p>
                    <p className="text-[#121415] text-sm font-normal leading-normal">{item.weather}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 'Traffic':
        return (
          <>
            <h2 className="text-[#0d161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Traffic along the route
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {[
                { city: tripData?.start || "San Francisco", status: "Clear", url: "https://cdn.usegalileo.ai/sdxl10/3b64ed6f-aeb0-4c2c-aa97-ac706866266c.png" },
                { city: "Paso Robles", status: "Clear", url: "https://cdn.usegalileo.ai/sdxl10/6868135c-ceba-4f53-84e2-b240ffb86c71.png" },
                { city: "Santa Barbara", status: "Moderate traffic", url: "https://cdn.usegalileo.ai/sdxl10/8f320251-5d15-4959-9bdc-dfeea8e7c066.png" },
                { city: tripData?.destination || "Los Angeles", status: "Light traffic", url: "https://cdn.usegalileo.ai/sdxl10/8f320251-5d15-4959-9bdc-dfeea8e7c066.png" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${item.url}")` }}
                  />
                  <div>
                    <p className="text-[#e3ecf2] text-base font-medium leading-normal">{item.city}</p>
                    <p className="text-[#000000] text-sm font-normal leading-normal">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-slate-500 overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-5 max-w-7xl mx-auto w-full">
          {/* Left Sidebar */}
          <div className="flex flex-col w-full lg:w-80 shrink-0">
            <h2 className="text-[#0d161b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Trip details</h2>
            {tripData ? (
              [
                `${tripData.start} to ${tripData.destination}`,
                `Departure: ${new Date(tripData.date).toLocaleDateString()}`,
                "Return: Sun, July 21st",
                `Travelers: ${tripData.travelers}`,
                "Car type: Standard",
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-4 border border-gray-800 px-4 py-3">
                  <p className="text-[#0d161b] text-base truncate">{text}</p>
                </div>
              ))
            ) : (
              <p className="text-[#0d161b] px-4">No trip created yet.</p>
            )}

            <h2 className="text-[#0d161b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Route preferences</h2>
            <div className="flex flex-col gap-3 p-3">
              {Object.entries(routePreferences).map(([preference, isSelected]) => (
                <label key={preference} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePreferenceChange(preference)}
                    className="h-4 w-4 rounded border-[#212d33] text-[#285067] focus:ring-[#139cec]"
                  />
                  <span className="text-[#0d161b] text-sm font-medium">{preference}</span>
                </label>
              ))}
            </div>

            <h2 className="text-[#0d161b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Stops ({stops.length})</h2>
            {!isAddingStop ? (
              <button
                onClick={handleAddStop}
                className="flex items-center gap-4 bg-gray-600 px-4 py-3 cursor-pointer"
              >
                <div className="text-[#0d161b] flex items-center justify-center rounded-lg bg-[#e7eff3] shrink-0 size-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#0d161b] text-base font-medium">Add stop</p>
                  <p className="text-[#4c7d9a] text-sm">Add stops to your trip</p>
                </div>
              </button>
            ) : (
              <form onSubmit={handleStopSubmit} className="px-4 py-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    placeholder="Enter stop name"
                    className="flex-1 rounded-xl bg-[#e7eff3] px-4 py-2 text-[#0d161b] text-base border-none focus:outline-none"
                  />
                  <div className="flex z-50 gap-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#139cec] text-slate-50 px-4 py-2 text-sm font-medium"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingStop(false)}
                      className="rounded-xl bg-[#1e1f20] text-[#c9d4da] px-4 py-2 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 px-4 py-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-12 w-12"
                  style={{ backgroundImage: `url("${stop.url}")` }}
                />
                <p className="text-[#0d161b] text-base truncate">{stop.name}</p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 max-w-[960px] relative">
            <div className="p-4 sm:p-6">
              <div
                className="w-full bg-center bg-no-repeat bg-cover rounded-xl h-64 sm:h-96"
                style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/48bc955f-3c5e-499a-a2dc-18ac1b698c4e.png")' }}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6">
              <p className="text-[#0d161b] text-2xl sm:text-3xl font-bold">
                Let&#39;s go to {tripData?.destination || 'Destination TBD'}
              </p>
              <button
                className="flex min-w-[84px] items-center justify-center rounded-xl h-8 px-4 bg-[#141719] text-[#afc5d0] text-sm font-medium"
              >
                <span className="truncate">Start</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 sm:p-6">
              <div className="flex gap-3 rounded-lg border border-[#cfdfe7] bg-gray-700 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#9fb6c3" viewBox="0 0 256 256">
                  <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,1,1,144,0C200,161.23,144.53,209,128,222Z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#92b4c6] text-base font-bold">{tripData?.start || 'Los Angeles'}</h2>
                  <p className="text-[#35b3fc] text-sm">Departure</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-[#cfdfe7] bg-gray-700 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#a9bbc5" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#c2ced4] text-base font-bold">{tripData?.travelTime || '6h 5m'}</h2>
                  <p className="text-[#36a7e9] text-sm">Travel Time</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-[#cfdfe7] bg-gray-700 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#c9d4da" viewBox="0 0 256 256">
                  <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z" />
                </svg>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#9db5c2] text-base font-bold">{tripData?.driveTime || '4h 5m'}</h2>
                  <p className="text-[#35a7e9] text-sm">Drive Time</p>
                </div>
              </div>
            </div>

            <div className="flex border rounded-sm flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6 relative">
              <div className="flex flex-col text-center gap-2">
                <p className="text-[#0d161b] text-2xl sm:text-3xl font-bold">
                  {tripData ? `${tripData.start} to ${tripData.destination}` : 'No Trip created yet'}
                </p>
                <p className="text-[#c5d4dd] text-base">
                  {tripData ? `Your trip created on ${new Date(tripData.date).toLocaleDateString()}` : 'Date TBD'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <StyledWrapper>
                  <button ref={editButtonRef}  onClick={handleEditTrip}>
                    Edit trip
                    <div className="star-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                  </button>
                </StyledWrapper>
                <StyledWrapper>
                  <button onClick={handleDropTrip}>
                    Drop trip to add new
                    <div className="star-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                    <div className="star-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53">
                        <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                      </svg>
                    </div>
                  </button>
                </StyledWrapper>
              </div>
              {isEditingTrip && (
                <div
                  className=" bg-gray-400 p-5 rounded-lg  shadow-lg z-[999] absolute w-[300px]"
                  style={{
                    top: editButtonRef.current
                      ? `${window.innerWidth < 768 ? 40 : window.innerWidth < 1024 ? 60 : 80}px`
                      : 'auto',
                    left: editButtonRef.current
                      ? `${window.innerWidth < 768 ? 40 : window.innerWidth < 1024 ? 180 : 340}px`
                      : 'auto',
                  }}
                >
                  <form onSubmit={handleEditFormSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold">Edit Trip</h3>
                    <input
                      type="text"
                      name="start"
                      value={editFormData.start}
                      onChange={handleEditFormChange}
                      placeholder="Starting Point"
                      className="w-full p-2 border bg-slate-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="destination"
                      value={editFormData.destination}
                      onChange={handleEditFormChange}
                      placeholder="Destination"
                      className="w-full p-2 border bg-slate-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="travelers"
                      value={editFormData.travelers}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full p-2 border bg-slate-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTrip(false)}
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <h3 className="text-[#0d161b] text-lg sm:text-xl font-bold px-4 sm:px-6 pb-2 pt-4">Today</h3>
            {[
              { name: "Santa Monica Pier", url: "https://cdn.usegalileo.ai/sdxl10/0e50c596-e0f3-4227-8134-652c1312dfac.png" },
              { name: "Route 66", url: "https://cdn.usegalileo.ai/sdxl10/aca9505e-bf42-4e9c-b1d6-7a888db47fcf.png" },
              { name: "Saddle Ranch", url: "https://cdn.usegalileo.ai/sdxl10/89ea90c4-c7a3-4c39-8c08-e1761e42920c.png" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-700 border border-gray-400 rounded-sm px-4 py-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-12 w-12"
                  style={{ backgroundImage: `url("${item.url}")` }}
                />
                <p className="text-[#0d161b] text-base truncate">{item.name}</p>
              </div>
            ))}

            <div className="border-b mt-8 border-[#cfdfe7] px-4 sm:px-6">
              <div className="flex gap-4 sm:gap-8">
                {['Route', 'Weather', 'Traffic'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-col items-center justify-center border-b-[3px] ${
                      activeTab === tab
                        ? 'border-b-[#0e1011] text-[#0d161b]'
                        : 'border-b-transparent text-[#ebf3f7]'
                    } pb-3 pt-4`}
                  >
                    <p className="text-sm font-bold tracking-wide">{tab}</p>
                  </button>
                ))}
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  button {
    position: relative;
    padding: 12px 35px;
    background: #fec195;
    font-size: 17px;
    font-weight: 500;
    color: #181818;
    border: 3px solid #fec195;
    border-radius: 8px;
    box-shadow: 0 0 0 #fec1958c;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .star-1 {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
  }

  .star-2 {
    position: absolute;
    top: 45%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-3 {
    position: absolute;
    top: 40%;
    left: 40%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-4 {
    position: absolute;
    top: 20%;
    left: 40%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-5 {
    position: absolute;
    top: 25%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
  }

  .star-6 {
    position: absolute;
    top: 5%;
    left: 50%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 0.8s ease;
  }

  button:hover {
    background: transparent;
    color: #fec195;
    box-shadow: 0 0 25px #fec1958c;
  }

  button:hover .star-1 {
    position: absolute;
    top: -80%;
    left: -30%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-2 {
    position: absolute;
    top: -25%;
    left: 10%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-3 {
    position: absolute;
    top: 55%;
    left: 25%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-4 {
    position: absolute;
    top: 30%;
    left: 80%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-5 {
    position: absolute;
    top: 25%;
    left: 115%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  button:hover .star-6 {
    position: absolute;
    top: 5%;
    left: 60%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }

  .fil0 {
    fill: #fffdef;
  }
`;

export default Explore;