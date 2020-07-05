import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary"></i> Edit profile
      </Link>
      <Link to="" className="btn btn-light">
        <i className="fas fa-black-tie text-primary"></i> Blank
      </Link>
      <Link to="" className="btn btn-light">
        <i className="fas fa-graduation-cap text-primary"></i> Blank
      </Link>
    </div>
  );
};

export default DashboardActions;
