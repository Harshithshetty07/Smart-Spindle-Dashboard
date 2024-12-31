'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const SpectrogramVisualization = () => {
  const [spectrogramData, setSpectrogramData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('1');

  // Available channels
  const channels = ['1', '2', '3', '4'];

  const startDataGeneration = async () => {
    try {
      const response = await axios.get(`https://cmti-edge.online/intelipod/DataHandle.php?action=start&channel=${selectedChannel}`);
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
        const response = await axios.get(`https://cmti-edge.online/intelipod/DataHandle.php?action=fetch&channel=${selectedChannel}`);
        setSpectrogramData(response.data.spectrogramData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [isRunning, selectedChannel]);

  const prepareHeatmapData = () => {
    const timeValues = spectrogramData.map(d => d.time);
    const frequencyValues = spectrogramData.map(d => d.frequency);
    const amplitudeValues = spectrogramData.map(d => d.amplitude);

    return [{
      x: timeValues,
      y: frequencyValues,
      z: amplitudeValues,
      type: 'heatmap',
      colorscale: 'Viridis'
    }];
  };

  const prepare3DSurfaceData = () => {
    const timeValues = [...new Set(spectrogramData.map(d => d.time))];
    const frequencyValues = [...new Set(spectrogramData.map(d => d.frequency))];
    
    const zData = timeValues.map(time => 
      frequencyValues.map(freq => {
        const matchingPoint = spectrogramData.find(
          d => Math.abs(d.time - time) < 0.001 && Math.abs(d.frequency - freq) < 0.001
        );
        return matchingPoint ? matchingPoint.amplitude : 0;
      })
    );

    return [{
      z: zData,
      type: 'surface',
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: "#42f462",
          project: { z: true }
        }
      }
    }];
  };

  const heatmapLayout = {
    title: `Channel ${selectedChannel} - Spectrogram Heatmap`,
    xaxis: { title: 'Time' },
    yaxis: { title: 'Frequency' }
  };

  const surfaceLayout = {
    title: `Channel ${selectedChannel} - STFT 3D Surface Plot`,
    scene: {
      xaxis: { title: 'Time' },
      yaxis: { title: 'Frequency' },
      zaxis: { title: 'Amplitude' },
      camera: { eye: { x: 1.87, y: 0.88, z: -0.64 } }
    },
    autosize: false,
    width: 800,
    height: 600,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90,
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>
                Channel {channel}
              </option>
            ))}
          </select>
          
          <button 
            className={`px-4 py-2 rounded ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            onClick={isRunning ? stopDataGeneration : startDataGeneration}
          >
            {isRunning ? 'Stop' : 'Start'} Data Generation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">2D Spectrogram Heatmap</h2>
          <Plot
            data={prepareHeatmapData()}
            layout={heatmapLayout}
            className="w-full"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">3D Surface Plot</h2>
          <Plot
            data={prepare3DSurfaceData()}
            layout={surfaceLayout}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SpectrogramVisualization;