/**
 * LeftColumnResizer Custom Hook
 * Stateful logic for left column resizing with event handling
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import type { 
  LeftColumnResizerProps, 
  LeftColumnResizerLogic,
  ResizeState, 
  ResizeConstraints 
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.types';
import {
  calculateConstraints,
  validateWidth,
  calculateWidthDelta,
  formatWidthDisplay,
  createResizeState,
  updateResizeState,
  resetResizeState
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.logic';

/**
 * Custom hook for left column resizer functionality
 */
export const useLeftColumnResizer = ({
  currentWidth,
  minWidth = 200,
  maxWidth = 500,
  containerWidth,
  rightColumnWidth,
  centerMinWidth = 400,
  onResize,
  onResizeStart,
  onResizeEnd,
  disabled = false,
}: LeftColumnResizerProps): LeftColumnResizerLogic => {
  // Local state for resize operation
  const [resizeState, setResizeState] = useState<ResizeState>(
    () => createResizeState(false, currentWidth, 0, currentWidth)
  );
  
  // Refs for event handling
  const resizerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const eventCountRef = useRef<number>(0);

  // Calculate current constraints
  const constraints = calculateConstraints(
    containerWidth,
    rightColumnWidth,
    centerMinWidth,
    minWidth,
    maxWidth
  );

  // Derived state
  const isActive = resizeState.isResizing;
  const previewWidth = resizeState.previewWidth;
  const widthDisplay = formatWidthDisplay(previewWidth);

  /**
   * Handle mouse move during resize
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!resizeState.isResizing) return;
    
    eventCountRef.current += 1;
    
    const result = calculateWidthDelta(
      event.clientX,
      resizeState.startX,
      resizeState.startWidth,
      containerWidth,
      rightColumnWidth,
      centerMinWidth,
      minWidth,
      maxWidth
    );
    
    setResizeState(currentState => 
      updateResizeState(currentState, {
        previewWidth: result.newWidth
      })
    );
  }, [
    resizeState.isResizing,
    resizeState.startX,
    resizeState.startWidth,
    containerWidth,
    rightColumnWidth,
    centerMinWidth,
    minWidth,
    maxWidth
  ]);

  /**
   * Handle mouse up to end resize
   */
  const handleMouseUp = useCallback(() => {
    if (!resizeState.isResizing) return;
    
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;
    
    // Apply the final width
    onResize?.(resizeState.previewWidth);
    onResizeEnd?.();
    
    // Reset state
    setResizeState(resetResizeState());
    
    // Clean up global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Reset performance tracking
    startTimeRef.current = 0;
    eventCountRef.current = 0;
  }, [
    resizeState.isResizing,
    resizeState.previewWidth,
    onResize,
    onResizeEnd,
    handleMouseMove
  ]);

  /**
   * Handle mouse down to start resize
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled || !constraints.isValid) return;
    
    event.preventDefault();
    
    // Initialize resize state
    const newState = createResizeState(
      true,
      currentWidth,
      event.clientX,
      currentWidth
    );
    
    setResizeState(newState);
    
    // Performance tracking
    startTimeRef.current = performance.now();
    eventCountRef.current = 0;
    
    // Notify start
    onResizeStart?.();
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [
    disabled,
    constraints.isValid,
    currentWidth,
    onResizeStart,
    handleMouseMove,
    handleMouseUp
  ]);

  /**
   * Calculate maximum allowed width
   */
  const calculateMaxWidth = useCallback(() => {
    return constraints.maxWidth;
  }, [constraints.maxWidth]);

  /**
   * Validate and clamp width to constraints
   */
  const validateCurrentWidth = useCallback((width: number): number => {
    return validateWidth(
      width,
      constraints.minWidth,
      constraints.maxWidth,
      containerWidth,
      rightColumnWidth,
      centerMinWidth
    );
  }, [
    constraints.minWidth,
    constraints.maxWidth,
    containerWidth,
    rightColumnWidth,
    centerMinWidth
  ]);

  /**
   * Check if resize is allowed for given width
   */
  const canResize = useCallback((newWidth: number): boolean => {
    return constraints.isValid && 
           newWidth >= constraints.minWidth && 
           newWidth <= constraints.maxWidth;
  }, [constraints]);

  // Clean up event listeners on unmount or dependency changes
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [handleMouseMove, handleMouseUp]);

  // Update preview width when current width changes externally
  useEffect(() => {
    if (!resizeState.isResizing) {
      setResizeState(currentState => 
        updateResizeState(currentState, {
          previewWidth: currentWidth
        })
      );
    }
  }, [currentWidth, resizeState.isResizing]);

  return {
    resizeState,
    constraints,
    isActive,
    previewWidth,
    widthDisplay,
    handleMouseDown,
    calculateMaxWidth,
    validateWidth: validateCurrentWidth,
    canResize
  };
};

/**
 * Hook for resize performance monitoring
 */
export const useResizePerformance = () => {
  const [metrics, setMetrics] = useState<{
    duration: number;
    eventCount: number;
    performance: 'smooth' | 'moderate' | 'laggy';
  } | null>(null);

  const trackResize = useCallback((
    startTime: number,
    endTime: number,
    eventCount: number
  ) => {
    const duration = endTime - startTime;
    const eventsPerSecond = eventCount / (duration / 1000);
    
    let performance: 'smooth' | 'moderate' | 'laggy';
    if (eventsPerSecond > 30) {
      performance = 'smooth';
    } else if (eventsPerSecond > 15) {
      performance = 'moderate';
    } else {
      performance = 'laggy';
    }
    
    setMetrics({
      duration,
      eventCount,
      performance
    });
  }, []);

  return { metrics, trackResize };
}; 