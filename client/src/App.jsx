import EventPage from "./pages/EventPage";
import Footers from "./components/Footers";
import Slidebar from "./components/Slidebar";
import Navbar from "./components/Navbar";
import Weathers from "./components/Weathers";
import Home from "./pages/Home";
import { Routes, Route ,useNavigate} from "react-router-dom";
import DetailsEvent from "./events/DetailsEvent";
import LoginModal from "./components/LoginModal";
import BackgroundScene from "./animation/BackgroundScene";
import Explore from "./components/Explore";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";
import ProtectedRoute from "./ProtectedRoute";
import { motion } from "framer-motion";
import CreateTripPlan from "./tripPlanner/CreateTripPlan";
import { ToastContainer } from 'react-toastify';








function App() {
  const navigate = useNavigate();
  const {showLogin,isCreateTripPlan} =useContext(AppContext)

  // const [screenSize, setScreenSize] = useState('mobile');
  
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width >= 1440) {
  //       setScreenSize('desktop');
  //     } else if (width >= 1024) {
  //       setScreenSize('laptop');
  //     } else {
  //       setScreenSize('mobile');
  //     }
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // useEffect(() => {
  //   if (showLogin) {
  //     navigate('/login');
  //   }
    
  // }, [showLogin, navigate]);






  
  return (
    <div className="sm:px-10 relative  md:px-14 lg:px-4 z-20 overflow-visible">
      <BackgroundScene/>
      <Navbar />
      <Slidebar />


      {isCreateTripPlan && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-x-0 top-24 mx-auto w-full z-10 max-w-50  shadow-lg  p-4 rounded-b-lg 
              sm:max-w-lg 
              md:max-w-xl 
              lg:max-w-xl "
          >
            <CreateTripPlan />
          </motion.div>
        )}

<ToastContainer position="bottom-right"/>  {/* for showing toast notification */}

      <Routes>
        <Route
          path="/*"
          element={
            showLogin ? (
              <div>
                <LoginModal />
              </div>
            ) : (
              
                <Home />
             
            )
          }
        />



        <Route
          path="/event/*"
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weathers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details-event"
          element={
            <ProtectedRoute>
              <DetailsEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
           
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            
          }
        />
      </Routes>
      <Footers />
     
    </div>
  );
}

export default App;


