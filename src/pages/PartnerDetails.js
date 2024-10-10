import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, List, ListItem, Alert } from '@mui/material';

const PartnerDetails = () => {
  const { id } = useParams();
  const [partnerPlans, setPartnerPlans] = useState([]); // State to hold service plans
  const [partner, setPartner] = useState({}); // State to hold partner details
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        console.log(`Fetching partner details for ID: ${id}`);
        const response = await axios.get(`http://localhost:3000/api/partners/${id}`);
        setPartner(response.data);
      } catch (err) {
        console.error('Error fetching partner details:', err);
        setError('Error fetching partner details.');
      }
    };

    const fetchPartnerPlans = async () => {
      try {
        console.log(`Fetching service plans for partner ID: ${id}`);
        const plansResponse = await axios.get(`http://localhost:3000/api/partners/${id}/service-plans`);
        setPartnerPlans(plansResponse.data);
      } catch (err) {
        console.error('Error fetching service plans:', err);
        setError('Error fetching service plans.');
      }
    };

    fetchPartner();
    fetchPartnerPlans();
  }, [id]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!partner || !partnerPlans) {
    return <Typography>Loading partner details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Partner Basic Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{partner.name || 'Partner Name'}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {partner.description || 'No description available.'}</Typography>
          <Typography variant="body1"><strong>Number of Houses Using Service:</strong> {partner.housesUsingService || 0}</Typography>
        </CardContent>
      </Card>

      {/* Service Plans */}
      <Typography variant="h5" sx={{ mb: 2 }}>Service Plans</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {partnerPlans.length > 0 ? (
              partnerPlans.map((plan, index) => (
                <ListItem key={index}>
                  {plan.name} - {plan.price}
                </ListItem>
              ))
            ) : (
              <Typography>No service plans available.</Typography>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {partner.paymentDetails ? (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>Payment Information</Typography>
          <Card>
            <CardContent>
              <Typography variant="body1"><strong>Last Payment Date:</strong> {partner.paymentDetails.lastPaymentDate || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Amount Paid:</strong> {partner.paymentDetails.amountPaid || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Bank Name:</strong> {partner.paymentDetails.bankName || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Account Number:</strong> {partner.paymentDetails.accountNumber || '**** **** **** 1234'}</Typography>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">No payment information available.</Alert>
      )}
    </Box>
  );
};

export default PartnerDetails;
