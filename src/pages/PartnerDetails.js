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
  Grid,
} from '@mui/material';

const PartnerDetails = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState({});
  const [about, setAbout] = useState('');
  const [importantInfo, setImportantInfo] = useState('');
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
  const [files, setFiles] = useState({
    logo: null,
    marketplace_cover: null,
    company_cover: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const partnerResponse = await axios.get(`http://localhost:3004/api/partners/${id}`);
        const partnerData = partnerResponse.data.partner;
        setPartner(partnerData);
        setAbout(partnerData.about || '');
        setImportantInfo(partnerData.important_information || '');

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleUpdatePartner = async () => {
    try {
      await axios.patch(`http://localhost:3004/api/partners/${id}`, {
        about,
        important_information: importantInfo,
      });
      alert('Partner details updated successfully.');
    } catch (err) {
      console.error('Error updating partner details:', err);
      setError('Error updating partner details.');
    }
  };

  const handleUploadMedia = async () => {
    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    try {
      await axios.patch(`http://localhost:3004/api/partners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Media uploaded successfully.');
      setFiles({ logo: null, marketplace_cover: null, company_cover: null });
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Error uploading media.');
    }
  };

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
      console.error('Error creating form:', err);
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      {/* Partner Information */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Partner Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Name: {partner.name || 'Not provided'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Description: {partner.description || 'Not provided'}
          </Typography>
          <TextField
            label="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            multiline
            rows={2}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="Important Information"
            value={importantInfo}
            onChange={(e) => setImportantInfo(e.target.value)}
            multiline
            rows={2}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleUpdatePartner}
            sx={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Box sx={{ mb: 3 }}>
  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
    Media Uploads
  </Typography>
  <Grid container spacing={2}>
    {['logo', 'marketplace_cover', 'company_cover'].map((key) => (
      <Grid item xs={12} sm={6} md={4} key={key}>
        {files[key] ? (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {/* Display preview if the media is present */}
            <img
              src={files[key] instanceof File ? URL.createObjectURL(files[key]) : files[key]}
              alt={`${key} preview`}
              style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '4px' }}
            />
            <Button
              size="small"
              color="error"
              variant="text"
              onClick={() =>
                setFiles((prev) => ({ ...prev, [key]: null }))
              }
              sx={{ mt: 1 }}
            >
              Remove
            </Button>
          </Box>
        ) : (
          <TextField
            type="file"
            name={key}
            onChange={handleFileChange}
            helperText={`Upload ${key.replace('_', ' ')}`}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        )}
      </Grid>
    ))}
  </Grid>
  <Button
    variant="contained"
    onClick={async () => {
      const formData = new FormData();
      Object.keys(files).forEach((key) => {
        if (files[key] instanceof File) {
          formData.append(key, files[key]);
        }
      });

      try {
        const response = await axios.patch(`http://localhost:3004/api/partners/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Assume the server responds with updated URLs for the uploaded files
        const updatedFiles = response.data; // Example response: { logo: 'url1', marketplace_cover: 'url2', company_cover: 'url3' }
        setFiles((prev) => ({
          ...prev,
          ...updatedFiles,
        }));
        alert('Media uploaded successfully.');
      } catch (err) {
        console.error('Error uploading media:', err);
        setError('Error uploading media.');
      }
    }}
    sx={{ fontSize: '0.8rem', padding: '6px 12px', mt: 2 }}
  >
    Upload Media
  </Button>
</Box>




      {/* Forms Section */}
      {partner.type === 'formable' && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Forms
          </Typography>
          {!selectedForm ? (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  label="Form Name"
                  size="small"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCreateForm}
                  sx={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  Create Form
                </Button>
              </Box>
              <Grid container spacing={2}>
                {forms.map((form) => (
                  <Grid item xs={12} sm={6} md={4} key={form.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        p: 2,
                        textAlign: 'center',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                      onClick={() => handleSelectForm(form)}
                    >
                      <Typography variant="body1">{form.name}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{selectedForm.name}</Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleDeselectForm}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Close Form
                </Button>
              </Box>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Parameter Name"
                  size="small"
                  value={newParameter.name}
                  onChange={(e) =>
                    setNewParameter((prev) => ({ ...prev, name: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newParameter.type}
                    onChange={(e) =>
                      setNewParameter((prev) => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="select">Dropdown</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Choices (comma-separated)"
                  size="small"
                  value={newParameter.choices}
                  onChange={(e) =>
                    setNewParameter((prev) => ({ ...prev, choices: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <TextField
                  label="Price Effect"
                  size="small"
                  value={newParameter.priceEffect}
                  onChange={(e) =>
                    setNewParameter((prev) => ({
                      ...prev,
                      priceEffect: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                  fullWidth
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddParameter}
                  sx={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  Add Parameter
                </Button>
              </Box>
              {parameters.length > 0 && (
                <TableContainer component={Paper}>
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
                              sx={{ fontSize: '0.8rem', padding: '4px 8px' }}
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
