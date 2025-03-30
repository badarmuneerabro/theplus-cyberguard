import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

// Register necessary components with Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type ThreatTimelineChartProps = {
  data: ChartData<'line'>; // Specify 'line' chart type for data
};

const ThreatTimelineChart: React.FC<ThreatTimelineChartProps> = ({ data }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ThreatTimelineChart;
