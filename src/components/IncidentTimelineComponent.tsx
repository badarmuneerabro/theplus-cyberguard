import React from 'react';
import { Chart } from 'react-google-charts';


interface IncidentLog {
  id: number;
  type: string;
  severity: string;
  status: string;
  detectedAt: string;
  resolvedAt: string;
}

interface IncidentTimelineComponentProps {
  data: IncidentLog[];
}

const IncidentTimelineComponent: React.FC<IncidentTimelineComponentProps> = ({ data }) => {
  const timelineData = [
    [
      { type: 'string', id: 'Incident' },
      { type: 'string', id: 'Severity' },
      { type: 'datetime', id: 'Start' },
      { type: 'datetime', id: 'End' },
    ],
    ...data.map((incident) => [
      `Incident ${incident.id}`,
      incident.severity,
      new Date(incident.detectedAt),
      new Date(incident.resolvedAt),
    ]),
  ];

  return (
    <Chart
      chartType="Timeline"
      data={timelineData}
      width="100%"
      height="400px"
      options={{ timeline: { showRowLabels: false } }}
    />
  );
};

export default IncidentTimelineComponent;
