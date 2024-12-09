'use client'

import React, { useState, useEffect } from 'react';

const VoltageGauge = () => {
  const [voltage, setVoltage] = useState(0);

  // Simulate voltage changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random voltage between 0 and 250
      const newVoltage = Math.min(250, Math.max(0, Math.random() * 250 + Math.sin(Date.now() / 1000) * 50));
      setVoltage(newVoltage);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate needle rotation based on voltage (0-250V)
  const calculateRotation = () => {
    // Map 0-250V to -135 to 135 degrees
    return Math.min(135, Math.max(-135, (voltage / 250) * 270 - 135));
  };

  // Color coding for voltage levels
  const getVoltageColor = () => {
    if (voltage < 50) return 'text-green-500';
    if (voltage < 100) return 'text-lime-500';
    if (voltage < 150) return 'text-yellow-500';
    if (voltage < 200) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="relative w-96 h-96 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border-8 border-gray-700">
        {/* Gauge Background */}
        <div className="absolute inset-0 rounded-full bg-opacity-20 bg-white"></div>

        {/* Voltage Scale Markers */}
        {[...Array(11)].map((_, i) => {
          const angle = -135 + i * 27;
          return (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div 
                className={`absolute w-1 h-4 bg-white bg-opacity-50 
                  ${i <= voltage / 25 ? 'bg-opacity-100' : 'bg-opacity-20'}
                  origin-bottom`} 
                style={{ 
                  left: 'calc(50% - 2px)', 
                  bottom: '50%', 
                  transformOrigin: 'bottom' 
                }}
              ></div>
            </div>
          );
        })}

        {/* Needle */}
        <div 
          className={`absolute bottom-1/2 left-1/2 w-1 transform origin-bottom 
            transition-transform duration-500 ease-in-out ${getVoltageColor()}`}
          style={{ 
            height: '45%', 
            transform: `translateX(-50%) rotate(${calculateRotation()}deg)` 
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Voltage Display */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center">
          <div className={`text-4xl font-bold ${getVoltageColor()}`}>
            {voltage.toFixed(1)}V
          </div>
          <div className="text-sm text-gray-400">Voltage</div>
        </div>

        {/* Gauge Labels */}
        <div className="absolute inset-0">
          {[0, 50, 100, 150, 200, 250].map((val, i) => {
            const angle = -135 + (val / 250) * 270;
            return (
              <div
                key={val}
                className="absolute w-full h-full text-white text-opacity-50"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div 
                  className="absolute text-xs" 
                  style={{ 
                    top: '15%', 
                    left: 'calc(50% - 10px)', 
                    transform: `rotate(${-angle}deg)` 
                  }}
                >
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VoltageGauge;