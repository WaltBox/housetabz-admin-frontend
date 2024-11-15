import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Alert, TextField, Button, TextareaAutosize, Input 
} from '@mui/material';

const PartnerDetails = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState({});
  const [serviceOffers, setServiceOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({ logo: null, marketplace_cover: null, company_cover: null });
  const [about, setAbout] = useState('');
  const [importantInformation, setImportantInformation] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track edit mode

  useEffect(() => {
    const fetchPartnerWithOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/api/partners/${id}`);
        const { partner, serviceOffers } = response.data;
        
        setPartner(partner);
        setServiceOffers(serviceOffers);
        setFilteredOffers(serviceOffers);
        setAbout(partner.about || '');
        setImportantInformation(partner.important_information || '');
      } catch (err) {
        console.error('Error fetching partner details or offers:', err);
        setError('Error fetching partner details or offers.');
      }
    };
    fetchPartnerWithOffers();
  }, [id]);

  const handleZipCodeSearch = () => {
    if (!zipCode) {
      setFilteredOffers(serviceOffers);
    } else {
      const offersByZip = serviceOffers.filter((offer) =>
        offer.zip_codes.includes(zipCode)
      );
      setFilteredOffers(offersByZip);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('about', about);
    formData.append('important_information', importantInformation);

    // Append files if selected
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    try {
      await axios.patch(`http://localhost:3004/api/partners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Partner information updated successfully');
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating partner information:', error);
      setError('Failed to update partner information.');
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Partner Information Preview */}
      <Typography variant="h5" sx={{ mb: 2 }}>Partner Details Preview</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Name: {partner.name || 'Not provided'}</Typography>
          <Typography>Description: {partner.description || 'Not provided'}</Typography>
          <Typography>About: {partner.about || 'Not provided'}</Typography>
          <Typography>Important Information: {partner.important_information || 'Not provided'}</Typography>
          <Typography>
            Logo:
            {partner.logo ? (
              <img
                src={`http://localhost:3004/${partner.logo}`}
                alt="Logo"
                style={{ width: '100px', height: 'auto', display: 'block', marginTop: '10px' }}
              />
            ) : (
              ' Not provided'
            )}
          </Typography>
          <Typography>
            Marketplace Cover:
            {partner.marketplace_cover ? (
              <img
                src={`http://localhost:3004/${partner.marketplace_cover}`}
                alt="Marketplace Cover"
                style={{ width: '100px', height: 'auto', display: 'block', marginTop: '10px' }}
              />
            ) : (
              ' Not provided'
            )}
          </Typography>
          <Typography>
            Company Cover:
            {partner.company_cover ? (
              <img
                src={`http://localhost:3004/${partner.company_cover}`}
                alt="Company Cover"
                style={{ width: '100px', height: 'auto', display: 'block', marginTop: '10px' }}
              />
            ) : (
              ' Not provided'
            )}
          </Typography>
        </CardContent>
      </Card>

      {/* Update Button */}
      {!isEditing && (
        <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mb: 3 }}>
          Update Details
        </Button>
      )}

      {/* Edit Form */}
      {isEditing && (
        <>
          {/* File Uploads for Logo, Marketplace Cover, and Company Cover */}
          <Typography variant="h5" sx={{ mb: 2 }}>Manage Partner Media</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mb: 3 }}>
            {['logo', 'marketplace_cover', 'company_cover'].map((field) => (
              <Box key={field}>
                <Typography variant="body1" gutterBottom>
                  {partner[field] ? `Edit ${field.replace('_', ' ')}` : `Upload ${field.replace('_', ' ')}`}
                </Typography>
                <Input
                  type="file"
                  name={field}
                  onChange={handleFileChange}
                  inputProps={{ accept: 'image/*' }}
                />
              </Box>
            ))}
          </Box>

          {/* About and Important Information Text Areas */}
          <Typography variant="h5" sx={{ mb: 2 }}>Partner Details</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">About</Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="About the partner"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">Important Information</Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="Important Information"
              value={importantInformation}
              onChange={(e) => setImportantInformation(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </Box>

          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </>
      )}

      {/* Offer Snapshots Section */}
      {serviceOffers.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Offer Snapshots</Typography>

          {/* Zip Code Input and Search Button */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Enter Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            <Button variant="contained" onClick={handleZipCodeSearch}>
              Search Offers
            </Button>
          </Box>

          {/* Offers Display */}
          <Grid container spacing={3}>
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <Grid item xs={12} sm={6} md={4} key={offer.uuid}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{offer.title}</Typography>
                      <Typography variant="body2">
                        <strong>Term Months:</strong> {offer.term_months}
                      </Typography>
                      <Typography variant="body2">
                        <strong>kWh Rate:</strong> {offer.rhythm_kwh_rate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Price for 1000 kWh:</strong> ${offer.price_1000_kwh}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Renewable Energy:</strong> {offer.renewable_energy ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {offer.description_en}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No offers available for this Zip Code.</Typography>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PartnerDetails;
