import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title = 'Page' }) => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
        textAlign="center"
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          This page is coming soon!
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          We're working hard to bring you this feature. Please check back later.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default ComingSoon;
