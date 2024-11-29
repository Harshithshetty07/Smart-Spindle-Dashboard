'use client'

import React, { useState } from 'react';

const TemperatureGauge = ({ initialTemp = 20, minTemp = -10, maxTemp = 40 }) => {
  const [temperature, setTemperature] = useState(initialTemp);

  // Determine temperature color and intensity
  const getTemperatureColor = (temp) => {
    if (temp < 0) return 'bg-blue-500';
    if (temp < 10) return 'bg-blue-300';
    if (temp < 20) return 'bg-green-300';
    if (temp < 30) return 'bg-yellow-300';
    return 'bg-red-500';
  };

  // Calculate rotation and color based on temperature
  const rotationDegree = ((temperature - minTemp) / (maxTemp - minTemp)) * 270 - 135;
  const currentColor = getTemperatureColor(temperature);

  // Handle temperature change
  const handleTemperatureChange = (e) => {
    setTemperature(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="relative w-64 h-64 rounded-full border-8 border-gray-300 shadow-lg">
        {/* Gauge Background */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: 'conic-gradient(from -135deg, #10B981 0%, #FBBF24 50%, #EF4444 100%)',
            transform: 'rotate(45deg)'
          }}
        >
          {/* Needle */}
          <div 
            className={`absolute bottom-1/2 left-1/2 origin-bottom w-1 h-32 ${currentColor}`}
            style={{
              transform: `translateX(-50%) rotate(${rotationDegree}deg)`
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800"></div>
          </div>
        </div>

        {/* Temperature Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {temperature}°C
          </div>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="mt-6 w-64">
        <input 
          type="range"
          min={minTemp}
          max={maxTemp}
          value={temperature}
          onChange={handleTemperatureChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{minTemp}°C</span>
          <span>{maxTemp}°C</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;