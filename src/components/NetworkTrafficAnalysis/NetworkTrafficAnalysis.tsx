/* import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid, Typography } from '@mui/material';


Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const mockTrafficData = [
  { capturedTimestamp: "2025-02-28T08:00", bytesTransferred: 200 },
  { capturedTimestamp: "2025-02-28T09:00", bytesTransferred: 400 },
  { capturedTimestamp: "2025-02-28T10:00", bytesTransferred: 600 },
  { capturedTimestamp: "2025-02-28T11:00", bytesTransferred: 800 },
  { capturedTimestamp: "2025-02-28T12:00", bytesTransferred: 1000 },
];

const NetworkTrafficAnalysis = () => {
  const [trafficData, setTrafficData] = useState(mockTrafficData);

  const chartData = {
    labels: trafficData.map(data => data.capturedTimestamp),
    datasets: [
      {
        label: 'Network Traffic Over Time',
        data: trafficData.map(data => data.bytesTransferred),
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div>
      <Typography variant="h6">Network Traffic Analysis</Typography>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default NetworkTrafficAnalysis;
 */




/* 
import React, { useEffect, useRef, useState } from 'react';
import { Chart, RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend, Filler } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register the required Chart.js components
Chart.register(RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend, Filler);

const NetworkScanChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);
  const [scanningActive, setScanningActive] = useState(true);
  const [scanPoint, setScanPoint] = useState(0);
  
  // Example security metrics data
  const securityMetrics = {
    labels: Array(12).fill(''),  // Empty labels for months, as we will rotate the scan instead
    datasets: [
      {
        label: 'Current Security Coverage',
        data: [85, 92, 78, 65, 88, 82, 90, 75, 70, 80, 85, 60],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      },
      {
        label: 'Threat Detection',
        data: [65, 59, 90, 81, 56, 55, 72, 60, 65, 70, 60, 65],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  };

  // Animation effect for scan point moving around the chart
  useEffect(() => {
    let animationFrameId: number;
    
    const animateScan = () => {
      if (scanningActive) {
        setScanPoint(prev => (prev + 0.05) % securityMetrics.labels.length);  // Update scan position to rotate
      }
      animationFrameId = requestAnimationFrame(animateScan);
    };
    
    animateScan();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanningActive, securityMetrics.labels.length]);

  // Chart options
  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: {
          color: 'rgba(130, 255, 168, 0.2)',
        },
        grid: {
          color: 'rgba(130, 255, 168, 0.2)',
        },
        pointLabels: {
          color: '#eee',
          font: {
            size: 12
          }
        },
        ticks: {
          backdropColor: 'rgba(0, 0, 0, 0)',
          color: '#5cffb4',
          z: 100,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#eee',
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#5cffb4',
        bodyColor: '#fff',
        borderColor: '#5cffb4',
        borderWidth: 1
      }
    },
    animation: {
      duration: 0
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.2
      }
    }
  };

  // Generate scan pulse data
  const getScanData = () => {
    const datasets = [...securityMetrics.datasets];
    
    if (scanningActive) {
      const currentPointIndex = Math.floor(scanPoint);
      const nextPointIndex = (currentPointIndex + 1) % securityMetrics.labels.length;
      const fraction = scanPoint - currentPointIndex;

      const scanData = Array(securityMetrics.labels.length).fill(0);
      scanData[currentPointIndex] = 100 * (1 - fraction);
      scanData[nextPointIndex] = 100 * fraction;
      
      datasets.push({
        label: 'Active Scan',
        data: scanData,
        backgroundColor: 'rgba(95, 255, 180, 0.5)',
        borderColor: 'rgba(95, 255, 180, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(95, 255, 180, 1)',
        pointRadius: (ctx) => {
          const index = ctx.dataIndex;
          return (index === currentPointIndex || index === nextPointIndex) ? 3 : 0;
        },
        pointHoverRadius: 3,
        fill: false
      });
    }
    
    return {
      labels: securityMetrics.labels,
      datasets
    };
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      height: '500px',
      backgroundColor: '#1a2035',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 0 15px rgba(95, 255, 180, 0.2)'
    }}>
      <div style={{ 
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#5cffb4',
        fontWeight: 'bold',
        fontSize: '18px',
        zIndex: 10
      }}>
        Network Security Scan
      </div>
      
      <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: '#5cffb4',
        zIndex: 10
      }}>
        <button 
          onClick={() => setScanningActive(!scanningActive)}
          style={{
            backgroundColor: scanningActive ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {scanningActive ? 'Stop Scan' : 'Start Scan'}
        </button>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}>
        <Radar
          ref={chartRef}
          data={getScanData()}
          options={options}
          redraw={true}
        />
      </div>
    </div>
  );
};

export default NetworkScanChart;



 */


import React, { useEffect, useRef, useState } from 'react';
import { Chart, RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend, Filler, ChartType } from 'chart.js';
import { Radar } from 'react-chartjs-2';

Chart.register(RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend, Filler);

const NetworkScanChart: React.FC = () => {
  const chartRef = useRef<Chart<"radar", number[], unknown> | null>(null);
  const [scanningActive, setScanningActive] = useState(true);
  const [scanPoint, setScanPoint] = useState(0);

  const securityMetrics = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', ''], 
    datasets: [
      {
        label: 'Current Security Coverage',
        data: [85, 92, 78, 65, 88, 82, 90, 75, 80, 70, 85, 95],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Threat Detection',
        data: [65, 59, 90, 81, 56, 55, 72, 60, 68, 75, 80, 70],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  useEffect(() => {
    let animationFrameId: number;

    const animateScan = () => {
      if (scanningActive) {
        setScanPoint((prev) => (prev + 0.05) % securityMetrics.labels.length);
      }
      animationFrameId = requestAnimationFrame(animateScan);
    };

    animateScan();

    return () => cancelAnimationFrame(animationFrameId);
  }, [scanningActive, securityMetrics.labels.length]);

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: { color: 'rgba(130, 255, 168, 0.2)' },
        grid: { color: 'rgba(130, 255, 168, 0.2)' },
        pointLabels: {
          color: '#eee',
          font: { size: 12 },
        },
        ticks: {
          backdropColor: 'rgba(0, 0, 0, 0)',
          color: '#5cffb4',
          z: 100,
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#eee',
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#5cffb4',
        bodyColor: '#fff',
        borderColor: '#5cffb4',
        borderWidth: 1,
      },
    },
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.2 } },
  };

  const getScanData = () => {
    const datasets = [...securityMetrics.datasets];

    if (scanningActive) {
      const currentPointIndex = Math.floor(scanPoint);
      const nextPointIndex = (currentPointIndex + 1) % securityMetrics.labels.length;
      const fraction = scanPoint - currentPointIndex;

      const scanData = Array(securityMetrics.labels.length).fill(0);
      scanData[currentPointIndex] = 100 * (1 - fraction);
      scanData[nextPointIndex] = 100 * fraction;

      datasets.push({
        label: 'Active Scan',
        data: scanData,
        backgroundColor: 'rgba(95, 255, 180, 0.5)',
        borderColor: 'rgba(95, 255, 180, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(95, 255, 180, 1)',
        pointRadius: (ctx: any) =>
          ctx.dataIndex === currentPointIndex || ctx.dataIndex === nextPointIndex ? 3 : 0,
        pointHoverRadius: 3,
        fill: false,
      } as any); // Type assertion to allow custom Chart.js properties
    }

    return { labels: securityMetrics.labels, datasets };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        backgroundColor: '#1a2035',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 15px rgba(95, 255, 180, 0.2)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#5cffb4',
          fontWeight: 'bold',
          fontSize: '18px',
          zIndex: 10,
        }}
      >
        Network Security Scan
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: '#5cffb4',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setScanningActive(!scanningActive)}
          style={{
            backgroundColor: scanningActive ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {scanningActive ? 'Stop Scan' : 'Start Scan'}
        </button>
      </div>

      {/* Scanning indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '20px',
          color: '#5cffb4',
          fontSize: '14px',
          zIndex: 10,
        }}
      >
        {scanningActive && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#5cffb4',
                borderRadius: '50%',
                marginRight: '8px',
                animation: 'pulse 1s infinite',
              }}
            />
            Scanning active...
          </div>
        )}
      </div>

      {/* Chart container */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Radar ref={chartRef} data={getScanData()} options={options} redraw={true} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default NetworkScanChart;
