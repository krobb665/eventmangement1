import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const EventDetailPage = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg">
      <Button
        component={Link}
        to="/events"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Events
      </Button>
      
      <Box mt={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Details
        </Typography>
        <Typography variant="body1">
          Viewing event with ID: {id}
        </Typography>
      </Box>
    </Container>
  );
};

export default EventDetailPage;
