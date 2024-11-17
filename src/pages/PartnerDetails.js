import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const PartnerDetails = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState({});
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formName, setFormName] = useState('');
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState({
    name: '',
    type: 'text',
    choices: '',
    priceEffect: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const partnerResponse = await axios.get(`http://localhost:3004/api/partners/${id}`);
        const partnerData = partnerResponse.data.partner;
        setPartner(partnerData);

        if (partnerData.type === 'formable') {
          const formsResponse = await axios.get(`http://localhost:3004/api/partners/${id}/forms`);
          setForms(formsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Error fetching details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleCreateForm = async () => {
    if (!formName) {
      alert('Please provide a name for the form.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3004/api/partners/${id}/forms`, {
        name: formName,
      });

      setForms((prev) => [...prev, response.data.form]);
      setFormName('');
      alert('Form created successfully.');
    } catch (err) {
      console.error('Error creating form:', err.response?.data || err.message);
      setError('Error creating form.');
    }
  };

  const handleSelectForm = (form) => {
    setSelectedForm(form);
    setParameters(form.parameters || []);
  };

  const handleDeselectForm = () => {
    setSelectedForm(null);
    setParameters([]);
  };

  const handleAddParameter = async () => {
    if (!newParameter.name || !newParameter.type || !selectedForm) {
      alert('Please provide parameter details and ensure a form is selected.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3004/api/partners/${id}/forms/parameters`,
        {
          ...newParameter,
          formId: selectedForm.id,
        }
      );
      setParameters((prev) => [...prev, response.data.parameter]);
      setNewParameter({ name: '', type: 'text', choices: '', priceEffect: '' });
    } catch (err) {
      console.error('Error adding parameter:', err);
      setError('Error adding parameter.');
    }
  };

  const handleDeleteParameter = async (parameterId) => {
    try {
      await axios.delete(`http://localhost:3004/api/partners/${id}/forms/parameters/${parameterId}`);
      setParameters((prev) => prev.filter((param) => param.id !== parameterId));
    } catch (err) {
      console.error('Error deleting parameter:', err);
      setError('Error deleting parameter.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Partner Information */}
      <Typography variant="h6" sx={{ mb: 2 }}>Partner Details</Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="body1">Name: {partner.name || 'Not provided'}</Typography>
          <Typography variant="body2">Description: {partner.description || 'Not provided'}</Typography>
          <Typography variant="body2">About: {partner.about || 'Not provided'}</Typography>
          <Typography variant="body2">
            Important Info: {partner.important_information || 'Not provided'}
          </Typography>
          <Typography variant="body2">Type: {partner.type || 'Not provided'}</Typography>
        </CardContent>
      </Card>

      {/* Form Section */}
      {partner.type === 'formable' && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Forms</Typography>

          {/* Create Form */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Form Name"
              size="small"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <Button variant="contained" size="small" onClick={handleCreateForm}>
              Create Form
            </Button>
          </Box>

          {/* List Existing Forms */}
          {!selectedForm && forms.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Existing Forms</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                {forms.map((form) => (
                  <Card
                    key={form.id}
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      textAlign: 'center',
                      border: selectedForm?.id === form.id ? '1px solid #1976d2' : '1px solid #ccc',
                    }}
                    onClick={() => handleSelectForm(form)}
                  >
                    <Typography variant="body1">{form.name}</Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Add Parameters to Selected Form */}
          {selectedForm && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Add Parameters to {selectedForm.name}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleDeselectForm}
                sx={{ mb: 2 }}
              >
                Close Form
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <TextField
                  label="Parameter Name"
                  size="small"
                  value={newParameter.name}
                  onChange={(e) => setNewParameter((prev) => ({ ...prev, name: e.target.value }))}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newParameter.type}
                    onChange={(e) => setNewParameter((prev) => ({ ...prev, type: e.target.value }))}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="select">Dropdown</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Choices"
                  size="small"
                  placeholder="Comma-separated"
                  value={newParameter.choices}
                  onChange={(e) => setNewParameter((prev) => ({ ...prev, choices: e.target.value }))}
                />
                <TextField
                  label="Price Effect"
                  size="small"
                  value={newParameter.priceEffect}
                  onChange={(e) => setNewParameter((prev) => ({ ...prev, priceEffect: e.target.value }))}
                />
                <Button variant="contained" size="small" onClick={handleAddParameter}>
                  Add
                </Button>
              </Box>

              {/* Display Parameters */}
              {parameters.length > 0 && (
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Choices</TableCell>
                        <TableCell>Price Effect</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {parameters.map((param) => (
                        <TableRow key={param.id}>
                          <TableCell>{param.name}</TableCell>
                          <TableCell>{param.type}</TableCell>
                          <TableCell>{param.choices || 'N/A'}</TableCell>
                          <TableCell>{param.priceEffect || 'N/A'}</TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleDeleteParameter(param.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PartnerDetails;
