'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const VibrationSpectrogram = () => {
  const [isClient, setIsClient] = useState(false);
  const [spectrogram, setSpectrogram] = useState([]);

  // Memoize constant data to prevent unnecessary re-renders
  const timeData = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const frequencyData = useMemo(() => Array.from({ length: 100 }, (_, i) => i * 10), []);

  // Fixed color bar configuration to prevent moving
  const colorBarConfig = useMemo(() => ({
    title: 'Amplitude',
    tick0: 0,
    dtick: 30, // Fixed interval between ticks
    tickvals: [10, 25, 50, 75], // Evenly spaced fixed values
    ticktext: ['10', '25', '50', '75'], // Corresponding text labels
    range: [0, 100] // Fixed range to prevent scaling
  }), []);

  // Optimized update function using useCallback
  const updateSpectrogram = useCallback(() => {
    const newSpectrogram = frequencyData.map((_, freqIdx) =>
      timeData.map((_, timeIdx) => {
        // Introduce more randomness and time-dependent variation
        const value = (
          Math.sin((freqIdx / 10 + timeIdx + Date.now() / 1000) / 5) * 100 + 
          Math.random() * 50 + 
          (frequencyData[freqIdx] / 4)
        );
        // Clip the value to ensure it stays within the predefined range
        return Math.max(0, Math.min(100, value));
      })
    );
    
    setSpectrogram(newSpectrogram);
  }, [timeData, frequencyData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      updateSpectrogram();
      
      const intervalId = setInterval(updateSpectrogram, 500);
      return () => clearInterval(intervalId);
    }
  }, [isClient, updateSpectrogram]);

  if (!isClient) return null;

  // Custom red-blue color scale
  const redBlueColorScale = [
    [0, 'blue'],
    [1, 'red']
  ];

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Plot
        data={[
          {
            z: spectrogram,
            x: timeData,
            y: frequencyData,
            type: 'heatmap',
            colorscale: redBlueColorScale,
            colorbar: colorBarConfig,
            zmin: 0,
            zmax: 100
          },
        ]}
        layout={{
          title: 'Vibration Frequency Spectrogram',
          xaxis: { title: 'Time (s)', rangeslider: { visible: false } },
          yaxis: { title: 'Frequency (Hz)', autorange: 'reversed' },
          paper_bgcolor: 'rgb(240, 240, 240)',
          plot_bgcolor: 'rgb(240, 240, 240)',
          width: '100%',
          height: '100%',
        }}
        config={{ responsive: true }}
        className="min-w-max h-full"
      />
    </div>
  );
};

export default VibrationSpectrogram;