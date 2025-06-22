/**
 * ColumnResizer Component Hooks
 * 
 * Custom hooks for column-specific resize operations
 * Split from BidirectionalResizer for better separation of concerns
 * 
 * @module ColumnResizer.hook
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { 
  ColumnResizeConfig, 
  ColumnResizeState 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.types';
import { 
  calculateNewColumnWidth, 
  createColumnResizeState,
  validateColumnConfig 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.logic';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';
import type { ColumnResizerHookReturn, ResizeDirection } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.types';
import type { RootState } from '@/stores/store';

/**
 * Return type for the useColumnResizeHandlers hook
 */
export interface UseColumnResizeHandlers {
  isResizing: boolean;
  isHovered: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  setIsHovered: (hovered: boolean) => void;
}

/**
 * Main hook for column resize functionality
 * Handles mouse and touch events for horizontal column resizing
 * 
 * @param config - Column resize configuration
 * @param onColumnResize - Callback for width changes
 * @param disabled - Whether resizing is disabled
 * @returns Resize handlers and state
 */
export const useColumnResizeHandlers = (
  config: ColumnResizeConfig,
  onColumnResize: (newWidth: number) => void,
  disabled: boolean
): UseColumnResizeHandlers => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startStateRef = useRef<ColumnResizeState>({ x: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate configuration on mount
  useEffect(() => {
    if (!validateColumnConfig(config)) {
      console.error('Invalid ColumnResizer configuration:', config);
    }
  }, [config]);

  /**
   * Handles mouse down events to start resize operation
   * Sets up initial state and prevents default browser behavior
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    
    startStateRef.current = createColumnResizeState(
      event.clientX,
      config.currentWidth
    );
  }, [disabled, config.currentWidth]);

  /**
   * Handles touch start events for mobile/tablet resizing
   * Provides similar functionality to mouse events
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    
    const touch = event.touches[0];
    startStateRef.current = createColumnResizeState(
      touch.clientX,
      config.currentWidth
    );
  }, [disabled, config.currentWidth]);

  /**
   * Handles mouse movement during resize
   * Calculates new column width and triggers callback
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = calculateNewColumnWidth(
      config,
      startStateRef.current,
      event.clientX
    );
    
    onColumnResize(newWidth);
  }, [isResizing, config, onColumnResize]);

  /**
   * Handles touch movement during resize
   * Similar to mouse move but for touch devices
   */
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isResizing) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const newWidth = calculateNewColumnWidth(
      config,
      startStateRef.current,
      touch.clientX
    );
    
    onColumnResize(newWidth);
  }, [isResizing, config, onColumnResize]);

  /**
   * Ends resize operation
   * Cleans up resize state
   */
  const handleEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  /**
   * Set up and clean up mouse event listeners
   * Only active during resize operations
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
 * Hook for managing column resize constraints
 * Provides validation and constraint helpers
 */
export const useColumnConstraints = (config: ColumnResizeConfig) => {
  const isValidConfig = validateColumnConfig(config);
  
  const getConstrainedWidth = useCallback((width: number) => {
    return Math.max(config.minWidth, Math.min(config.maxWidth, width));
  }, [config.minWidth, config.maxWidth]);
  
  return {
    isValidConfig,
    getConstrainedWidth
  };
};

/**
 * Hook for managing column resize operations with platform-aware constraints
 * and Redux state coordination
 */
export const useColumnResizer = (
  direction: ResizeDirection,
  minWidth: number = 200,
  maxWidth: number = 600
): ColumnResizerHookReturn => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);

  // Get current column sizes from Redux
  const columnSizes = useSelector((state: RootState) => 
    state.layout?.columnSizes || { left: 300, center: 0, right: 300 }
  );
  
  const isResizing = useSelector((state: RootState) => 
    state.layout?.isResizing || false
  );

  const responsive = useSelector((state: RootState) => 
    state.layout?.responsive || { isMobile: false, isTablet: false, isDesktop: true }
  );

  // Platform-adaptive constraints
  const getConstraints = useCallback(() => {
    if (responsive.isMobile) {
      return { min: 0, max: window.innerWidth };
    }
    if (responsive.isTablet) {
      return { min: 150, max: 400 };
    }
    return { min: minWidth, max: maxWidth };
  }, [responsive, minWidth, maxWidth]);

  // Throttled resize dispatch to prevent excessive Redux updates
  const throttledResize = useCallback(
    throttle((column: string, newSize: number) => {
      dispatch({
        type: 'layout/resizeColumn',
        payload: { column, size: newSize }
      });
    }, 16), // 60fps
    [dispatch]
  );

  // Calculate new size based on direction and delta
  const calculateNewSize = useCallback((delta: number): number => {
    const currentSize = direction === 'left' ? columnSizes.left : columnSizes.right;
    const adjustedDelta = direction === 'left' ? delta : -delta; // Right resizer works in reverse
    const newSize = currentSize + adjustedDelta;
    
    const constraints = getConstraints();
    return Math.max(constraints.min, Math.min(constraints.max, newSize));
  }, [direction, columnSizes, getConstraints]);

  // Start resize operation
  const handleResizeStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setStartX(clientX);
    setIsDragging(true);
    
    // Set global resize state
    dispatch({
      type: 'layout/setResizing',
      payload: true
    });
  }, [dispatch]);

  // Handle resize movement
  const handleResizeMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const delta = clientX - startX;
    const newSize = calculateNewSize(delta);
    
    // Only dispatch if size actually changed
    const currentSize = direction === 'left' ? columnSizes.left : columnSizes.right;
    if (Math.abs(newSize - currentSize) > 1) {
      throttledResize(direction, newSize);
    }
    
    setStartX(clientX);
  }, [isDragging, startX, calculateNewSize, direction, columnSizes, throttledResize]);

  // End resize operation
  const handleResizeEnd = useCallback(() => {
    setIsDragging(false);
    setStartX(0);
    
    // Clear global resize state
    dispatch({
      type: 'layout/setResizing',
      payload: false
    });
  }, [dispatch]);

  // Set up global event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      const moveHandler = (e: MouseEvent | TouchEvent) => handleResizeMove(e);
      const endHandler = () => handleResizeEnd();
      
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
  }, [isDragging, handleResizeMove, handleResizeEnd]);

  // Reset to default size
  const resetToDefault = useCallback(() => {
    const defaultSize = responsive.isMobile ? window.innerWidth : 300;
    throttledResize(direction, defaultSize);
  }, [direction, responsive, throttledResize]);

  // Lock/unlock column
  const toggleLock = useCallback(() => {
    dispatch({
      type: 'layout/toggleColumnLock',
      payload: direction
    });
  }, [direction, dispatch]);

  return {
    isDragging,
    isResizing,
    currentSize: direction === 'left' ? columnSizes.left : columnSizes.right,
    constraints: getConstraints(),
    dragRef,
    handlers: {
      onMouseDown: handleResizeStart,
      onTouchStart: handleResizeStart,
    },
    actions: {
      resetToDefault,
      toggleLock,
    },
  };
}; 