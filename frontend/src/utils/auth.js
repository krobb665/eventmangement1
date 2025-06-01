// Clerk configuration
export const clerkConfig = {
  // Production publishable key
  publishableKey: process.env.REACT_APP_CLERK_PUBLISHABLE_KEY,
  // Custom domain for production
  domain: process.env.REACT_APP_CLERK_DOMAIN,
  // Enable Clerk's hosted pages
  signInUrl: process.env.REACT_APP_CLERK_SIGN_IN_URL,
  signUpUrl: process.env.REACT_APP_CLERK_SIGN_UP_URL,
  afterSignInUrl: process.env.REACT_APP_CLERK_AFTER_SIGN_IN_URL,
  afterSignUpUrl: process.env.REACT_APP_CLERK_AFTER_SIGN_UP_URL,
  // Enable Clerk's account portal
  userProfileUrl: '/user',
  // Appearance settings
  appearance: {
    variables: {
      colorPrimary: '#1976d2', // Match your theme's primary color
    },
  },
  // Enable production mode
  isSatellite: false,
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
};

// Note: These functions should be used in a React component with ClerkProvider
// or with the useAuth/useUser hooks

// Get the Clerk token
export const getToken = async (auth) => {
  if (!auth) {
    console.error('Auth object is required');
    return null;
  }
  
  try {
    const token = await auth.getToken();
    return token;
  } catch (err) {
    console.error('Error getting Clerk token:', err);
    return null;
  }
};

// Get the current user
export const getUser = (auth) => {
  if (!auth) {
    console.error('Auth object is required');
    return null;
  }
  return auth.user || null;
};

// Check if user is authenticated
export const isAuthenticated = (auth) => {
  if (!auth) {
    console.error('Auth object is required');
    return false;
  }
  return auth.isSignedIn || false;
};

// Check if user has specific role
export const hasRole = (auth, role) => {
  const user = getUser(auth);
  return user?.publicMetadata?.roles?.includes(role) || false;
};

// Check if user has any of the specified roles
export const hasAnyRole = (auth, roles) => {
  const user = getUser(auth);
  return user?.publicMetadata?.roles?.some(role => roles.includes(role)) || false;
};

// Get user initials
export const getUserInitials = (auth, user = null) => {
  const targetUser = user || getUser(auth);
  if (!targetUser) return '';
  
  const { firstName, lastName, email } = targetUser;
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  
  if (email) {
    return email[0].toUpperCase();
  }
  
  return 'U';
};

// Get user full name
export const getFullName = (auth, user = null) => {
  const targetUser = user || getUser(auth);
  if (!targetUser) return 'Guest';
  
  const { firstName, lastName, email } = targetUser;
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) {
    return firstName;
  }
  
  return email || 'Guest';
};

// Get user avatar URL
export const getAvatarUrl = (auth, user = null, size = 200) => {
  const targetUser = user || getUser(auth);
  if (!targetUser) return '';
  
  return targetUser.profileImageUrl || `https://ui-avatars.com/api/?name=${getUserInitials(auth, targetUser)}&background=random&size=${size}`;
};

// Format date
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', defaultOptions);
  } catch (err) {
    console.error('Error formatting date:', err);
    return '';
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (err) {
    console.error('Error formatting currency:', err);
    return amount.toString();
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// For backward compatibility
export const setUser = (user) => {
  console.warn('setUser is deprecated. Use Clerk\'s built-in user management instead.');
};

export const setTokens = (accessToken, refreshToken) => {
  console.warn('setTokens is deprecated. Clerk handles token management automatically.');
};

export const removeTokens = () => {
  console.warn('removeTokens is deprecated. Use Clerk\'s signOut method instead.');
};

export const getRefreshToken = () => {
  console.warn('getRefreshToken is deprecated. Clerk handles token management automatically.');
  return null;
};
