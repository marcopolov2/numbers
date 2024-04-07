import React from 'react';
import { Link } from 'react-router-dom';

const NoPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NoPage;
