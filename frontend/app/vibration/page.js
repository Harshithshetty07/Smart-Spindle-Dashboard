'use client'

import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

// Register necessary Chart.js elements
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler);

const LiveSpectrogram = () => {
  const chartRef = useRef(null); // Reference to chart for gradient
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 32 }, (_, i) => ` ${i + 1}`),
    datasets: [
      {
        label: "Frequency Intensity",
        data: Array.from({ length: 32 }, () => Math.random() * 100),
        borderWidth: 2,
        borderColor: "rgba(255, 0, 0, 1)", // Default red border
        backgroundColor: "rgba(0, 0, 255, 0.2)", // Placeholder for gradient
        tension: 0.3, // Smooth curves
        fill: true, // Enable fill for gradient
      },
    ],
  });

  // Dynamically generate gradient for the chart
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)"); // Red (high frequency)
      gradient.addColorStop(1, "rgba(0, 0, 255, 0.8)"); // Blue (low frequency)
      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            backgroundColor: gradient, // Apply gradient
            borderColor: "rgba(255, 255, 255, 0.8)", // White border for visibility
          },
        ],
      }));
    }
  }, [chartRef]);

  // Update the chart data every second
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: Array.from({ length: 32 }, () => Math.random() * 100), // Update data dynamically
          },
        ],
      }));
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-center text-2xl font-bold mb-4">Live Spectrogram</h2>
      <div className="relative">
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // White grid lines
                ticks: { color: "white" },
                title: { display: true, text: "Time ", color: "white" },
              },
              y: {
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // White grid lines
                ticks: { color: "white" },
                title: { display: true, text: "Frequency (hz)", color: "white" },
              },
            },
            plugins: {
              legend: { display: false }, // Hide legend
            },
            elements: {
              line: {
                borderWidth: 2, // Line thickness
              },
              point: {
                radius: 2, // Point size
                hoverRadius: 4,
                backgroundColor: "white", // Points are white
              },
            },
          }}
          height={400}
        />
      </div>
    </div>
  );
};

export default LiveSpectrogram;
