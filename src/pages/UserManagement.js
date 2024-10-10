import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { Link as RouterLink } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Replace the URL with your backend API URL
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, []);

  return (
    <TableContainer component={Paper} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>User Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>House Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/users/${user.id}`}
                  underline="hover"
                >
                  {user.username}
                </Link>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.houseName}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagement;
