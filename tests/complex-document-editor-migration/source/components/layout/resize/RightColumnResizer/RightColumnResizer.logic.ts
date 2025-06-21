/**
 * RightColumnResizer Logic
 * 
 * Pure business logic for right column resizing operations
 * Handles constraint calculations and resize validation
 * Note: Right column grows leftward (negative delta)
 * 
 * @module RightColumnResizer.logic
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../../hooks/store.hooks';
import { selectColumnConstraints, selectRightColumnSize } from '../../../../../../stores/selectors/layout.selectors';
import { resizeColumn, setResizing } from '../../../../../../stores/layout.slice';
import type { 
  RightColumnResizerProps, 
  RightResizeState, 
  RightResizeConstraints,
  RightResizeEvent,
  ResizeState,
  ResizeConstraints,
  ResizeHandlers
} from './RightColumnResizer.types';

/**
 * Calculate maximum allowed width based on layout constraints
 */
export const calculateRightMaxWidth = (
  containerWidth: number,
  leftColumnWidth: number,
  centerMinWidth: number,
  maxWidth: number
): number => {
  const availableSpace = containerWidth - leftColumnWidth - centerMinWidth;
  return Math.min(maxWidth, availableSpace);
};

/**
 * Validate and clamp width to constraints
 */
export const validateRightWidth = (
  width: number,
  minWidth: number,
  maxWidth: number
): number => {
  return Math.max(minWidth, Math.min(maxWidth, width));
};

/**
 * Calculate right column resize constraints
 */
export const calculateRightResizeConstraints = (
  containerWidth: number,
  leftColumnWidth: number,
  centerMinWidth: number,
  minWidth: number,
  maxWidth: number
): RightResizeConstraints => {
  const availableSpace = containerWidth - leftColumnWidth - centerMinWidth;
  const calculatedMaxWidth = Math.min(maxWidth, availableSpace);
  
  return {
    minWidth,
    maxWidth: calculatedMaxWidth,
    availableSpace,
  };
};

/**
 * Create right column resize event data
 */
export const createRightResizeEvent = (
  width: number,
  deltaX: number,
  isActive: boolean,
  constraints: RightResizeConstraints
): RightResizeEvent => ({
  width,
  deltaX,
  isActive,
  constraints,
});

/**
 * Pure functions for resize calculations
 */

/**
 * Calculate constrained width within bounds
 */
export const calculateConstrainedWidth = (
  targetWidth: number,
  constraints: ResizeConstraints
): number => {
  return Math.max(constraints.minWidth, Math.min(constraints.maxWidth, targetWidth));
};

/**
 * Calculate snap-to points
 */
export const calculateSnapWidth = (
  targetWidth: number,
  snapPoints: number[] = [],
  snapThreshold: number = 10
): number => {
  for (const snapPoint of snapPoints) {
    if (Math.abs(targetWidth - snapPoint) <= snapThreshold) {
      return snapPoint;
    }
  }
  return targetWidth;
};

/**
 * Extract coordinates from mouse or touch event
 */
export const extractEventCoordinates = (event: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return { clientX: event.clientX, clientY: event.clientY };
};

/**
 * Calculate new width based on mouse movement for right column
 * Note: Right column resizing moves in opposite direction (left movement increases width)
 */
export const calculateNewWidth = (
  startWidth: number,
  startX: number,
  currentX: number,
  constraints: ResizeConstraints,
  snapPoints?: number[],
  snapThreshold?: number
): number => {
  // For right column, moving left increases width (negative delta = positive width change)
  const deltaX = startX - currentX;
  const targetWidth = startWidth + deltaX;
  const constrainedWidth = calculateConstrainedWidth(targetWidth, constraints);
  
  if (snapPoints && snapThreshold) {
    return calculateSnapWidth(constrainedWidth, snapPoints, snapThreshold);
  }
  
  return constrainedWidth;
};

/**
 * Custom hook for right column resizer logic
 */
export const useRightColumnResizerLogic = (
  initialWidth: number,
  minWidth: number = 200,
  maxWidth: number = 600,
  onResize?: (width: number) => void,
  onResizeStart?: (width: number) => void,
  onResizeEnd?: (width: number) => void,
  snapPoints?: number[],
  snapThreshold?: number
) => {
  const dispatch = useAppDispatch();
  const currentWidth = useAppSelector(selectRightColumnSize);
  const constraints = useAppSelector(selectColumnConstraints);
  
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    startX: 0,
    startWidth: 0,
    currentWidth: currentWidth || initialWidth,
  });
  
  const resizerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Effective constraints combining props and Redux state
   */
  const effectiveConstraints: ResizeConstraints = {
    minWidth: Math.max(minWidth, constraints.minColumnWidth),
    maxWidth: Math.min(maxWidth, constraints.maxColumnWidth),
    snapThreshold,
    snapPoints,
  };

  /**
   * Handle resize start
   */
  const handleResizeStart = useCallback((clientX: number) => {
    const startWidth = currentWidth || initialWidth;
    
    setResizeState({
      isResizing: true,
      startX: clientX,
      startWidth,
      currentWidth: startWidth,
    });
    
    dispatch(setResizing(true));
    onResizeStart?.(startWidth);
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
    if (resizerRef.current) {
      resizerRef.current.style.pointerEvents = 'auto';
    }
  }, [currentWidth, initialWidth, dispatch, onResizeStart]);

  /**
   * Handle resize move
   */
  const handleResizeMove = useCallback((clientX: number) => {
    if (!resizeState.isResizing) return;

    // Use requestAnimationFrame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newWidth = calculateNewWidth(
        resizeState.startWidth,
        resizeState.startX,
        clientX,
        effectiveConstraints,
        snapPoints,
        snapThreshold
      );

      setResizeState(prev => ({
        ...prev,
        currentWidth: newWidth,
      }));

      // Dispatch to Redux for global state updates
      dispatch(resizeColumn({ column: 'right', size: newWidth }));
      onResize?.(newWidth);
    });
  }, [resizeState, effectiveConstraints, snapPoints, snapThreshold, dispatch, onResize]);

  /**
   * Handle resize end
   */
  const handleResizeEnd = useCallback(() => {
    if (!resizeState.isResizing) return;

    const finalWidth = resizeState.currentWidth;
    
    setResizeState(prev => ({
      ...prev,
      isResizing: false,
    }));
    
    dispatch(setResizing(false));
    onResizeEnd?.(finalWidth);
    
    // Restore document styles
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [resizeState.isResizing, resizeState.currentWidth, dispatch, onResizeEnd]);

  /**
   * Mouse event handlers
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    handleResizeStart(event.clientX);
  }, [handleResizeStart]);

  /**
   * Touch event handlers
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleResizeStart(touch.clientX);
  }, [handleResizeStart]);

  /**
   * Global mouse/touch move handler
   */
  const handleGlobalMove = useCallback((event: MouseEvent | TouchEvent) => {
    const { clientX } = extractEventCoordinates(event);
    handleResizeMove(clientX);
  }, [handleResizeMove]);

  /**
   * Global mouse/touch end handler
   */
  const handleGlobalEnd = useCallback(() => {
    handleResizeEnd();
  }, [handleResizeEnd]);

  /**
   * Setup global event listeners for resize operations
   */
  useEffect(() => {
    if (resizeState.isResizing) {
      const handleMove = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        handleGlobalMove(event);
      };

      const handleEnd = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        handleGlobalEnd();
      };

      // Mouse events
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      
      // Touch events
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [resizeState.isResizing, handleGlobalMove, handleGlobalEnd]);

  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handlers: ResizeHandlers = {
    handleMouseDown,
    handleTouchStart,
    handleMove: handleGlobalMove,
    handleEnd: handleGlobalEnd,
  };

  return {
    resizeState,
    constraints: effectiveConstraints,
    handlers,
    resizerRef,
    currentWidth: resizeState.currentWidth,
    isResizing: resizeState.isResizing,
  };
};

/**
 * Utility functions for testing and debugging
 */
export const createResizeConstraints = (
  minWidth: number,
  maxWidth: number,
  snapPoints?: number[],
  snapThreshold?: number
): ResizeConstraints => ({
  minWidth,
  maxWidth,
  snapPoints,
  snapThreshold,
});

export const validateResizeState = (state: ResizeState, constraints: ResizeConstraints): boolean => {
  return (
    state.currentWidth >= constraints.minWidth &&
    state.currentWidth <= constraints.maxWidth &&
    state.startWidth >= 0 &&
    (!state.isResizing || state.startX >= 0)
  );
}; 