import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Components 
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Area } from 'recharts';
const apiUrl = process.env.REACT_APP_API_URL; // URL API

const DashboardChart = () => {

  const [dateInformation, setDateInformation] = useState([]); // Get Added and Delete Date
  // Capture the statistics - i.e: Added and Deleted date to plot 
  useEffect(() => {
    axios.get(`${apiUrl}/admin/statistics`)
      .then(response => {
        setDateInformation(response.data.DateInformation);
      })
      .catch(error => {
        console.error('Error fetching date information:', error);
      });
  }, []);

  // Process the dates
  const processDataForChart = () => {
    const monthCount = {};

    dateInformation.forEach(item => {
      const date = item.dateAdded || item.dateDeleted;
      if (!date) return;

      const [day, month, year] = date.split(/[./]/).map(Number); // Support for both '.' and '/'
      const formattedMonth = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
      const key = `${formattedMonth} ${year}`; // Concatenate month and year as the key

      if (!monthCount[key]) {
        monthCount[key] = { Added: 0, Deleted: 0 };
      }

      if (item.dateAdded) {
        monthCount[key].Added++;
      } else {
        monthCount[key].Deleted++;
      }
    });

    // Convert monthCount object to an array of objects for recharts
    const data = Object.keys(monthCount).map(month => ({
      name: month,
      Added: monthCount[month].Added,
      Deleted: monthCount[month].Deleted
    }));

    return data;
  };

  const chartData = processDataForChart();

  return (
    <div className="dashboard-box">
      <div className="box-content2">
        <div className='typo-box'>Added and Deleted Videos</div>
        <ResponsiveContainer height={300}>
          <AreaChart data={chartData} margin={{ top: 20, left: -30, bottom: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
            <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="Added" stroke="#F7B267" fill="#F7B267" />
            <Area type="monotone" dataKey="Deleted" stroke="#FF6347" fill="#FF6347" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
