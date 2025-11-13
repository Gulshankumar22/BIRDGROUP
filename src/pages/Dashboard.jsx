import React from 'react';
import KPICards from '../components/dashboard/KPICards';
import MISCards from '../components/dashboard/MISCards';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>
      <KPICards />
      <MISCards />
    </div>
  );
};

export default Dashboard;