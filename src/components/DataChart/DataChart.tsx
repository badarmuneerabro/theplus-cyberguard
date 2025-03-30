import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { darkOptions } from "../../components/DataChart/Themes";


const DataChart = (props: ChartConfiguration) => {
  const { data, options } = props;
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        ...props,
        options: {
          ...options,
          ...darkOptions,
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [data, options, props]);

  return <canvas ref={chartRef} />;
};
Chart.register(...registerables);

export default DataChart;
