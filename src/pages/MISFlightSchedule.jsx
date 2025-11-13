// MISFlightSchedule.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Plane, XCircle, CheckCircle, Download, Edit, Save, Plus } from 'lucide-react';

const MISFlightSchedule = () => {
  const [filters, setFilters] = useState({
    search: '',
    station: 'All Stations',
    airline: 'All Airlines',
    status: 'All Statuses',
    dateRange: ''
  });

  const [showFlightForm, setShowFlightForm] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightForm, setFlightForm] = useState({
    flightNo: '',
    airline: '',
    route: '',
    date: '',
    time: '',
    status: 'Scheduled',
    arrival: 'Scheduled',
    description: '',
    personName: '',
    actionType: 'edit' // 'edit', 'cancel', 'add'
  });

  // Sample flight data - you can replace this with API data
  const [flightsData, setFlightsData] = useState([
    {
      id: 1,
      flightNo: 'AI 101',
      airline: 'Air India',
      route: 'DEL – BOM',
      date: 'Nov 11, 2025',
      time: '06:00',
      status: 'Scheduled',
      arrival: 'Arrived',
      remarks: '-',
      signature: '-'
    },
    {
      id: 2,
      flightNo: '6E 2345',
      airline: 'IndiGo',
      route: 'BLR – DEL',
      date: 'Nov 11, 2025',
      time: '07:30',
      status: 'Scheduled',
      arrival: 'Delayed',
      remarks: '-',
      signature: '-'
    },
    {
      id: 3,
      flightNo: 'SG 567',
      airline: 'SpiceJet',
      route: 'MAA – HYD',
      date: 'Nov 11, 2025',
      time: '09:15',
      status: 'Canceled',
      arrival: 'Canceled',
      remarks: 'Aircraft maintenance required',
      signature: 'John Doe'
    },
    {
      id: 4,
      flightNo: 'UK 890',
      airline: 'Vistara',
      route: 'CCU – BLR',
      date: 'Nov 11, 2025',
      time: '11:00',
      status: 'Scheduled',
      arrival: 'Arrived',
      remarks: '-',
      signature: '-'
    },
    {
      id: 5,
      flightNo: 'G8 123',
      airline: 'Go First',
      route: 'DEL – GOI',
      date: 'Nov 11, 2025',
      time: '13:45',
      status: 'Scheduled',
      arrival: 'On Time',
      remarks: '-',
      signature: '-'
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFlights = flightsData.length;
    const scheduled = flightsData.filter(f => f.status === 'Scheduled').length;
    const canceled = flightsData.filter(f => f.status === 'Canceled').length;
    const additionalFlights = flightsData.filter(f => 
      f.arrival === 'Delayed' || f.arrival === 'On Time'
    ).length;

    return { totalFlights, scheduled, canceled, additionalFlights };
  }, [flightsData]);

  // Filter flights based on filters
  const filteredFlights = useMemo(() => {
    return flightsData.filter(flight => {
      const matchesSearch = filters.search === '' || 
        flight.flightNo.toLowerCase().includes(filters.search.toLowerCase()) ||
        flight.airline.toLowerCase().includes(filters.search.toLowerCase()) ||
        flight.route.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesAirline = filters.airline === 'All Airlines' || flight.airline === filters.airline;
      const matchesStatus = filters.status === 'All Statuses' || flight.status === filters.status;
      
      return matchesSearch && matchesAirline && matchesStatus;
    });
  }, [filters, flightsData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddFlight = () => {
    setSelectedFlight(null);
    setFlightForm({
      flightNo: '',
      airline: '',
      route: '',
      date: '',
      time: '',
      status: 'Scheduled',
      arrival: 'Scheduled',
      description: '',
      personName: '',
      actionType: 'add'
    });
    setShowFlightForm(true);
  };

  const handleEditFlight = (flight) => {
    setSelectedFlight(flight);
    setFlightForm({
      flightNo: flight.flightNo,
      airline: flight.airline,
      route: flight.route,
      date: flight.date,
      time: flight.time,
      status: flight.status,
      arrival: flight.arrival,
      description: flight.remarks !== '-' ? flight.remarks : '',
      personName: flight.signature !== '-' ? flight.signature : '',
      actionType: 'edit'
    });
    setShowFlightForm(true);
  };

  const handleCancelFlight = (flight) => {
    setSelectedFlight(flight);
    setFlightForm({
      flightNo: flight.flightNo,
      airline: flight.airline,
      route: flight.route,
      date: flight.date,
      time: flight.time,
      status: flight.status,
      arrival: flight.arrival,
      description: flight.remarks !== '-' ? flight.remarks : '',
      personName: flight.signature !== '-' ? flight.signature : '',
      actionType: 'cancel'
    });
    setShowFlightForm(true);
  };

  const handleSaveFlightDetails = () => {
    if (flightForm.actionType === 'add') {
      // Add new flight
      const newFlight = {
        id: Math.max(...flightsData.map(f => f.id)) + 1,
        flightNo: flightForm.flightNo,
        airline: flightForm.airline,
        route: flightForm.route,
        date: flightForm.date,
        time: flightForm.time,
        status: flightForm.status,
        arrival: flightForm.arrival,
        remarks: flightForm.description || '-',
        signature: flightForm.personName || '-'
      };

      setFlightsData(prev => [...prev, newFlight]);
      alert('Flight added successfully!');
    } else if (selectedFlight) {
      // Update existing flight
      const updatedFlights = flightsData.map(flight => {
        if (flight.id === selectedFlight.id) {
          const updatedFlight = {
            ...flight,
            flightNo: flightForm.flightNo,
            airline: flightForm.airline,
            route: flightForm.route,
            date: flightForm.date,
            time: flightForm.time,
            status: flightForm.status,
            arrival: flightForm.arrival,
            remarks: flightForm.description || '-',
            signature: flightForm.personName || '-'
          };

          // If action type is cancel, update status and arrival
          if (flightForm.actionType === 'cancel') {
            updatedFlight.status = 'Canceled';
            updatedFlight.arrival = 'Canceled';
          }

          return updatedFlight;
        }
        return flight;
      });

      setFlightsData(updatedFlights);
      
      // Show success message based on action type
      const actionMessage = flightForm.actionType === 'cancel' 
        ? 'Flight cancelled successfully!' 
        : 'Flight details updated successfully!';
      
      alert(actionMessage);
    }
    
    setShowFlightForm(false);
    setSelectedFlight(null);
    setFlightForm({ 
      flightNo: '',
      airline: '',
      route: '',
      date: '',
      time: '',
      status: 'Scheduled',
      arrival: 'Scheduled',
      description: '', 
      personName: '', 
      actionType: 'edit' 
    });
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = ['Flight No.', 'Airline', 'Route', 'Date', 'Time', 'Status', 'Arrival', 'Remarks', 'Signature'];
    const csvContent = [
      headers.join(','),
      ...filteredFlights.map(flight => 
        [
          flight.flightNo,
          flight.airline,
          flight.route,
          flight.date,
          flight.time,
          flight.status,
          flight.arrival,
          flight.remarks,
          flight.signature
        ].map(field => `"${field}"`).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `flight-schedule-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const stations = ['All Stations', 'DEL', 'BOM', 'BLR', 'MAA', 'HYD', 'CCU', 'GOI'];
  const airlines = ['All Airlines', 'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First'];
  const statuses = ['All Statuses', 'Scheduled', 'Canceled'];
  const arrivalStatuses = ['Scheduled', 'Arrived', 'Delayed', 'On Time', 'Canceled'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 text-slate-800 p-6">
      {/* Header */}
      

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          {
            value: stats.totalFlights,
            label: "Total Flights",
            icon: "✈️",
            description: "Active flights in system",
            color: "sky",
            bgGradient: "from-sky-50 to-blue-50",
            hoverGradient: "from-sky-100 to-blue-100",
            progress: 75,
          },
          {
            value: stats.scheduled,
            label: "Scheduled",
            icon: "⏱️",
            description: "On-time flights",
            color: "emerald",
            bgGradient: "from-emerald-50 to-green-50",
            hoverGradient: "from-emerald-100 to-green-100",
            progress: 82,
          },
          {
            value: stats.canceled,
            label: "Canceled",
            icon: "❌",
            description: "Cancelled flights",
            color: "red",
            bgGradient: "from-red-50 to-pink-50",
            hoverGradient: "from-red-100 to-pink-100",
            progress: parseInt((stats.canceled / stats.totalFlights) * 100),
          },
          {
            value: stats.additionalFlights,
            label: "Additional Flights",
            icon: "📊",
            description: "Delayed & on-time",
            color: "violet",
            bgGradient: "from-violet-50 to-purple-50",
            hoverGradient: "from-violet-100 to-purple-100",
            progress: parseInt((stats.additionalFlights / stats.totalFlights) * 100),
          },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`
              relative bg-gradient-to-br ${item.bgGradient} border border-${item.color}-200
              rounded-2xl p-6 shadow-lg hover:shadow-2xl 
              transform transition-all duration-500 group 
              overflow-hidden cursor-pointer hover-lift
              hover:${item.hoverGradient}
            `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative z-10">
              {/* Header with icon and indicator */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`
                    w-12 h-12 rounded-xl bg-white shadow-lg
                    flex items-center justify-center text-xl
                    transform group-hover:scale-110 group-hover:rotate-12
                    transition-all duration-500 border border-${item.color}-100
                  `}
                >
                  <span className="icon-float">{item.icon}</span>
                </div>
                <div
                  className={`
                    w-2 h-2 rounded-full bg-${item.color}-400 
                    animate-pulse group-hover:animate-bounce
                  `}
                ></div>
              </div>

              {/* Main content */}
              <div className="mb-2">
                <div
                  className={`
                    text-2xl font-bold text-${item.color}-700 
                    transition-all duration-300
                  `}
                >
                  {item.value}
                </div>
                <div className="text-lg font-semibold text-slate-700 mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="w-full bg-white/50 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className={`
                    h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 
                    rounded-full transition-all duration-1000 ease-out
                  `}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>

              {/* Progress percentage */}
              <div className="text-xs text-slate-500 mt-1 text-right">
                {item.progress}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg mb-6">
        <div className="p-6 border-b border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <Filter className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-600 text-lg">Filters & Actions</h3>
              <p className="text-slate-600 text-sm">Filter and manage flight schedules</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleAddFlight}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add Flight
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search flights..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Station Filter */}
          <select
            className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            value={filters.station}
            onChange={(e) => handleFilterChange('station', e.target.value)}
          >
            {stations.map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>

          {/* Airline Filter */}
          <select
            className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            value={filters.airline}
            onChange={(e) => handleFilterChange('airline', e.target.value)}
          >
            {airlines.map(airline => (
              <option key={airline} value={airline}>{airline}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Date Range Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Select date range..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm cursor-pointer"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              onFocus={(e) => {
                e.target.type = 'date';
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = 'text';
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/60">
            <thead className="bg-slate-50/80">
              <tr>
                {[
                  "Flight No.",
                  "Airline",
                  "Route",
                  "Date",
                  "Time",
                  "Status",
                  "Arrival",
                  "Remarks",
                  "Signature",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200/40">
              {filteredFlights.map((flight, index) => (
                <tr
                  key={flight.id}
                  className="hover:bg-sky-50/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                    {flight.flightNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {flight.airline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {flight.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {flight.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {flight.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      flight.status === 'Scheduled' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {flight.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      flight.arrival === 'Arrived' || flight.arrival === 'On Time'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : flight.arrival === 'Delayed'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : flight.arrival === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {flight.arrival}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                    {flight.remarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {flight.signature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditFlight(flight)}
                      className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    {flight.status === 'Scheduled' && (
                      <button
                        onClick={() => handleCancelFlight(flight)}
                        className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1 transition-colors duration-200"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No flights found</h3>
            <p className="text-slate-500">Try adjusting your filters or add a new flight.</p>
          </div>
        )}
      </div>

      {/* Flight Details Form Modal */}
      {showFlightForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
            <div className="p-6 border-b border-white/50">
              <h3 className="text-xl font-semibold text-sky-600">
                {flightForm.actionType === 'add' ? 'Add New Flight' : 
                 flightForm.actionType === 'cancel' ? 'Cancel Flight' : 'Edit Flight Details'} 
                {flightForm.actionType !== 'add' && ` - ${selectedFlight?.flightNo}`}
              </h3>
              {flightForm.actionType !== 'add' && selectedFlight && (
                <p className="text-sm text-slate-600 mt-1">
                  {selectedFlight.airline} • {selectedFlight.route} • {selectedFlight.date} {selectedFlight.time}
                </p>
              )}
            </div>

            <div className="p-6 space-y-6">
              {flightForm.actionType === 'cancel' && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">You are about to cancel this flight</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This action will mark the flight as canceled. Please provide details below.
                  </p>
                </div>
              )}

              {flightForm.actionType === 'add' && (
                <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Add New Flight Schedule</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Please fill in all the required flight details below.
                  </p>
                </div>
              )}

              {/* Flight Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Flight Number *
                  </label>
                  <input
                    type="text"
                    value={flightForm.flightNo}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, flightNo: e.target.value }))}
                    placeholder="e.g., AI 101"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Airline *
                  </label>
                  <select
                    value={flightForm.airline}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, airline: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  >
                    <option value="">Select Airline</option>
                    {airlines.filter(a => a !== 'All Airlines').map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Route *
                  </label>
                  <input
                    type="text"
                    value={flightForm.route}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="e.g., DEL – BOM"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="text"
                    value={flightForm.date}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g., Nov 11, 2025"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={flightForm.time}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g., 06:00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={flightForm.status}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Arrival Status *
                  </label>
                  <select
                    value={flightForm.arrival}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, arrival: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  >
                    {arrivalStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description / Remarks {flightForm.actionType === 'cancel' && '(Required)'}
                </label>
                <textarea
                  value={flightForm.description}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={
                    flightForm.actionType === 'cancel' 
                      ? 'Please provide reason for cancellation...' 
                      : flightForm.actionType === 'add'
                      ? 'Enter flight description or remarks...'
                      : 'Enter flight description, remarks, or additional notes...'
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  required={flightForm.actionType === 'cancel'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Person Name / Signature {flightForm.actionType === 'cancel' && '(Required)'}
                </label>
                <input
                  type="text"
                  value={flightForm.personName}
                  onChange={(e) => setFlightForm(prev => ({ ...prev, personName: e.target.value }))}
                  placeholder="Enter person name for signature..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required={flightForm.actionType === 'cancel' || flightForm.actionType === 'add'}
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/50 bg-slate-50/80 backdrop-blur-sm rounded-b-2xl flex justify-end space-x-3">
              <button
                onClick={() => setShowFlightForm(false)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFlightDetails}
                className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 ${
                  flightForm.actionType === 'cancel' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30' 
                    : flightForm.actionType === 'add'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30'
                } hover:scale-105`}
                disabled={
                  flightForm.actionType === 'cancel' && (!flightForm.description || !flightForm.personName) ||
                  flightForm.actionType === 'add' && (!flightForm.flightNo || !flightForm.airline || !flightForm.route || !flightForm.date || !flightForm.time || !flightForm.personName)
                }
              >
                <Save className="h-4 w-4" />
                {flightForm.actionType === 'add' ? 'Add Flight' : 
                 flightForm.actionType === 'cancel' ? 'Confirm Cancellation' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MISFlightSchedule;