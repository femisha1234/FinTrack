import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div>
      <nav className="sidebar">
        <h2  id='heading'>FinTrack</h2>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/income'>Income Tracker</Link>
        <Link to='/expense'>Expense Tracker</Link>
        <Link to='/budget'>Budget Management</Link>
        <Link to='/report'>Reports</Link>
        <Link to='/savings'>Savings Goals</Link>
        <Link to='/premium'>Premium</Link>
        <Link to='/settings'>Settings</Link>

      </nav>
    </div>
  );
}

export default Sidebar;