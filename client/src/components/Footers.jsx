import { assets } from "../assets/assets";



const Footers = () => {
  


    return (
      <div className=" font-sans  w-full flex flex-col"style={{ position: 'relative', zIndex: 10 }}>
        <footer className="bg-gray-400 ">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10 py-4 sm:py-0 sm:h-16 flex items-center justify-between">
            <ul className="flex items-center gap-4 sm:space-x-6">
              <li className="relative group">
                <button 
                  className="!rounded-button flex items-center md:gap-3 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-custom"
                  onClick={() => alert('Save Route functionality coming soon!')}
                >
                  <img src={assets.save_route_icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Save Route</span>
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity sm:hidden">
                    Save Route
                  </span>
                </button>
              </li>
              <li className="relative group">
                <button 
                  className="!rounded-button flex items-center md:gap-3 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-custom"
                  onClick={() => alert('Share Trip functionality coming soon!')}
                >
                  <img src={assets.share_icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Share Trip</span>
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity sm:hidden">
                    Share Trip
                  </span>
                </button>
              </li>
              <li className="relative group">
                <button 
                  className="!rounded-button flex items-center md:gap-3 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-custom"
                  onClick={() => alert('Export Itinerary functionality coming soon!')}
                >
                  <img src={assets.down_icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Export Itinerary</span>
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity sm:hidden">
                    Export Itinerary
                  </span>
                </button>
              </li>
            </ul>
            <div className="relative group">
              <button 
                className="!rounded-button flex items-center md:gap-3 sm:gap-2 text-xs sm:text-sm text-red-600 hover:text-red-700"
                onClick={() => window.location.href = 'tel:100'}
              >
                <img src={assets.phone_icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Emergency Contacts</span>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity sm:hidden">
                  Emergency Contacts
                </span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Footers;
  