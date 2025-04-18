import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import Loader from "../animation/Loader";

const RoadTripPlanner = () => {
  const { tripData, skyCondition, setLocationNamesEvery1km, setLocationNamesEvery2km, setTotalDistance } = useContext(AppContext);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarkerRef = useRef(null); // Blue arrow for dynamic start or fixed start from tripData
  const routeLayerRef = useRef(null);
  const trafficMarkersRef = useRef([]);
  const [userLocation, setUserLocation] = useState(null); // Dynamic starting location (if no tripData.start)
  const [trafficCondition, setTrafficCondition] = useState("Awaiting trip data...");
  const [roadCondition, setRoadCondition] = useState("Awaiting trip data...");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [trafficDataEvery1km, setTrafficDataEvery1km] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [showLoader, setShowLoader] = useState(false); // State for loader after route creation

  const TOMTOM_API_KEY = "5kWUb6923blREE5culhFRgYpW8IemtVo";
  const DEFAULT_LOCATION = { lng: 77.2090, lat: 28.6139 }; // New Delhi, India

  const createArrowMarkerElement = () => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "20px";
    markerElement.style.height = "20px";
    markerElement.style.backgroundColor = "blue";
    markerElement.style.clipPath = "polygon(50% 0%, 100% 100%, 0% 100%)";
    markerElement.style.transform = "rotate(180deg)";
    return markerElement;
  };




  const fetchTrafficStatus = async (lat, lon) => {
    const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/json?point=${lat},${lon}&key=${TOMTOM_API_KEY}`;
    try {
      const response = await fetch(trafficUrl);
      const data = await response.json();
      if (data.flowSegmentData) {
        const { currentSpeed, freeFlowSpeed } = data.flowSegmentData;
        if (currentSpeed / freeFlowSpeed < 0.3) return "🚧 High Traffic Jam";
        if (currentSpeed / freeFlowSpeed < 0.7) return "🚦 Moderate Traffic";
        return "🚗 Clear";
      }
    } catch (error) {
      console.error("Error fetching traffic status:", error);
    }
    return "Unknown";
  };

  const fetchLocationName = async (lat, lon) => {
    const reverseGeocodeUrl = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${TOMTOM_API_KEY}`;
    try {
      const response = await fetch(reverseGeocodeUrl);
      const data = await response.json();
      if (data.addresses && data.addresses.length > 0) {
        const address = data.addresses[0].address;
        return address.freeformAddress || address.localName || "Unknown Location";
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
    return "Unknown Location";
  };

  const geocode = async (place) => {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(place.trim())}.json?key=${TOMTOM_API_KEY}&countrySet=IN`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return { lng: data.results[0].position.lon, lat: data.results[0].position.lat };
      }
      throw new Error(`No geocode result for ${place}`);
    } catch (error) {
      console.error(`Geocode error for ${place}:`, error.message);
      throw error;
    }
  };

  const fetchTrafficAlongRoute = async (startLat, startLon, endLat, endLon) => {
    const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLon}:${endLat},${endLon}/json?traffic=true&key=${TOMTOM_API_KEY}`;
    try {
      const response = await fetch(routeUrl);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const points = route.legs[0].points;
        const distanceThreshold1km = 1000;
        const distanceThreshold2km = 2000;
        let lastDistance1km = 0;
        let lastDistance2km = 0;
        let trafficResults1km = [];
        let names1km = [];
        let names2km = [];

        // Start from the beginning (including start point) for location names, but skip traffic marker at start
        for (let i = 0; i < points.length; i++) { // Start from index 0 to include start (e.g., Delhi)
          const { latitude, longitude } = points[i];
          const distance = route.legs[0].points[i].distanceFromStart;

          if (distance - lastDistance1km >= distanceThreshold1km || i === points.length - 1) {
            const trafficStatus = await fetchTrafficStatus(latitude, longitude);
            const locationName = await fetchLocationName(latitude, longitude);
            if (i > 0) { // Skip adding traffic marker at start, but include name
              trafficResults1km.push({ lat: latitude, lon: longitude, status: trafficStatus });
            }
            names1km.push(locationName); // Store names starting from start (e.g., Delhi)
            lastDistance1km = distance;
          }

          if (distance - lastDistance2km >= distanceThreshold2km || i === points.length - 1) {
            const locationName = await fetchLocationName(latitude, longitude);
            names2km.push(locationName); // Store names starting from start (e.g., Delhi)
            lastDistance2km = distance;
          }
        }

        setTrafficDataEvery1km(trafficResults1km);
        setLocationNamesEvery1km(names1km); // Store all 1km names starting from start (e.g., Delhi)
        // Derive 2km names from 1km names (every other entry, starting from the first point)
        const names2kmFrom1km = names1km.filter((_, index) => index % 2 === 0); // Take every 2nd name (0, 2, 4, ...)
        setLocationNamesEvery2km(names2kmFrom1km);

        const totalDistanceInKm = route.summary.lengthInMeters / 1000;
        setTotalDistance(totalDistanceInKm);

        setRouteSummary({
          lengthInKM: totalDistanceInKm,
          travelTimeInMinutes: route.summary.travelTimeInSeconds / 60,
          trafficDelayInSeconds: route.summary.trafficDelayInSeconds || 600,
          departureTime: route.summary.departureTime || "2025-02-27T00:00:00Z",
          arrivalTime: route.summary.arrivalTime || "2025-02-27T06:00:00Z",
        });

        if (trafficResults1km.some((point) => point.status === "🚧 High Traffic Jam")) {
          setTrafficCondition("Heavy traffic detected");
        } else if (trafficResults1km.some((point) => point.status === "🚦 Moderate Traffic")) {
          setTrafficCondition("Moderate traffic detected");
        } else {
          setTrafficCondition("Light traffic expected");
        }

        // console.log("Dynamic names every 1km from start (e.g., Delhi):", names1km);
        // console.log("Dynamic names every 2km from start (e.g., Delhi, derived from 1km):", names2kmFrom1km);
      }
    } catch (error) {
      console.error("Error fetching traffic along route:", error);
      setTrafficCondition("Traffic data unavailable");
    }
  };

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      try {
        mapInstance.current = tt.map({
          key: TOMTOM_API_KEY,
          container: mapRef.current,
          center: DEFAULT_LOCATION,
          zoom: 10,
          dragPan: true,
          scrollZoom: true,
          doubleClickZoom: true,
          touchZoomRotate: true,
        });

        mapInstance.current.on("load", () => {
          const markerElement = createArrowMarkerElement();
          const marker = new tt.Marker({ element: markerElement })
            .setLngLat([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat])
            .addTo(mapInstance.current);
          userMarkerRef.current = marker;
          console.log("Default arrow marker added at:", DEFAULT_LOCATION);
          setMapLoaded(true);
        });

        mapInstance.current.on("dragstart", () => {
          console.log("Map drag started");
        });

        return () => {
          if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
          }
        };
      } catch (error) {
        console.error("Map initialization error:", error.message);
      }
    }
  }, []);

  // Watch user location dynamically (used as fallback if no tripData.start)
  useEffect(() => {
    if (navigator.geolocation && (!tripData || !tripData.start)) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          setUserLocation(location);

          if (mapInstance.current) {
            if (userMarkerRef.current) {
              userMarkerRef.current.setLngLat([location.lng, location.lat]);
              console.log("Start marker (blue arrow) updated at (from geolocation):", location);
            } else {
              const markerElement = createArrowMarkerElement();
              const marker = new tt.Marker({ element: markerElement })
                .setLngLat([location.lng, location.lat])
                .addTo(mapInstance.current);
              userMarkerRef.current = marker;
              console.log("Start marker (blue arrow) created at (from geolocation):", location);
            }
            if (!tripData || (!tripData.start && !tripData.destination)) {
              mapInstance.current.setCenter([location.lng, location.lat]);
              console.log("Map centered on user location (from geolocation):", location);
            }
          }
        },
        (error) => {
          console.error("Geolocation watch error:", error.message);
          setUserLocation(DEFAULT_LOCATION);
          if (mapInstance.current) {
            if (userMarkerRef.current) {
              userMarkerRef.current.setLngLat([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat]);
              console.log("Start marker (blue arrow) set to default (from geolocation):", DEFAULT_LOCATION);
            } else {
              const markerElement = createArrowMarkerElement();
              const marker = new tt.Marker({ element: markerElement })
                .setLngLat([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat])
                .addTo(mapInstance.current);
              userMarkerRef.current = marker;
              console.log("Start marker (blue arrow) created at default (from geolocation):", DEFAULT_LOCATION);
            }
            if (!tripData || (!tripData.start && !tripData.destination)) {
              mapInstance.current.setCenter([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat]);
              console.log("Map centered on default location due to geolocation error:", DEFAULT_LOCATION);
            }
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
      );

      return () => navigator.geolocation.clearWatch(watchId); 
    } else {
      console.error("Geolocation not supported or tripData.start provided");
      if (!tripData || !tripData.start) {
        setUserLocation(DEFAULT_LOCATION);
        if (mapInstance.current && (!tripData || (!tripData.start && !tripData.destination))) {
          mapInstance.current.setCenter([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat]);
        }
      }
    }
  }, [tripData]); // Depend on tripData to switch between geolocation and tripData.start

  // Update route with fixed start from tripData.start, ensuring names start from start
  useEffect(() => {
    if (mapInstance.current && mapLoaded && tripData?.start && tripData?.destination) {
      const updateRoute = async () => {
        try {
          const startPos = tripData.start.includes(",")
            ? {
                lat: parseFloat(tripData.start.split(",")[0]),
                lng: parseFloat(tripData.start.split(",")[1]),
              }
            : await geocode(tripData.start);
          const endPos = tripData.destination.includes(",")
            ? {
                lat: parseFloat(tripData.destination.split(",")[0]),
                lng: parseFloat(tripData.destination.split(",")[1]),
              }
            : await geocode(tripData.destination);

          console.log("Updating route - Start (from tripData):", startPos, "End:", endPos);

          const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${startPos.lat},${startPos.lng}:${endPos.lat},${endPos.lng}/json?key=${TOMTOM_API_KEY}&routeType=fastest${tripData?.preferences?.avoidHighways ? "&avoid=highways" : ""}`;
          const routeResponse = await fetch(routeUrl);
          if (!routeResponse.ok) throw new Error("Route fetch failed");
          const routeData = await routeResponse.json();

          if (routeData.routes && routeData.routes.length > 0) {
            const route = routeData.routes[0];
            const coordinates = route.legs[0].points.map((point) => [point.longitude, point.latitude]);

            if (routeLayerRef.current) {
              mapInstance.current.removeLayer("route");
              mapInstance.current.removeSource("route");
              routeLayerRef.current = null;
            }

            const routeLayer = {
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates,
                  },
                },
              },
              paint: {
                "line-color": "blue",
                "line-width": 4,
              },
            };
            mapInstance.current.addLayer(routeLayer);
            routeLayerRef.current = routeLayer;
            mapInstance.current.fitBounds(coordinates, { padding: 50 });
            console.log("Route added from:", startPos, "to:", endPos);

            // Ensure start marker (blue arrow) is at tripData.start
            if (userMarkerRef.current) {
              userMarkerRef.current.setLngLat([startPos.lng, startPos.lat]);
              console.log("Start marker (blue arrow) confirmed at (from tripData):", startPos);
            } else {
              const markerElement = createArrowMarkerElement();
              const marker = new tt.Marker({ element: markerElement })
                .setLngLat([startPos.lng, startPos.lat])
                .addTo(mapInstance.current);
              userMarkerRef.current = marker;
              console.log("Start marker (blue arrow) added at (from tripData):", startPos);
            }

            setRoadCondition("Smooth roads expected");
            // Show loader for 1 second after route creation
            setShowLoader(true);
            setTimeout(() => {
              setShowLoader(false);
              console.log("Loader hidden after 1 second");
            }, 1000);

            await fetchTrafficAlongRoute(startPos.lat, startPos.lng, endPos.lat, endPos.lng);

            trafficMarkersRef.current.forEach((marker) => marker.remove());
            trafficMarkersRef.current = trafficDataEvery1km.map((point) => {
              const markerColor = point.status === "🚧 High Traffic Jam" ? "red" : point.status === "🚦 Moderate Traffic" ? "orange" : "green";
              const marker = new tt.Marker({ color: markerColor })
                .setLngLat([point.lon, point.lat])
                .addTo(mapInstance.current);
              return marker;
            });
            console.log("Traffic markers added (every 1 km, excluding start):", trafficMarkersRef.current);
          } else {
            setRoadCondition("No valid route found");
          }
        } catch (error) {
          console.error("Error in updateRoute:", error);
          setRoadCondition(`Error: ${error.message}`);
          setTrafficCondition(`Error: ${error.message}`);
        }
      };

      updateRoute();
    } else if (mapInstance.current && mapLoaded && userLocation && (!tripData || !tripData.start || !tripData.destination)) {
      // Fallback to geolocation if no tripData.start or destination
      if (routeLayerRef.current) {
        mapInstance.current.removeLayer("route");
        mapInstance.current.removeSource("route");
        routeLayerRef.current = null;
        console.log("Route hidden due to no trip data start or destination");
      }
      trafficMarkersRef.current.forEach((marker) => marker.remove());
      trafficMarkersRef.current = [];
      if (userLocation) {
        mapInstance.current.setCenter([userLocation.lng, userLocation.lat]);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
          console.log("Start marker (blue arrow) ensured at (from geolocation):", userLocation);
        }
      } else {
        mapInstance.current.setCenter([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat]);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat]);
          console.log("Start marker (blue arrow) ensured at default (from geolocation):", DEFAULT_LOCATION);
        }
      }
      setTrafficCondition("Awaiting trip data...");
      setRoadCondition("Awaiting trip data...");
      setTrafficDataEvery1km([]);
      setLocationNamesEvery1km([]);
      setLocationNamesEvery2km([]); // Clear names when no route
      setRouteSummary(null);
      setShowLoader(false); // Ensure loader is hidden when no route
    }
  }, [tripData, mapLoaded, userLocation]); // Depend on tripData and userLocation

  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapInstance.current.getZoom() + 1);
      console.log("Zoomed in to:", mapInstance.current.getZoom());
      if (userMarkerRef.current) console.log("Start marker after zoom in:", userMarkerRef.current.getLngLat());
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapInstance.current.getZoom() - 1);
      console.log("Zoomed out to:", mapInstance.current.getZoom());
      if (userMarkerRef.current) console.log("Start marker after zoom out:", userMarkerRef.current.getLngLat());
    }
  };

  const handleRecenter = async () => {
    if (mapInstance.current && (tripData?.start ? userLocation : userLocation)) {
      let centerPoint;
      if (tripData?.start) {
        centerPoint = tripData.start.includes(",")
          ? { lat: parseFloat(tripData.start.split(",")[0]), lng: parseFloat(tripData.start.split(",")[1]) }
          : await geocode(tripData.start);
      } else {
        centerPoint = userLocation || DEFAULT_LOCATION;
      }
      mapInstance.current.setCenter([centerPoint.lng, centerPoint.lat]);
      mapInstance.current.setZoom(10);

      let currentBearing = mapInstance.current.getBearing();
      const steps = 60;
      const stepSize = 360 / steps;
      let step = 0;

      const rotate = () => {
        if (step < steps) {
          currentBearing += stepSize; // Fixed syntax error here
          mapInstance.current.setBearing(currentBearing % 360);
          step++;
          requestAnimationFrame(rotate);
        } else {
          mapInstance.current.setBearing(0);
          console.log("Map rotated 360 degrees and recentered on start location:", centerPoint);
          if (userMarkerRef.current) console.log("Start marker after rotation:", userMarkerRef.current.getLngLat());
        }
      };

      requestAnimationFrame(rotate);
    } else {
      console.error("Cannot recenter: Map or start location not available", { map: mapInstance.current, userLocation, tripData });
    }
  };

  return (
    <div className="bg-gray-500/40 border  lg:w-[770px] min-w-[320px] z-20 rounded-tl-md border-zinc-300">
      <main className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-6 lg:gap-4 xl:gap-10">
          <div className="bg-cover pt-0 w-full">
            <div className="bg-gray-300 shadow-sm rounded-lg p-2 sm:p-4 md:p-5 lg:p-6">
              <ul className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-3">
                <li className="flex items-center space-x-1 hover:bg-gray-200 p-2 rounded-lg transition-colors w-full sm:w-auto">
                  <img src={assets.sun_icon} className="w-5 h-5 flex-shrink-0" alt="Weather" />
                  <span className="text-sm sm:text-md font-medium">{skyCondition}</span>
                </li>
                <li className="flex items-center space-x-1 hover:bg-gray-50 p-2 rounded-lg transition-colors w-full sm:w-auto">
                  <img src={assets.van_icon} className="w-5 h-5 flex-shrink-0" alt="Traffic" />
                  <span className="text-sm sm:text-md font-medium">{trafficCondition}</span>
                </li>
                <li className="flex items-center space-x-1 hover:bg-gray-50 p-2 rounded-lg transition-colors w-full sm:w-auto">
                  <img src={assets.road_icon} className="w-5 h-5 flex-shrink-0" alt="Road Condition" />
                  <span className="text-sm sm:text-md font-medium">{roadCondition}</span>
                </li>
              </ul>
            </div>

            <div className="relative bg-gray-500 h-[320px] sm:h-[400px] md:h-[450px] lg:h-[540px] rounded-md mt-4 p-4 sm:p-6">
              <div ref={mapRef} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
              {!mapLoaded ? (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : showLoader ? (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : null}
              <div className="absolute z-40 bottom-2 right-2 sm:bottom-4 sm:right-4">
                <div className="flex bg-white/60 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg items-center justify-center gap-2 sm:gap-3 shadow-lg">
                  <button onClick={handleZoomIn} className="hover:bg-gray-100 p-1 sm:p-1.5 rounded-md transition-colors" aria-label="Zoom In" disabled={!mapInstance.current}>
                    <img width={20} src={assets.plus_icon2} alt="Zoom In" />
                  </button>
                  <button onClick={handleZoomOut} className="hover:bg-gray-100 p-1 sm:p-1.5 rounded-md transition-colors" aria-label="Zoom Out" disabled={!mapInstance.current}>
                    <img width={20} src={assets.min_icon} alt="Zoom Out" />
                  </button>
                  <button onClick={handleRecenter} className="hover:bg-gray-100 p-1 sm:p-1.5 rounded-md transition-colors" aria-label="Recenter and Rotate" disabled={!mapInstance.current || !(tripData?.start || userLocation)}>
                    <img width={16} src={assets.zooming_icon} alt="Recenter and Rotate" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoadTripPlanner;