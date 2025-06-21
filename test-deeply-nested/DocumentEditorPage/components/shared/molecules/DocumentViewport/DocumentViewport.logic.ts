import type { ZoomState, NavigationState, ViewMode } from './DocumentViewport.types';

/**
 * Calculate navigation state based on current page and total pages
 */
export const calculateNavigationState = (
  currentPageIndex: number,
  totalPages: number
): NavigationState => ({
  canGoNext: currentPageIndex < totalPages - 1,
  canGoPrev: currentPageIndex > 0,
  currentPage: currentPageIndex + 1,
  totalPages
});

/**
 * Calculate zoom level with constraints
 */
export const calculateZoomLevel = (
  currentZoom: number,
  delta: number,
  min: number = 0.5,
  max: number = 2
): number => {
  const newZoom = currentZoom + delta;
  return Math.max(min, Math.min(max, newZoom));
};

/**
 * Get default zoom state configuration
 */
export const getDefaultZoomState = (): ZoomState => ({
  level: 1,
  min: 0.5,
  max: 2,
  step: 0.1
});

/**
 * Determine if zoom controls should be visible
 */
export const shouldShowZoomControls = (isMobile: boolean): boolean => !isMobile;

/**
 * Determine if page navigation should be visible
 */
export const shouldShowPageNavigation = (viewMode: ViewMode): boolean => viewMode === 'single';

/**
 * Calculate next page index
 */
export const getNextPageIndex = (
  currentIndex: number,
  totalPages: number
): number | null => {
  if (currentIndex >= totalPages - 1) return null;
  return currentIndex + 1;
};

/**
 * Calculate previous page index
 */
export const getPreviousPageIndex = (currentIndex: number): number | null => {
  if (currentIndex <= 0) return null;
  return currentIndex - 1;
};

/**
 * Format zoom percentage for display
 */
export const formatZoomPercentage = (zoom: number): string => `${Math.round(zoom * 100)}%`;

/**
 * Determine if a page should trigger view mode change on click
 */
export const shouldTriggerViewModeChange = (
  currentViewMode: ViewMode
): boolean => currentViewMode === 'thumbnail';

/**
 * Get page dimensions based on view mode and device
 */
export const getPageDimensions = (
  viewMode: ViewMode,
  isMobile: boolean
): { width: string; minHeight: string } => {
  if (viewMode === 'thumbnail') {
    return {
      width: isMobile ? '150px' : '200px',
      minHeight: isMobile ? '200px' : '300px'
    };
  }

  return {
    width: isMobile ? '100%' : '8.5in',
    minHeight: '800px'
  };
};

/**
 * Get page content styling based on view mode and device
 */
export const getPageContentStyle = (
  viewMode: ViewMode,
  isMobile: boolean
): { padding: string; fontSize: string } => {
  if (viewMode === 'thumbnail') {
    return {
      padding: isMobile ? '8px' : '12px',
      fontSize: isMobile ? '8px' : '10px'
    };
  }

  return {
    padding: isMobile ? '16px' : '1in',
    fontSize: isMobile ? '14px' : '12pt'
  };
};

/**
 * Determine layout direction based on view mode
 */
export const getLayoutDirection = (viewMode: ViewMode): 'row' | 'column' => {
  return viewMode === 'infinite' ? 'column' : 'row';
};

/**
 * Determine content justification based on view mode
 */
export const getContentJustification = (viewMode: ViewMode): string => {
  return viewMode === 'single' ? 'center' : 'flex-start';
}; 