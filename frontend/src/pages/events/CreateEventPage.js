import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CreateEventPage = () => {
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
          Create New Event
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Event creation form will be displayed here
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled
        >
          Create Event
        </Button>
      </Box>
    </Container>
  );
};

export default CreateEventPage;
