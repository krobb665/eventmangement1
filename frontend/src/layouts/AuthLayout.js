import React from 'react';
import { Box, Container, CssBaseline, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 500,
      marginBottom: '1.5rem',
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1.5rem',
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 12,
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    boxShadow: 'none',
  },
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  textDecoration: 'none',
  color: 'inherit',
}));

const LogoText = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginLeft: '0.5rem',
  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const AuthLayout = ({ children, title, subtitle, footerText, footerLink, footerLinkText }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
      >
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <StyledPaper elevation={3}>
            <Logo component={Link} to="/">
              <Box
                component="span"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                EM
              </Box>
              <LogoText variant="h5" component="h1">
                EventMgr
              </LogoText>
            </Logo>
            
            {title && (
              <Typography component="h1" variant="h4" align="center">
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                {subtitle}
              </Typography>
            )}
            
            {children}
            
            {footerText && (
              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  {footerText}{' '}
                  {footerLink && footerLinkText && (
                    <StyledLink to={footerLink}>
                      {footerLinkText}
                    </StyledLink>
                  )}
                </Typography>
              </Box>
            )}
          </StyledPaper>
          
          <Box mt={5} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} EventMgr. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
