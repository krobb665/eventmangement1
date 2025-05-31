import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';

// Create the context with default values
const WebSocketContext = createContext({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => () => {},
  off: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  getSocket: () => null,
});

// WebSocketManager component that handles the WebSocket connection
export const WebSocketProvider = ({ children, token }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const eventHandlersRef = useRef({});
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);
  const dispatch = useDispatch();

  // Attempt to reconnect with exponential backoff
  const attemptReconnect = useCallback((authToken) => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
    
    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current++;
      
      // Reconnect logic
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          auth: { token: authToken },
          transports: ['websocket'],
          reconnection: false,
        });

        socket.on('connect', () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          reconnectAttempts.current = 0;
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          setIsConnected(false);
          
          // Attempt to reconnect if this wasn't a manual disconnection
          if (reason === 'io server disconnect') {
            // The disconnection was initiated by the server, we need to reconnect manually
            socket.connect();
          } else if (reason !== 'io client disconnect') {
            // Otherwise, attempt to reconnect with backoff
            attemptReconnect(authToken);
          }
        });

        socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          setIsConnected(false);
          attemptReconnect(authToken);
        });

        // Handle notifications from server
        socket.on('notification', (data) => {
          dispatch(
            addNotification({
              type: data.type || 'info',
              message: data.message,
              autoHideDuration: data.autoHideDuration || 5000,
            })
          );
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        attemptReconnect(authToken);
      }
    }, delay);
  }, [dispatch, maxReconnectAttempts]);

  // Connect WebSocket with authentication
  const connectWebSocket = useCallback((authToken) => {
    if (!authToken) {
      console.log('No auth token provided, skipping WebSocket connection');
      return;
    }
    console.log('Connecting WebSocket with token');
    attemptReconnect(authToken);
  }, [attemptReconnect]);

  // Connect on mount and when token changes
  useEffect(() => {
    if (token) {
      connectWebSocket(token);
    }

    return () => {
      // Cleanup on unmount
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, connectWebSocket]);

  // Register an event handler
  const on = useCallback((event, handler) => {
    if (!socketRef.current) return () => {};
    
    socketRef.current.on(event, handler);
    
    // Store the handler for cleanup
    if (!eventHandlersRef.current[event]) {
      eventHandlersRef.current[event] = [];
    }
    eventHandlersRef.current[event].push(handler);
    
    // Return cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
        if (eventHandlersRef.current[event]) {
          eventHandlersRef.current[event] = eventHandlersRef.current[event].filter(
            h => h !== handler
          );
        }
      }
    };
  }, []);

  // Remove an event handler
  const off = useCallback((event, handler) => {
    if (!socketRef.current) return;
    
    if (handler) {
      socketRef.current.off(event, handler);
      if (eventHandlersRef.current[event]) {
        eventHandlersRef.current[event] = eventHandlersRef.current[event].filter(
          h => h !== handler
        );
      }
    } else {
      socketRef.current.off(event);
      eventHandlersRef.current[event] = [];
    }
  }, []);

  // Emit an event to the server
  const emit = useCallback((event, data, callback) => {
    if (!socketRef.current) {
      console.error('WebSocket is not connected');
      return false;
    }
    
    if (callback) {
      return socketRef.current.emit(event, data, callback);
    } else {
      return socketRef.current.emit(event, data);
    }
  }, []);

  // Join a room
  const joinRoom = useCallback((room) => {
    if (!socketRef.current) return;
    emit('join_room', { room });
  }, [emit]);

  // Leave a room
  const leaveRoom = useCallback((room) => {
    if (!socketRef.current) return;
    emit('leave_room', { room });
  }, [emit]);

  // Get the socket instance
  const getSocket = useCallback(() => {
    return socketRef.current;
  }, []);

  // Context value
  const contextValue = {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
    getSocket,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use the WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
