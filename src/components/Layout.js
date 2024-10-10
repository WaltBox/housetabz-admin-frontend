// src/components/Layout.js
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Navbar stays at the top */}
      <Navbar />
      {/* Main container for the sidebar and content */}
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
