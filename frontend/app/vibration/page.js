'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { interpolateMagma } from 'd3-scale-chromatic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const VibrationSpectrogram = () => {
  const [isClient, setIsClient] = useState(false);
  const [spectrogram, setSpectrogram] = useState([]);
  const [minMax, setMinMax] = useState([0, 0]);

  // Memoize constant data to prevent unnecessary re-renders
  const timeData = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const frequencyData = useMemo(() => Array.from({ length: 100 }, (_, i) => i * 10), []);

  // Optimized update function using useCallback
  const updateSpectrogram = useCallback(() => {
    const newSpectrogram = frequencyData.map((_, freqIdx) =>
      timeData.map((_, timeIdx) => {
        const value = (Math.sin((freqIdx / 10 + timeIdx) / 5) * 100) + (frequencyData[freqIdx] / 4);
        return value;
      })
    );

    const minValue = Math.min(...newSpectrogram.flat());
    const maxValue = Math.max(...newSpectrogram.flat());
    setMinMax([minValue, maxValue]);
    setSpectrogram(newSpectrogram);
  }, [timeData, frequencyData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      updateSpectrogram();
      const intervalId = setInterval(updateSpectrogram, 100);
      return () => clearInterval(intervalId);
    }
  }, [isClient, updateSpectrogram]);

  if (!isClient) return null;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Plot
        data={[
          {
            z: spectrogram,
            x: timeData,
            y: frequencyData,
            type: 'heatmap',
            colorscale: interpolateMagma,
            colorbar: {
              title: 'Amplitude',
              tickvals: [minMax[0], (minMax[0] + minMax[1]) / 2, minMax[1]],
              ticktext: [`Min: ${minMax[0].toFixed(2)}`, 'Mid', `Max: ${minMax[1].toFixed(2)}`],
            },
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
        className="w-full h-full"
      />
    </div>
  );
};

export default VibrationSpectrogram;