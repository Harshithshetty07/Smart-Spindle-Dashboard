'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TemperatureGauge = () => {
  const [temperature, setTemperature] = useState(50);

  // Function to generate a random temperature
  const generateRandomTemperature = () => {
    return Math.floor(Math.random() * 100); // Random value between 0 and 100
  };

  // Color mapping based on temperature
  const getTemperatureColor = (temp) => {
    if (temp < 30) return 'bg-blue-300';
    if (temp < 50) return 'bg-green-300';
    if (temp < 70) return 'bg-yellow-300';
    return 'bg-red-300';
  };

  // Temperature label
  const getTemperatureLabel = (temp) => {
    if (temp < 30) return 'Cold';
    if (temp < 50) return 'Cool';
    if (temp < 70) return 'Warm';
    return 'Hot';
  };

  // Effect to update temperature randomly every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTemperature(generateRandomTemperature());
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-64 h-96 bg-white rounded-full shadow-2xl border-4 border-gray-200 overflow-hidden">
        {/* Outer Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Water Container */}
          <div className="relative w-5/6 h-5/6 bg-gray-100 rounded-full overflow-hidden">
            {/* Water Level */}
            <motion.div
              key={temperature} // Force re-render on temperature change
              className={`absolute bottom-0 left-0 right-0 ${getTemperatureColor(temperature)} transition-all duration-0`}
              initial={{ height: 0 }}
              animate={{ height: `${temperature}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              }}
            >
              {/* Wave Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
                <div className="wave absolute bottom-0 left-0 right-0 h-full bg-blue-400/50 animate-wave"></div>
                <div className="wave absolute bottom-0 left-0 right-0 h-full bg-blue-400/30 animate-wave-slow"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Temperature Display */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="text-2xl font-bold">{temperature}°F</div>
          <div className="text-sm text-gray-500">{getTemperatureLabel(temperature)}</div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;