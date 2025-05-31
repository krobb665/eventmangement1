import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TaskDetailPage = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg">
      <Button
        component={Link}
        to="/tasks"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Tasks
      </Button>
      
      <Box mt={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Details
        </Typography>
        <Typography variant="body1">
          Viewing task with ID: {id}
        </Typography>
      </Box>
    </Container>
  );
};

export default TaskDetailPage;
