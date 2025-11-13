import React, { useState } from 'react';
import FlightStatusChart from '../components/charts/FlightStatusChart';
import PerformanceChart from '../components/charts/PerformanceChart';

const Reports = () => {
  const [flightChartType, setFlightChartType] = useState('pie');
  const [performanceChartType, setPerformanceChartType] = useState('line');

  const toggleFlightChartType = (type) => {
    setFlightChartType(type);
  };

  const togglePerformanceChartType = () => {
    setPerformanceChartType(prev => prev === 'line' ? 'bar' : 'line');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FlightStatusChart 
          chartType={flightChartType} 
          onChartTypeChange={toggleFlightChartType}
        />
        <PerformanceChart 
          chartType={performanceChartType}
          onChartTypeChange={togglePerformanceChartType}
        />
      </div>

      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="text-3xl">🚀</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Advanced Analytics Coming Soon
            </h3>
            <p className="text-sky-100 text-sm">
              More advanced 3D visualizations and predictive analytics will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;