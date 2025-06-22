// Re-export shared logic functions
export { 
  shouldShowZoomControls, 
  shouldShowPageNavigation, 
  formatZoomPercentage 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.logic';

/**
 * Get icon size based on mobile state
 */
export const getIconSize = (isMobile: boolean): number => {
  return isMobile ? 20 : 16;
};

/**
 * Get gap size based on mobile state
 */
export const getGapSize = (isMobile: boolean): string => {
  return isMobile ? 'sm' : 'xs';
}; 