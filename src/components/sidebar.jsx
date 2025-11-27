// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'gateway', label: 'Gateway' },
    { id: 'schedule-setup', label: 'Schedule Setup' },
    { id: 'schedule-equipment', label: 'Schedule Equipment' },
    { id: 'cargo-section', label: 'Cargo Section 5' },
    { id: 'invoicing', label: 'Invoicing' },
    { id: 'alert-setup', label: 'Alert Setup' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Creation Menu</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-6 py-3 transition duration-200 ${
              activeSection === item.id
                ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;