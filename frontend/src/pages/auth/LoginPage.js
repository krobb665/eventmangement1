import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Link as MuiLink,
  Container,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useSignIn, useAuth } from '@clerk/clerk-react';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already logged in
  useEffect(() => {
    if (isSignedIn) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isSignedIn, navigate, location.state]);
  
  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setIsSubmitting(true);
      
      if (!isLoaded) {
        setError('Authentication service not ready');
        setIsSubmitting(false);
        return;
      }
      
      try {
        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        });
        
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          navigate(from, { replace: true });
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.errors?.[0]?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider) => {
    if (!isLoaded) return;
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth',
        provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err) {
      console.error('OAuth error:', err);
      setError(err.errors?.[0]?.message || 'Failed to sign in with OAuth');
    }
  };
  
  const handleDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);
    
    if (!isLoaded) {
      setError('Authentication service not ready');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Replace with your demo account credentials
      const result = await signIn.create({
        identifier: 'demo@example.com',
        password: 'demoPassword123!',
      });
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate(from, { replace: true });
      } else {
        setError('Demo login failed. Please try again.');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err.errors?.[0]?.message || 'Failed to log in with demo account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Welcome Back
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
        Sign in to your account to continue
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleOAuthSignIn('google')}
          startIcon={<img src="/google-icon.svg" alt="Google" width={20} />}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleOAuthSignIn('github')}
          startIcon={<img src="/github-icon.svg" alt="GitHub" width={20} />}
        >
          GitHub
        </Button>
      </Box>
      
      <Divider sx={{ my: 3 }}>OR</Divider>
      
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          disabled={isSubmitting}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <MuiLink 
            component={RouterLink} 
            to="/forgot-password" 
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot password?
          </MuiLink>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">OR</Typography>
        </Divider>
        
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleOAuthSignIn('google')}
          startIcon={<GoogleIcon />}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          sx={{ mb: 2, py: 1.5 }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Try Demo Account'
          )}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <MuiLink component={RouterLink} to="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </MuiLink>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
