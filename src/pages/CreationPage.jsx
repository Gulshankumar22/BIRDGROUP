// pages/CreationPage.js
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Gateway from '../components/Gateway';
import ScheduleSetup from '../components/ScheduleSetup';

const CreationPage = () => {
  const [activeSection, setActiveSection] = useState('gateway');

  const renderContent = () => {
    switch (activeSection) {
      case 'gateway':
        return <Gateway />;
      case 'schedule-setup':
        return <ScheduleSetup />;
      case 'schedule-equipment':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Schedule Equipment</h2></div>;
      case 'cargo-section':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Cargo Section 5</h2></div>;
      case 'invoicing':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Invoicing</h2></div>;
      case 'alert-setup':
        return <div className="p-6"><h2 className="text-2xl font-bold text-gray-800">Alert Setup</h2></div>;
      default:
        return <Gateway />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default CreationPage;