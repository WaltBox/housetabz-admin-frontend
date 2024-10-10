// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: '#4CAF50', zIndex: 1301 }}>
      <Toolbar>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          HouseTabz <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>admin</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
