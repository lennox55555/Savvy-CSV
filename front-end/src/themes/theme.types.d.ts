export type ThemeType = {
    [key: string]: string;
};
export interface ThemeContextType {
    themeName: string;
    toggleTheme: () => void;
    toggleLightThemeChange: () => void;
}
