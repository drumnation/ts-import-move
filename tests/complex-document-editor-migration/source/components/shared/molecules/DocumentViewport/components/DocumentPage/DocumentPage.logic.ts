import type { ViewMode } from '../../DocumentViewport.types';

/**
 * Get hover scale factor based on view mode
 * @param viewMode - Current view mode
 * @returns Scale factor for hover state
 */
export const getHoverScale = (viewMode: ViewMode): number => {
  return viewMode === 'thumbnail' ? 1.02 : 1;
};

/**
 * Get tap scale factor based on view mode
 * @param viewMode - Current view mode
 * @returns Scale factor for tap state
 */
export const getTapScale = (viewMode: ViewMode): number => {
  return viewMode === 'thumbnail' ? 0.98 : 1;
};

/**
 * Check if page is currently active
 * @param pageIndex - Index of the page
 * @param currentPageIndex - Index of the currently active page
 * @returns Whether the page is active
 */
export const isPageActive = (pageIndex: number, currentPageIndex: number): boolean => {
  return pageIndex === currentPageIndex;
}; 