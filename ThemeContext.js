import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    colors: {
      background: isDark ? '#121212' : '#f8f9fa',
      cardBackground: isDark ? '#1e1e1e' : '#ffffff',
      textPrimary: isDark ? '#ffffff' : '#2d3436',
      textSecondary: isDark ? '#b0b0b0' : '#6c757d',
      buttonBackground: isDark ? '#bb86fc' : '#007bff',
      border: isDark ? '#373737' : '#dee2e6',
    },
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);