import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  Grid,
  Link as MuiLink,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSignUp, useSignIn } from '@clerk/clerk-react';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(50, 'First name must be at most 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .max(50, 'Last name must be at most 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoaded } = useSignUp();
  const { signIn: clerkSignIn } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      setIsSubmitting(true);
      
      try {
        if (!signUp) {
          throw new Error('Authentication service not ready');
        }
        
        // Start the sign-up process
        await signUp.create({
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.email,
          password: values.password,
        });
        
        // Send verification email
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        
        // Redirect to verify email page
        navigate('/verify-email', { 
          state: { 
            email: values.email,
            from: location.state?.from || '/',
            message: 'Please verify your email address to continue.'
          } 
        });
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleOAuthSignUp = async (provider) => {
    try {
      if (!clerkSignIn) {
        throw new Error('Authentication service not ready');
      }
      
      await clerkSignIn.authenticateWithRedirect({
        strategy: 'oauth',
        provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || 'An unexpected error occurred. Please try again.');
      console.error('OAuth registration error:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create an account
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Join us today and start managing your events
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOAuthSignUp('google')}
            disabled={isSubmitting}
            startIcon={<img src="/google-icon.svg" alt="Google" width={20} />}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleOAuthSignUp('github')}
            disabled={isSubmitting}
            startIcon={<img src="/github-icon.svg" alt="GitHub" width={20} />}
          >
            Continue with GitHub
          </Button>
        </Box>
        <Divider sx={{ my: 3 }}>OR</Divider>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password ? formik.errors.password : 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character'}
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
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          disabled={isSubmitting}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              name="acceptTerms"
              color="primary"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isSubmitting}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <MuiLink component={RouterLink} to="/terms" color="primary">
                Terms of Service
              </MuiLink>{' '}
              and{' '}
              <MuiLink component={RouterLink} to="/privacy" color="primary">
                Privacy Policy
              </MuiLink>
            </Typography>
          }
          sx={{ mt: 2, mb: 1 }}
        />
        
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <Typography color="error" variant="caption" display="block" gutterBottom>
            {formik.errors.acceptTerms}
          </Typography>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting || !formik.isValid}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create Account'
          )}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <MuiLink 
              component={RouterLink} 
              to="/login" 
              color="primary" 
              sx={{ 
                fontWeight: 500, 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
