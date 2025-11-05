/**
 * Theme Utilities
 * Helper functions to ensure consistent theming across the app
 */

// Color mapping from hardcoded Tailwind to CSS variables
export const colorMap = {
  // Blue shades
  'text-blue-400': 'text-[rgb(var(--primary-400))]',
  'text-blue-500': 'text-[rgb(var(--primary-500))]',
  'text-blue-600': 'text-[rgb(var(--primary-600))]',
  'bg-blue-50': 'bg-[rgb(var(--primary-50))]',
  'bg-blue-500': 'bg-[rgb(var(--primary-500))]',
  'bg-blue-600': 'bg-[rgb(var(--primary-600))]',
  'bg-blue-700': 'bg-[rgb(var(--primary-700))]',
  'border-blue-500': 'border-[rgb(var(--primary-500))]',
  'hover:bg-blue-600': 'hover:bg-[rgb(var(--primary-600))]',
  'hover:bg-blue-700': 'hover:bg-[rgb(var(--primary-700))]',
  'hover:text-blue-300': 'hover:text-[rgb(var(--primary-300))]',

  // Green shades
  'text-green-400': 'text-[rgb(var(--success))]',
  'text-green-600': 'text-[rgb(var(--success))]',
  'bg-green-50': 'bg-[rgb(var(--secondary-50))]',
  'bg-green-500': 'bg-[rgb(var(--success))]',
  'bg-green-600': 'bg-[rgb(var(--success))]',
  'hover:bg-green-100': 'hover:bg-[rgb(var(--secondary-100))]',

  // Red shades
  'text-red-400': 'text-[rgb(var(--error))]',
  'text-red-500': 'text-[rgb(var(--error))]',
  'text-red-600': 'text-[rgb(var(--error))]',
  'bg-red-50': 'bg-[rgba(var(--error),0.1)]',
  'bg-red-500': 'bg-[rgb(var(--error))]',
  'bg-red-600': 'bg-[rgb(var(--error))]',
  'hover:bg-red-100': 'hover:bg-[rgba(var(--error),0.15)]',

  // Yellow/Amber shades
  'text-yellow-400': 'text-[rgb(var(--warning))]',
  'text-yellow-600': 'text-[rgb(var(--warning))]',
  'bg-yellow-50': 'bg-[rgb(var(--accent-50))]',
  'bg-yellow-500': 'bg-[rgb(var(--warning))]',
  'hover:bg-yellow-100': 'hover:bg-[rgb(var(--accent-100))]',

  // Purple shades
  'text-purple-400': 'text-[rgb(var(--accent-400))]',
  'text-purple-600': 'text-[rgb(var(--accent-600))]',
  'bg-purple-500': 'bg-[rgb(var(--accent-500))]',
  'bg-purple-600': 'bg-[rgb(var(--accent-600))]',
  'hover:bg-purple-700': 'hover:bg-[rgb(var(--accent-700))]',

  // Emerald shades
  'text-emerald-400': 'text-[rgb(var(--secondary-400))]',
  'text-emerald-600': 'text-[rgb(var(--secondary-600))]',
  'bg-emerald-500': 'bg-[rgb(var(--secondary-500))]',
  'bg-emerald-600': 'bg-[rgb(var(--secondary-600))]',
} as const;

// Semantic color classes (these will work with both light and dark themes)
export const themeColors = {
  // Status colors
  success: {
    text: 'text-[rgb(var(--success))]',
    bg: 'bg-[rgb(var(--success))]',
    bgLight: 'bg-[rgba(var(--success),0.1)]',
    bgMedium: 'bg-[rgba(var(--success),0.2)]',
    border: 'border-[rgb(var(--success))]',
  },
  error: {
    text: 'text-[rgb(var(--error))]',
    bg: 'bg-[rgb(var(--error))]',
    bgLight: 'bg-[rgba(var(--error),0.1)]',
    bgMedium: 'bg-[rgba(var(--error),0.2)]',
    border: 'border-[rgb(var(--error))]',
  },
  warning: {
    text: 'text-[rgb(var(--warning))]',
    bg: 'bg-[rgb(var(--warning))]',
    bgLight: 'bg-[rgba(var(--warning),0.1)]',
    bgMedium: 'bg-[rgba(var(--warning),0.2)]',
    border: 'border-[rgb(var(--warning))]',
  },
  info: {
    text: 'text-[rgb(var(--info))]',
    bg: 'bg-[rgb(var(--info))]',
    bgLight: 'bg-[rgba(var(--info),0.1)]',
    bgMedium: 'bg-[rgba(var(--info),0.2)]',
    border: 'border-[rgb(var(--info))]',
  },

  // Brand colors
  primary: {
    text: 'text-[rgb(var(--primary-500))]',
    bg: 'bg-[rgb(var(--primary-500))]',
    bgLight: 'bg-[rgb(var(--primary-50))]',
    bgHover: 'hover:bg-[rgb(var(--primary-600))]',
    border: 'border-[rgb(var(--primary-500))]',
  },
  secondary: {
    text: 'text-[rgb(var(--secondary-500))]',
    bg: 'bg-[rgb(var(--secondary-500))]',
    bgLight: 'bg-[rgb(var(--secondary-50))]',
    bgHover: 'hover:bg-[rgb(var(--secondary-600))]',
    border: 'border-[rgb(var(--secondary-500))]',
  },
  accent: {
    text: 'text-[rgb(var(--accent-500))]',
    bg: 'bg-[rgb(var(--accent-500))]',
    bgLight: 'bg-[rgb(var(--accent-50))]',
    bgHover: 'hover:bg-[rgb(var(--accent-600))]',
    border: 'border-[rgb(var(--accent-500))]',
  },

  // UI colors
  background: {
    primary: 'bg-[rgb(var(--bg-primary))]',
    secondary: 'bg-[rgb(var(--bg-secondary))]',
    tertiary: 'bg-[rgb(var(--bg-tertiary))]',
  },
  text: {
    primary: 'text-[rgb(var(--text-primary))]',
    secondary: 'text-[rgb(var(--text-secondary))]',
    tertiary: 'text-[rgb(var(--text-tertiary))]',
    muted: 'text-[rgb(var(--text-muted))]',
  },
  border: {
    light: 'border-[rgb(var(--border-light))]',
    default: 'border-[rgb(var(--border-default))]',
    dark: 'border-[rgb(var(--border-dark))]',
  },
};

// Helper function to get status color
export function getStatusColor(status: 'success' | 'error' | 'warning' | 'info' | 'pending' | 'active' | 'inactive') {
  switch (status) {
    case 'success':
    case 'active':
      return themeColors.success;
    case 'error':
    case 'inactive':
      return themeColors.error;
    case 'warning':
    case 'pending':
      return themeColors.warning;
    case 'info':
      return themeColors.info;
    default:
      return themeColors.primary;
  }
}

// Helper to get action color (for audit logs, etc.)
export function getActionColor(action: string) {
  if (action.includes('Create') || action.includes('Add')) {
    return themeColors.success.text;
  }
  if (action.includes('Update') || action.includes('Edit')) {
    return themeColors.info.text;
  }
  if (action.includes('Delete') || action.includes('Remove')) {
    return themeColors.error.text;
  }
  return themeColors.text.secondary;
}

// Helper to get priority color
export function getPriorityColor(priority: 'low' | 'medium' | 'high' | 'critical') {
  switch (priority) {
    case 'low':
      return themeColors.success;
    case 'medium':
      return themeColors.warning;
    case 'high':
      return themeColors.error;
    case 'critical':
      return themeColors.error;
    default:
      return themeColors.primary;
  }
}

// Helper to get role color
export function getRoleColor(role: string) {
  if (role.includes('ADMIN') || role.includes('SUPER')) {
    return themeColors.accent;
  }
  return themeColors.primary;
}

// Utility to combine theme-aware classes
export function tw(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
