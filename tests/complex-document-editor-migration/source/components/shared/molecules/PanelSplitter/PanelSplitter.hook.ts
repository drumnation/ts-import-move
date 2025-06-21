/**
 * PanelSplitter Component Hooks
 * 
 * Custom hooks for vertical panel splitting operations
 * Split from BidirectionalResizer for better separation of concerns
 * 
 * @module PanelSplitter.hook
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { 
  PanelSplitConfig, 
  PanelSplitState,
  UsePanelSplitHandlers
} from './PanelSplitter.types';
import { 
  calculateNewSplitRatio, 
  createPanelSplitState,
  validateSplitConfig 
} from './PanelSplitter.logic';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';
import type { 
  PanelSplitterHookReturn, 
  ColumnType, 
  PanelSplitConstraints 
} from './PanelSplitter.types';
import type { RootState } from '@/stores/store';

/**
 * Main hook for panel split functionality
 * Handles mouse and touch events for vertical panel splitting
 * 
 * @param config - Panel split configuration
 * @param onSplitChange - Callback for ratio changes
 * @param disabled - Whether splitting is disabled
 * @returns Split handlers and state
 */
export const usePanelSplitHandlers = (
  config: PanelSplitConfig,
  onSplitChange: (newRatio: number) => void,
  disabled: boolean
): UsePanelSplitHandlers => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startStateRef = useRef<PanelSplitState>({ y: 0, ratio: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate configuration on mount
  useEffect(() => {
    if (!validateSplitConfig(config)) {
      console.error('Invalid PanelSplitter configuration:', config);
    }
  }, [config]);

  /**
   * Handles mouse down events to start split operation
   * Sets up initial state and prevents default browser behavior
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    
    startStateRef.current = createPanelSplitState(
      event.clientY,
      config.currentRatio
    );
  }, [disabled, config.currentRatio]);

  /**
   * Handles touch start events for mobile/tablet splitting
   * Provides similar functionality to mouse events
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    
    const touch = event.touches[0];
    startStateRef.current = createPanelSplitState(
      touch.clientY,
      config.currentRatio
    );
  }, [disabled, config.currentRatio]);

  /**
   * Handles mouse movement during split
   * Calculates new split ratio and triggers callback
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isResizing) return;
    
    const newRatio = calculateNewSplitRatio(
      config,
      startStateRef.current,
      event.clientY
    );
    
    onSplitChange(newRatio);
  }, [isResizing, config, onSplitChange]);

  /**
   * Handles touch movement during split
   * Similar to mouse move but for touch devices
   */
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isResizing) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const newRatio = calculateNewSplitRatio(
      config,
      startStateRef.current,
      touch.clientY
    );
    
    onSplitChange(newRatio);
  }, [isResizing, config, onSplitChange]);

  /**
   * Ends split operation
   * Cleans up resize state
   */
  const handleEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  /**
   * Set up and clean up mouse event listeners
   * Only active during split operations
   */
  useEffect(() => {
    if (!isResizing) return;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isResizing, handleMouseMove, handleEnd]);

  /**
   * Set up and clean up touch event listeners
   * Handles touch-specific behavior with passive: false for preventDefault
   */
  useEffect(() => {
    if (!isResizing) return;
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, handleTouchMove, handleEnd]);

  return {
    isResizing,
    isHovered,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    setIsHovered
  };
};

/**
 * Hook for managing panel split constraints
 * Provides validation and constraint helpers
 */
export const usePanelSplitConstraints = (config: PanelSplitConfig) => {
  const isValidConfig = validateSplitConfig(config);
  
  const getConstrainedRatio = useCallback((ratio: number) => {
    return Math.max(config.minRatio, Math.min(config.maxRatio, ratio));
  }, [config.minRatio, config.maxRatio]);
  
  return {
    isValidConfig,
    getConstrainedRatio
  };
};

/**
 * Hook for managing panel split operations with ratio-based constraints
 * and Redux state coordination
 */
export const usePanelSplitter = (
  column: ColumnType,
  currentRatio: number,
  minRatio: number = 0.2,
  maxRatio: number = 0.8,
  onSplitChange?: (ratio: number) => void
): PanelSplitterHookReturn => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const splitterRef = useRef<HTMLDivElement>(null);

  // Get current split ratios from Redux
  const splitRatios = useSelector((state: RootState) => 
    state.layout?.splitRatios || { 
      leftVertical: 0.5, 
      centerVertical: 0.5, 
      rightVertical: 0.5 
    }
  );
  
  const isResizing = useSelector((state: RootState) => 
    state.layout?.isResizing || false
  );

  const responsive = useSelector((state: RootState) => 
    state.layout?.responsive || { isMobile: false, isTablet: false, isDesktop: true }
  );

  // Platform-adaptive constraints
  const getConstraints = useCallback((): PanelSplitConstraints => {
    if (responsive.isMobile) {
      return { min: 0.1, max: 0.9 }; // More flexible on mobile
    }
    if (responsive.isTablet) {
      return { min: 0.15, max: 0.85 };
    }
    return { min: minRatio, max: maxRatio };
  }, [responsive, minRatio, maxRatio]);

  // Get current ratio for the specified column
  const getCurrentRatio = useCallback((): number => {
    const ratioKey = `${column}Vertical` as keyof typeof splitRatios;
    return splitRatios[ratioKey] || currentRatio;
  }, [column, splitRatios, currentRatio]);

  // Throttled split dispatch to prevent excessive Redux updates
  const throttledSplit = useCallback(
    throttle((columnKey: string, newRatio: number) => {
      dispatch({
        type: 'layout/adjustSplit',
        payload: { column: columnKey, ratio: newRatio }
      });
      onSplitChange?.(newRatio);
    }, 16), // 60fps
    [dispatch, onSplitChange]
  );

  // Calculate new ratio based on Y delta and container height
  const calculateNewRatio = useCallback((deltaY: number): number => {
    if (containerHeight <= 0) return getCurrentRatio();
    
    const ratioChange = deltaY / containerHeight;
    const newRatio = getCurrentRatio() + ratioChange;
    
    const constraints = getConstraints();
    return Math.max(constraints.min, Math.min(constraints.max, newRatio));
  }, [containerHeight, getCurrentRatio, getConstraints]);

  // Update container height when component mounts or resizes
  useEffect(() => {
    const updateContainerHeight = () => {
      if (splitterRef.current?.parentElement) {
        setContainerHeight(splitterRef.current.parentElement.clientHeight);
      }
    };

    updateContainerHeight();
    
    const resizeObserver = new ResizeObserver(updateContainerHeight);
    if (splitterRef.current?.parentElement) {
      resizeObserver.observe(splitterRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Start split operation
  const handleSplitStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    setStartY(clientY);
    setIsDragging(true);
    
    // Set global resize state
    dispatch({
      type: 'layout/setResizing',
      payload: true
    });
  }, [dispatch]);

  // Handle split movement
  const handleSplitMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = clientY - startY;
    const newRatio = calculateNewRatio(deltaY);
    
    // Only dispatch if ratio actually changed significantly
    const currentRatio = getCurrentRatio();
    if (Math.abs(newRatio - currentRatio) > 0.01) {
      const ratioKey = `${column}Vertical`;
      throttledSplit(ratioKey, newRatio);
    }
    
    setStartY(clientY);
  }, [isDragging, startY, calculateNewRatio, getCurrentRatio, column, throttledSplit]);

  // End split operation
  const handleSplitEnd = useCallback(() => {
    setIsDragging(false);
    setStartY(0);
    
    // Clear global resize state
    dispatch({
      type: 'layout/setResizing',
      payload: false
    });
  }, [dispatch]);

  // Set up global event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      const moveHandler = (e: MouseEvent | TouchEvent) => handleSplitMove(e);
      const endHandler = () => handleSplitEnd();
      
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', endHandler);
      document.addEventListener('touchmove', moveHandler);
      document.addEventListener('touchend', endHandler);
      
      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', endHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', endHandler);
      };
    }
  }, [isDragging, handleSplitMove, handleSplitEnd]);

  // Reset to default ratio
  const resetToDefault = useCallback(() => {
    const defaultRatio = 0.5;
    const ratioKey = `${column}Vertical`;
    throttledSplit(ratioKey, defaultRatio);
  }, [column, throttledSplit]);

  // Lock/unlock panel split
  const toggleLock = useCallback(() => {
    dispatch({
      type: 'layout/toggleSplitLock',
      payload: `${column}Vertical`
    });
  }, [column, dispatch]);

  return {
    isDragging,
    isResizing,
    currentRatio: getCurrentRatio(),
    constraints: getConstraints(),
    splitterRef,
    handlers: {
      onMouseDown: handleSplitStart,
      onTouchStart: handleSplitStart,
    },
    actions: {
      resetToDefault,
      toggleLock,
    },
  };
};

 