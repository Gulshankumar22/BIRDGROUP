// components/ScheduleSetup.js
import React, { useState } from 'react';

const ScheduleSetup = () => {
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

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      airline: 'Emirates',
      code: 'EK',
      flightNo: 'EK202',
      sta: '14:30',
      std: '15:45',
      route: 'DXB-LHR',
      aircraft: 'Boeing 777',
      aircraftBody: 'Wide Body',
      typeOfHandling: 'Passenger'
    },
    {
      id: 2,
      airline: 'Qatar Airways',
      code: 'QR',
      flightNo: 'QR101',
      sta: '09:15',
      std: '10:30',
      route: 'DXB-DOH',
      aircraft: 'Airbus A350',
      aircraftBody: 'Wide Body',
      typeOfHandling: 'Passenger'
    }
  ]);

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing schedule
      setSchedules(schedules.map(schedule => 
        schedule.id === editingId ? { ...formData, id: editingId } : schedule
      ));
      setEditingId(null);
    } else {
      // Add new schedule
      const newSchedule = {
        ...formData,
        id: schedules.length + 1
      };
      setSchedules([...schedules, newSchedule]);
    }
    
    // Reset form
    setFormData({
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
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setEditingId(schedule.id);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleCancel = () => {
    setFormData({
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
    setEditingId(null);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Setup</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {editingId ? 'Edit Airline Schedule' : 'Create New Airline'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields same as Gateway component */}
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

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {editingId ? 'Update Schedule' : 'Create Airline'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold text-gray-700 p-6 border-b">Schedule Airlines</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Airline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.airline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.flightNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.sta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.std}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSetup;