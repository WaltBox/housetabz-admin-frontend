import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';

const UserDetails = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details from the backend
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${id}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  // Render loading state while fetching data
  if (!userDetails) {
    return <Typography variant="h6">Loading user details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{userDetails.username}</Typography>
          <Typography variant="body1"><strong>ID:</strong> {userDetails.id}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {userDetails.email}</Typography>
          <Typography variant="body1"><strong>House Name:</strong> {userDetails.house ? userDetails.house.name : 'No house assigned'}</Typography>
          <Typography variant="body1"><strong>Balance:</strong> {userDetails.balance}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {userDetails.status || 'Unknown'}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetails;
