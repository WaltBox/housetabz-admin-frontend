import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Alert, TextField, Button 
} from '@mui/material';

const PartnerDetails = () => {
  const { id } = useParams(); // To get the partner ID from URL params
  const [partner, setPartner] = useState({});
  const [offerSnapshots, setOfferSnapshots] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState(null);

  // Fetch partner details and offer snapshots on component load
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        console.log(`Fetching partner details for ID: ${id}`);
        const response = await axios.get(`http://localhost:3004/api/partners/${id}`);
        setPartner(response.data);
      } catch (err) {
        console.error('Error fetching partner details:', err);
        setError('Error fetching partner details.');
      }
    };

    const fetchOfferSnapshots = async () => {
      try {
        console.log('Fetching offer snapshots...');
        const response = await axios.get('http://localhost:3000/api/v2/offer-snapshots');
        setOfferSnapshots(response.data);
        setFilteredOffers(response.data); // Display all offers initially
      } catch (err) {
        console.error('Error fetching offer snapshots:', err);
        setError('Error fetching offer snapshots.');
      }
    };

    fetchPartner();
    fetchOfferSnapshots();
  }, [id]);

  // Handle searching offers by zip code
  const handleZipCodeSearch = () => {
    if (!zipCode) {
      setFilteredOffers(offerSnapshots); // Show all offers if Zip Code is cleared
    } else {
      const offersByZip = offerSnapshots.filter(offer =>
        offer.zip_codes.includes(zipCode)
      );
      setFilteredOffers(offersByZip);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Partner Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{partner.name || 'Partner Name'}</Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {partner.description || 'No description available.'}
          </Typography>
          <Typography variant="body1">
            <strong>Number of Houses Using Service:</strong> {partner.housesUsingService || 0}
          </Typography>
        </CardContent>
      </Card>

      {/* Offer Snapshots Section */}
      {partner.name === 'Rhythm' && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>Offer Snapshots</Typography>

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
