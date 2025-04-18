

function Activities() {
  return (
    <div className="w-full max-w-4xl bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-black">Choose Activities</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Activity 1 */}
        <div className="border border-gray-200 rounded-lg p-4 flex items-center">
          <img loading="lazy"
            className="w-16 h-16 rounded-full"
            src="https://cdn.pixabay.com/photo/2023/03/31/18/44/mountains-7890734_960_720.jpg"
            alt="Hiking"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Hiking</h3>
            <p className="text-sm text-gray-600">Explore nature trails</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 flex items-center">
          <img loading="lazy"
            className="w-16 h-16 rounded-full"
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Yoga"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Yoga Sessions</h3>
            <p className="text-sm text-gray-600">Relax with guided meditation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
