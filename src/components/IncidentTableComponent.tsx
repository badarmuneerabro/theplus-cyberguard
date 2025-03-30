// src/components/IncidentTableComponent.tsx
import React from 'react';

const apiGatewayUrl = '';  // API Gateway URL


interface IncidentLog {
  id: number;
  type: string;
  severity: string;
  status: string;
  detectedAt: string;
  resolvedAt: string;
}

interface IncidentTableComponentProps {
  title: string;
  data: IncidentLog[];
}

const IncidentTableComponent: React.FC<IncidentTableComponentProps> = ({ title, data }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Severity</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Detected At</th>
            <th className="py-2 px-4 border-b">Resolved At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((incident) => (
            <tr key={incident.id}>
              <td className="py-2 px-4 border-b">{incident.id}</td>
              <td className="py-2 px-4 border-b">{incident.type}</td>
              <td className="py-2 px-4 border-b">{incident.severity}</td>
              <td className="py-2 px-4 border-b">{incident.status}</td>
              <td className="py-2 px-4 border-b">{incident.detectedAt}</td>
              <td className="py-2 px-4 border-b">{incident.resolvedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTableComponent;
