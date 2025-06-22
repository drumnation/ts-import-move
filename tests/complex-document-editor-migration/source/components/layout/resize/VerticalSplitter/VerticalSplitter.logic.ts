/**
 * VerticalSplitter Logic
 * 
 * Pure business logic for vertical splitter functionality
 * Handles position calculations, constraint validation, and splitting operations
 * 
 * @module VerticalSplitter.logic
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../../hooks/store.hooks';
import { selectSplitRatios, selectColumnConstraints } from '../../../../../../stores/selectors/layout.selectors';
import { adjustSplit, setResizing } from '../../../../../../stores/layout.slice';
import type { SplitState, SplitConstraints, SplitHandlers } from './VerticalSplitter.types';

/**
 * Pure functions for split calculations
 */

/**
 * Calculate constrained ratio within bounds
 */
export const calculateConstrainedRatio = (
  targetRatio: number,
  constraints: SplitConstraints
): number => {
  return Math.max(constraints.minRatio, Math.min(constraints.maxRatio, targetRatio));
};

/**
 * Calculate snap-to points for ratios
 */
export const calculateSnapRatio = (
  targetRatio: number,
  snapPoints: number[] = [],
  snapThreshold: number = 0.05
): number => {
  for (const snapPoint of snapPoints) {
    if (Math.abs(targetRatio - snapPoint) <= snapThreshold) {
      return snapPoint;
    }
  }
  return targetRatio;
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
 * Calculate new ratio based on mouse movement
 */
export const calculateNewRatio = (
  startRatio: number,
  startY: number,
  currentY: number,
  containerHeight: number,
  constraints: SplitConstraints,
  snapPoints?: number[],
  snapThreshold?: number
): number => {
  const deltaY = currentY - startY;
  const deltaRatio = deltaY / containerHeight;
  const targetRatio = startRatio + deltaRatio;
  const constrainedRatio = calculateConstrainedRatio(targetRatio, constraints);
  
  if (snapPoints && snapThreshold) {
    return calculateSnapRatio(constrainedRatio, snapPoints, snapThreshold);
  }
  
  return constrainedRatio;
};

/**
 * Get container height from element
 */
export const getContainerHeight = (element: HTMLElement | null): number => {
  if (!element) return 0;
  return element.getBoundingClientRect().height;
};

/**
 * Custom hook for vertical splitter logic
 */
export const useVerticalSplitterLogic = (
  column: 'left' | 'center' | 'right',
  initialRatio: number,
  minRatio: number = 0.2,
  maxRatio: number = 0.8,
  onSplit?: (ratio: number) => void,
  onSplitStart?: (ratio: number) => void,
  onSplitEnd?: (ratio: number) => void,
  snapPoints?: number[],
  snapThreshold?: number
) => {
  const dispatch = useAppDispatch();
  const splitRatios = useAppSelector(selectSplitRatios);
  const constraints = useAppSelector(selectColumnConstraints);
  
  // Map column to split ratio key
  const splitKey = `${column}Vertical` as keyof typeof splitRatios;
  const currentRatio = splitRatios[splitKey];
  
  const [splitState, setSplitState] = useState<SplitState>({
    isSplitting: false,
    startY: 0,
    startRatio: 0,
    currentRatio: currentRatio || initialRatio,
    containerHeight: 0,
  });
  
  const splitterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Effective constraints combining props and Redux state
   */
  const effectiveConstraints: SplitConstraints = {
    minRatio: Math.max(minRatio, 0.2),
    maxRatio: Math.min(maxRatio, 0.8),
    snapThreshold,
    snapPoints,
  };

  /**
   * Handle split start
   */
  const handleSplitStart = useCallback((clientY: number) => {
    const containerHeight = getContainerHeight(containerRef.current);
    const startRatio = currentRatio || initialRatio;
    
    setSplitState({
      isSplitting: true,
      startY: clientY,
      startRatio,
      currentRatio: startRatio,
      containerHeight,
    });
    
    dispatch(setResizing(true));
    onSplitStart?.(startRatio);
    
    // Prevent text selection during split
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
    if (splitterRef.current) {
      splitterRef.current.style.pointerEvents = 'auto';
    }
  }, [column, currentRatio, initialRatio, dispatch, onSplitStart]);

  /**
   * Handle split move
   */
  const handleSplitMove = useCallback((clientY: number) => {
    if (!splitState.isSplitting) return;

    // Use requestAnimationFrame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newRatio = calculateNewRatio(
        splitState.startRatio,
        splitState.startY,
        clientY,
        splitState.containerHeight,
        effectiveConstraints,
        snapPoints,
        snapThreshold
      );

      setSplitState(prev => ({
        ...prev,
        currentRatio: newRatio,
      }));

      // Dispatch to Redux for global state updates
      dispatch(adjustSplit({ column: splitKey, ratio: newRatio }));
      onSplit?.(newRatio);
    });
  }, [splitState, effectiveConstraints, snapPoints, snapThreshold, column, dispatch, onSplit]);

  /**
   * Handle split end
   */
  const handleSplitEnd = useCallback(() => {
    if (!splitState.isSplitting) return;

    const finalRatio = splitState.currentRatio;
    
    setSplitState(prev => ({
      ...prev,
      isSplitting: false,
    }));
    
    dispatch(setResizing(false));
    onSplitEnd?.(finalRatio);
    
    // Restore document styles
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [splitState.isSplitting, splitState.currentRatio, dispatch, onSplitEnd]);

  /**
   * Mouse event handlers
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    handleSplitStart(event.clientY);
  }, [handleSplitStart]);

  /**
   * Touch event handlers
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleSplitStart(touch.clientY);
  }, [handleSplitStart]);

  /**
   * Global mouse/touch move handler
   */
  const handleGlobalMove = useCallback((event: MouseEvent | TouchEvent) => {
    const { clientY } = extractEventCoordinates(event);
    handleSplitMove(clientY);
  }, [handleSplitMove]);

  /**
   * Global mouse/touch end handler
   */
  const handleGlobalEnd = useCallback(() => {
    handleSplitEnd();
  }, [handleSplitEnd]);

  /**
   * Setup global event listeners for split operations
   */
  useEffect(() => {
    if (splitState.isSplitting) {
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
  }, [splitState.isSplitting, handleGlobalMove, handleGlobalEnd]);

  /**
   * Update container height on resize
   */
  useEffect(() => {
    const updateContainerHeight = () => {
      const height = getContainerHeight(containerRef.current);
      setSplitState(prev => ({
        ...prev,
        containerHeight: height,
      }));
    };

    const resizeObserver = new ResizeObserver(updateContainerHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  const handlers: SplitHandlers = {
    handleMouseDown,
    handleTouchStart,
    handleMove: handleGlobalMove,
    handleEnd: handleGlobalEnd,
  };

  return {
    splitState,
    constraints: effectiveConstraints,
    handlers,
    splitterRef,
    containerRef,
    currentRatio: splitState.currentRatio,
    isSplitting: splitState.isSplitting,
  };
};

/**
 * Utility functions for testing and debugging
 */
export const createSplitConstraints = (
  minRatio: number,
  maxRatio: number,
  snapPoints?: number[],
  snapThreshold?: number
): SplitConstraints => ({
  minRatio,
  maxRatio,
  snapPoints,
  snapThreshold,
});

export const validateSplitState = (state: SplitState, constraints: SplitConstraints): boolean => {
  return (
    state.currentRatio >= constraints.minRatio &&
    state.currentRatio <= constraints.maxRatio &&
    state.startRatio >= 0 &&
    state.containerHeight > 0 &&
    (!state.isSplitting || state.startY >= 0)
  );
}; 