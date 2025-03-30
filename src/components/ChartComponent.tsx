import React from 'react';
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';


// Define the type for the data that will be passed to the chart
export interface ChartData {
  [key: string]: string | number;
}

type ChartComponentProps = {
  title: string;
  data: ChartData[];  // Specific type for data
  type: 'pie' | 'line' | 'bar' | 'area' | 'geo';
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartComponent: React.FC<ChartComponentProps> = ({ title, data, type }) => {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart width={400} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart width={400} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="indicator" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart width={400} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
