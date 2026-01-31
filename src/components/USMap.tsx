
import React, { useState } from 'react';

const USMap = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  console.log('USMap component is rendering - Using enhanced map image');
  
  const handleStateClick = (stateName: string) => {
    console.log(`Clicked on ${stateName}`);
    setSelectedState(stateName);
  };

  const states = [
    { name: 'California', x: '8%', y: '45%', width: '18%', height: '33.75%' },
    { name: 'Texas', x: '35%', y: '60%', width: '27%', height: '27%' },
    { name: 'Florida', x: '75%', y: '75%', width: '18%', height: '18%' },
    { name: 'New York', x: '78%', y: '25%', width: '13.5%', height: '13.5%' },
    { name: 'Alaska', x: '5%', y: '75%', width: '18%', height: '22.5%' },
    { name: 'Hawaii', x: '15%', y: '80%', width: '9%', height: '9%' },
    { name: 'Washington', x: '12%', y: '8%', width: '18%', height: '18%' },
    { name: 'Oregon', x: '8%', y: '20%', width: '18%', height: '22.5%' },
    { name: 'Nevada', x: '12%', y: '35%', width: '18%', height: '27%' },
    { name: 'Arizona', x: '20%', y: '55%', width: '18%', height: '22.5%' },
    { name: 'Montana', x: '25%', y: '15%', width: '27%', height: '22.5%' },
    { name: 'Idaho', x: '20%', y: '20%', width: '18%', height: '27%' },
    { name: 'Wyoming', x: '28%', y: '30%', width: '18%', height: '22.5%' },
    { name: 'Colorado', x: '30%', y: '42%', width: '22.5%', height: '22.5%' },
    { name: 'New Mexico', x: '28%', y: '55%', width: '18%', height: '22.5%' },
    { name: 'North Dakota', x: '40%', y: '18%', width: '18%', height: '18%' },
    { name: 'South Dakota', x: '40%', y: '30%', width: '18%', height: '18%' },
    { name: 'Nebraska', x: '42%', y: '40%', width: '18%', height: '18%' },
    { name: 'Kansas', x: '42%', y: '48%', width: '18%', height: '18%' },
    { name: 'Oklahoma', x: '42%', y: '55%', width: '18%', height: '18%' },
    { name: 'Minnesota', x: '48%', y: '22%', width: '18%', height: '22.5%' },
    { name: 'Iowa', x: '50%', y: '35%', width: '18%', height: '18%' },
    { name: 'Missouri', x: '50%', y: '45%', width: '18%', height: '18%' },
    { name: 'Arkansas', x: '50%', y: '55%', width: '18%', height: '18%' },
    { name: 'Louisiana', x: '50%', y: '70%', width: '18%', height: '18%' },
    { name: 'Wisconsin', x: '55%', y: '25%', width: '18%', height: '22.5%' },
    { name: 'Illinois', x: '58%', y: '35%', width: '13.5%', height: '27%' },
    { name: 'Michigan', x: '62%', y: '25%', width: '22.5%', height: '27%' },
    { name: 'Indiana', x: '65%', y: '38%', width: '13.5%', height: '22.5%' },
    { name: 'Ohio', x: '70%', y: '35%', width: '18%', height: '22.5%' },
    { name: 'Kentucky', x: '68%', y: '48%', width: '18%', height: '13.5%' },
    { name: 'Tennessee', x: '65%', y: '52%', width: '22.5%', height: '13.5%' },
    { name: 'Mississippi', x: '58%', y: '62%', width: '13.5%', height: '22.5%' },
    { name: 'Alabama', x: '65%', y: '62%', width: '13.5%', height: '22.5%' },
    { name: 'Georgia', x: '72%', y: '58%', width: '18%', height: '27%' },
    { name: 'South Carolina', x: '75%', y: '55%', width: '13.5%', height: '18%' },
    { name: 'North Carolina', x: '75%', y: '45%', width: '22.5%', height: '18%' },
    { name: 'Virginia', x: '75%', y: '38%', width: '18%', height: '18%' },
    { name: 'West Virginia', x: '72%', y: '42%', width: '13.5%', height: '13.5%' },
    { name: 'Maryland', x: '78%', y: '35%', width: '9%', height: '9%' },
    { name: 'Delaware', x: '82%', y: '35%', width: '4.5%', height: '9%' },
    { name: 'Pennsylvania', x: '75%', y: '32%', width: '18%', height: '13.5%' },
    { name: 'New Jersey', x: '80%', y: '32%', width: '6.75%', height: '13.5%' },
    { name: 'Connecticut', x: '83%', y: '28%', width: '6.75%', height: '6.75%' },
    { name: 'Rhode Island', x: '85%', y: '27%', width: '4.5%', height: '4.5%' },
    { name: 'Massachusetts', x: '83%', y: '25%', width: '11.25%', height: '6.75%' },
    { name: 'Vermont', x: '81%', y: '22%', width: '6.75%', height: '9%' },
    { name: 'New Hampshire', x: '83%', y: '20%', width: '6.75%', height: '9%' },
    { name: 'Maine', x: '85%', y: '15%', width: '11.25%', height: '18%' }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl">
        <div 
          className="relative w-full rounded-xl overflow-hidden shadow-2xl"
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(148, 163, 184, 0.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10"></div>
          
          <img 
            src="/lovable-uploads/3f978e59-2f64-494a-bcf6-019418063f40.png"
            alt="United States Map"
            className="w-full h-auto relative z-10"
            style={{ 
              maxHeight: '450px', 
              objectFit: 'contain',
              filter: 'contrast(1.2) brightness(0.8) saturate(1.1) hue-rotate(210deg)',
              mixBlendMode: 'multiply'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-700/10"></div>
          
          {/* Interactive overlay areas */}
          <div className="absolute inset-0 z-20">
            {states.map((state) => (
              <div
                key={state.name}
                className={`absolute cursor-pointer transition-all duration-500 rounded-lg transform ${
                  selectedState === state.name
                    ? 'bg-blue-500/80 ring-4 ring-blue-400/60 shadow-2xl shadow-blue-500/50 scale-105 z-30'
                    : 'hover:bg-blue-400/60 hover:shadow-xl hover:shadow-blue-400/30 hover:scale-102 hover:z-20'
                }`}
                style={{
                  left: state.x,
                  top: state.y,
                  width: state.width,
                  height: state.height,
                }}
                onClick={() => handleStateClick(state.name)}
                title={state.name}
              />
            ))}
          </div>
          
          {/* Decorative border glow */}
          <div className="absolute inset-0 rounded-xl border border-slate-500/30 pointer-events-none"></div>
        </div>
      </div>
      
      {selectedState && (
        <div className="mt-6 text-center animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600/40 to-slate-600/40 border border-blue-500/70 rounded-xl px-6 py-3 backdrop-blur-md shadow-lg">
            <span className="text-white font-bold text-lg tracking-wide">Selected: {selectedState}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default USMap;
