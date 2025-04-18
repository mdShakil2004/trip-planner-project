import axios from 'axios';
import { useState, createContext, useEffect } from 'react';
import { genConfig } from "react-nice-avatar";
export const AppContext = createContext();
import {  toast } from "react-toastify";

const AppContextProvider = (props) => {
  const [locationAt1km, setLocationAt1km] = useState({
    street: '',
    area: '',
    city: '',
    postalCode: '',
    state: ''
  });
  const [locationAt2km, setLocationAt2km] = useState({
    street: '',
    area: '',
    city: '',
    postalCode: '',
    state: ''
  });


  const [login, setLogin] = useState(false);
  const [Token, setToken] = useState(localStorage.getItem("token")|| null);
  const [loginData, setLoginData] = useState(null); 
  const [hasCreatedTrip, setHasCreatedTrip] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTripPlan, setCreateTripPlan] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [locationNamesEvery1km, setLocationNamesEvery1km] = useState([]);
  const [locationNamesEvery2km, setLocationNamesEvery2km] = useState([]);
  const [skyCondition, setSkyCondition] = useState("Awaiting for trip data...");
  const [totalDistance, setTotalDistance] = useState(null);
    const [groupLink, setGroupLink] = useState(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  



  // console.log("locationNameEvery1km .. ", locationAt1km);
  // console.log("locationNameEvery2km .. ", locationAt2km);

  const [budgetHistory, setBudgetHistory] = useState(() => {
    const storedHistory = localStorage.getItem('budgetHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const addBudgetHistory = (item) => {
    setBudgetHistory((prevHistory) => [...prevHistory, item]);
  };

  useEffect(() => {
    localStorage.setItem('budgetHistory', JSON.stringify(budgetHistory));
    
  }, [budgetHistory]);

  useEffect(() => {
    const updateBudgetHistory = (item) => {
      setBudgetHistory((prevHistory) => [...prevHistory, item]);
    };
    // Return a function to update budget history when the component mounts
    return () => {
      updateBudgetHistory;
    };
  }, []);

  const fetchTripById = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/trips/${id}`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
     
      setTripData(response.data);
    } catch (error) {
      toast.error("Error fetching trip!"); 
    }
  };


// for avatar manage
  // Avatar Management
  const defaultAvatars = Array.from({ length: 25 }, (_, i) =>
    genConfig({
      sex: i % 2 === 0 ? "man" : "woman",
      hairStyle: ["normal", "thick", "mohawk", "womanLong", "womanShort"][i % 5],
      faceColor: ["#F9C9B6", "#AC6651", "#FFD3B5", "#FFF3E0", "#D2A2CC"][i % 5],
      eyeStyle: ["circle", "oval", "smile"][i % 3],
      hairColor: ["#000", "#FFF", "#FFD700", "#8B4513", "#FF4500"][i % 5],
      shirtColor: ["#9287FF", "#6BD9E9", "#F9C9B6", "#73D9A2", "#FF5733"][i % 5],
    })
  );
 

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    // Load from localStorage if available, otherwise use a random default avatar
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      return JSON.parse(storedAvatar);
    } else {
      const randomAvatarIndex = Math.floor(Math.random() * 25);
      const randomAvatar = defaultAvatars[randomAvatarIndex];
      localStorage.setItem("selectedAvatar", JSON.stringify(randomAvatar));
      return randomAvatar;
    }
  });





  // Persist selectedAvatar to localStorage whenever it changes
  // useEffect(() => {
    
  //   if (selectedAvatar) {
  //     localStorage.setItem("selectedAvatar", JSON.stringify(selectedAvatar));
  //   }
    
  // }, [selectedAvatar]);

  // console.log("selecct avatar ",selectedAvatar)











  const logout = () => {
    localStorage.removeItem("token");
    setToken('');
    setLoginData(null);
    setTripData(null);
    setLogin(false);
    setIsSidebarOpen(false);
    setHasCreatedTrip(false);
    setShowLogin(false);
    setSelectedAvatar(defaultAvatars[0]); // Reset avatar on logout
    
  };

  const updateTrip = async (id, updatedData) => {
    try {
      const response = await axios.put(`${backendUrl}/trips/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      const updatedTrip = response.data;
      setTripData(updatedTrip);
      setTotalDistance(updatedTrip.totalDistance || '380 miles'); // Update distance if provided
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  // Distribute the locationNamesEvery1km
  const separateLocationAt1km = (locationData) => {
    if (!locationData || (Array.isArray(locationData) && locationData.length === 0)) {
      setLocationAt1km({
        street: '',
        area: '',
        city: '',
        postalCode: '',
        state: ''
      });
      return;
    }

    // Extract the string from locationData (array or direct string)
    const locationString = Array.isArray(locationData) ? locationData[0] : locationData;

    if (typeof locationString !== 'string') {
      console.error('locationString for 1km is not a string:', locationString);
      setLocationAt1km({
        street: '',
        area: '',
        city: '',
        postalCode: '',
        state: ''
      });
      return;
    }

    // Split the location string by commas
    const parts = locationString.split(',').map(part => part.trim());

    // Assuming format: "Street, Area, City PostalCode, State"
    const streetPart = parts[0] || '';
    const areaPart = parts[1] || '';
    const cityPostalPart = parts[2] ? parts[2].split(' ') : [''];
    const cityPart = cityPostalPart[0] || '';
    const postalCodePart = cityPostalPart[1] || '';
    const statePart = parts[3] || '';

    // Update the entire location object
    setLocationAt1km({
      street: streetPart,
      area: areaPart,
      city: cityPart,
      postalCode: postalCodePart,
      state: statePart
    });
  };

  // Update the separated data whenever locationNamesEvery1km changes
  useEffect(() => {
    separateLocationAt1km(locationNamesEvery1km);
  }, [locationNamesEvery1km]);

  // Distribute the locationNamesEvery2km
  const separateLocationAt2km = (locationData) => {
    if (!locationData || (Array.isArray(locationData) && locationData.length === 0)) {
      setLocationAt2km({
        street: '',
        area: '',
        city: '',
        postalCode: '',
        state: ''
      });
      return;
    }

    // Extract the string from locationData (array or direct string)
    const locationString = Array.isArray(locationData) ? locationData[0] : locationData;

    if (typeof locationString !== 'string') {
      console.error('locationString for 2km is not a string:', locationString);
      setLocationAt2km({
        street: '',
        area: '',
        city: '',
        postalCode: '',
        state: ''
      });
      return;
    }

    // Split the location string by commas
    const parts = locationString.split(',').map(part => part.trim());

    // Assuming format: "Street, Area, City PostalCode, State"
    const streetPart = parts[0] || '';
    const areaPart = parts[1] || '';
    const cityPostalPart = parts[2] ? parts[2].split(' ') : [''];
    const cityPart = cityPostalPart[0] || '';
    const postalCodePart = cityPostalPart[1] || '';
    const statePart = parts[3] || '';

    // Update the entire location object
    setLocationAt2km({
      street: streetPart,
      area: areaPart,
      city: cityPart,
      postalCode: postalCodePart,
      state: statePart
    });
  };



  
  // Update the separated data whenever locationNamesEvery2km changes
  useEffect(() => {
    separateLocationAt2km(locationNamesEvery2km);
  }, [locationNamesEvery2km]);

  const value = {
    showLogin,
    setShowLogin,
    isSidebarOpen,
    setIsSidebarOpen,
    isCreateTripPlan,
    setCreateTripPlan,
    tripData,
    setTripData,
    locationNamesEvery1km,
    setLocationNamesEvery1km,
    locationNamesEvery2km,
    setLocationNamesEvery2km,
    skyCondition,
    setSkyCondition,
    totalDistance,
    setTotalDistance,
    budgetHistory,
    addBudgetHistory,
    setBudgetHistory,
    hasCreatedTrip,
    setHasCreatedTrip,
    backendUrl,
    loginData,
    setLoginData,
    Token,
    setToken,
    logout,
    login,
    setLogin,
    fetchTripById,
    updateTrip,
    locationAt1km, // Add these to context so they can be accessed
    locationAt2km,
    selectedAvatar,
    setSelectedAvatar,
    defaultAvatars,
    groupLink, setGroupLink

  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;