import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Airport data
const airports = [
  { id: 1, name: 'Indira Gandhi International Airport', code: 'DEL', city: 'Delhi', coordinates: [28.5562, 77.1000], color: '#ef4444', logo: '🛫' },
  { id: 2, name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', city: 'Mumbai', coordinates: [19.0887, 72.8679], color: '#3b82f6', logo: '🏙️' },
  { id: 3, name: 'Kempegowda International Airport', code: 'BLR', city: 'Bengaluru', coordinates: [13.1986, 77.7066], color: '#10b981', logo: '💻' },
  { id: 4, name: 'Chennai International Airport', code: 'MAA', city: 'Chennai', coordinates: [12.9941, 80.1709], color: '#a855f7', logo: '🌊' },
  { id: 5, name: 'Netaji Subhas Chandra Bose International Airport', code: 'CCU', city: 'Kolkata', coordinates: [22.6547, 88.4467], color: '#f97316', logo: '🌉' },
  { id: 6, name: 'Rajiv Gandhi International Airport', code: 'HYD', city: 'Hyderabad', coordinates: [17.2403, 78.4294], color: '#ec4899', logo: '💎' },
  { id: 7, name: 'Cochin International Airport', code: 'COK', city: 'Kochi', coordinates: [10.1520, 76.4015], color: '#14b8a6', logo: '🌴' },
  { id: 8, name: 'Sardar Vallabhbhai Patel International Airport', code: 'AMD', city: 'Ahmedabad', coordinates: [23.0732, 72.6258], color: '#6366f1', logo: '🕌' },
  { id: 9, name: 'Pune Airport', code: 'PNQ', city: 'Pune', coordinates: [18.5793, 73.9089], color: '#eab308', logo: '🎓' },
  { id: 10, name: 'Goa International Airport', code: 'GOI', city: 'Goa', coordinates: [15.3806, 73.8353], color: '#06b6d4', logo: '🏖️' }
];

// Create custom marker icon
const createAirportIcon = (color, code) => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="width: 40px; height: 40px; background-color: ${color}; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </div>
        <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background-color: rgba(0,0,0,0.9); color: white; font-size: 11px; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-weight: bold; border: 1px solid rgba(255,255,255,0.3);">
          ${code}
        </div>
      </div>
    `,
    className: 'custom-airport-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const AirportLogin = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">✈️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">India Airports Live Map</h1>
                <p className="text-sm text-gray-300">Interactive map with airport markers</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-300">Markers show airport info</p>
              <p className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{airports.length} airports</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="relative">
        <div className="h-[calc(100vh-80px)] w-full">
          {mapLoaded ? (
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Markers */}
              {airports.map((airport) => (
                <Marker
                  key={airport.id}
                  position={airport.coordinates}
                  icon={createAirportIcon(airport.color, airport.code)}
                >
                  <Popup maxWidth={300}>
                    <div className="p-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div style={{ backgroundColor: airport.color }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow">
                          <span className="text-xl">{airport.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{airport.city} ({airport.code})</h3>
                          <p className="text-sm text-gray-700">{airport.name}</p>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-600">
                        Coordinates: {airport.coordinates[0].toFixed(4)}, {airport.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-white text-lg font-semibold">Loading Map...</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 max-w-xs">
            <h3 className="text-sm font-bold text-white mb-3">Airports</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {airports.map((airport) => (
                <div
                  key={airport.id}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg"
                >
                  <div style={{ backgroundColor: airport.color }} className="w-3 h-3 rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-white font-bold">{airport.code}</span>
                  <span className="text-xs text-gray-300 flex-1 text-left truncate">{airport.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .leaflet-container { background: #0f172a; font-family: inherit; }
        .custom-airport-marker { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
      `}</style>
    </div>
  );
};

export default AirportLogin;