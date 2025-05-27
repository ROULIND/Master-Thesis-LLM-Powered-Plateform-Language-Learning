// Checked
import React, { useState } from 'react';
// Components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const NumberVisits = () =>{

    const dataDate = [
        { date: '2023-09-01', visits: 2 },
        { date: '2023-09-02', visits: 1 },
        { date: '2023-09-03', visits: 2 },
        { date: '2023-09-04', visits: 1 },
        { date: '2023-09-05', visits: 2 },
      ];

  const filterDataByMonth = (data, month) => {
    return data.filter(entry => entry.date.slice(0, 7) === month);
  }
  const [selectedMonth, setSelectedMonth] = useState('2023-09');
  const filteredData = filterDataByMonth(dataDate, selectedMonth);

    return (
        <div className="dashboard-box">
          <div className="box-content2"  >
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
              <div className='typo-box'>Number of visits (client)</div>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="2023-09">September 2023</MenuItem>
              </Select>
            </div>
            <div style={{ height: '20px' }}></div>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart height={250} data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#f25c54" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )
}
export default NumberVisits;