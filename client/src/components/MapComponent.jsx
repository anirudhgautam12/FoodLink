import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom user icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to center map on user
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ foods, userLocation, onClaim }) => {
  const center = userLocation || [20.5937, 78.9629]; // Default to India if no location

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && <MapUpdater center={userLocation} />}
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="font-semibold text-purple-700">You are here</div>
            </Popup>
          </Marker>
        )}

        {/* Food Markers */}
        {foods.map((food) => (
          <Marker 
            key={food._id}
            position={[food.location.coordinates[1], food.location.coordinates[0]]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">{food.name}</h3>
                <p className="text-sm mb-1"><strong>Serves:</strong> {food.quantity} people</p>
                <p className="text-sm mb-1"><strong>Donor:</strong> {food.donorId?.name}</p>
                <p className="text-sm text-red-600 mb-3"><strong>Expires:</strong> {new Date(food.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <button 
                  onClick={() => onClaim(food._id)}
                  className="w-full bg-purple-600 text-white text-xs font-bold py-1.5 rounded hover:bg-purple-700 transition"
                >
                  Claim Food
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
