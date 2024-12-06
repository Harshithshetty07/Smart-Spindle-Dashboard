'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThermometerSun, ThermometerSnowflake } from 'lucide-react';

const TemperatureTwo = () => {
  const [temperatures, setTemperatures] = useState([
    { value: 50, label: 'Temperature 4' },
    { value: 50, label: 'Temperature 5' },
    { value: 50, label: 'Temperature 6' }
  ]);

  // Function to generate a more nuanced random temperature
  const generateRandomTemperature = () => {
    return Math.floor(Math.random() * 70) + 30; // Random value between 30 and 100
  };

  // Gradient and icon selection based on temperature
  const getTemperatureStyle = (temp) => {
    if (temp < 40) return {
      gradient: 'from-blue-500 to-indigo-700',
      icon: <ThermometerSnowflake className="w-16 h-16 text-blue-300" />,
      textColor: 'text-blue-200',
      description: 'Freezing'
    };
    if (temp < 55) return {
      gradient: 'from-green-400 to-teal-600',
      icon: <ThermometerSun className="w-16 h-16 text-green-300" />,
      textColor: 'text-green-200',
      description: 'Cool'
    };
    if (temp < 70) return {
      gradient: 'from-yellow-400 to-orange-500',
      icon: <ThermometerSun className="w-16 h-16 text-yellow-300" />,
      textColor: 'text-yellow-200',
      description: 'Moderate'
    };
    return {
      gradient: 'from-red-500 to-orange-700',
      icon: <ThermometerSun className="w-16 h-16 text-red-300" />,
      textColor: 'text-red-200',
      description: 'Hot'
    };
  };

  // Effect to update temperatures randomly
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTemperatures(prev => prev.map(temp => ({
        ...temp,
        value: generateRandomTemperature()
      })));
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className=" bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="w-full mx-auto">
        
        
        <div className="grid md:grid-cols-3 gap-8">
          {temperatures.map((temp, index) => {
            const tempStyle = getTemperatureStyle(temp.value);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className={`p-6 bg-gradient-to-br ${tempStyle.gradient}`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">{temp.label}</h2>
                    {tempStyle.icon}
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <div className="relative h-48 w-48 mx-auto mb-4">
                    <svg viewBox="0 0 200 200" className="absolute inset-0">
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="90" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="20"
                      />
                      <motion.circle 
                        cx="100" 
                        cy="100" 
                        r="90" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="20"
                        strokeDasharray="565.48" 
                        strokeDashoffset={565.48 - (565.48 * temp.value / 100)}
                        className={`${tempStyle.textColor} transition-all duration-300`}
                        initial={{ strokeDashoffset: 565.48 }}
                        animate={{ strokeDashoffset: 565.48 - (565.48 * temp.value / 100) }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <span className={`text-5xl font-bold ${tempStyle.textColor}`}>
                        {temp.value}°
                      </span>
                      <span className={`text-lg ${tempStyle.textColor} opacity-70`}>
                        {tempStyle.description}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemperatureTwo;