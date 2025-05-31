import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const EditEventPage = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg">
      <Button
        component={Link}
        to={`/events/${id}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Event
      </Button>
      
      <Box mt={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Event
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Editing event with ID: {id}
        </Typography>
      </Box>
      
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default EditEventPage;
