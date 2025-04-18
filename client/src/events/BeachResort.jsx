import {  useNavigate } from "react-router-dom";


const BeachResort = () => {
  const navigate = useNavigate();

    const images = [
      {
        id: 1,
        name:"KKR water park",
        src: "https://static.toiimg.com/thumb/msid-92684403,width-748,height-499,resizemode=4,imgsize-104946/.jpg",
        description: "Summer Music Festival",
        title: "Summer Music Festival",
        location:" D-MART , Banglore",
        price:50,
        additionalParticipants: 50,

        discount:10,
        date: "July 15-17, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/ea408ced90758cfcc2a8c3cbfb5ca5d1.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/abd96478e79ec6fc4e3301f0223d298b.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/88cbc11060bace7ba48ec8d82946c32e.png",
        ],
      },
      {
        id: 2,
        name:"KC water park",
        src: "https://rajwaterparkresort.com/images/mainslider/slide0.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        location:" near big mart , jaipur",
        additionalParticipants: 50,

        price:50,
        discount:10,
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },
      {
        id: 3,
        src: "https://rajwaterparkresort.com/gallery/pic2.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        discount:10,
        name:"PC beasch resort ",
        additionalParticipants: 50,


        location:" PC place , raypur",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },
      {
        id: 4,
        src: "https://thumbs.dreamstime.com/b/kids-water-park-20338673.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },
      {
        id: 4,
        src: "https://img.freepik.com/premium-photo/lively-water-slides-thrive-amusement-parks-ai-generated_54006-3865.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },{
        id: 4,
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHutHlraWGdgRItT44raLRnN5KP5CE0Kk5LLGT44aj20NCXIYnjJM7GLIJIcN42YDQB58&usqp=CAU",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },{
        id: 4,
        src: "https://travelwayfinder.com/wp-content/uploads/2024/05/water-parks-jaipur.webp",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },{
        id: 4,
        src: "https://content3.jdmagicbox.com/comp/porbandar/u3/9999px286.x286.180904140348.r5u3/catalogue/shakti-water-park-porbandar-water-parks-0bf40llkw3.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },{
        id: 4,
        src: "https://rajwaterparkresort.com/images/mainslider/slide1.jpg",
        description: "Tech Conference 2024",
        title: "Tech Conference 2024",
        price:50,
        location:" near AT place , jaipur",
        additionalParticipants: 50,
        discount:10,
        name:"AC resort park",
        date: "August 5-7, 2024",
        participants: [
          "https://image-resource.creatie.ai/149191124190406/149191124190408/6e60034c113bb2bd1d63215a11b1ebb9.png",
          "https://image-resource.creatie.ai/149191124190406/149191124190408/370ab422dee1eeead1d11be23f805dc9.png",
        ],
      },
      // Add more images here...
    ];

    // image, 
    // name, 
    // description, 
    // location: venueLocation, 
    // date, 
    // price, 
    // discount, 
    // booked, 
    // remaining,
    
    // room_number,
    // roomType,

   
    const remaining = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
   
  
    // isBooked 
    const handleLetsGoClick = (event) => {
      navigate('/details-event', {
        state: {
          image: event.src,
          name: event.name,
          description: event.description,
          location: event.location,
          date: event.date,
          price: event.price,
          discount: event.discount,
          booked: true,
          remaining: remaining,
          room_number: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
          roomType: 'Standard', // can be 'Standard', 'Deluxe', 'Premium'
          
          participants: event.participants,
          additionalParticipants: event.additionalParticipants,
        }
      });
    };


    return (
      <div className="relative min-h-screen w-[1200px] border rounded-sm border-blue-400 z-20 flex flex-col gap-4 xs:gap-6 sm:gap-8 px-3 xs:px-4 sm:px-2 md:px-4">
      {/* Blurred background layer */}
      <div className="absolute inset-0 bg-gray-500 backdrop-blur-[50px] blur-sm z-0"></div>

      
      <div className="relative z-[1]"> 
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl shadow-sm rounded-lg p-3 xs:p-4 sm:p-6 ">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-2 xs:mb-3 sm:mb-4">
            Events at your next stopping
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3   xs:gap-4 sm:gap-6">
            {images.map((event, index) => (
              <div 
                key={index} 
                className="border border-gray-700 backdrop-blur-[200px] bg-slate-600  rounded-md overflow-hidden"
              >
                <div
                  className="h-32 xs:h-40 sm:h-48 md:h-52 lg:h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.src})` }}
                />
                <div className="p-2 xs:p-3 sm:p-4">
                  <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold truncate text-black">{event.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
                    {event.description.split(" ").slice(0, 15).join(" ") + "..."}
                  </p>
                  <div className="text-gray-300 font-roboto text-xs sm:text-sm">
                    💰 <strong>Price:</strong> ${event.price} 
                    <span className="text-green-600"> ({event.discount}%off)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 truncate">📅 {event.date}</p>
                  <p className="text-xs sm:text-sm text-gray-300 truncate">📍 {event.location}</p>
                  <div className="flex items-center mt-1 xs:mt-2">
                    <div className="flex -space-x-1 xs:-space-x-2">
                      {event.participants.map((participant, i) => (
                        <img
                          key={i}
                          className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white"
                          src={participant}
                         
                         alt={`Participant ${i + 1}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs sm:text-sm text-gray-900">
                      +{event.additionalParticipants}
                    </span>
                  </div>
                </div>
                <div className="p-2 xs:p-3 sm:p-4 flex justify-end mt-[-50px] xs:mt-[-60px] sm:mt-[-70px]">
                  <button 
                    onClick={() => handleLetsGoClick(event)}
                    className="bg-blue-500 text-white font-semibold px-2 py-1 xs:px-3 xs:py-1 sm:px-4 sm:py-2 rounded-lg text-xs xs:text-sm sm:text-base hover:bg-blue-600 transition"
                  >
                    Let&#39;s Book
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>

  )
}

export default BeachResort
