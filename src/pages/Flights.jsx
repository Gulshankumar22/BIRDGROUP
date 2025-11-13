import React from 'react';
import FlightTable from '../components/flights/FlightTable';
import FlightFilters from '../components/flights/FlightFilters';

const Flights = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Flight Operations</h1>
        <FlightFilters />
      </div>
      <FlightTable />
    </div>
  );
};

export default Flights;