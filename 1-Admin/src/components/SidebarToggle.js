import React, { useState } from 'react';
import './SidebarToggle.css'; // You'll create this CSS file

const SidebarToggle = ({ isOpen, onToggle }) => {
  return (
    <div>
      <div className="sidebar-toggle" onClick={onToggle}>
        <div className={`icon ${isOpen ? 'open' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
      </div>
    </div>
    </div>

  );
};

export default SidebarToggle;
