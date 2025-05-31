import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NotFoundPage from './NotFoundPage';

const theme = createTheme();

describe('NotFoundPage', () => {
  test('renders 404 page with correct content', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NotFoundPage />
        </Router>
      </ThemeProvider>
    );

    // Check if the main heading is rendered
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    
    // Check if the subtitle is rendered
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(
      screen.getByText(/the page you are looking for does not exist or has been moved/i)
    ).toBeInTheDocument();
    
    // Check if the back to home button is rendered
    const backButton = screen.getByRole('button', { name: /back to home/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton.closest('a')).toHaveAttribute('href', '/');
  });

  test('matches snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NotFoundPage />
        </Router>
      </ThemeProvider>
    );
    
    expect(container).toMatchSnapshot();
  });
});
