import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

// Register necessary components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Define the props type for the component
type ThreatTypePieChartProps = {
  data: ChartData<'pie'>; // Specify 'pie' chart type for data
};

// Define the functional component
const ThreatTypePieChart: React.FC<ThreatTypePieChartProps> = ({ data }) => {
  // Chart options configuration
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Customize legend position as needed
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default ThreatTypePieChart;
