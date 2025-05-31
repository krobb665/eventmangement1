import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions,
  Divider,
  useTheme
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  Assignment as TaskIcon,
  Store as VendorIcon,
  Receipt as BudgetIcon,
  BarChart as ReportIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const { user } = useUser();
  const theme = useTheme();

  const quickActions = [
    { 
      title: 'Create Event', 
      icon: <EventIcon fontSize="large" color="primary" />, 
      to: '/events/create',
      color: theme.palette.primary.main
    },
    { 
      title: 'Add Guest', 
      icon: <PeopleIcon fontSize="large" color="secondary" />, 
      to: '/guests/create',
      color: theme.palette.secondary.main
    },
    { 
      title: 'Add Task', 
      icon: <TaskIcon fontSize="large" style={{ color: theme.palette.success.main }} />, 
      to: '/tasks/create',
      color: theme.palette.success.main
    },
    { 
      title: 'Add Vendor', 
      icon: <VendorIcon fontSize="large" style={{ color: theme.palette.warning.main }} />, 
      to: '/vendors/create',
      color: theme.palette.warning.main
    },
  ];

  const stats = [
    { title: 'Upcoming Events', value: '5', to: '/events' },
    { title: 'Pending Tasks', value: '12', to: '/tasks' },
    { title: 'Total Guests', value: '243', to: '/guests' },
    { title: 'Active Vendors', value: '8', to: '/vendors' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your events today.
        </Typography>
      </Box>


      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              component={Link} 
              to={action.to}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                {action.icon}
                <Typography variant="h6" component="h3" sx={{ mt: 1, color: action.color }}>
                  {action.title}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'center', py: 1 }}>
                <Button size="small" color="primary">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats Overview */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              component={Link} 
              to={stat.to}
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography variant="h4" component="div" color="primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity to display.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
