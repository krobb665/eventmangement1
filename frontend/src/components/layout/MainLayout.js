import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Container, CssBaseline, Typography } from '@mui/material';
import UserButton from '../auth/UserButton';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={0} color="default">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <img 
              src="/logo192.png" 
              alt="Logo" 
              style={{ height: 40, cursor: 'pointer' }} 
              onClick={() => window.location.href = '/'}
            />
          </Box>
          <UserButton />
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      
      {/* Footer */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => 
        theme.palette.mode === 'light'
          ? theme.palette.grey[200]
          : theme.palette.grey[800],
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Event Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
