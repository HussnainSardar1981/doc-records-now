
import React from 'react';

interface StatesListProps {
  onStateSelect: (state: string) => void;
  selectedState: string | null;
}

const StatesList = ({ onStateSelect, selectedState }: StatesListProps) => {
  const handleStateClick = (stateName: string) => {
    console.log(`Clicked on ${stateName}`);
    onStateSelect(stateName);
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];


  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {states.map((state) => (
          <div
            key={state}
            className={`cursor-pointer p-3 rounded-lg transition-all duration-300 text-sm ${
              selectedState === state
                ? 'bg-blue-600/80 text-white shadow-lg'
                : 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 hover:text-white'
            }`}
            onClick={() => handleStateClick(state)}
          >
            {state}
          </div>
        ))}
      </div>
      
      {selectedState && (
        <div className="mt-4 text-center">
          <div className="bg-gradient-to-r from-blue-600/40 to-slate-600/40 border border-blue-500/70 rounded-xl px-4 py-2 backdrop-blur-md shadow-lg">
            <span className="text-white font-bold text-sm">Selected: {selectedState}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatesList;
