import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartType, ChartItem, ScriptableContext } from 'chart.js';
import { Box, Typography } from '@mui/material';

// Register all Chart.js components
Chart.register(...registerables);

const CoverageIssuesChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<ChartType, unknown[], unknown> | null>(null);

  const securityCoverageData = [
    { category: 'Endpoints', covered: 78, total: 100 },
    { category: 'Networks', covered: 92, total: 100 },
    { category: 'Cloud', covered: 65, total: 100 },
    { category: 'Applications', covered: 81, total: 100 },
    { category: 'Data', covered: 59, total: 100 },
    { category: 'IoT Devices', covered: 42, total: 100 },
  ];

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(canvas as ChartItem, {
      type: 'bar',
      data: {
        labels: securityCoverageData.map(item => item.category),
        datasets: [
          {
            label: 'Covered',
            data: securityCoverageData.map(item => item.covered),
            backgroundColor: (context: ScriptableContext<'bar'>) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(92, 255, 180, 0.9)');
              gradient.addColorStop(1, 'rgba(92, 255, 180, 0.2)');
              return gradient;
            },
            borderColor: 'rgba(92, 255, 180, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'At Risk',
            data: securityCoverageData.map(item => item.total - item.covered),
            backgroundColor: (context: ScriptableContext<'bar'>) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, 'rgba(240, 78, 88, 0.7)');
              gradient.addColorStop(1, 'rgba(240, 78, 88, 0.2)');
              return gradient;
            },
            borderColor: 'rgba(240, 78, 88, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            right: 25,
            bottom: 20,
            left: 25
          }
        },
        scales: {
          x: {
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 11
              }
            },
            stacked: true,
          },
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              display: true  // Removed the dashed line configuration
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            },
            max: 100,
            stacked: true,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
            align: 'end' as const,
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 15,
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#5cffb4',
            bodyColor: '#ffffff',
            borderColor: 'rgba(92, 255, 180, 0.3)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 4,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '%';
                }
                return label;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Box 
      sx={{ 
        bgcolor: '#1a2035', 
        borderRadius: '10px',
        p: 2,
        height: '10%',
        minHeight: '400px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        position: 'relative'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#5cffb4', 
          fontWeight: 'bold',
          fontSize: '1.1rem',
          mb: 1
        }}
      >
        Security Coverage Issues
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem',
          mb: 2
        }}
      >
        Security coverage across different asset categories
      </Typography>
      
      <Box 
        sx={{ 
          position: 'relative',
          height: 'calc(100% - 60px)',
          minHeight: '320px'
        }}
      >
        <canvas ref={chartRef} />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 15,
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.7rem'
        }}
      >
        Last updated: Today, 10:45 AM
      </Box>
    </Box>
  );
};

export default CoverageIssuesChart;