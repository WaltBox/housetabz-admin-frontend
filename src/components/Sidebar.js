// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentIcon from '@mui/icons-material/Payment';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px', // Adjusts the start of the sidebar below the Navbar
        },
      }}
    >
      <List>
        {/* Houses Tab */}
        <ListItem button component={Link} to="/houses">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Houses" />
        </ListItem>

        {/* Users Tab */}
        <ListItem button component={Link} to="/user-management">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>

        {/* Partnerships Tab */}
        <ListItem button component={Link} to="/partners">
          <ListItemIcon>
            <BusinessCenterIcon />
          </ListItemIcon>
          <ListItemText primary="Partnerships" />
        </ListItem>

        {/* Payments Tab */}
        <ListItem button component={Link} to="/payments">
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
