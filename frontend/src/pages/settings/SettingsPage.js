import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Payment as BillingIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Palette as PaletteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSaveSettings = () => {
    showMessage('Settings saved successfully!');
  };

  const notificationSettings = [
    { id: 1, name: 'Email Notifications', enabled: true },
    { id: 2, name: 'Push Notifications', enabled: true },
    { id: 3, name: 'SMS Alerts', enabled: false },
    { id: 4, name: 'Event Reminders', enabled: true },
  ];

  const connectedAccounts = [
    { id: 1, name: 'Google', email: 'user@gmail.com' },
    { id: 2, name: 'Facebook', email: 'user@facebook.com' },
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="settings tabs"
          >
            <Tab label="General" />
            <Tab label="Notifications" />
            <Tab label="Appearance" />
            <Tab label="Security" />
            <Tab label="Account" />
          </Tabs>
          
          <Divider />
          
          <Box p={3}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  General Settings
                </Typography>
                <TextField
                  label="Time Zone"
                  select
                  fullWidth
                  margin="normal"
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  <option value="">Select Time Zone</option>
                  <option value="pst">Pacific Time (PST/PDT)</option>
                  <option value="mst">Mountain Time (MST/MDT)</option>
                  <option value="cst">Central Time (CST/CDT)</option>
                  <option value="est">Eastern Time (EST/EDT)</option>
                </TextField>
                
                <TextField
                  label="Date Format"
                  select
                  fullWidth
                  margin="normal"
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </TextField>
                
                <Box mt={3}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <List>
                  {notificationSettings.map((setting) => (
                    <ListItem key={setting.id}>
                      <ListItemText 
                        primary={setting.name}
                        secondary={`${setting.enabled ? 'Enabled' : 'Disabled'}`}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={setting.enabled}
                          onChange={() => {}}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                <Box mt={3}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSaveSettings}
                  >
                    Save Notification Settings
                  </Button>
                </Box>
              </Box>
            )}
            
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Theme & Appearance
                </Typography>
                <FormControlLabel
                  control={<Switch />}
                  label="Dark Mode"
                />
                <Typography variant="body2" color="textSecondary" paragraph>
                  Toggle between light and dark theme
                </Typography>
                
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Theme Color
                  </Typography>
                  <Box display="flex" gap={2} mb={3}>
                    {['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2'].map((color) => (
                      <Box
                        key={color}
                        width={40}
                        height={40}
                        bgcolor={color}
                        borderRadius="50%"
                        sx={{ cursor: 'pointer', border: '2px solid transparent', '&:hover': { borderColor: 'primary.main' } }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveSettings}
                >
                  Save Appearance Settings
                </Button>
              </Box>
            )}
            
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Security
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <Button variant="outlined" size="small">
                      Enable 2FA
                    </Button>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Change Password"
                      secondary="Last changed 3 months ago"
                    />
                    <Button variant="outlined" size="small">
                      Change
                    </Button>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Login Activity"
                      secondary="View recent login attempts"
                    />
                    <Button variant="outlined" size="small">
                      View
                    </Button>
                  </ListItem>
                </List>
                
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Connected Accounts
                  </Typography>
                  <List>
                    {connectedAccounts.map((account) => (
                      <ListItem key={account.id}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {account.name[0]}
                        </Avatar>
                        <ListItemText 
                          primary={account.name}
                          secondary={account.email}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={handleMenuOpen}>
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <ListItemText primary="Disconnect" />
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
            
            {tabValue === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Export Data
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Download a copy of your personal data
                  </Typography>
                  <Button variant="outlined" color="primary">
                    Request Data Export
                  </Button>
                </Box>
                
                <Box mt={4}>
                  <Typography variant="subtitle1" gutterBottom color="error">
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Delete My Account
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
