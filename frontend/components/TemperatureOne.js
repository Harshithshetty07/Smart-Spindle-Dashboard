'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplet, Waves } from 'lucide-react';

const TemperatureOne = () => {
  const [temperatures, setTemperatures] = useState([
    { value: 50, label: 'Temperature 1', icon: <Thermometer className="w-16 h-16" /> },
    { value: 50, label: 'Temperature 2', icon: <Droplet className="w-16 h-16" /> },
    { value: 50, label: 'Temperature 3', icon: <Waves className="w-16 h-16" /> }
  ]);

  // Function to generate a random temperature
  const generateRandomTemperature = () => {
    return Math.floor(Math.random() * 100); // Random value between 0 and 100
  };

  // Determine gauge status and color
  const getGaugeStatus = (temp) => {
    if (temp < 30) return { 
      color: 'from-blue-500 to-blue-300', 
      status: 'Stable', 
      textColor: 'text-blue-600' 
    };
    if (temp < 50) return { 
      color: 'from-green-500 to-green-300', 
      status: 'Nominal', 
      textColor: 'text-green-600' 
    };
    if (temp < 70) return { 
      color: 'from-yellow-500 to-yellow-300', 
      status: 'Caution', 
      textColor: 'text-yellow-600' 
    };
    return { 
      color: 'from-red-800 to-red-400', 
      status: 'Critical', 
      textColor: 'text-red-600' 
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
    <div className=" bg-gradient-to-br from-zinc-900 to-zinc-800 p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-wide uppercase">
            Advanced Temperature Monitoring System
          </h1>
          <p className="text-gray-400 mt-2">Real-time environmental tracking</p>
        </div>

        {/* Gauges Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {temperatures.map((temp, index) => {
            const { color, status, textColor } = getGaugeStatus(temp.value);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2 
                }}
                className="bg-zinc-800 rounded-2xl shadow-2xl border-2 border-zinc-700 overflow-hidden"
              >
                {/* Gauge Header */}
                <div className={`p-4 flex items-center justify-between bg-gradient-to-r ${color}`}>
                  <div className="flex items-center space-x-4">
                    {temp.icon}
                    <h2 className="text-xl font-semibold text-white">{temp.label}</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${textColor} bg-white/20`}>
                    {status}
                  </div>
                </div>

                {/* Gauge Visualization */}
                <div className="relative h-72 p-6">
                  {/* Circular Progress */}
                  <div className="absolute inset-6 bg-zinc-900 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-zinc-800 rounded-full relative overflow-hidden">
                      {/* Temperature Fill */}
                      <motion.div
                        key={temp.value}
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-b ${color}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${temp.value}%` }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 20 
                        }}
                      >
                        {/* Glowing Liquid Effect */}
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </motion.div>

                      {/* Temperature Value */}
                      <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                        <div className="text-3xl font-bold text-white">{temp.value}°F</div>
                      </div>
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

export default TemperatureOne;