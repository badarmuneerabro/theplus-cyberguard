import React from 'react';

type IoC = {
  id: number;
  type: string;
  description: string;
  severity: string;
  source: string;
  indicatorsOfCompromise: string;
  status: string;
  detectedTimestamp: string;
  affectedAssets: string;
  remediationSteps: string;
};

type TableComponentProps = {
  title: string;
  data: IoC[];
  onDelete: (id: number) => void; // Add functionality for deleting if needed
};

const TableComponent: React.FC<TableComponentProps> = ({ title, data, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Severity</th>
            <th className="py-2 px-4 border-b">Source</th>
            <th className="py-2 px-4 border-b">Indicator</th>
            <th className="py-2 px-4 border-b">Date Detected</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ioc) => (
            <tr key={ioc.id}>
              <td className="py-2 px-4 border-b">{ioc.type}</td>
              <td className="py-2 px-4 border-b">{ioc.description}</td>
              <td className="py-2 px-4 border-b">{ioc.severity}</td>
              <td className="py-2 px-4 border-b">{ioc.source}</td>
              <td className="py-2 px-4 border-b">{ioc.indicatorsOfCompromise}</td>
              <td className="py-2 px-4 border-b">{new Date(ioc.detectedTimestamp).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{ioc.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onDelete(ioc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
 