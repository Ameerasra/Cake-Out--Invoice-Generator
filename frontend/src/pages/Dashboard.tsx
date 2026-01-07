import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to Cake Out Invoice Generator</h2>
      <div className="dashboard-cards">
        <Link to="/invoices/create" className="dashboard-card">
          <div className="card-icon">➕</div>
          <h3>Create New Invoice</h3>
          <p>Generate a new invoice for your customer</p>
        </Link>
        <Link to="/invoices" className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>View All Invoices</h3>
          <p>Browse and manage all your invoices</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;






