import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, Paper } from '@mui/material';

const HouseDetails = () => {
  const { id } = useParams(); // Get houseId from URL
  const [houseDetails, setHouseDetails] = useState({});
  const [services, setServices] = useState([]); // House services
  const [Users, setUsers] = useState([]); // House users

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        // Fetch the house details
        const houseResponse = await axios.get(`http://localhost:3000/api/houses/${id}`);
        setHouseDetails(houseResponse.data);

        // Fetch the services associated with the house
        const servicesResponse = await axios.get(`http://localhost:3000/api/houses/${id}/services`);
        setServices(servicesResponse.data);

        // Fetch users associated with the house
        const usersResponse = await axios.get(`http://localhost:3000/api/houses/${id}/users`);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching house details, services, or users:', error);
      }
    };

    fetchHouseDetails();
  }, [id]);

  const users = houseDetails.users || [];  // Safely handle case where users might not exist yet
  const hsi = houseDetails.hsi || 0; // House Status Index
  const balance = houseDetails.balance || 0; // House balance
  const ledger = houseDetails.ledger || 0; // House ledger

  return (
    <Box sx={{ p: 3 }}>
      {/* House Basic Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{houseDetails.name || 'House Name'}</Typography>
          <Typography variant="body1"><strong>Address:</strong> {houseDetails.address || 'House Address'}</Typography>
        </CardContent>
      </Card>

      {/* HSI, Balance, Ledger Display */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6"><strong>HSI (House Status Index):</strong> {hsi}</Typography>
        <Typography variant="h6"><strong>Balance:</strong> ${balance}</Typography>
        <Typography variant="h6"><strong>Ledger:</strong> ${ledger}</Typography>
      </Paper>

      {/* House Services */}
      <Typography variant="h5" sx={{ mb: 2 }}>House Services</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {services.length > 0 ? (
          services.map((service) => (
            <Grid item xs={12} md={6} key={service.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{service?.Partner?.name || 'Unknown Partner'}</Typography>
                  <Typography variant="body2">{service?.Partner?.description || 'No description available'}</Typography>
                  {service?.ServicePlan && (
                    <Typography variant="body2"><strong>Service Plan:</strong> {service.ServicePlan.name}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No services associated with this house.</Typography>
          </Grid>
        )}
      </Grid>

      {/* House Users */}
      <Typography variant="h5" sx={{ mb: 2 }}>House Members</Typography>
      <Grid container spacing={2}>
        {users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} md={6} key={user.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
                  <Typography variant="body2"><strong>Balance:</strong> {user.balance}</Typography>
                  <Typography variant="body2"><strong>Points:</strong> {user.points}</Typography>
                  <Typography variant="body2"><strong>Credit:</strong> {user.credit}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No users associated with this house.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default HouseDetails;
