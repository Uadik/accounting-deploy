import React from 'react';

import './error-indicator.css';

const ErrorIndicator = ({ errMsg }) => {
  return (
    <div>
      <label className='error-msg'>{errMsg}</label>
    </div>
  );
};

export default ErrorIndicator;
