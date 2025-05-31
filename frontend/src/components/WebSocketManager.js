import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { WebSocketProvider } from '../contexts/WebSocketContext';

const WebSocketManager = ({ children }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [authToken, setAuthToken] = useState(null);
  
  // Memoize the token getter function
  const fetchToken = useCallback(async () => {
    if (!isLoaded) return null;
    
    try {
      if (isSignedIn) {
        const token = await getToken();
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }, [getToken, isLoaded, isSignedIn]);
  
  // Handle token updates
  useEffect(() => {
    let isMounted = true;
    
    const updateToken = async () => {
      const token = await fetchToken();
      if (isMounted) {
        setAuthToken(token);
      }
    };
    
    updateToken();
    
    // Set up an interval to refresh the token periodically
    const tokenRefreshInterval = setInterval(() => {
      updateToken();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(tokenRefreshInterval);
    };
  }, [fetchToken]);

  // Only render WebSocketProvider when we have a valid auth token
  if (!isLoaded) {
    return <>{children}</>; // Or a loading spinner
  }

  return (
    <WebSocketProvider token={authToken}>
      {children}
    </WebSocketProvider>
  );
};

export default WebSocketManager;
