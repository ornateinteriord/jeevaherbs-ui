// Utility functions and constants for dashboard color scheme
export const DASHBOARD_COLORS = {
  primary: '#2c8786',
  light: '#3da1a0',
  dark: '#236d6c',
  gradient: 'linear-gradient(to right, #2c8786, #3da1a0)',
  gradientDark: 'linear-gradient(to right, #236d6c, #2c8786)',
};

// Utility function to apply dashboard color classes
export const applyDashboardColor = (className: string) => {
  return `${className} bg-dashboard text-white`;
};

// Utility function to apply dashboard button classes
export const applyDashboardButton = (variant: 'filled' | 'outline' = 'filled') => {
  if (variant === 'outline') {
    return 'border border-dashboard text-dashboard hover:bg-dashboard/10';
  }
  return 'bg-dashboard text-white hover:bg-dashboard/90';
};