import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { processData, MaxMinTableEntry, AvgTableEntry } from './dataProcessor';

const App: React.FC = () => {
  // State variables to hold data retrieved from the JSON file
  const [maxMinTable, setMaxMinTable] = useState<MaxMinTableEntry[]>([]);
  const [avgTable, setAvgTable] = useState<AvgTableEntry[]>([]);

  useEffect(() => {
    // Fetching the JSON data when the component mounts
    fetch('/Manufac _India _Agro_Dataset.json')
      .then(response => {
        // Check if response is okay, otherwise throw an error
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Convert response to text
        return response.text();
      })
      .then(data => {
        // Log the received JSON data
        console.log('Received JSON data:', data);
        // Process the JSON data using processData function
        const { maxMinTable, avgTable } = processData(data);
        // Replace NaN values in avgYield and avgArea with 0
        const updatedAvgTable = avgTable.map(entry => ({
          ...entry,
          avgYield: Number.isNaN(entry.avgYield) ? 0 : entry.avgYield,
          avgArea: Number.isNaN(entry.avgArea) ? 0 : entry.avgArea,
        }));
        // Update state with processed data
        setMaxMinTable(maxMinTable);
        setAvgTable(updatedAvgTable);
      });
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return (
    <div>
      <h1>Agriculture Data Analytics</h1>
      <h2>Max and Min Production by Year</h2>
      {/* Table displaying max and min production */}
      <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={tableHeaderCellStyle}>Year</th>
            <th style={tableHeaderCellStyle}>Crop with Maximum Production</th>
            <th style={tableHeaderCellStyle}>Crop with Minimum Production</th>
          </tr>
        </thead>
        <tbody>
          {maxMinTable.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{row.year}</td>
              <td style={tableCellStyle}>{row.maxCrop}</td>
              <td style={tableCellStyle}>{row.minCrop}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Average Yield and Cultivation Area</h2>
      {/* Table displaying average yield and cultivation area */}
      <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={tableHeaderCellStyle}>Crop</th>
            <th style={tableHeaderCellStyle}>Average Yield</th>
            <th style={tableHeaderCellStyle}>Average Cultivation Area</th>
          </tr>
        </thead>
        <tbody>
          {avgTable.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{row.crop}</td>
              {/* Display average yield rounded to 3 decimal places */}
              <td style={tableCellStyle}>{row.avgYield.toFixed(3)}</td>
              {/* Display average area rounded to 3 decimal places */}
              <td style={tableCellStyle}>{row.avgArea.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// CSS styles for table headers
const tableHeaderCellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

// CSS styles for table cells
const tableCellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
};

export default App;
