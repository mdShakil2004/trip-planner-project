const stops = [
    {
        name: "Big Sur Coastal Drive",
        description: "Scenic viewpoints along Highway 1",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.5
    },
    {
        name: "Misty Hollow Cafe",
        description: "Local favorite for lunch",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/a043102f57a334864fc90bff2d743e33.png",
        rating: 4.0
    },
    {
        name: "Ravenwood Bakery",
        description: "Fresh pastries and coffee",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/a043102f57a334864fc90bff2d743e33.png",
        rating: 4.2
    },
    {
        name: "Crescent Bay Lookout",
        description: "Scenic viewpoints along the coast",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.5
    },
    {
        name: "Pine Ridge Trail",
        description: "Breathtaking forest views",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.7
    },  
    {
        name: "Seabreeze Diner",
        description: "Local favorite for lunch",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/a043102f57a334864fc90bff2d743e33.png",
        rating: 4.0
    },
    {
        name: "Lunar Cliffs",
        description: "Stunning coastal cliffs",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.6
    },
    {
        name: "Willow Creek Overlook",
        description: "Panoramic views of the valley",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.5
    },
    {
        name: "Starlight Plaza",
        description: "Charming shopping and dining spot",
        image: "https://image-resource.creatie.ai/149191124190406/149191124190408/8f9ce2dfc0dd111a36f47f2afd8f83b6.png",
        rating: 4.3
    },
];

const StopSugest = () => {
    return (
        <div className=" mx-auto lg:w-[450px]  max-w-[480px] p-7 relative z-[999] border border-gray-300 shadow-md rounded-br-md">
            <div className="absolute inset-0 blur-sm z-0"></div>

            <h2 className="text-lg font-semibold mb-4">Suggested Stops</h2>
            <div className="space-y-5 flex-1 overflow-y-auto scrollbar-hide" style={{ maxHeight: '750px', scrollbarWidth: 'none', scrollbarHeight: 'none' }} >
                {stops.map((stop, index) => (
                    <div key={index} className="flex items-start backdrop-blur-[150px] bg-gray-400 p-4 rounded-lg shadow-md transition-transform transform hover:scale-95">
                        <img src={stop.image} alt={stop.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="ml-5 flex-1">
                            <h3 className="text-md font-medium">{stop.name}</h3>
                            <p className="text-sm text-gray-800">{stop.description}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500 text-lg">★</span>
                                <span className="text-gray-800 ml-1">{stop.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StopSugest;