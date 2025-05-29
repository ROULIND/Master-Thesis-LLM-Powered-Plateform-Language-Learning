import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import CloseIcon from '@mui/icons-material/Close';
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="menu">
      <li>
          <Link to="/">Dashboard</Link>
        </li>
     
        <li>
          <Link to="/youtube-videos/accueil">Youtube videos</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
