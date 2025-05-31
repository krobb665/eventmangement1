import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/events/create"
        >
          New Event
        </Button>
      </Box>
      
      <Box mt={4} textAlign="center">
        <Typography variant="h6" color="textSecondary">
          Events list will be displayed here
        </Typography>
      </Box>
    </Container>
  );
};

export default EventsPage;
