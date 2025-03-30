import React, { useEffect, useState } from "react";
import scss from "./ThreatsPerDay.module.scss";
import { Card, Grid, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";
import DataChart from "../../../components/DataChart";

const apiGatewayUrl = '';  // API Gateway URL


const ThreatsPerDay = () => {
  const theme = useTheme();
  const [threatData, setThreatData] = useState<number[]>([]);
  const [criticalThreats, setCriticalThreats] = useState<number>(0);
  const [highThreats, setHighThreats] = useState<number>(0);
  const [lowThreats, setLowThreats] = useState<number>(0);

  useEffect(() => {
    const fetchThreatData = async () => {
      try {
        const response = await fetch('http://localhost:8088/api/threats-per-day');
        const data = await response.json();
        setThreatData(data.dailyCounts); // Assume the backend sends an array of daily threat counts
        setCriticalThreats(data.criticalCount);
        setHighThreats(data.highCount);
        setLowThreats(data.lowCount);
      } catch (error) {
        console.error("Error fetching threat data:", error);
      }
    };
    fetchThreatData();
  }, []);

  return (
    <Grid container gap={2} className={scss.wrapper}>
      <Paper className={scss.threats}>
        <div className={scss.chart}>
          <Typography>Threats Detected Per Day</Typography>
          <DataChart
            type={"line"}
            data={{
              labels: Array.from({ length: threatData.length }, (_, i) => `Day ${i + 1}`),
              datasets: [
                {
                  label: "Threats",
                  data: threatData,
                  fill: false,
                  borderColor: "rgb(255, 99, 132)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>
        <div className={scss.cardWrapper}>
          <Card className={scss.card} variant={"outlined"}>
            <div className={scss.cardTitle}>
              <Typography>Critical Threats</Typography>
            </div>
            <div className={scss.cardValue}>
              <Typography>{criticalThreats}</Typography>
              <Typography color={theme.palette.error.main} fontSize={14}>
                High Risk
              </Typography>
            </div>
          </Card>
          <Card className={scss.card} variant={"outlined"}>
            <div className={scss.cardTitle}>
              <Typography>High Severity Threats</Typography>
            </div>
            <div className={scss.cardValue}>
              <Typography>{highThreats}</Typography>
              <Typography color={theme.palette.warning.main} fontSize={14}>
                Medium Risk
              </Typography>
            </div>
          </Card>
          <Card className={scss.card} variant={"outlined"}>
            <div className={scss.cardTitle}>
              <Typography>Low Severity Threats</Typography>
            </div>
            <div className={scss.cardValue}>
              <Typography>{lowThreats}</Typography>
              <Typography color={theme.palette.success.main} fontSize={14}>
                Low Risk
              </Typography>
            </div>
          </Card>
        </div>
      </Paper>
    </Grid>
  );
};

export default ThreatsPerDay;
