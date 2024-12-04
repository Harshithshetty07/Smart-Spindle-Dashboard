// components/TemperatureGauge.js
import React from "react";

const TemperatureGauge = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-64 p-4 bg-gray-400 rounded-md shadow-lg">
        {/* Display */}
        <div className="bg-gray-200 rounded-md shadow-inner p-4">
          {/* Upper Section (OUT) */}
          <div className="flex justify-between items-center border-b border-gray-500 pb-2 mb-2">
            <div className="text-4xl font-mono text-black">28.2</div>
            <div className="text-xs text-black font-semibold">
              <div>°C</div>
              <div className="text-right">OUT</div>
            </div>
          </div>
          {/* Lower Section (IN) */}
          <div className="flex justify-between items-center">
            <div className="text-4xl font-mono text-black">23.4</div>
            <div className="text-xs text-black font-semibold">
              <div>°C</div>
              <div className="text-right">IN</div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-center mt-4">
          <button className="w-6 h-6 bg-gray-600 rounded-full mx-2 shadow-md"></button>
          <button className="w-6 h-6 bg-gray-600 rounded-full mx-2 shadow-md"></button>
        </div>
      </div>
    </div>
  );
};

export default TemperatureGauge;
