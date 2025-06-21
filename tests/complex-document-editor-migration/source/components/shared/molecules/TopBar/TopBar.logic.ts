/**
 * TopBar Business Logic
 * @module TopBar.logic
 */

/**
 * Status configuration for different editor states
 */
export const STATUS_CONFIG = {
  ready: {
    color: '#10b981',
    label: 'Ready',
    description: 'Editor is ready for input'
  },
  saving: {
    color: '#f59e0b', 
    label: 'Saving',
    description: 'Saving changes to document'
  },
  error: {
    color: '#ef4444',
    label: 'Error', 
    description: 'An error has occurred'
  }
} as const;

/**
 * Get status configuration for a given status
 */
export const getStatusConfig = (status: keyof typeof STATUS_CONFIG) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.ready;
};

/**
 * Determine which actions to show on mobile
 */
export const getMobileActions = () => {
  return ['search', 'preview'] as const;
};

/**
 * Get all available actions for desktop
 */
export const getDesktopActions = () => {
  return ['search', 'preview', 'download', 'print', 'share'] as const;
};

/**
 * Check if an action should be visible on current screen size
 */
export const shouldShowAction = (
  action: string, 
  isMobile: boolean
): boolean => {
  if (!isMobile) return true;
  
  const mobileActions = getMobileActions();
  return mobileActions.includes(action as any);
};

/**
 * Format document title for display
 */
export const formatDocumentTitle = (
  title: string, 
  maxLength: number = 30
): string => {
  if (title.length <= maxLength) return title;
  return `${title.substring(0, maxLength - 3)}...`;
};

/**
 * Get icon size based on screen size
 */
export const getIconSize = (isMobile: boolean): number => {
  return isMobile ? 16 : 14;
}; 