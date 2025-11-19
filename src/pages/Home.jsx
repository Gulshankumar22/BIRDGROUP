import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MISFlightSchedule from "../pages/MISFlightSchedule";

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Constants
const FLIGHT_DATA = [
  {
    flightNo: "AF101",
    route: "DEL-BOM",
    aircraft: "A320",
    arrival: "10:30",
    departure: "08:45",
    date: "2024-01-15",
    scheduled: true,
    nonScheduled: false,
    status: "Active",
  },
  {
    flightNo: "AF202",
    route: "BOM-BLR",
    aircraft: "B737",
    arrival: "14:15",
    departure: "12:30",
    date: "2024-01-16",
    scheduled: true,
    nonScheduled: false,
    status: "Delayed",
  },
  {
    flightNo: "AF303",
    route: "BLR-HYD",
    aircraft: "A321",
    arrival: "16:45",
    departure: "15:00",
    date: "2024-01-17",
    scheduled: false,
    nonScheduled: true,
    status: "Active",
  },
  {
    flightNo: "AF404",
    route: "DEL-GOA",
    aircraft: "A320",
    arrival: "18:30",
    departure: "16:15",
    date: "2024-01-18",
    scheduled: true,
    nonScheduled: false,
    status: "Cancelled",
  },
  {
    flightNo: "AF505",
    route: "BOM-BLR",
    aircraft: "B737",
    arrival: "20:00",
    departure: "18:45",
    date: "2024-01-19",
    scheduled: true,
    nonScheduled: false,
    status: "Active",
  },
];

const KPI_DATA = {
  totalFlights: 156,
  activePassengers: 23450,
  fuelEfficiency: 87.5,
  onTimePerformance: 94.2,
};

const MIS_DATA = {
  totalRevenue: 45600000,
  operatingCost: 32100000,
  profitMargin: 29.6,
  loadFactor: 82.3,
  utilization: 91.7,
  marketShare: 15.8,
};

const EQUIPMENT_DATA = [
  {
    id: 1,
    name: "Baggage Cart B-101",
    type: "Baggage Cart",
    status: "available",
    location: "Terminal A, Bay 12",
    coordinates: [28.5562, 77.1],
    lastMaintenance: "2023-10-15",
    nextMaintenance: "2024-01-15",
  },
  {
    id: 2,
    name: "Fuel Truck F-205",
    type: "Fuel Truck",
    status: "in-use",
    location: "Runway 3, Gate 7",
    coordinates: [28.555, 77.099],
    lastMaintenance: "2023-11-20",
    nextMaintenance: "2024-02-20",
  },
  {
    id: 3,
    name: "Catering Truck C-308",
    type: "Catering Truck",
    status: "maintenance",
    location: "Maintenance Hangar",
    coordinates: [28.5575, 77.098],
    lastMaintenance: "2023-09-10",
    nextMaintenance: "2023-12-10",
  },
  {
    id: 4,
    name: "Pushback Tractor P-412",
    type: "Pushback Tractor",
    status: "available",
    location: "Terminal B, Bay 5",
    coordinates: [28.5545, 77.1015],
    lastMaintenance: "2023-10-30",
    nextMaintenance: "2024-01-30",
  },
  {
    id: 5,
    name: "De-icing Truck D-516",
    type: "De-icing Truck",
    status: "in-use",
    location: "De-icing Pad 2",
    coordinates: [28.558, 77.0975],
    lastMaintenance: "2023-11-05",
    nextMaintenance: "2024-02-05",
  },
  {
    id: 6,
    name: "Passenger Bus PB-621",
    type: "Passenger Bus",
    status: "available",
    location: "Terminal C, Gate 3",
    coordinates: [28.5538, 77.102],
    lastMaintenance: "2023-10-22",
    nextMaintenance: "2024-01-22",
  },
];

const STATUS_COLORS = {
  Active: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  Delayed: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  Cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  available: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  "in-use": {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  maintenance: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
};

// Airports data for login
const AIRPORTS = [
  {
    id: 1,
    name: "Indira Gandhi International Airport",
    code: "DEL",
    city: "Delhi",
    coordinates: [28.5562, 77.1],
  },
  {
    id: 2,
    name: "Chhatrapati Shivaji Maharaj International Airport",
    code: "BOM",
    city: "Mumbai",
    coordinates: [19.0887, 72.8679],
  },
  {
    id: 3,
    name: "Kempegowda International Airport",
    code: "BLR",
    city: "Bengaluru",
    coordinates: [13.1986, 77.7066],
  },
  {
    id: 4,
    name: "Chennai International Airport",
    code: "MAA",
    city: "Chennai",
    coordinates: [12.9941, 80.1709],
  },
  {
    id: 5,
    name: "Netaji Subhas Chandra Bose International Airport",
    code: "CCU",
    city: "Kolkata",
    coordinates: [22.6547, 88.4467],
  },
  {
    id: 6,
    name: "Rajiv Gandhi International Airport",
    code: "HYD",
    city: "Hyderabad",
    coordinates: [17.2403, 78.4294],
  },
  {
    id: 7,
    name: "Cochin International Airport",
    code: "COK",
    city: "Kochi",
    coordinates: [10.152, 76.4015],
  },
  {
    id: 8,
    name: "Sardar Vallabhbhai Patel International Airport",
    code: "AMD",
    city: "Ahmedabad",
    coordinates: [23.0732, 72.6258],
  },
  {
    id: 9,
    name: "Pune Airport",
    code: "PNQ",
    city: "Pune",
    coordinates: [18.5793, 73.9089],
  },
  {
    id: 10,
    name: "Goa International Airport",
    code: "GOI",
    city: "Goa",
    coordinates: [15.3806, 73.8353],
  },
];

// Ticket Confirmation Popup Component
const TicketConfirmationPopup = ({ isOpen, onClose, onRaiseAnother }) => {
  if (!isOpen) return null;

  const ticketNumber = `TKT-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ticket Raised Successfully!
          </h3>
          <p className="text-gray-600">
            Your support ticket has been submitted and will be processed shortly.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Ticket Number</p>
            <p className="text-2xl font-bold text-green-600 font-mono">
              {ticketNumber}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Please save this number for reference
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Our team will review your ticket within 2-4 hours
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              You'll receive email updates on progress
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Track status in your dashboard
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onRaiseAnother}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg shadow-green-600/25"
          >
            Raise Another
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Login Modal Component
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
    setLoginError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username && loginForm.password) {
      if (loginForm.username === "jatin" && loginForm.password === "password") {
        onLogin({
          user: loginForm.username,
          airport: selectedAirport,
        });
        setLoginError("");
      } else {
        setLoginError("Invalid credentials. Try jatin/password");
      }
    } else {
      setLoginError("Please enter both username and password");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                India Airport System Login
              </h2>
              <p className="text-indigo-100 mt-1">
                Select your airport and login to access the dashboard
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Select Your Airport
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AIRPORTS.map((airport) => (
                <button
                  key={airport.id}
                  onClick={() => handleAirportSelect(airport)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedAirport?.id === airport.id
                      ? "border-indigo-500 bg-indigo-50 scale-105"
                      : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {airport.city}
                      </h4>
                      <p className="text-sm text-gray-600">{airport.name}</p>
                      <p className="text-xs text-gray-500">
                        Code: {airport.code}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedAirport && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Login to {selectedAirport.city} Airport
              </h3>
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={loginForm.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Login to {selectedAirport.city} Airport
                </button>
              </form>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-600 text-center">
                  Demo credentials:{" "}
                  <span className="font-mono">admin / password</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Calendar Sidebar Component
// Calendar Sidebar Component
const CalendarSidebar = ({ isOpen, onClose, dateRange, setDateRange, applyFilters }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    return {
      firstDay,
      lastDay,
      daysInMonth,
      startingDay: firstDay.getDay()
    };
  };

  const isDateInRange = (date) => {
    if (!dateRange.start || !dateRange.end) return false;
    
    const currentDate = new Date(date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    return currentDate >= startDate && currentDate <= endDate;
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({
        start: dateString,
        end: ""
      });
    } else {
      const startDate = new Date(dateRange.start);
      if (date < startDate) {
        setDateRange({
          start: dateString,
          end: dateRange.start
        });
      } else {
        setDateRange(prev => ({
          ...prev,
          end: dateString
        }));
      }
    }
  };

  const applyDateFilter = () => {
    applyFilters();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const clearDates = () => {
    setDateRange({ start: "", end: "" });
    applyFilters();
  };

  const { firstDay, lastDay, daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const isStart = dateString === dateRange.start;
    const isEnd = dateString === dateRange.end;
    const inRange = isDateInRange(date);
    const isToday = dateString === new Date().toISOString().split('T')[0];
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        className={`
          relative w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
          ${isStart || isEnd 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
            : inRange 
            ? 'bg-blue-100 text-blue-700' 
            : isToday
            ? 'bg-orange-100 text-orange-700 border border-orange-300'
            : 'text-gray-700 hover:bg-gray-100'
          }
          ${(isStart || isEnd) && 'ring-2 ring-white ring-opacity-50'}
        `}
      >
        {day}
        {(isStart || isEnd) && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
        )}
      </button>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-20 h-[calc(100vh-5rem)] lg:h-auto w-80 bg-white/95 backdrop-blur-md rounded-xl
        border-l border-gray-200/50 z-10 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:relative lg:w-64 lg:block
      `}>
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Date Filter</h3>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected Dates */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-2 mb-6">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">From</label>
                <div className="text-sm font-medium text-gray-800">
                  {dateRange.start ? new Date(dateRange.start).toLocaleDateString() : 'Select start date'}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">To</label>
                <div className="text-sm font-medium text-gray-800">
                  {dateRange.end ? new Date(dateRange.end).toLocaleDateString() : 'Select end date'}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h4 className="text-sm font-bold text-gray-800">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              
              <button
                onClick={() => navigateMonth(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <button
              onClick={applyDateFilter}
              disabled={!dateRange.start || !dateRange.end}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Apply Filter
            </button>
            
            <button
              onClick={clearDates}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Clear Dates
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Home = () => {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filteredData, setFilteredData] = useState(FLIGHT_DATA);
  const [currentChartType, setCurrentChartType] = useState("pie");
  const [lineChartType, setLineChartType] = useState("line");
  const [kpis, setKpis] = useState({
    totalFlights: 0,
    activePassengers: 0,
    fuelEfficiency: 0,
    onTimePerformance: 0,
  });
  const [misValues, setMisValues] = useState({
    totalRevenue: "₹0",
    operatingCost: "₹0",
    profitMargin: "0%",
    loadFactor: "0%",
    utilization: "0%",
    marketShare: "0%",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Login Demo");
  const [modalMessage, setModalMessage] = useState("This is a demo login interface.");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Ticket Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: "",
    priority: "Medium",
    subject: "",
    description: "",
    equipmentId: "",
    flightNo: "",
    attachments: null,
  });

  const [showTicketConfirmation, setShowTicketConfirmation] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);

  // Refs
  const flightStatusRef = useRef(null);
  const performanceRef = useRef(null);
  const gseMapRef = useRef(null);
  const gseMapInstance = useRef(null);
  const equipmentMarkersRef = useRef([]);
  const particlesContainerRef = useRef(null);
  const flightStatusChartRef = useRef(null);
  const performanceChartRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Memoized data
  const flightData = useMemo(() => FLIGHT_DATA, []);
  const equipmentData = useMemo(() => EQUIPMENT_DATA, []);

  // Animation utilities
  const animateValue = useCallback(
    (start, end, duration, onUpdate, onComplete) => {
      const startTime = performance.now();

      const updateValue = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + (end - start) * easeOutQuart;

        onUpdate(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(updateValue);
        } else if (onComplete) {
          onComplete();
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateValue);
    },
    []
  );

  const formatLargeNumber = useCallback((num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(1) + "L";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return Math.floor(num).toString();
  }, []);

  // KPI Animations
  const animateKPIs = useCallback(() => {
    animateValue(0, KPI_DATA.totalFlights, 2000, (value) =>
      setKpis((prev) => ({ ...prev, totalFlights: Math.floor(value) }))
    );

    animateValue(0, KPI_DATA.activePassengers, 2000, (value) =>
      setKpis((prev) => ({ ...prev, activePassengers: Math.floor(value) }))
    );

    animateValue(0, KPI_DATA.fuelEfficiency, 2000, (value) =>
      setKpis((prev) => ({ ...prev, fuelEfficiency: Number(value.toFixed(1)) }))
    );

    animateValue(0, KPI_DATA.onTimePerformance, 2000, (value) =>
      setKpis((prev) => ({
        ...prev,
        onTimePerformance: Number(value.toFixed(1)),
      }))
    );
  }, [animateValue]);

  const animateMIS = useCallback(() => {
    animateValue(0, MIS_DATA.totalRevenue, 2000, (value) =>
      setMisValues((prev) => ({
        ...prev,
        totalRevenue: `₹${formatLargeNumber(value)}`,
      }))
    );

    animateValue(0, MIS_DATA.operatingCost, 2000, (value) =>
      setMisValues((prev) => ({
        ...prev,
        operatingCost: `₹${formatLargeNumber(value)}`,
      }))
    );

    animateValue(0, MIS_DATA.profitMargin, 2000, (value) =>
      setMisValues((prev) => ({
        ...prev,
        profitMargin: `${value.toFixed(1)}%`,
      }))
    );

    animateValue(0, MIS_DATA.loadFactor, 2000, (value) =>
      setMisValues((prev) => ({ ...prev, loadFactor: `${value.toFixed(1)}%` }))
    );

    animateValue(0, MIS_DATA.utilization, 2000, (value) =>
      setMisValues((prev) => ({ ...prev, utilization: `${value.toFixed(1)}%` }))
    );

    animateValue(0, MIS_DATA.marketShare, 2000, (value) =>
      setMisValues((prev) => ({ ...prev, marketShare: `${value.toFixed(1)}%` }))
    );
  }, [animateValue, formatLargeNumber]);

  // Charts
  const createFlightStatusChart = useCallback(() => {
    if (!flightStatusRef.current) return;

    try {
      const ctx = flightStatusRef.current.getContext("2d");

      if (flightStatusChartRef.current) {
        flightStatusChartRef.current.destroy();
        flightStatusChartRef.current = null;
      }

      const statusCounts = { Active: 0, Delayed: 0, Cancelled: 0 };
      flightData.forEach((f) => statusCounts[f.status]++);

      const data = {
        labels: ["Active", "Delayed", "Cancelled"],
        datasets: [
          {
            data: [
              statusCounts.Active,
              statusCounts.Delayed,
              statusCounts.Cancelled,
            ],
            backgroundColor: [
              "rgba(173, 216, 230, 0.8)",
              "rgba(144, 238, 144, 0.8)",
              "rgba(255, 182, 193, 0.8)",
            ],
            borderColor: [
              "rgb(135, 206, 235)",
              "rgb(124, 252, 124)",
              "rgb(255, 105, 180)",
            ],
            borderWidth: 3,
            hoverOffset: 20,
            ...((currentChartType === "pie" || currentChartType === "doughnut") && {
              spacing: 2,
              offset: [10, 10, 10],
            }),
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const label = ctx.label || "";
                const value = ctx.raw || 0;
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} flights (${percentage}%)`;
              },
            },
          },
          title: {
            display: true,
            text: "Flight Status Distribution",
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#1e293b",
            padding: 20,
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
        ...(currentChartType === "pie" && {
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1800,
            easing: "easeOutBack",
          },
          cutout: "0%",
        }),
        ...(currentChartType === "doughnut" && {
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: "easeOutElastic",
          },
          cutout: "50%",
          radius: "90%",
        }),
        ...(currentChartType === "bar" && {
          animation: {
            duration: 1500,
            easing: "easeOutQuart",
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  size: 11,
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                  weight: "bold",
                },
              },
            },
          },
        }),
      };

      flightStatusChartRef.current = new Chart(ctx, {
        type: currentChartType,
        data,
        options,
      });

      setTimeout(() => {
        if (flightStatusChartRef.current) {
          flightStatusChartRef.current.update("none");
        }
      }, 100);
    } catch (error) {
      console.error("Error creating flight status chart:", error);
    }
  }, [currentChartType, flightData]);

  const createPerformanceChart = useCallback(() => {
    if (!performanceRef.current) return;

    try {
      const ctx = performanceRef.current.getContext("2d");

      if (performanceChartRef.current) {
        performanceChartRef.current.destroy();
        performanceChartRef.current = null;
      }

      const months = ["Aug", "Sep", "Oct", "Nov"];
      const onTimeData = [85, 78, 92, 88];
      const delayedData = [10, 15, 5, 8];
      const cancelledData = [5, 7, 3, 4];

      const data = {
        labels: months,
        datasets: [
          {
            label: "On Time",
            data: onTimeData,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgb(34, 197, 94)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
          {
            label: "Delayed",
            data: delayedData,
            borderColor: "rgb(249, 115, 22)",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgb(249, 115, 22)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
          {
            label: "Cancelled",
            data: cancelledData,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgb(239, 68, 68)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: "bold",
              },
            },
          },
          title: {
            display: true,
            text: "Monthly Flight Performance",
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#1e293b",
            padding: 20,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            cornerRadius: 8,
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (v) => `${v}%`,
              stepSize: 20,
              font: {
                size: 11,
              },
            },
            title: {
              display: true,
              text: "Percentage",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Months",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
                weight: "bold",
              },
            },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
        ...(lineChartType === "bar" && {
          animation: {
            duration: 1800,
            easing: "easeOutBack",
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (v) => `${v}%`,
                stepSize: 20,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }),
        ...(lineChartType === "line" && {
          animation: {
            duration: 2000,
            easing: "easeOutElastic",
            tension: 0.4,
          },
        }),
      };

      performanceChartRef.current = new Chart(ctx, {
        type: lineChartType,
        data,
        options,
      });

      setTimeout(() => {
        if (performanceChartRef.current) {
          performanceChartRef.current.update("none");
        }
      }, 100);
    } catch (error) {
      console.error("Error creating performance chart:", error);
    }
  }, [lineChartType]);

  const toggleChartType = useCallback((type) => {
    setCurrentChartType(type);
    setTimeout(() => {
      if (flightStatusChartRef.current) {
        flightStatusChartRef.current.destroy();
        flightStatusChartRef.current = null;
      }
    }, 50);
  }, []);

  const toggleLineChart = useCallback(() => {
    setLineChartType((prev) => (prev === "line" ? "bar" : "line"));
    setTimeout(() => {
      if (performanceChartRef.current) {
        performanceChartRef.current.destroy();
        performanceChartRef.current = null;
      }
    }, 50);
  }, []);

  const initializeCharts = useCallback(() => {
    setTimeout(() => {
      createFlightStatusChart();
      createPerformanceChart();
    }, 100);
  }, [createFlightStatusChart, createPerformanceChart]);

  // Map functions
  const initializeMap = useCallback(() => {
    if (!gseMapRef.current) return;

    if (gseMapInstance.current) return;

    try {
      if (gseMapRef.current._leaflet_id) return;

      gseMapInstance.current = L.map(gseMapRef.current).setView(
        [28.5562, 77.1],
        16
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(gseMapInstance.current);

      L.polygon(
        [
          [28.558, 77.095],
          [28.558, 77.105],
          [28.552, 77.105],
          [28.552, 77.095],
        ],
        {
          color: "#0ea5e9",
          fillColor: "#0ea5e9",
          fillOpacity: 0.1,
          weight: 2,
        }
      )
        .addTo(gseMapInstance.current)
        .bindPopup("Airport Area");

      const terminals = [
        {
          name: "Terminal A",
          coords: [28.5565, 77.0995],
          size: [0.002, 0.003],
        },
        { name: "Terminal B", coords: [28.555, 77.101], size: [0.002, 0.003] },
        {
          name: "Terminal C",
          coords: [28.5535, 77.1025],
          size: [0.002, 0.003],
        },
      ];

      terminals.forEach((terminal) => {
        L.rectangle(
          [
            [
              terminal.coords[0] - terminal.size[0],
              terminal.coords[1] - terminal.size[1],
            ],
            [
              terminal.coords[0] + terminal.size[0],
              terminal.coords[1] + terminal.size[1],
            ],
          ],
          {
            color: "#f59e0b",
            fillColor: "#f59e0b",
            fillOpacity: 0.3,
            weight: 2,
          }
        )
          .addTo(gseMapInstance.current)
          .bindPopup(
            `<strong>${terminal.name}</strong><br/>Passenger Terminal`
          );
      });

      addEquipmentMarkers();
    } catch (error) {
      console.error("Error initializing map:", error);
      gseMapInstance.current = null;
    }
  }, []);

  const addEquipmentMarkers = useCallback(() => {
    if (!gseMapInstance.current) return;

    try {
      equipmentMarkersRef.current.forEach(({ marker }) => {
        if (marker && gseMapInstance.current) {
          gseMapInstance.current.removeLayer(marker);
        }
      });
      equipmentMarkersRef.current = [];

      equipmentData.forEach((eq) => {
        const iconColor =
          eq.status === "available"
            ? "#22c55e"
            : eq.status === "in-use"
            ? "#f97316"
            : "#ef4444";

        const customIcon = L.divIcon({
          html: `
          <div style="
            position: relative;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: white;
              border: 2px solid ${iconColor};
              z-index: 2;
            "></div>
            <div style="
              position: absolute;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${iconColor};
              opacity: 0.4;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
          className: "custom-equipment-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker(eq.coordinates, { icon: customIcon }).addTo(
          gseMapInstance.current
        ).bindPopup(`
          <div style="padding: 12px; min-width: 220px; font-family: sans-serif;">
            <h4 style="font-weight: bold; color: #0ea5e9; margin: 0 0 8px 0; font-size: 16px;">${eq.name}</h4>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Type:</strong> ${eq.type}</p>
            <p style="margin: 4px 0; font-size: 14px;">
              <strong>Status:</strong> 
              <span style="text-transform: capitalize; color: ${iconColor}; font-weight: bold;"> ${eq.status}</span>
            </p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${eq.location}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Last Maintenance:</strong> ${eq.lastMaintenance}</p>
          </div>
        `);

        equipmentMarkersRef.current.push({ id: eq.id, marker, equipment: eq });
      });
    } catch (error) {
      console.error("Error adding equipment markers:", error);
    }
  }, [equipmentData]);

  const focusOnEquipment = useCallback((equipmentId) => {
    if (!gseMapInstance.current) return;

    try {
      const found = equipmentMarkersRef.current.find(
        (m) => m.id === equipmentId
      );
      if (!found) return;

      gseMapInstance.current.setView(found.equipment.coordinates, 18);
      found.marker.openPopup();

      const element = document.querySelector(
        `.equipment-item[data-id="${equipmentId}"]`
      );
      if (element) {
        document.querySelectorAll(".equipment-item").forEach((item) => {
          item.style.boxShadow = "none";
          item.style.background = "rgba(248, 250, 252, 0.8)";
        });
        element.style.boxShadow = "0 0 0 2px #0ea5e9";
        element.style.background = "rgba(14, 165, 233, 0.1)";
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (error) {
      console.error("Error focusing on equipment:", error);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (flightStatusChartRef.current) {
      flightStatusChartRef.current.destroy();
      flightStatusChartRef.current = null;
    }
    if (performanceChartRef.current) {
      performanceChartRef.current.destroy();
      performanceChartRef.current = null;
    }

    if (gseMapInstance.current) {
      try {
        gseMapInstance.current.eachLayer((layer) => {
          gseMapInstance.current.removeLayer(layer);
        });
        gseMapInstance.current.remove();
        gseMapInstance.current = null;
      } catch (error) {
        console.warn("Error during map cleanup:", error);
        gseMapInstance.current = null;
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      initializeCharts();
      initializeMap();
      createParticles();
    }, 200);

    animateKPIs();
    animateMIS();

    return () => {
      clearTimeout(initTimer);
      cleanup();
    };
  }, [initializeCharts, initializeMap, animateKPIs, animateMIS, cleanup]);

  useEffect(() => {
    createFlightStatusChart();
  }, [currentChartType, createFlightStatusChart]);

  useEffect(() => {
    createPerformanceChart();
  }, [lineChartType, createPerformanceChart]);

  const createParticles = useCallback(() => {
    const container = particlesContainerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full bg-blue-200/20";

      const size = Math.random() * 15 + 5;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 15 + 10;
      const animationDelay = Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = "100%";
      particle.style.animation = `float ${animationDuration}s ease-in ${animationDelay}s infinite`;

      container.appendChild(particle);
    }
  }, []);

  const applyFilters = useCallback(() => {
    const searchTerm = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const routeFilter = document.getElementById("routeFilter")?.value || "";
    const aircraftFilter = document.getElementById("aircraftFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";

    const filtered = flightData.filter((flight) => {
      const matchesSearch = !searchTerm ||
        flight.flightNo.toLowerCase().includes(searchTerm) ||
        flight.route.toLowerCase().includes(searchTerm) ||
        flight.aircraft.toLowerCase().includes(searchTerm);

      const matchesRoute = !routeFilter || flight.route === routeFilter;
      const matchesAircraft = !aircraftFilter || flight.aircraft === aircraftFilter;
      const matchesStatus = !statusFilter || flight.status === statusFilter;
      
      const matchesDateRange = !dateRange.start || !dateRange.end || 
        (flight.date >= dateRange.start && flight.date <= dateRange.end);

      return matchesSearch && matchesRoute && matchesAircraft && matchesStatus && matchesDateRange;
    });

    setFilteredData(filtered);
  }, [flightData, dateRange]);

  const exportToCSV = useCallback(() => {
    const headers = [
      "Flight No.",
      "Route",
      "Aircraft",
      "Arrival",
      "Departure",
      "Scheduled",
      "Non-Scheduled",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((f) =>
        [
          f.flightNo,
          f.route,
          f.aircraft,
          f.arrival,
          f.departure,
          f.scheduled ? "Yes" : "No",
          f.nonScheduled ? "Yes" : "No",
          f.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "flight-data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [filteredData]);

  const openModal = useCallback((type = "Login") => {
    const modalConfigs = {
      "Passenger Shift Flight": {
        title: "Passenger Shift Flight",
        message:
          "This feature would display detailed information about passenger shifts between flights...",
      },
      "Baggage Report": {
        title: "Baggage Report",
        message:
          "This feature would show comprehensive baggage tracking information...",
      },
      "MIS Analysis": {
        title: "MIS Analysis",
        message:
          "This feature would provide detailed MIS analysis for flight operations...",
      },
      Login: {
        title: "Login Demo",
        message: "This is a demo login interface.",
      },
    };

    const config = modalConfigs[type] || modalConfigs.Login;
    setModalTitle(config.title);
    setModalMessage(config.message);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const viewFlight = useCallback((flightNo) => {
    alert(
      `Viewing detailed information for flight: ${flightNo}\n\nThis would show passenger manifest, cargo details, maintenance status, and real-time tracking.`
    );
  }, []);

  const openTicketModal = useCallback(() => {
    setTicketModalOpen(true);
  }, []);

  const closeTicketModal = useCallback(() => {
    setTicketModalOpen(false);
    setTicketForm({
      category: "",
      priority: "Medium",
      subject: "",
      description: "",
      equipmentId: "",
      flightNo: "",
      attachments: null,
    });
  }, []);

  const handleTicketInputChange = useCallback((field, value) => {
    setTicketForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setTicketForm((prev) => ({
        ...prev,
        attachments: file,
      }));
    }
  }, []);

  const submitTicket = useCallback(() => {
    if (
      !ticketForm.category ||
      !ticketForm.subject ||
      !ticketForm.description
    ) {
      alert(
        "Please fill in all required fields (Category, Subject, and Description)"
      );
      return;
    }

    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`,
      ...ticketForm,
      createdAt: new Date().toISOString(),
      status: "Open",
    };

    setTicketHistory((prev) => [...prev, newTicket]);
    console.log("Ticket submitted:", newTicket);

    setTicketModalOpen(false);

    setTimeout(() => {
      setShowTicketConfirmation(true);
    }, 300);
  }, [ticketForm]);

  const handleCloseConfirmation = useCallback(() => {
    setShowTicketConfirmation(false);
  }, []);

  const handleRaiseAnotherTicket = useCallback(() => {
    setShowTicketConfirmation(false);
    setTicketForm({
      category: "",
      priority: "Medium",
      subject: "",
      description: "",
      equipmentId: "",
      flightNo: "",
      attachments: null,
    });
    setTimeout(() => {
      setTicketModalOpen(true);
    }, 300);
  }, []);

  useEffect(() => {
    animateKPIs();
    animateMIS();
    initializeCharts();
    initializeMap();
    createParticles();

    return () => {
      if (flightStatusChartRef.current) {
        flightStatusChartRef.current.destroy();
      }
      if (performanceChartRef.current) {
        performanceChartRef.current.destroy();
      }
      if (gseMapInstance.current) {
        gseMapInstance.current.remove();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animateKPIs,
    animateMIS,
    initializeCharts,
    initializeMap,
    createParticles,
  ]);

  useEffect(() => {
    createFlightStatusChart();
  }, [currentChartType, createFlightStatusChart]);

  useEffect(() => {
    createPerformanceChart();
  }, [lineChartType, createPerformanceChart]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    let lastScrollTop = 0;
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-700 to-gray-900 ">
      <div
        ref={particlesContainerRef}
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      />

      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-slate-200/50 transition-all duration-300 px-4 sm:px-6 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="BirdGroup Logo"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            </div>
            <h3 className="font-bold text-lg text-sky-900">
              BIRD<span className="text-sky-600">GROUP</span>
            </h3>
            {userData?.airport && (
              <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {userData.airport.city} - {userData.airport.code}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>Dashboard</span>
            </a>
            <a
              href="#flights"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>Flights</span>
            </a>
            <a
              href="#MIS"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>MIS</span>
            </a>
            <a
              href="#reports"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>Reports</span>
            </a>
            <a
              href="#ticket-history"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>Ticket History</span>
            </a>
            <a
              href="#gse"
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors duration-200 font-medium"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <span>GSE</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="hidden md:inline-block bg-gradient-to-r from-gray-500 to-gray-900 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/30 transition-all duration-300 hover:scale-105"
              onClick={openTicketModal}
            >
              🎫 RAISE IT TICKET
            </button>

            {isLoggedIn ? (
              <button
                className="hidden md:inline-block bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
                onClick={handleLogout}
              >
                Logout ({userData?.user})
              </button>
            ) : (
              <button
                className="hidden md:inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <a
                href="#dashboard"
                className="block py-2 px-4 rounded-lg bg-sky-50 text-sky-600 font-medium"
              >
                Dashboard
              </a>
              <a
                href="#flights"
                className="block py-2 px-4 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
              >
                Flights
              </a>
              <a
                href="#reports"
                className="block py-2 px-4 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
              >
                Reports
              </a>
              <a
                href="#ticket-history"
                className="block py-2 px-4 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
              >
                Ticket History
              </a>
              <a
                href="#gse"
                className="block py-2 px-4 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
              >
                GSE
              </a>
              <button
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-gray-500 to-gray-900 text-white font-bold shadow-lg shadow-gray-500/25"
                onClick={openTicketModal}
              >
                🎫 RAISE IT TICKET
              </button>
              {isLoggedIn ? (
                <button
                  className="w-full py-2 px-4 rounded-lg bg-red-500 text-white font-medium"
                  onClick={handleLogout}
                >
                  Logout ({userData?.user})
                </button>
              ) : (
                <button
                  className="w-full py-2 px-4 rounded-lg bg-sky-500 text-white font-medium"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

     <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar Sidebar - Desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'w-64 flex-shrink-0' : 'w-0 overflow-hidden'}`}>
        <CalendarSidebar
          isOpen={true}
          onClose={() => setSidebarOpen(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          applyFilters={applyFilters}
        />
      </div>

      {/* Mobile Calendar Sidebar */}
      <div className="lg:hidden">
        <CalendarSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          applyFilters={applyFilters}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:max-w-[calc(100%-16rem)]' : 'lg:max-w-full'}`}>
        {/* Dashboard Overview */}
        <section id="dashboard" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard Overview
            </h2>
            {/* Desktop Calendar Toggle */}
            <button
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {sidebarOpen ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                value: kpis.totalFlights,
                label: "Total Flights",
                icon: "✈️",
                description: "Active flights in system",
                color: "sky",
                bgGradient: "from-sky-50 to-blue-50",
                hoverGradient: "from-sky-100 to-blue-100",
                progress: 75,
              },
              {
                value: kpis.activePassengers,
                label: "Active Passengers",
                icon: "👥",
                description: "Currently traveling",
                color: "emerald",
                bgGradient: "from-emerald-50 to-green-50",
                hoverGradient: "from-emerald-100 to-green-100",
                progress: 82,
              },
              {
                value: `${kpis.fuelEfficiency}%`,
                label: "Staff On Ground",
                icon: "🧍",
                description: "Staff Record",
                color: "amber",
                bgGradient: "from-amber-50 to-yellow-50",
                hoverGradient: "from-amber-100 to-yellow-100",
                progress: parseInt(kpis.fuelEfficiency),
              },
              {
                value: `${kpis.onTimePerformance}%`,
                label: "On-Time Performance",
                icon: "⏱️",
                description: "Schedule adherence",
                color: "violet",
                bgGradient: "from-violet-50 to-purple-50",
                hoverGradient: "from-violet-100 to-purple-100",
                progress: parseInt(kpis.onTimePerformance),
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`
                  relative bg-gradient-to-br ${item.bgGradient} border border-${item.color}-200
                  rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                  transform transition-all duration-500 group 
                  overflow-hidden cursor-pointer
                  hover:${item.hoverGradient}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full translate-y-8 -translate-x-8"></div>
                </div>

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

                  {/* Progress percentage */}
                  <div className="text-xs text-slate-500 mt-1 text-right">
                    {item.progress}%
                  </div>
                </div>

                {/* Sparkle effect */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="sparkle text-lg">✨</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flight Operations */}
        <section id="flights" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Flight Operations
            </h2>
            <div className="flex gap-3">
              <button
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                onClick={exportToCSV}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>

              {/* Mobile Calendar Toggle Button */}
              <button
                className="lg:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {sidebarOpen ? 'Hide Calendar' : 'Show Calendar'}
              </button>
            </div>
          </div>

                <div className="bg-white backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg mb-6">
                  <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                    <div className="flex-1 min-w-[150px]">
                      <input
                        id="searchInput"
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-sm"
                        placeholder="Search flights..."
                        onChange={applyFilters}
                      />
                    </div>

                    <div className="flex-1 min-w-[120px]">
                      <select
                        id="routeFilter"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-sm bg-white"
                        onChange={applyFilters}
                      >
                        <option value="">All Routes</option>
                        <option value="DEL-BOM">DEL-BOM</option>
                        <option value="BOM-BLR">BOM-BLR</option>
                        <option value="BLR-HYD">BLR-HYD</option>
                        <option value="DEL-GOA">DEL-GOA</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-[120px]">
                      <select
                        id="aircraftFilter"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-sm bg-white"
                        onChange={applyFilters}
                      >
                        <option value="">All Aircraft</option>
                        <option value="A320">A320</option>
                        <option value="B737">B737</option>
                        <option value="A321">A321</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-[120px]">
                      <select
                        id="statusFilter"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-sm bg-white"
                        onChange={applyFilters}
                      >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                      onClick={() => {
                        document.getElementById("searchInput").value = "";
                        document.getElementById("routeFilter").value = "";
                        document.getElementById("aircraftFilter").value = "";
                        document.getElementById("statusFilter").value = "";
                        applyFilters();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/60">
                      <thead className="bg-slate-50/80">
                        <tr>
                          {[
                            "Flight No.",
                            "Route",
                            "Aircraft",
                            "Arrival",
                            "Departure",
                            "Scheduled",
                            "Non-Scheduled",
                            "Status",
                            "Actions",
                          ].map((header) => (
                            <th
                              key={header}
                              className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200/40">
                        {filteredData.map((flight, index) => (
                          <tr
                            key={flight.flightNo}
                            className="hover:bg-sky-500/100 transition-colors duration-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                              {flight.flightNo}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {flight.route}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {flight.aircraft}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {flight.arrival}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {flight.departure}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                  flight.scheduled
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {flight.scheduled ? "✓" : "✗"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                  flight.nonScheduled
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {flight.nonScheduled ? "✓" : "✗"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  STATUS_COLORS[flight.status].bg
                                } ${STATUS_COLORS[flight.status].text} ${
                                  STATUS_COLORS[flight.status].border
                                } border`}
                              >
                                {flight.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <button
                                className="bg-sky-500 hover:text-sky-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-white transition-colors duration-200 text-sm shadow-sm shadow-sky-500/25"
                                onClick={() => viewFlight(flight.flightNo)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="MIS" className="mb-8">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    MIS - Flight Schedule Management
                  </h2>
                  <p className="text-white">
                    Manage flight schedules, track cancellations, and monitor
                    flight arrivals
                  </p>
                </div>
                <MISFlightSchedule />
              </section>

              <section id="ticket-history" className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Ticket History
                </h2>

                {ticketHistory.length === 0 ? (
                  <div className="bg-white backdrop-blur-md border border-white/50 rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Tickets Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Your submitted tickets will appear here
                    </p>
                    <button
                      className="bg-gradient-to-r from-gray-500 to-gray-900 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/30 transition-all duration-300 hover:scale-105"
                      onClick={openTicketModal}
                    >
                      🎫 Create Your First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200/60">
                        <thead className="bg-slate-50/80">
                          <tr>
                            {[
                              "Ticket ID",
                              "Category",
                              "Subject",
                              "Priority",
                              "Status",
                              "Created Date",
                              "Actions",
                            ].map((header) => (
                              <th
                                key={header}
                                className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200/40">
                          {ticketHistory.map((ticket, index) => (
                            <tr
                              key={ticket.id}
                              className="hover:bg-sky-400/100 transition-colors duration-200"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                                {ticket.id}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {ticket.category}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {ticket.subject}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    ticket.priority === "High"
                                      ? "bg-red-100 text-red-800 border border-red-200"
                                      : ticket.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                      : "bg-green-100 text-green-800 border border-green-200"
                                  }`}
                                >
                                  {ticket.priority}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  {ticket.status}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {new Date(
                                  ticket.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <button
                                  className="bg-sky-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-sky-600 transition-colors duration-200 text-sm shadow-sm shadow-sky-500/25"
                                  onClick={() =>
                                    alert(`Viewing ticket: ${ticket.id}`)
                                  }
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              <section id="reports" className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Reports & Analytics
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <h3 className="text-lg font-semibold text-sky-600">
                        Flight Status Distribution
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {["pie", "bar", "doughnut"].map((type) => (
                          <button
                            key={type}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                              currentChartType === type
                                ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300"
                            }`}
                            onClick={() => toggleChartType(type)}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-72">
                      <canvas ref={flightStatusRef} />
                    </div>
                  </div>

                  <div className="bg-white backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <h3 className="text-lg font-semibold text-sky-600">
                        Flight Performance Trends
                      </h3>
                      <button
                        className="px-4 py-1 rounded-lg bg-sky-500 text-white text-sm font-medium shadow-sm shadow-sky-500/25 hover:shadow-sky-500/30 transition-all duration-200"
                        onClick={toggleLineChart}
                      >
                        {lineChartType === "line" ? "Bar Chart" : "Line Chart"}
                      </button>
                    </div>
                    <div className="h-72">
                      <canvas ref={performanceRef} />
                    </div>
                  </div>
                </div>
              </section>

              <section id="gse" className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Ground Support Equipment
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 bg-white backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-sky-600">
                        Live Equipment Tracking
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-sky-300 transition-colors duration-200 flex items-center gap-2"
                          onClick={() =>
                            gseMapInstance.current?.setView([28.5562, 77.1], 16)
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Refresh
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg bg-sky-500 text-white text-sm font-medium shadow-sm shadow-sky-500/25 hover:shadow-sky-500/30 transition-all duration-200 flex items-center gap-2"
                          onClick={() => openModal("Live Tracking")}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Live Tracking
                        </button>
                      </div>
                    </div>
                    <div className="h-80 sm:h-96 rounded-xl overflow-hidden shadow-sm">
                      <div
                        id="gseMap"
                        ref={gseMapRef}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="bg-white backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Equipment Status
                      </h3>
                      <button
                        className="px-3 py-1 rounded-lg bg-sky-500 text-white text-sm font-medium shadow-sm shadow-sky-500/25 hover:shadow-sky-500/30 transition-all duration-200"
                        onClick={() => {
                          document
                            .querySelectorAll(".equipment-item")
                            .forEach((item) => {
                              item.style.display = "flex";
                              item.classList.remove(
                                "ring-2",
                                "ring-sky-500",
                                "bg-sky-50"
                              );
                            });
                        }}
                      >
                        Show All
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {equipmentData.map((equipment, index) => (
                        <div
                          key={equipment.id}
                          data-id={equipment.id}
                          className="equipment-item p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 cursor-pointer transition-all duration-200 group"
                          onClick={() => focusOnEquipment(equipment.id)}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-sky-600 group-hover:text-sky-700 transition-colors duration-200">
                              {equipment.name}
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                STATUS_COLORS[equipment.status].bg
                              } ${STATUS_COLORS[equipment.status].text}`}
                            >
                              {equipment.status}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div>
                              <strong>Type:</strong> {equipment.type}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {equipment.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-sky-600">
                {modalTitle}
              </h3>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-400 hover:text-slate-600"
                onClick={closeModal}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 mb-6">{modalMessage}</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors duration-200 shadow-sm shadow-sky-500/25"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {ticketModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTicketModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
            <div className="sticky top-0 bg-gradient-to-r from-gray-500 to-gray-900 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">🎫 RAISE IT TICKET</h3>
                  <p className="text-gray-100 mt-1">
                    Get immediate assistance from our support team
                  </p>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-600 transition-colors duration-200 text-white"
                  onClick={closeTicketModal}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) =>
                    handleTicketInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Access and Permission">
                    Access and Permission
                  </option>
                  <option value="Network & Connectivity">
                    Network & Connectivity
                  </option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "Low",
                      color: "bg-green-100 text-green-800 border-green-300",
                    },
                    {
                      value: "Medium",
                      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    },
                    {
                      value: "High",
                      color: "bg-red-100 text-red-800 border-red-300",
                    },
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() =>
                        handleTicketInputChange("priority", priority.value)
                      }
                      className={`p-3 rounded-lg border-2 transition-all duration-200 font-semibold ${
                        ticketForm.priority === priority.value
                          ? `${priority.color} border-current scale-105`
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {priority.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) =>
                    handleTicketInputChange("subject", e.target.value)
                  }
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) =>
                    handleTicketInputChange("description", e.target.value)
                  }
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Related Equipment (Optional)
                  </label>
                  <select
                    value={ticketForm.equipmentId}
                    onChange={(e) =>
                      handleTicketInputChange("equipmentId", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentData.map((equipment) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Related Flight (Optional)
                  </label>
                  <select
                    value={ticketForm.flightNo}
                    onChange={(e) =>
                      handleTicketInputChange("flightNo", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select Flight</option>
                    {flightData.map((flight) => (
                      <option key={flight.flightNo} value={flight.flightNo}>
                        {flight.flightNo} - {flight.route}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-slate-600 font-medium">
                        {ticketForm.attachments
                          ? ticketForm.attachments.name
                          : "Click to upload files"}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        JPG, PNG, PDF, DOC (Max 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={closeTicketModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTicket}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/30 transition-all duration-200 hover:scale-105"
                >
                  🎫 SUBMIT TICKET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TicketConfirmationPopup
        isOpen={showTicketConfirmation}
        onClose={handleCloseConfirmation}
        onRaiseAnother={handleRaiseAnotherTicket}
      />
      

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 0.5s ease-out;
        }

        #navbar.scrolled {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
      `}</style>
      {/* Add this at the end of your component, before the closing </div> */}
      <footer className="bg-white py-4 mt-8 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">
              &copy; {new Date().getFullYear()} All rights reserved by Bird Group Pvt Ltd
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;