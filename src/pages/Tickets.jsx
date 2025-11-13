import React, { useState } from 'react';
import TicketModal from '../components/tickets/TicketModal';

const Tickets = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Support Tickets</h1>
        <button
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
          onClick={() => setIsTicketModalOpen(true)}
        >
          🎫 RAISE NEW TICKET
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-lg">
        <p className="text-slate-600 text-center py-8">
          Your support tickets will appear here. Raise a new ticket to get started.
        </p>
      </div>

      <TicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
      />
    </div>
  );
};

export default Tickets;