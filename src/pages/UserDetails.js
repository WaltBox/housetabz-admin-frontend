import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';

const UserDetails = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user details from the backend
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/api/users/${id}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch tasks for the user from the backend
  const fetchUserTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/api/tasks/user/${id}`);
      setUserTasks(response.data);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  // Fetch both user details and tasks on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();
      await fetchUserTasks();
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                {userDetails.username.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h4" gutterBottom>
                {userDetails.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {userDetails.email}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>ID:</strong> {userDetails.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>House:</strong>{' '}
                {userDetails.house ? userDetails.house.name : 'No house assigned'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Balance:</strong> ${userDetails.balance}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {userDetails.status || 'Unknown'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tasks <Assignment fontSize="small" sx={{ ml: 1 }} />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {userTasks.length > 0 ? (
            <List>
              {userTasks.map((task) => (
                <ListItem key={task.id} sx={{ mb: 1 }}>
                  <ListItemText
                    primary={task.type}
                    secondary={`Response: ${task.response || 'Pending'}`}
                  />
                  <Chip
                    label={task.status ? 'Completed' : 'Pending'}
                    color={task.status ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tasks assigned.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetails;
