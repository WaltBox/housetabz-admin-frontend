import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Link } from '@mui/material';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [formValues, setFormValues] = useState({ name: '', description: '' });

  // Fetch partners from the backend
  const fetchPartners = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/partners');
      setPartners(response.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  // Open dialog for creating/editing partner
  const handleOpen = (partner = null) => {
    setCurrentPartner(partner);
    setFormValues(partner ? { name: partner.name, description: partner.description } : { name: '', description: '' });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setCurrentPartner(null);
    setFormValues({ name: '', description: '' });
  };

  // Handle input change in form
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Create or update partner
  const handleSave = async () => {
    if (currentPartner) {
      // Update existing partner
      try {
        await axios.put(`http://localhost:3000/api/partners/${currentPartner.id}`, formValues);
        fetchPartners();
      } catch (error) {
        console.error('Error updating partner:', error);
      }
    } else {
      // Create new partner
      try {
        await axios.post('http://localhost:3000/api/partners', formValues);
        fetchPartners();
      } catch (error) {
        console.error('Error creating partner:', error);
      }
    }
    handleClose();
  };

  // Delete partner
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/partners/${id}`);
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Partners</Typography>

      {/* Button to create a new partner */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 3 }}>
        Add Partner
      </Button>

      {/* Partners Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>{partner.id}</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/partners/${partner.id}`}
                    underline="hover"
                  >
                    {partner.name}
                  </Link>
                </TableCell>
                <TableCell>{partner.description}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(partner)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDelete(partner.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creating/Editing Partner */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentPartner ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            {currentPartner ? 'Save Changes' : 'Add Partner'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Partners;
