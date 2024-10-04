import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from './themes';
var ThemeContext = createContext(undefined);
export var useTheme = function () {
    var context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export var ThemeProvider = function (_a) {
    var children = _a.children;
    // Use local storage to persist theme between sessions
    var _b = useState(function () { return localStorage.getItem('theme') || 'light'; }), themeName = _b[0], setThemeName = _b[1];
    var applyTheme = function (themeName) {
        // Optionally get the current light theme (if multiple light themes exist)
        var lightTheme = localStorage.getItem('lightTheme') || 'casual';
        var theme = themeName === 'light' ? themes[lightTheme.toLowerCase()] : themes['dark'];
        // Apply the selected theme to the CSS variables
        Object.keys(theme).forEach(function (key) {
            document.documentElement.style.setProperty("--".concat(key), theme[key]);
        });
    };
    // Toggle between light and dark themes
    var toggleTheme = function () {
        var newThemeName = themeName === 'light' ? 'dark' : 'light';
        setThemeName(newThemeName);
        localStorage.setItem('theme', newThemeName);
        applyTheme(newThemeName);
    };
    // Toggle between different light themes if desired
    var toggleLightThemeChange = function () {
        if (themeName === 'light') {
            applyTheme('light'); // Assuming you're changing to a new light theme
        }
    };
    // Apply the theme when the component mounts or when the themeName changes
    useEffect(function () {
        applyTheme(themeName);
    }, [themeName]);
    return (React.createElement(ThemeContext.Provider, { value: { themeName: themeName, toggleTheme: toggleTheme, toggleLightThemeChange: toggleLightThemeChange } }, children));
};
