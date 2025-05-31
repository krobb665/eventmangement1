import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, signIn } = useSignIn();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  useEffect(() => {
    // If no email in state, redirect to forgot password
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);
  
  const handleSendCode = async (e) => {
    e?.preventDefault();
    
    if (!isLoaded) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Request password reset code
      await signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });
      
      setIsCodeSent(true);
    } catch (err) {
      console.error('Error sending reset code:', err);
      setError(err.errors?.[0]?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (!isLoaded) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Reset the password
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });
      
      if (result.status === 'complete') {
        setIsSuccess(true);
        
        // Auto-login the user after a short delay
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Password reset successful. Please sign in with your new password.',
            },
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.errors?.[0]?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!email) {
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
          Reset Your Password
        </Typography>
        
        {!isCodeSent && !isSuccess && (
          <>
            <Typography variant="body1" color="textSecondary" align="center" paragraph>
              We'll send a verification code to <strong>{email}</strong> to reset your password.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendCode}
              disabled={isLoading}
              sx={{ mt: 2, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send Verification Code'}
            </Button>
            
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
          </>
        )}
        
        {isCodeSent && !isSuccess && (
          <Box component="form" onSubmit={handleResetPassword} width="100%" mt={2}>
            <Typography variant="body2" color="textSecondary" paragraph>
              We've sent a verification code to <strong>{email}</strong>.
              Please enter the code and your new password below.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              margin="normal"
              label="Verification Code"
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
            
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Must be at least 8 characters long"
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={newPassword !== confirmPassword && confirmPassword !== ''}
              helperText={
                newPassword !== confirmPassword && confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                isLoading ||
                !code ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              sx={{ mt: 2, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
            
            <Box mt={2} textAlign="center" width="100%">
              <MuiLink
                component="button"
                type="button"
                variant="body2"
                onClick={handleSendCode}
                disabled={isLoading}
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Didn't receive a code? Resend
              </MuiLink>
            </Box>
          </Box>
        )}
        
        {isSuccess && (
          <Box textAlign="center" width="100%">
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              Your password has been reset successfully! Redirecting to login...
            </Alert>
            
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
