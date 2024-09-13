import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes } from './themes';
import { ThemeContextType } from './theme.types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use local storage to persist theme between sessions
  const [themeName, setThemeName] = useState<string>(() => localStorage.getItem('theme') || 'light');

  const applyTheme = (themeName: string) => {
    // Optionally get the current light theme (if multiple light themes exist)
    const lightTheme = localStorage.getItem('lightTheme') || 'casual';
    const theme = themeName === 'light' ? themes[lightTheme.toLowerCase()] : themes['dark'];

    // Apply the selected theme to the CSS variables
    Object.keys(theme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newThemeName = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName);
    applyTheme(newThemeName);
  };

  // Toggle between different light themes if desired
  const toggleLightThemeChange = () => {
    if (themeName === 'light') {
      applyTheme('light'); // Assuming you're changing to a new light theme
    }
  };

  // Apply the theme when the component mounts or when the themeName changes
  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, toggleLightThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};