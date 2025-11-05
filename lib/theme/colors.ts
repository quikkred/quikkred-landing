/**
 * Theme Color Configuration
 * Centralized color system for easy theme management
 */

export const themes = {
  light: {
    // Primary Brand Colors - New Green Palette
    primary: {
      50: '#FFFFFF',
      100: '#D3F1EB',
      200: '#A8E3D7',
      300: '#7CDAC3',
      400: '#51C9AF',
      500: '#25B181',  // Main primary green
      600: '#1F8F68',
      700: '#1A6D4F',
      800: '#144B37',
      900: '#0E2920',
    },

    // Secondary/Accent Colors - New Blue Palette
    secondary: {
      50: '#FFFFFF',
      100: '#DAE6FF',
      200: '#B6CEFF',
      300: '#91B3FF',
      400: '#6D90FF',
      500: '#4A66FF',  // Main secondary blue
      600: '#3B52CC',
      700: '#2C3E99',
      800: '#1E2966',
      900: '#0F1533',
    },

    // Warning/Accent Colors - New Orange Palette
    accent: {
      50: '#FFF4E4',
      100: '#FFEBD1',
      200: '#FFD9B0',
      300: '#FFC690',
      400: '#FFB170',
      500: '#FF9C70',  // Main accent orange
      600: '#E36229',
      700: '#C44F1F',
      800: '#A43C16',
      900: '#85290C',
    },

    // Neutral/Gray Colors - New Neutral Palette
    neutral: {
      50: '#FFFFFF',
      100: '#F5F5F5',
      200: '#DAD8D8',
      300: '#BCBCBC',
      400: '#A0A0A0',
      500: '#818181',
      600: '#616161',
      700: '#464646',
      800: '#2E2E2E',
      900: '#1A1A1A',
    },

    // Semantic Colors - New Semantic Palette
    success: {
      light: '#E7F4EB',
      DEFAULT: '#3AC6A0',
      dark: '#26907F',
    },
    error: {
      light: '#FFE2E5',
      DEFAULT: '#FF616B',
      dark: '#E02431',
    },
    warning: {
      light: '#FFF4E4',
      DEFAULT: '#FF9C70',
      dark: '#E36229',
    },
    info: {
      light: '#DAE6FF',
      DEFAULT: '#6D90FF',
      dark: '#4A66FF',
    },

    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      modal: '#ffffff',
    },

    // Text Colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },

    // Border Colors
    border: {
      light: '#f1f5f9',
      DEFAULT: '#e2e8f0',
      dark: '#cbd5e1',
    },
  },

  dark: {
    // Primary Brand Colors - New Green Palette (Inverted)
    primary: {
      50: '#0E2920',
      100: '#144B37',
      200: '#1A6D4F',
      300: '#1F8F68',
      400: '#25B181',
      500: '#51C9AF',  // Main primary (brighter for dark mode)
      600: '#7CDAC3',
      700: '#A8E3D7',
      800: '#D3F1EB',
      900: '#FFFFFF',
    },

    // Secondary/Accent Colors - New Blue Palette (Inverted)
    secondary: {
      50: '#0F1533',
      100: '#1E2966',
      200: '#2C3E99',
      300: '#3B52CC',
      400: '#4A66FF',
      500: '#6D90FF',  // Main secondary (brighter for dark mode)
      600: '#91B3FF',
      700: '#B6CEFF',
      800: '#DAE6FF',
      900: '#FFFFFF',
    },

    // Warning/Accent Colors - New Orange Palette (Inverted)
    accent: {
      50: '#85290C',
      100: '#A43C16',
      200: '#C44F1F',
      300: '#E36229',
      400: '#FF9C70',
      500: '#FFB170',  // Main accent
      600: '#FFC690',
      700: '#FFD9B0',
      800: '#FFEBD1',
      900: '#FFF4E4',
    },

    // Neutral/Gray Colors - New Neutral Palette (Inverted)
    neutral: {
      50: '#1A1A1A',
      100: '#2E2E2E',
      200: '#464646',
      300: '#616161',
      400: '#818181',
      500: '#A0A0A0',
      600: '#BCBCBC',
      700: '#DAD8D8',
      800: '#F5F5F5',
      900: '#FFFFFF',
    },

    // Semantic Colors - New Semantic Palette (Dark Mode)
    success: {
      light: '#26907F',
      DEFAULT: '#3AC6A0',
      dark: '#E7F4EB',
    },
    error: {
      light: '#E02431',
      DEFAULT: '#FF616B',
      dark: '#FFE2E5',
    },
    warning: {
      light: '#E36229',
      DEFAULT: '#FF9C70',
      dark: '#FFF4E4',
    },
    info: {
      light: '#4A66FF',
      DEFAULT: '#6D90FF',
      dark: '#DAE6FF',
    },

    // Background Colors
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      card: '#1e293b',
      modal: '#334155',
    },

    // Text Colors
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      muted: '#64748b',
      inverse: '#0f172a',
    },

    // Border Colors
    border: {
      light: '#334155',
      DEFAULT: '#475569',
      dark: '#64748b',
    },
  },
};

// Gradient definitions
export const gradients = {
  light: {
    primary: 'linear-gradient(135deg, #25B181 0%, #51C9AF 100%)',
    secondary: 'linear-gradient(135deg, #4A66FF 0%, #6D90FF 100%)',
    accent: 'linear-gradient(135deg, #FF9C70 0%, #E36229 100%)',
    ocean: 'linear-gradient(135deg, #4A66FF 0%, #25B181 100%)',
    sunset: 'linear-gradient(135deg, #FF9C70 0%, #4A66FF 100%)',
    vibrant: 'linear-gradient(135deg, #25B181 0%, #FF9C70 50%, #4A66FF 100%)',
  },
  dark: {
    primary: 'linear-gradient(135deg, #51C9AF 0%, #7CDAC3 100%)',
    secondary: 'linear-gradient(135deg, #6D90FF 0%, #91B3FF 100%)',
    accent: 'linear-gradient(135deg, #FFB170 0%, #FF9C70 100%)',
    ocean: 'linear-gradient(135deg, #6D90FF 0%, #51C9AF 100%)',
    sunset: 'linear-gradient(135deg, #FFB170 0%, #6D90FF 100%)',
    vibrant: 'linear-gradient(135deg, #51C9AF 0%, #FFB170 50%, #6D90FF 100%)',
  },
};

// Shadow definitions
export const shadows = {
  light: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(37, 177, 129, 0.4)',
  },
  dark: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    glow: '0 0 20px rgba(81, 201, 175, 0.5)',
  },
};

export type ThemeMode = 'light' | 'dark';
export type Theme = typeof themes.light;
