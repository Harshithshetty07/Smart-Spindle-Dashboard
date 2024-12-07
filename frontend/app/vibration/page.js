
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly with no SSR
const Plot = dynamic(
  () => import('react-plotly.js').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingPlaceholder /> }
);

// Loading component
const LoadingPlaceholder = () => (
  <div className="w-full bg-black">
    <div className="h-[600px] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p>Loading Spectrogram...</p>
      </div>
    </div>
  </div>
);

const SpectrogramContent = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.95, 1500) : 1000,
    height: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.7, 600) : 500
  });
  const [spectrogramData, setSpectrogramData] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth * 0.95, 1500),
        height: Math.min(window.innerHeight * 0.7, 600)
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateSpectrogramData = () => {
    const totalDataPoints = 10000;
    const duration = 60; // 1 minute in seconds
    
    // Generate time data
    const xData = Array.from({ length: 200 }, (_, i) => i * (duration / 200));
    
    // Generate frequency data
    const yData = Array.from({ length: 200 }, (_, i) => i * (200 / 200));
    
    // Initialize zData with random values
    const zData = Array(200).fill().map(() => 
      Array(200).fill(0).map(() => Math.random() * 8)
    );

    // Add some structured randomness to simulate signal characteristics
    const signalTypes = [
      { timeStart: 10, timeEnd: 20, freqStart: 50, freqEnd: 100, intensity: 6 },
      { timeStart: 30, timeEnd: 40, freqStart: 100, freqEnd: 150, intensity: 5 },
      { timeStart: 45, timeEnd: 55, freqStart: 0, freqEnd: 50, intensity: 4 }
    ];

    signalTypes.forEach(({ timeStart, timeEnd, freqStart, freqEnd, intensity }) => {
      const timeIndices = xData
        .map((t, i) => t >= timeStart && t < timeEnd ? i : -1)
        .filter(i => i !== -1);

      for (let t of timeIndices) {
        for (let f = Math.floor(freqStart / 200 * 200); f < Math.floor(freqEnd / 200 * 200); f++) {
          // Create variation with sine wave, randomness, and time-based modulation
          const oscillation = Math.sin(2 * Math.PI * Date.now() / 1000) * 2;
          const timeModulation = Math.sin(2 * Math.PI * f / 200) * 1.5;
          zData[f][t] = Math.max(10, intensity + oscillation + timeModulation + Math.random() * 2);
        }
      }
    });

    return { xData, yData, zData };
  };

  // Update data every second
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setSpectrogramData(generateSpectrogramData());
    }, 1000);

    // Initial data generation
    setSpectrogramData(generateSpectrogramData());

    return () => clearInterval(updateInterval);
  }, []);

  // If data is not yet generated, return loading
  if (!spectrogramData) return <LoadingPlaceholder />;

  const { xData, yData, zData } = spectrogramData;

  return (
    <Plot
      data={[{
        z: zData,
        x: xData,
        y: yData,
        type: 'heatmap',
        colorscale: [
          [0, 'rgb(0, 0, 150)'],
          [0.2, 'rgb(0, 0, 255)'],
          [0.3, 'rgb(0, 255, 255)'],
          [0.4, 'rgb(0, 255, 0)'],
          [0.6, 'rgb(255, 255, 0)'],
          [0.8, 'rgb(255, 0, 0)'],
          [1, 'rgb(128, 0, 0)']
        ],
        colorbar: {
          title: {
            text: "Amplitude",
            font: { color: 'white' }
          },
          titleside: 'right',
          len: 0.9,
          thickness: 20,
        },
        zmin: 0,
        zmax: 8
      }]}
      layout={{
        title: {
          text: 'Dynamic Signal Spectrogram (Real-time Updates)',
          font: {
            size: dimensions.width < 768 ? 16 : 24,
            color: 'white',
          }
        },
        width: dimensions.width,
        height: dimensions.height,
        xaxis: {
          title: {
            text: 'Time (s)',
            font: {
              size: dimensions.width < 768 ? 12 : 14,
              color: 'white'
            }
          },
          range: [0, 60],
          showgrid: false,
          color: 'white'
        },
        yaxis: {
          title: {
            text: 'Frequency [Hz]',
            font: {
              size: dimensions.width < 768 ? 12 : 14,
              color: 'white'
            }
          },
          range: [0, 200],
          showgrid: false,
          color: 'white'
        },
        margin: {
          l: dimensions.width < 768 ? 50 : 70,
          r: dimensions.width < 768 ? 50 : 90,
          b: dimensions.width < 768 ? 40 : 80,
          t: dimensions.width < 768 ? 80 : 80,
        },
        plot_bgcolor: 'rgb(0, 0, 150)',
        paper_bgcolor: 'black',
        autosize: true
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'],
        toImageButtonOptions: {
          format: 'png',
          filename: 'dynamic_spectrogram',
          height: dimensions.height,
          width: dimensions.width,
          scale: 2
        }
      }}
      className="w-full h-full"
    />
  );
};

const Spectrogram = () => {
  return (
    <div className="w-full bg-transparent px-[2%] xl:px-[3%] 3xl:px-[12%] flex justify-center mt-5 3xl:mt-8">
      <div className="w-full relative">
        <Suspense fallback={<LoadingPlaceholder />}>
          <SpectrogramContent />
        </Suspense>
      </div>
    </div>
  );
};

export default Spectrogram;