'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

function SpectrogramVisualization() {
  const [spectrogramData, setSpectrogramData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div>
      <button onClick={isRunning ? stopDataGeneration : startDataGeneration}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <Plot
        data={[{
          x: spectrogramData.map(d => d.time),
          y: spectrogramData.map(d => d.frequency),
          z: spectrogramData.map(d => d.amplitude),
          type: 'heatmap',
          colorscale: 'Viridis'
        }]}
        layout={{
          title: 'STFT Spectrogram',
          xaxis: { title: 'Time' },
          yaxis: { title: 'Frequency' }
        }}
      />
    </div>
  );
}

export default SpectrogramVisualization;