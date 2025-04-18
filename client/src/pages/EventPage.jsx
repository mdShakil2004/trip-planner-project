import { Routes, Route } from 'react-router-dom';
import BeachResort from '../events/BeachResort';
import EventProgram from '../events/EvenProgram'; // Assuming typo corrected from EvenProgram
import Hotel from '../events/Hotel';
import AiEventSuggest from '../events/AiEventSuggest';
import LiveBandHub from '../events/LiveBandHub';
import FoodTestingEventSession from '../events/FoodTestingEventSession';
import InteractiveGamesSession from '../events/InteractiveGamesSession';
import Budget from '../components/Budget';
import ActivitieBar from '../events/ActivitieBar';
import Checkout from '../components/Checkout';

const EventPage = () => {
  return (
    <div className="container mx-auto px-2 py-1 min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-6 lg:gap-8">
              {/* Stack vertically on small screens, side-by-side on medium and larger */}
              <div className="w-full md:w-2/3 lg:w-3/5">
                <EventProgram />
              </div>
              <div className="w-full ml-2 md:w-1/3 lg:w-2/5">
                <AiEventSuggest />
              </div>
            </div>
          }
        />
        <Route
          path="beachResort"
          element={
            <div className=" ml-20 mx-auto px-2 sm:px-4 md:px-6">
              <BeachResort />
            </div>
          }
        />
        <Route
          path="book-hostel"
          element={
            <div className=" ml-20 mx-auto px-2 sm:px-4 md:px-6">
              <Hotel />
            </div>
          }
        />
        <Route 
          path="/live-band-performance" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <LiveBandHub />
            </div>
          } 
        />
        <Route 
          path="/food-testing" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <FoodTestingEventSession />
            </div>
          } 
        />
        <Route 
          path="/game-session" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <InteractiveGamesSession />
            </div>
          }  
        />
        <Route 
          path="/budget" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <Budget/>
            </div>
          } 
        />
        <Route 
          path="activities" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <ActivitieBar/>
            </div>
          } 
        />

<Route 
          path="check-out" 
          element={
            <div className="w-full px-2 sm:px-4 md:px-6">
              <Checkout/>
            </div>
          } 
        />


      </Routes>
    </div>
  );
};

export default EventPage;