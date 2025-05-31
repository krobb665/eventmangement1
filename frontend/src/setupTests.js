// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';

// Enable the fetch mock
import 'whatwg-fetch';

// Mock the WebSocket object
class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.onopen = jest.fn();
    this.onclose = jest.fn();
    this.onmessage = jest.fn();
    this.onerror = jest.fn();
    this.readyState = WebSocket.OPEN;
  }
  
  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose();
  }
  
  send(data) {
    // Mock send implementation
  }
}

global.WebSocket = WebSocketMock;

// Mock the matchMedia API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Configure test-id attribute for testing-library
configure({ testIdAttribute: 'data-testid' });

// Mock the ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock the scrollTo method
window.scrollTo = jest.fn();

// Mock the IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

window.IntersectionObserver = IntersectionObserver;

// Mock the scrollIntoView method
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the getComputedStyle method
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

// Mock the localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Set up MSW server for API mocking
beforeAll(() => {
  // Start the mock service worker
  server.listen({
    onUnhandledRequest: 'warn',
  });
  
  // Mock the current date for consistent testing
  const mockDate = new Date('2025-01-01T00:00:00.000Z');
  jest.useFakeTimers('modern');
  jest.setSystemTime(mockDate);
});

// Reset any request handlers that we may add during the tests
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset the mock server handlers
  server.resetHandlers();
  
  // Clear the local and session storage
  localStorage.clear();
  sessionStorage.clear();
});

// Clean up after the tests are done
afterAll(() => {
  // Clean up the mock service worker
  server.close();
  
  // Reset the timers
  jest.useRealTimers();
});

// Mock the console.error to fail tests on prop-type errors
const originalConsoleError = console.error;
console.error = (message, ...args) => {
  if (/(Failed prop type)/.test(message)) {
    throw new Error(message);
  }
  originalConsoleError(message, ...args);
};

// Mock the console.warn to fail tests on deprecation warnings
const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
  if (/(deprecated|Deprecation|Warning: componentWill)/i.test(message)) {
    throw new Error(`Warning: ${message}`);
  }
  originalConsoleWarn(message, ...args);
};

// Mock the console.log to prevent cluttering test output
console.log = jest.fn();
console.info = jest.fn();
console.debug = jest.fn();
