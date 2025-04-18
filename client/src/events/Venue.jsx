import { Link } from "react-router-dom";
function Venue() {
 
 




  return (
    <div className="w-full max-w-4xl bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-black">Select a Venue</h2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {/* Venue Option 1 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Beach Resort"
            className="h-48 w-full object-cover"
          />
          <div className="p-4 flex flex-col justify-between">
  <div>
    <h3 className="text-lg font-semibold">Beach Resort</h3>
    <p className="text-sm text-gray-600">Perfect for summer gatherings</p>
  </div>
  <Link to='/event/beachResort' className="text-sm text-center text-gray-600 bg-green-400 hover:bg-green-500 py-2 px-4 rounded mt-2">View More</Link>
</div>
  </div>

        {/* Venue Option 2 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <img loading="lazy"
            src="https://media.istockphoto.com/id/903417402/photo/luxury-construction-hotel-with-swimming-pool-at-sunset.jpg?s=612x612&w=0&k=20&c=NyPC_c-wE3W_CImA4t57FpyGy6f428CYROd80jxVC4A="
            alt="Luxury Hotel"
            className="h-48 w-full object-cover"
          />
          <div className="p-4 flex flex-col justify-between">
  <div>
    <h3 className="text-lg font-semibold">Luxury Hotel</h3>
    <p className="text-sm text-gray-600">Great for corporate events</p>
  </div>
  <Link to='/event/book-hostel' className="text-sm text-gray-600  text-center bg-green-400 hover:bg-green-500 py-2 px-4 rounded mt-2">View More</Link>
</div>
        </div>
      </div>
    </div>
  );
}

export default Venue;