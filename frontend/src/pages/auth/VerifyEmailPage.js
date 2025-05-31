import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSignUp, useSignIn } from '@clerk/clerk-react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded } = useSignIn();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Get email from location state or signUp.attemptNextAction
  const email = location.state?.email || signUp?.emailAddress || '';
  
  useEffect(() => {
    // If we don't have an email and no sign-up in progress, redirect to sign up
    if (!email && (!isSignUpLoaded || !signUp)) {
      navigate('/register');
    }
  }, [email, isSignUpLoaded, signUp, navigate]);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!isSignUpLoaded || !isSignInLoaded) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Complete the sign up process
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      if (completeSignUp.status === 'complete') {
        // Create a session for the user
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Redirect to the intended page or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!isSignUpLoaded) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }
    
    setResendLoading(true);
    setError('');
    setResendSuccess(false);
    
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setResendSuccess(true);
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  const handleSignInLink = () => {
    navigate('/login', {
      state: {
        email: email,
        message: 'Your email has been verified. Please sign in to continue.',
      },
    });
  };
  
  if (!isSignUpLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box
      maxWidth={500}
      mx="auto"
      p={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        Verify Your Email
      </Typography>
      
      <Typography variant="body1" color="textSecondary" align="center" paragraph>
        We've sent a verification code to <strong>{email}</strong>.
        Please enter the code below to verify your email address.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {resendSuccess && (
        <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
          A new verification code has been sent to your email.
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleVerify} width="100%">
        <TextField
          fullWidth
          margin="normal"
          label="Verification Code"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoFocus
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            maxLength: 6,
          }}
          helperText="Enter the 6-digit code from your email"
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading || !code}
          sx={{ mt: 2, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Verify Email'}
        </Button>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Didn't receive a code?{' '}
            <Link
              component="button"
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </Link>
          </Typography>
          
          <Typography variant="body2" color="textSecondary" mt={2}>
            Already verified?{' '}
            <Link
              component="button"
              type="button"
              onClick={handleSignInLink}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmailPage;
