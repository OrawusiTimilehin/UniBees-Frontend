import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './navbar';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Define which paths should NOT show the navbars
  const hideNavPaths = ['/login', '/signup', '/']; 
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Only render Navbar if we aren't on an Auth page */}
      {!shouldHideNav && <Navbar activeTab={location.pathname.replace('/', '') || 'match'} />}

      <Box 
        component="main" 
        sx={{ 
          // 1. Padding Top: Prevents the Top Header from blocking content
          pt: shouldHideNav ? 0 : '0px', 
          
          // 2. Padding Bottom: Prevents page content from being hidden
          // Note: This only affects static content. 
          // For FIXED buttons in BeesMatch, change their 'bottom' to 120px.
          pb: shouldHideNav ? 0 : '120px',
          
          px: 2 
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default LayoutWrapper;