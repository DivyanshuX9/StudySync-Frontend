import React, { createContext, useContext } from "react";

// ThemeContext is now a thin wrapper — the real tone is driven by WeatherContext.
// We keep it so existing imports don't break.
const ThemeContext = createContext({ isDark: false, toggle: () => {} });

export const ThemeProvider = ({ children }) => children;

export const useTheme = () => useContext(ThemeContext);
