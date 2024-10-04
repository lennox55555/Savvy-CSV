import React, { ReactNode } from 'react';
import { ThemeContextType } from './theme.types';
export declare const useTheme: () => ThemeContextType;
interface ThemeProviderProps {
    children: ReactNode;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export {};
