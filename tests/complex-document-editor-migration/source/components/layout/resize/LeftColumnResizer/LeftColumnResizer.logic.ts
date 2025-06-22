/**
 * LeftColumnResizer Logic
 * 
 * Pure business logic for left column resizing operations
 * Handles constraint calculations and resize validation
 * 
 * @module LeftColumnResizer.logic
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/tests/hooks/store.hooks';
import { selectColumnConstraints, selectLeftColumnSize } from '@/tests/stores/selectors/layout.selectors';
import { resizeColumn, setResizing } from '@/tests/stores/layout.slice';
import type { 
  LeftColumnResizerProps, 
  ResizeState, 
  ResizeConstraints,
  ResizeEvent,
  ResizeHandlers
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.types';

// Default constraints for left column resizing
const DEFAULT_CONSTRAINTS = {
  minWidth: 200,
  maxWidth: 500,
  centerMinWidth: 400,
  containerPadding: 20
} as const;

/**
 * Calculate maximum allowed width based on layout constraints
 */
export const calculateMaxWidth = (
  containerWidth: number,
  rightColumnWidth: number,
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth,
  maxWidth: number = DEFAULT_CONSTRAINTS.maxWidth
): number => {
  const availableSpace = containerWidth - rightColumnWidth - centerMinWidth;
  return Math.min(maxWidth, Math.max(0, availableSpace));
};

/**
 * Validate and constrain width to allowed range
 */
export const validateWidth = (
  width: number,
  minWidth: number = DEFAULT_CONSTRAINTS.minWidth,
  maxWidth: number = DEFAULT_CONSTRAINTS.maxWidth,
  containerWidth: number,
  rightColumnWidth: number,
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth
): number => {
  const calculatedMaxWidth = calculateMaxWidth(
    containerWidth,
    rightColumnWidth,
    centerMinWidth,
    maxWidth
  );
  
  return Math.max(minWidth, Math.min(calculatedMaxWidth, width));
};

/**
 * Calculate resize constraints for current layout
 */
export const calculateConstraints = (
  containerWidth: number,
  rightColumnWidth: number,
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth,
  minWidth: number = DEFAULT_CONSTRAINTS.minWidth,
  maxWidth: number = DEFAULT_CONSTRAINTS.maxWidth
): ResizeConstraints => {
  const availableSpace = containerWidth - rightColumnWidth - centerMinWidth;
  const calculatedMaxWidth = Math.min(maxWidth, Math.max(0, availableSpace));
  
  return {
    minWidth,
    maxWidth: calculatedMaxWidth,
    availableSpace,
    isValid: availableSpace >= minWidth
  };
};

/**
 * Check if resize operation is allowed for given width
 */
export const canResize = (
  newWidth: number,
  constraints: ResizeConstraints
): boolean => {
  return constraints.isValid && 
         newWidth >= constraints.minWidth && 
         newWidth <= constraints.maxWidth;
};

/**
 * Calculate width delta from mouse movement
 */
export const calculateWidthDelta = (
  currentX: number,
  startX: number,
  startWidth: number,
  containerWidth: number,
  rightColumnWidth: number,
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth,
  minWidth: number = DEFAULT_CONSTRAINTS.minWidth,
  maxWidth: number = DEFAULT_CONSTRAINTS.maxWidth
): { newWidth: number; deltaX: number; isValid: boolean } => {
  const deltaX = currentX - startX;
  const proposedWidth = startWidth + deltaX;
  
  const validatedWidth = validateWidth(
    proposedWidth,
    minWidth,
    maxWidth,
    containerWidth,
    rightColumnWidth,
    centerMinWidth
  );
  
  const constraints = calculateConstraints(
    containerWidth,
    rightColumnWidth,
    centerMinWidth,
    minWidth,
    maxWidth
  );
  
  return {
    newWidth: validatedWidth,
    deltaX,
    isValid: canResize(validatedWidth, constraints)
  };
};

/**
 * Format width value for display
 */
export const formatWidthDisplay = (width: number): string => {
  return `${Math.round(width)}px`;
};

/**
 * Get constraint indicator positions
 */
export const getConstraintPositions = (
  constraints: ResizeConstraints,
  containerOffset: number = 0
): { minPosition: number; maxPosition: number } => {
  return {
    minPosition: constraints.minWidth + containerOffset,
    maxPosition: constraints.maxWidth + containerOffset
  };
};

/**
 * Calculate resize preview position
 */
export const calculatePreviewPosition = (
  width: number,
  containerOffset: number = 0
): number => {
  return width + containerOffset;
};

/**
 * Calculate width indicator position
 */
export const calculateIndicatorPosition = (
  width: number,
  containerOffset: number = 0
): number => {
  return width + containerOffset + 10; // Offset for better visibility
};

/**
 * Check if resize would cause layout conflicts
 */
export const hasLayoutConflicts = (
  newLeftWidth: number,
  rightColumnWidth: number,
  containerWidth: number,
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth
): boolean => {
  const remainingSpace = containerWidth - newLeftWidth - rightColumnWidth;
  return remainingSpace < centerMinWidth;
};

/**
 * Suggest optimal column width
 */
export const suggestOptimalWidth = (
  containerWidth: number,
  rightColumnWidth: number,
  preferredRatio: number = 0.25, // 25% of available space
  centerMinWidth: number = DEFAULT_CONSTRAINTS.centerMinWidth,
  minWidth: number = DEFAULT_CONSTRAINTS.minWidth,
  maxWidth: number = DEFAULT_CONSTRAINTS.maxWidth
): number => {
  const availableSpace = containerWidth - rightColumnWidth - centerMinWidth;
  const suggestedWidth = availableSpace * preferredRatio;
  
  return validateWidth(
    suggestedWidth,
    minWidth,
    maxWidth,
    containerWidth,
    rightColumnWidth,
    centerMinWidth
  );
};

/**
 * Create resize state
 */
export const createResizeState = (
  isResizing: boolean = false,
  previewWidth: number = 0,
  startX: number = 0,
  startWidth: number = 0
): ResizeState => ({
  isResizing,
  previewWidth,
  startX,
  startWidth
});

/**
 * Update resize state
 */
export const updateResizeState = (
  currentState: ResizeState,
  updates: Partial<ResizeState>
): ResizeState => ({
  ...currentState,
  ...updates
});

/**
 * Reset resize state
 */
export const resetResizeState = (): ResizeState => createResizeState();

/**
 * Validate resize configuration
 */
export const validateResizeConfig = (config: {
  minWidth: number;
  maxWidth: number;
  containerWidth: number;
  centerMinWidth: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (config.minWidth >= config.maxWidth) {
    errors.push('Minimum width must be less than maximum width');
  }
  
  if (config.minWidth + config.centerMinWidth >= config.containerWidth) {
    errors.push('Minimum widths exceed container width');
  }
  
  if (config.minWidth < 100) {
    errors.push('Minimum width too small for usability');
  }
  
  if (config.maxWidth > config.containerWidth * 0.8) {
    errors.push('Maximum width too large for layout balance');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate resize performance metrics
 */
export const calculateResizeMetrics = (
  startTime: number,
  endTime: number,
  initialWidth: number,
  finalWidth: number,
  eventCount: number
): {
  duration: number;
  widthDelta: number;
  eventsPerSecond: number;
  performance: 'smooth' | 'moderate' | 'laggy';
} => {
  const duration = endTime - startTime;
  const widthDelta = Math.abs(finalWidth - initialWidth);
  const eventsPerSecond = eventCount / (duration / 1000);
  
  let performance: 'smooth' | 'moderate' | 'laggy';
  if (eventsPerSecond > 30) {
    performance = 'smooth';
  } else if (eventsPerSecond > 15) {
    performance = 'moderate';
  } else {
    performance = 'laggy';
  }
  
  return {
    duration,
    widthDelta,
    eventsPerSecond,
    performance
  };
};

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
 * Calculate new width based on mouse movement
 */
export const calculateNewWidth = (
  startWidth: number,
  startX: number,
  currentX: number,
  constraints: ResizeConstraints,
  snapPoints?: number[],
  snapThreshold?: number
): number => {
  const deltaX = currentX - startX;
  const targetWidth = startWidth + deltaX;
  const constrainedWidth = calculateConstrainedWidth(targetWidth, constraints);
  
  if (snapPoints && snapThreshold) {
    return calculateSnapWidth(constrainedWidth, snapPoints, snapThreshold);
  }
  
  return constrainedWidth;
};

/**
 * Custom hook for left column resizer logic
 */
export const useLeftColumnResizerLogic = (
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
  const currentWidth = useAppSelector(selectLeftColumnSize);
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
      dispatch(resizeColumn({ column: 'left', size: newWidth }));
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