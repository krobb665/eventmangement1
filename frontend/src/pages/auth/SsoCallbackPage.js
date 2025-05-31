import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Box, CircularProgress, Typography } from '@mui/material';

const SsoCallbackPage = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignInLoaded || !isSignUpLoaded) return;

    const handleCallback = async () => {
      try {
        // Check if this is a sign in attempt
        if (signIn.attemptFirstFactor) {
          await signIn.attemptFirstFactor({
            strategy: 'oauth_callback',
            redirectUrl: window.location.href,
          });
          navigate('/');
          return;
        }

        // Check if this is a sign up attempt
        if (signUp.attemptEmailAddressVerification) {
          await signUp.attemptEmailAddressVerification({
            strategy: 'oauth_callback',
            redirectUrl: window.location.href,
          });
          navigate('/');
          return;
        }

        // If we get here, something went wrong
        console.error('Unexpected OAuth callback state');
        navigate('/login');
      } catch (err) {
        console.error('Error during OAuth callback:', err);
        navigate('/login', {
          state: {
            error: 'An error occurred during authentication. Please try again.',
          },
        });
      }
    };

    handleCallback();
  }, [signIn, signUp, isSignInLoaded, isSignUpLoaded, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Completing Authentication
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Please wait while we sign you in...
      </Typography>
    </Box>
  );
};

export default SsoCallbackPage;
