
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from './Landing';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Navigate to the landing page
    navigate('/');
  }, [navigate]);
  
  // Render the Landing page directly
  return <Landing />;
};

export default Index;
