import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Different tile providers (no API key required)
const tileProviders = [
  {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
  },
  {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    name: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    name: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
];

// Create custom marker icon
const createAirportIcon = (color, code) => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="width: 48px; height: 48px; background: radial-gradient(circle, ${color} 0%, ${color}dd 70%, ${color}aa 100%); border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
          <svg style="width: 22px; height: 22px; color: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </div>
        <div style="position: absolute; top: -36px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.95) 100%); color: white; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 8px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 6px rgba(0,0,0,0.3); backdrop-filter: blur(4px);">
          ${code}
          <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(0,0,0,0.95);"></div>
        </div>
      </div>
    `,
    className: 'custom-airport-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const AirportLogin = () => {
  const [mapLoaded, setMapLoaded] = useState(true);
  const [selectedTileProvider, setSelectedTileProvider] = useState(tileProviders[0]);
  const [selectedAirport, setSelectedAirport] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
  };

  const handleTileProviderChange = (provider) => {
    setSelectedTileProvider(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 lg:px-48">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0  ">
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
              <p className="text-sm text-gray-300">Click markers for airport info</p>
              <p className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{airports.length} airports</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="">
        <div className="h-[calc(100vh-80px)] w-full">
          {mapLoaded ? (
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
              attributionControl={true}
            >
              <TileLayer
                attribution={selectedTileProvider.attribution}
                url={selectedTileProvider.url}
                subdomains={selectedTileProvider.subdomains}
              />

              {/* Markers */}
              {airports.map((airport) => (
                <Marker
                  key={airport.id}
                  position={airport.coordinates}
                  icon={createAirportIcon(airport.color, airport.code)}
                  eventHandlers={{
                    click: () => handleAirportSelect(airport),
                  }}
                >
                  <Popup maxWidth={300}>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div style={{ backgroundColor: airport.color }} className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <span className="text-2xl">{airport.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{airport.city} ({airport.code})</h3>
                          <p className="text-sm text-gray-700">{airport.name}</p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Latitude:</span>
                            <span className="font-mono">{airport.coordinates[0].toFixed(4)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Longitude:</span>
                            <span className="font-mono">{airport.coordinates[1].toFixed(4)}°</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => window.open(`https://www.google.com/search?q=${airport.name}`, '_blank')}
                        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Search More Info →
                      </button>
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

          {/* Controls Panel */}
          <div className="absolute top-4 left-4 flex flex-col gap-3">
            {/* Map Style Selector */}
            <div className=" backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/20 max-w-xs">
              <h3 className="text-sm font-bold text-white mb-2">Map Style</h3>
              <div className="flex flex-col gap-1">
                {tileProviders.map((provider, index) => (
                  <button
                    key={index}
                    onClick={() => handleTileProviderChange(provider)}
                    className={`text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${selectedTileProvider.name === provider.name ? 'bg-blue-500/80 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Airports</h3>
                <span className="text-xs text-gray-400">{airports.length} total</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {airports.map((airport) => (
                  <div
                    key={airport.id}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 group ${selectedAirport?.id === airport.id ? 'bg-white/10 border border-white/20' : ''}`}
                    onClick={() => handleAirportSelect(airport)}
                  >
                    <div style={{ backgroundColor: airport.color }} className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
                      <span className="text-sm">{airport.logo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-bold text-white">{airport.code}</span>
                        <span className="text-xs text-gray-300 truncate">{airport.city}</span>
                      </div>
                      <div className="text-xs text-gray-400 truncate">{airport.name.split(' ')[0]}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Airport Info Panel */}
          {selectedAirport && (
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 max-w-xs animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span style={{ backgroundColor: selectedAirport.color }} className="w-3 h-3 rounded-full"></span>
                  Selected Airport
                </h3>
                <button 
                  onClick={() => setSelectedAirport(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: selectedAirport.color }} className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow">
                    <span className="text-xl">{selectedAirport.logo}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{selectedAirport.city} ({selectedAirport.code})</h4>
                    <p className="text-sm text-gray-300">{selectedAirport.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-2 rounded">
                    <div className="text-gray-400">Latitude</div>
                    <div className="text-white font-mono">{selectedAirport.coordinates[0].toFixed(4)}°</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded">
                    <div className="text-gray-400">Longitude</div>
                    <div className="text-white font-mono">{selectedAirport.coordinates[1].toFixed(4)}°</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/20">
            <p className="text-xs text-gray-300">
              <span className="font-semibold text-white">Tip:</span> Scroll to zoom • Click and drag to pan • Click markers for details
            </p>
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        
        .leaflet-container { 
          background: #ffffffff !important; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .leaflet-popup-content-wrapper { 
          border-radius: 16px !important; 
          padding: 0 !important; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .leaflet-popup-content { 
          margin: 0 !important; 
          min-width: 280px !important;
        }
        
        .leaflet-popup-tip-container { 
          margin-top: -1px !important; 
        }
        
        .leaflet-popup-close-button {
          color: #666 !important;
          font-size: 20px !important;
          padding: 8px !important;
          transition: color 0.2s !important;
        }
        
        .leaflet-popup-close-button:hover {
          color: #333 !important;
        }
        
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: rgba(255,255,255,0.7) !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          margin: 10px !important;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .leaflet-control-attribution a {
          color: #60a5fa !important;
        }
        
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.2) !important;
          background: rgba(0,0,0,0.7) !important;
          backdrop-filter: blur(4px);
          border-radius: 12px !important;
          overflow: hidden;
          margin: 20px !important;
        }
        
        .leaflet-control-zoom a {
          background: transparent !important;
          color: white !important;
          border: none !important;
          transition: all 0.2s !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 20px !important;
        }
        
        .leaflet-control-zoom-in {
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .custom-airport-marker:hover > div > div:first-child {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.3);
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default AirportLogin;