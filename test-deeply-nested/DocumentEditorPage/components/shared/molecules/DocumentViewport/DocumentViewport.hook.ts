import { useState, useRef, useCallback } from 'react';
import { usePlatformDetection } from '../../../../DocumentEditorPage.hook';
import {
  calculateZoomLevel,
  getDefaultZoomState,
  shouldTriggerViewModeChange,
  getNextPageIndex,
  getPreviousPageIndex
} from './DocumentViewport.logic';
import type { DocumentViewportProps, ViewMode } from './DocumentViewport.types';

/**
 * Hook for managing zoom functionality
 */
export const useZoomControls = () => {
  const zoomState = getDefaultZoomState();
  const [zoom, setZoom] = useState(zoomState.level);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => calculateZoomLevel(prev, zoomState.step, zoomState.min, zoomState.max));
  }, [zoomState]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => calculateZoomLevel(prev, -zoomState.step, zoomState.min, zoomState.max));
  }, [zoomState]);

  const canZoomIn = zoom < zoomState.max;
  const canZoomOut = zoom > zoomState.min;

  return {
    zoom,
    handleZoomIn,
    handleZoomOut,
    canZoomIn,
    canZoomOut,
    zoomState
  };
};

/**
 * Hook for managing page navigation
 */
export const usePageNavigation = (
  currentPageIndex: number,
  totalPages: number,
  onPageChange: (pageIndex: number) => void
) => {
  const handlePrevPage = useCallback(() => {
    const prevIndex = getPreviousPageIndex(currentPageIndex);
    if (prevIndex !== null) {
      onPageChange(prevIndex);
    }
  }, [currentPageIndex, onPageChange]);

  const handleNextPage = useCallback(() => {
    const nextIndex = getNextPageIndex(currentPageIndex, totalPages);
    if (nextIndex !== null) {
      onPageChange(nextIndex);
    }
  }, [currentPageIndex, totalPages, onPageChange]);

  const canGoNext = getNextPageIndex(currentPageIndex, totalPages) !== null;
  const canGoPrev = getPreviousPageIndex(currentPageIndex) !== null;

  return {
    handlePrevPage,
    handleNextPage,
    canGoNext,
    canGoPrev
  };
};

/**
 * Hook for handling page click interactions
 */
export const usePageClickHandler = (
  viewMode: ViewMode,
  onPageChange: (pageIndex: number) => void,
  onViewModeChange: (mode: ViewMode) => void
) => {
  const handlePageClick = useCallback((pageIndex: number) => {
    if (shouldTriggerViewModeChange(viewMode)) {
      onPageChange(pageIndex);
      onViewModeChange('single');
    }
  }, [viewMode, onPageChange, onViewModeChange]);

  return { handlePageClick };
};

/**
 * Hook for viewport container reference
 */
export const useViewportContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return { containerRef };
};

/**
 * Main hook that combines all DocumentViewport functionality
 */
export const useDocumentViewport = (props: DocumentViewportProps) => {
  const { document, onPageChange, onViewModeChange } = props;
  const { touchTargetConfig, isMobile } = usePlatformDetection();
  
  const zoomControls = useZoomControls();
  const pageNavigation = usePageNavigation(
    document.currentPageIndex,
    document.totalPages,
    onPageChange
  );
  const pageClickHandler = usePageClickHandler(
    document.viewMode,
    onPageChange,
    onViewModeChange
  );
  const { containerRef } = useViewportContainer();

  return {
    // Platform detection
    touchTargetConfig,
    isMobile,
    
    // Zoom functionality
    ...zoomControls,
    
    // Navigation functionality
    ...pageNavigation,
    
    // Page interaction
    ...pageClickHandler,
    
    // Container ref
    containerRef,
    
    // Document data
    document
  };
}; 