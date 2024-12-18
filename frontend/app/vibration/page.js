'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

function SpectrogramVisualization() {
  const [spectrogramData, setSpectrogramData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  // Responsive window size tracking
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startDataGeneration = async () => {
    try {
      const response = await axios.get('https://cmti-edge.online/intelipod/DataHandle.php?action=start');
      setSpectrogramData(response.data.spectrogramData);
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting data generation', error);
    }
  };

  const stopDataGeneration = async () => {
    try {
      await axios.get('https://cmti-edge.online/intelipod/DataHandle.php?action=stop');
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping data generation', error);
    }
  };

  const fetchData = async () => {
    if (isRunning) {
      try {
        const response = await axios.get('https://cmti-edge.online/intelipod/DataHandle.php?action=fetch');
        setSpectrogramData(response.data.spectrogramData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Dynamic layout configuration
  const getLayoutConfig = () => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

    return {
      title: 'STFT Spectrogram',
      xaxis: { 
        title: 'Time',
        titlefont: { size: isMobile ? 10 : isTablet ? 12 : 14 }
      },
      yaxis: { 
        title: 'Frequency',
        titlefont: { size: isMobile ? 10 : isTablet ? 12 : 14 }
      },
      margin: { 
        l: isMobile ? 25 : 50, 
        r: isMobile ? 25 : 50, 
        t: isMobile ? 25 : 50, 
        b: isMobile ? 25 : 50 
      },
      autosize: true,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex-grow overflow-hidden w-full h-full">
        <Plot
          data={[{
            x: spectrogramData.map(d => d.time),
            y: spectrogramData.map(d => d.frequency),
            z: spectrogramData.map(d => d.amplitude),
            type: 'heatmap',
            colorscale: 'Viridis'
          }]}
          layout={getLayoutConfig()}
          style={{ 
            width: '100%', 
            height: windowSize.width < 768 ? '80%' : '90%' 
          }}
          config={{ 
            responsive: true,
            displayModeBar: false 
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={isRunning ? stopDataGeneration : startDataGeneration} 
          className="
            w-48 md:w-64 
            h-16 md:h-16 
            bg-white 
            text-black 
            text-lg md:text-xl 
            rounded-lg 
            shadow-lg 
            hover:bg-gray-200 
            transition-colors 
            duration-300 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-opacity-50
          "
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
}

export default SpectrogramVisualization;