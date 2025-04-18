import { useContext } from "react";
import { motion } from "framer-motion";
import Chatbar from "../components/Chatbar";
import RoadTripPlanner from "../tripPlanner/RoadTripPlanner";
import StopSugest from "../tripPlanner/StopSugest";
import TripColleburation from "../tripPlanner/TripColleburation";
import TripTime from "../tripPlanner/TripTime";
import { AppContext } from "../context/AppContext";
import CreateTripPlan from "../tripPlanner/CreateTripPlan";

const Home = () => {
  const { isCreateTripPlan } = useContext(AppContext);

  return (
    <div className="relative min-h-screen border z-[99] border-blue-500 flex flex-col px-4 py-4 sm:px-6 md:px-8 lg:px-24 xl:px-32">
      {/* Blurred background layer */}
      <div className="absolute inset-0 backdrop-blur-[200px] bg-gray-600 blur-sm z-0"></div>

      {/* Content above blur */}
      <div className="relative z-[1]  flex flex-col">
        {/* Sliding effect for CreateTripPlan */}
        {isCreateTripPlan && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-x-0 top-0 mx-auto w-full max-w-50  shadow-lg z-50 p-4 rounded-b-lg 
              sm:max-w-lg 
              md:max-w-xl 
              lg:max-w-xl "
          >
            <CreateTripPlan />
          </motion.div>
        )}

        {/* Main content */}
        <div className="flex flex-col  gap-4 z-40 lg:flex-row lg:gap-2">
          <div className="flex-1 z-30">
            <RoadTripPlanner />
          </div>
          <div className="flex-1 z-[35]">
            <TripColleburation />
          </div>
        </div>

        {/* Lower section */}
        <div className="flex flex-col lg:w-[1230px] z-[38] gap-2 md:flex-row md:gap-2 mt-4">
          <div className="flex-1  z-[100]  border rounded-bl-md border-zinc-200 flex flex-col">
            <TripTime />
            {/* Chatbar below TripTime on lg and xl */}
            <div className=" -z-30 hidden lg:block">
              <Chatbar />
            </div>
          </div>
          <div className="w-96 md:w-auto md:flex-none">
            <StopSugest />
          </div>
        </div>

        {/* Chatbar at bottom on small and medium screens */}
        <div className="mt-4 z-20 lg:hidden">
          <Chatbar />
        </div>
      </div>
    </div>
  );
};

export default Home;