// components/Gateway.js
import React, { useState } from 'react';

const Gateway = () => {
  const [formData, setFormData] = useState({
    airline: '',
    code: '',
    flightNo: '',
    sta: '',
    std: '',
    route: '',
    aircraft: '',
    aircraftBody: '',
    typeOfHandling: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Airline created successfully!');
  };

  // Sample data for dropdowns
  const airlines = ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Lufthansa', 'British Airways'];
  const codes = ['EK', 'QR', 'SQ', 'LH', 'BA'];
  const routes = ['DXB-LHR', 'DXB-JFK', 'DXB-SIN', 'DXB-CDG', 'DXB-SYD'];
  const aircrafts = ['Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350', 'Boeing 737'];
  const aircraftBodies = ['Wide Body', 'Narrow Body', 'Regional Jet'];
  const handlingTypes = ['VIP', 'Cargo', 'Passenger', 'Mixed'];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Airline</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Airline Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
            <select
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Airline</option>
              {airlines.map((airline, index) => (
                <option key={index} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          {/* Code Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
            <select
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Code</option>
              {codes.map((code, index) => (
                <option key={index} value={code}>{code}</option>
              ))}
            </select>
          </div>

          {/* Flight Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flight No.</label>
            <input
              type="text"
              name="flightNo"
              value={formData.flightNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter flight number"
              required
            />
          </div>

          {/* STA Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">STA (Time)</label>
            <input
              type="time"
              name="sta"
              value={formData.sta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* STD Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">STD (Time)</label>
            <input
              type="time"
              name="std"
              value={formData.std}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Route Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              name="route"
              value={formData.route}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Route</option>
              {routes.map((route, index) => (
                <option key={index} value={route}>{route}</option>
              ))}
            </select>
          </div>

          {/* Aircraft Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
            <select
              name="aircraft"
              value={formData.aircraft}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Aircraft</option>
              {aircrafts.map((aircraft, index) => (
                <option key={index} value={aircraft}>{aircraft}</option>
              ))}
            </select>
          </div>

          {/* Aircraft Body Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Body</label>
            <select
              name="aircraftBody"
              value={formData.aircraftBody}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Aircraft Body</option>
              {aircraftBodies.map((body, index) => (
                <option key={index} value={body}>{body}</option>
              ))}
            </select>
          </div>

          {/* Type of Handling Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of Handling</label>
            <select
              name="typeOfHandling"
              value={formData.typeOfHandling}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Handling Type</option>
              {handlingTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Create Airline
          </button>
        </div>
      </form>
    </div>
  );
};

export default Gateway;