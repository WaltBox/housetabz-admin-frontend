import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';

const Houses = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]); // State to hold the fetched houses

  // Fetch houses from backend
  useEffect(() => {
    axios.get('http://localhost:3004/api/houses')
      .then(response => {
        setHouses(response.data); // Set the fetched houses data
      })
      .catch(error => {
        console.error('Error fetching houses:', error);
      });
  }, []);

  // Navigate to specific house details
  const handleHouseClick = (id) => {
    navigate(`/houses/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>House ID</TableCell>
            <TableCell>House Name</TableCell>
            <TableCell>Address</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {houses.map((house) => (
            <TableRow key={house.id}>
              <TableCell>{house.id}</TableCell>
              <TableCell>
                <Link
                  component="button"
                  variant="body1"
                  onClick={() => handleHouseClick(house.id)}
                  underline="hover"
                >
                  {house.name}
                </Link>
              </TableCell>
              <TableCell>{house.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Houses;
