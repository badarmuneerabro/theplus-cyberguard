import React, { useState, useEffect } from "react";


// Define the type for chart data
interface ChartDataType {
  title: string;
  data: ChartData[];  // Using the ChartData interface from above
}

interface ChartData {
  count: number;
  source?: string;
  date?: string;
  indicator?: string;
}

const CyberGuardOverview = () => {
  // Initialize state with the defined type
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  useEffect(() => {
    // Fetch data from your backend
    fetch("http://localhost:8088/api/data/some-endpoint")
      .then((response) => response.json())
      .then((data) => {
        setChartData((prevData) => [
          ...prevData,
          { title: "Category Title", data }, // Example of how you might structure it
        ]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {chartData.map((chart, index) => (
        <div key={index}>
          <h3>{chart.title}</h3>
          {/* Render your chart using the data */}
          {/* Example: <ChartComponent data={chart.data} title={chart.title} type="line" /> */}
        </div>
      ))}
    </div>
  );
};

export default CyberGuardOverview;
