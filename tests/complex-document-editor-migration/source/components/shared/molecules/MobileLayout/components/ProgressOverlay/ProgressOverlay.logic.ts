/**
 * Animation variants for progress overlay
 */
export const progressOverlayVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * Validates progress value to ensure it's within 0-100 range
 */
export const validateProgress = (progress: number): number => {
  return Math.max(0, Math.min(100, progress));
};

/**
 * Formats progress message for display
 */
export const formatProgressMessage = (message: string): string => {
  return message.trim() || 'Processing...';
}; 