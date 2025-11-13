import React from 'react';
import GSEMap from '../components/gse/GSEMap';
import EquipmentList from '../components/gse/EquipmentList';

const GSE = () => {
  const handleEquipmentSelect = (equipmentId) => {
    console.log('Selected equipment:', equipmentId);
    // Handle equipment selection logic
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Ground Support Equipment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GSEMap />
        </div>
        <div>
          <EquipmentList onEquipmentSelect={handleEquipmentSelect} />
        </div>
      </div>
    </div>
  );
};

export default GSE;