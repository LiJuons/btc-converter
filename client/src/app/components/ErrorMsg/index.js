import React from 'react';
import './ErrorMsg.scss';

const ErrorMsg = ({err}) => (
  <div className="error-msg">
    {err}
  </div>
);

export default ErrorMsg;