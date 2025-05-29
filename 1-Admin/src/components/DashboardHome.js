import React from 'react';
import AreaChart from './Dashboard/AreaChart';
import PieChart from './Dashboard/PieChart';
import CrudStorage from './Dashboard/CrudStorage';
import DifficultyModel from './Dashboard/DifficultyModel';
import Timer from './Dashboard/Timer';
import './DashboardHome.css';

const DashboardHome = () => {
  return (
    <div className="app-container">
      <div className="dashboard-container" style={{ backgroundColor: '#F79D6529', minHeight: '100vh' }}>

        <div className="dashboard-header">
          <h1 style={{ fontFamily: 'Ubuntu 700', fontSize: '25px', textAlign: 'left' }}> <span style={{ color: '#F27059' }}>Monjoor </span> Admin Dashboard</h1>
        </div>

        <div className="dashboard-content">
          <AreaChart />
          <PieChart></PieChart>
        </div>

        <div style={{ height: '20px' }}></div>

        <div className="dashboard-content">
          <CrudStorage></CrudStorage>
          <DifficultyModel></DifficultyModel>
          <div className="dashboard-box">
            <Timer></Timer>
          </div>
        </div>
        {/* This component works well - waiting for app to have a domain to get the Google Analytics Informations
          <NumberVisits></NumberVisits>  */}
      </div>
    </div>
  );
};

export default DashboardHome;
