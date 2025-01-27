import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import "react-datepicker/dist/react-datepicker.css";
import './TodoList.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [startDate, setStartDate] = useState(new Date('2022-12-01'));
  const [endDate, setEndDate] = useState(new Date('2022-12-31'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('total_sales');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5051/api/sales-data?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: selectedMetric === 'total_sales' ? 'Total Sales' : 'Average Weekly Sales',
        data: data.map(d => d[selectedMetric]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="app-container">
      <h1>Sales Dashboard</h1>
      <div className="controls-container">
        <div className="date-picker-container">
          <div>
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
        <div className="metric-selector">
          <label>Select Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="total_sales">Total Sales</option>
            <option value="average_weekly_sales">Average Weekly Sales</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App; 