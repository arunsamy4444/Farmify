import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const API_KEY = "5b3ce3597851110001cf624883f55d6c1dd044b5baf673edc602cb80";

const MapComponent = () => {
  const [startAddress, setStartAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default location (Kallakurichi)
  const defaultLocation = { lat: 11.7401, lng: 78.9647 };

  // Fetch Coordinates from Address (Geocoding)
  const fetchCoordinates = async (address, setterFunction) => {
    if (!address) {
      setError("Please enter an address.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}`
      );

      if (response.data.features.length > 0) {
        const { coordinates } = response.data.features[0].geometry;
        setterFunction({ lat: coordinates[1], lng: coordinates[0] });
      } else {
        setError("Address not found.");
      }
    } catch (err) {
      setError("Error fetching location.");
    }
  };

  // Fetch Route
  const fetchRoute = async () => {
    if (!userLocation || !destination) {
      alert("Enter both start and destination locations.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          coordinates: [
            [userLocation.lng, userLocation.lat],
            [destination.lng, destination.lat],
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.features?.length > 0) {
        const routeData = response.data.features[0];
        const routeCoordinates = routeData.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(routeCoordinates);
        setDistance(routeData.properties.segments[0].distance / 1000);
        setDuration(routeData.properties.segments[0].duration / 60);
      } else {
        setError("No route found.");
      }
    } catch (error) {
      setError("Error fetching route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>🗺️ Live Map & Route Finder</h1>

      {/* Start Location Input */}
      <input
        type="text"
        placeholder="Enter starting location..."
        value={startAddress}
        onChange={(e) => setStartAddress(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={() => fetchCoordinates(startAddress, setUserLocation)}>Set Start</button>

      {/* Destination Input */}
      <input
        type="text"
        placeholder="Where do you want to go?"
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
        style={{ marginLeft: "10px", padding: "5px" }}
      />
      <button onClick={() => fetchCoordinates(selectedAddress, setDestination)}>Set Destination</button>

      {/* Show Route Button */}
      <button onClick={fetchRoute} disabled={loading}>
        {loading ? "Loading..." : "Show Route"}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Map Display */}
      {userLocation && (
        <MapContainer center={userLocation} zoom={7} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation} />
          {destination && <Marker position={destination} />}
          {route && <Polyline positions={route} color="blue" />}
        </MapContainer>
      )}

      {/* Route Details */}
      {distance && duration && (
        <div>
          <p>📏 Distance: {distance.toFixed(2)} km</p>
          <p>⏳ Duration: {Math.round(duration)} minutes</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
