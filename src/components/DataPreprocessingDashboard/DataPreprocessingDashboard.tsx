/* import React, { useEffect, useState } from 'react';
import { springAxios } from '../../config/axiosConfig';
import { isAxiosError } from 'axios';
import { Bar } from 'react-chartjs-2';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Grid, Typography } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FeatureData {
  feature: string;
  count: number;
}

interface TransformationData {
  timestamp: string;
  value: number;
}

const DataPreprocessingDashboard: React.FC = () => {
  const [featureData, setFeatureData] = useState<FeatureData[]>([]);
  const [transformationData, setTransformationData] = useState<TransformationData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [featuresResponse, transformationsResponse] = await Promise.all([
        springAxios.get("/api/preprocessing/features"),
        springAxios.get("/api/preprocessing/transformations"),
      ]);
      console.log("Features Data:", featuresResponse.data);
      setFeatureData(featuresResponse.data);
      setTransformationData(transformationsResponse.data);
    } catch (error) {
      console.error("Axios Error:", error);
      if (isAxiosError(error)) {
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
        } else if (error.request) {
          console.error("No Response from Server:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      } else {
        console.error("Unknown Error:", String(error));
      }
    }
  };

  const featureChartData: ChartData<'bar'> = {
    labels: featureData.map((item) => item.feature),
    datasets: [
      {
        label: 'Feature Count',
        data: featureData.map((item) => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const transformationChartData: ChartData<'bar'> = {
    labels: transformationData.map((item) => item.timestamp),
    datasets: [
      {
        label: 'Transformation Values',
        data: transformationData.map((item) => item.value),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  }; 

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Data Preprocessing Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Feature Distribution</Typography>
          <Bar data={featureChartData} options={barOptions} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Data Transformations</Typography>
          <Bar data={transformationChartData} options={barOptions} />
        </Grid>
      </Grid>
    </div>
  );
};

export default DataPreprocessingDashboard;
  */