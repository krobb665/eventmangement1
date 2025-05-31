import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link as MuiLink,
  Container,
  Paper,
} from '@mui/material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { isLoaded } = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // This will send a reset password email to the user
      await window.Clerk.client.signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });
      
      // Navigate to reset password page with email pre-filled
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(err.errors?.[0]?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        
        <Typography variant="body1" color="textSecondary" align="center" paragraph>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
            Password reset instructions have been sent to your email.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} width="100%" mt={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="Enter your email address"
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading || !email}
              sx={{ mt: 2, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
          </Box>
        )}
        
        <Box mt={2} textAlign="center" width="100%">
          <MuiLink
            component={Link}
            to="/login"
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Back to Sign In
          </MuiLink>
        </Box>
        
        <Box mt={2} textAlign="center" width="100%">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <MuiLink
              component={Link}
              to="/register"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
