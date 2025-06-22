/**
 * DrawerLayout Shared Logic
 * 
 * Business logic for mobile drawer layout system
 * Handles touch gestures, drawer animations, and state management
 * Optimized for mobile document editing experience
 * 
 * @module DrawerLayout.logic
 */

import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { 
  DrawerLayoutProps, 
  DrawerLayoutLogic, 
  MobileLayoutState,
  DrawerPosition,
  DrawerState,
  TouchGesture,
  SwipeDirection,
  DrawerAnimationConfig,
  DrawerConstraints 
} from './DrawerLayout.types';

/**
 * Default animation configuration
 */
const DEFAULT_ANIMATION_CONFIG: DrawerAnimationConfig = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: {
    tension: 300,
    friction: 30,
  },
  openThreshold: 50,
  closeThreshold: 50,
  velocityThreshold: 0.5,
};

/**
 * Default drawer constraints
 */
const DEFAULT_CONSTRAINTS: DrawerConstraints = {
  maxSizes: {
    leftWidth: 320,
    rightWidth: 320,
    bottomHeight: 400,
  },
  minSizes: {
    leftWidth: 280,
    rightWidth: 280,
    bottomHeight: 200,
  },
  screen: {
    minWidth: 320,
    minHeight: 568,
  },
  safeArea: {
    minTop: 20,
    minBottom: 20,
  },
};

/**
 * Default mobile layout state
 */
const DEFAULT_MOBILE_STATE: MobileLayoutState = {
  leftDrawer: {
    position: 'left',
    isOpen: false,
    state: 'closed',
    swipeEnabled: true,
    hasBackdrop: true,
    backdropClosable: true,
    size: {
      width: 85,
      height: 0,
      maxSize: 320,
      minSize: 280,
    },
  },
  rightDrawer: {
    position: 'right',
    isOpen: false,
    state: 'closed',
    swipeEnabled: true,
    hasBackdrop: true,
    backdropClosable: true,
    size: {
      width: 85,
      height: 0,
      maxSize: 320,
      minSize: 280,
    },
  },
  bottomDrawer: {
    position: 'bottom',
    isOpen: false,
    state: 'closed',
    swipeEnabled: true,
    hasBackdrop: true,
    backdropClosable: true,
    size: {
      width: 0,
      height: 60,
      maxSize: 400,
      minSize: 200,
    },
  },
  activeDrawer: null,
  screenDimensions: {
    width: 375,
    height: 812,
  },
  safeArea: {
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  },
};

/**
 * Custom hook providing shared drawer layout logic
 * Handles touch gestures and drawer coordination
 */
export const useDrawerLayout = (props: DrawerLayoutProps): DrawerLayoutLogic => {
  const {
    layoutState = DEFAULT_MOBILE_STATE,
    onDrawerToggle,
    onDrawerStateChange,
    onGestureStart,
    onGestureMove,
    onGestureEnd,
    onScreenResize,
  } = props;

  // Local state for layout and gestures
  const [localLayoutState, setLocalLayoutState] = useState<MobileLayoutState>(layoutState);
  const [currentGesture, setCurrentGesture] = useState<TouchGesture | null>(null);
  
  // Refs for gesture tracking
  const gestureStartTime = useRef<number>(0);
  const lastTouchPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update local state when props change
  useEffect(() => {
    setLocalLayoutState(layoutState);
  }, [layoutState]);

  /**
   * Determine swipe direction from gesture
   */
  const getSwipeDirection = useCallback((gesture: TouchGesture): SwipeDirection | null => {
    const { delta } = gesture;
    const absX = Math.abs(delta.x);
    const absY = Math.abs(delta.y);
    
    // Require minimum movement
    if (absX < 10 && absY < 10) return null;
    
    // Determine primary direction
    if (absX > absY) {
      return delta.x > 0 ? 'right' : 'left';
    } else {
      return delta.y > 0 ? 'down' : 'up';
    }
  }, []);

  /**
   * Calculate touch velocity
   */
  const calculateVelocity = useCallback((gesture: TouchGesture): { x: number; y: number } => {
    const timeDelta = Date.now() - gesture.timestamp;
    if (timeDelta === 0) return { x: 0, y: 0 };
    
    return {
      x: gesture.delta.x / timeDelta,
      y: gesture.delta.y / timeDelta,
    };
  }, []);

  /**
   * Open specific drawer
   */
  const openDrawer = useCallback((position: DrawerPosition) => {
    // Close other drawers first
    const updatedState = {
      ...localLayoutState,
      leftDrawer: { ...localLayoutState.leftDrawer, isOpen: position === 'left', state: position === 'left' ? 'opening' as DrawerState : 'closed' as DrawerState },
      rightDrawer: { ...localLayoutState.rightDrawer, isOpen: position === 'right', state: position === 'right' ? 'opening' as DrawerState : 'closed' as DrawerState },
      bottomDrawer: { ...localLayoutState.bottomDrawer, isOpen: position === 'bottom', state: position === 'bottom' ? 'opening' as DrawerState : 'closed' as DrawerState },
      activeDrawer: position,
    };

    setLocalLayoutState(updatedState);
    onDrawerToggle?.(position, true);
    onDrawerStateChange?.(position, 'opening');

    // Simulate animation completion
    setTimeout(() => {
      const finalState = {
        ...updatedState,
        [position + 'Drawer']: {
          ...updatedState[position + 'Drawer' as keyof MobileLayoutState],
          state: 'open' as DrawerState,
        },
      };
      setLocalLayoutState(finalState);
      onDrawerStateChange?.(position, 'open');
    }, DEFAULT_ANIMATION_CONFIG.duration);
  }, [localLayoutState, onDrawerToggle, onDrawerStateChange]);

  /**
   * Close specific drawer
   */
  const closeDrawer = useCallback((position: DrawerPosition) => {
    const drawerKey = position + 'Drawer' as keyof MobileLayoutState;
    const drawer = localLayoutState[drawerKey] as any;
    
    if (!drawer.isOpen) return;

    const updatedState = {
      ...localLayoutState,
      [drawerKey]: {
        ...drawer,
        state: 'closing' as DrawerState,
      },
      activeDrawer: null,
    };

    setLocalLayoutState(updatedState);
    onDrawerStateChange?.(position, 'closing');

    // Simulate animation completion
    setTimeout(() => {
      const finalState = {
        ...updatedState,
        [drawerKey]: {
          ...drawer,
          isOpen: false,
          state: 'closed' as DrawerState,
        },
      };
      setLocalLayoutState(finalState);
      onDrawerToggle?.(position, false);
      onDrawerStateChange?.(position, 'closed');
    }, DEFAULT_ANIMATION_CONFIG.duration);
  }, [localLayoutState, onDrawerToggle, onDrawerStateChange]);

  /**
   * Toggle drawer open/close
   */
  const toggleDrawer = useCallback((position: DrawerPosition) => {
    const drawerKey = position + 'Drawer' as keyof MobileLayoutState;
    const drawer = localLayoutState[drawerKey] as any;
    
    if (drawer.isOpen) {
      closeDrawer(position);
    } else {
      openDrawer(position);
    }
  }, [localLayoutState, openDrawer, closeDrawer]);

  /**
   * Close all drawers
   */
  const closeAllDrawers = useCallback(() => {
    const positions: DrawerPosition[] = ['left', 'right', 'bottom'];
    positions.forEach(position => {
      const drawerKey = position + 'Drawer' as keyof MobileLayoutState;
      const drawer = localLayoutState[drawerKey] as any;
      if (drawer.isOpen) {
        closeDrawer(position);
      }
    });
  }, [localLayoutState, closeDrawer]);

  /**
   * Handle touch gesture start
   */
  const handleGestureStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    const startPosition = { x: touch.clientX, y: touch.clientY };
    
    const gesture: TouchGesture = {
      startPosition,
      currentPosition: startPosition,
      delta: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      direction: null,
      isActive: true,
      timestamp: Date.now(),
    };

    gestureStartTime.current = Date.now();
    lastTouchPosition.current = startPosition;
    setCurrentGesture(gesture);
    onGestureStart?.(gesture);
  }, [onGestureStart]);

  /**
   * Handle touch gesture move
   */
  const handleGestureMove = useCallback((event: TouchEvent) => {
    if (!currentGesture) return;

    const touch = event.touches[0];
    const currentPosition = { x: touch.clientX, y: touch.clientY };
    const delta = {
      x: currentPosition.x - currentGesture.startPosition.x,
      y: currentPosition.y - currentGesture.startPosition.y,
    };

    const updatedGesture: TouchGesture = {
      ...currentGesture,
      currentPosition,
      delta,
      velocity: calculateVelocity({ ...currentGesture, delta }),
      direction: getSwipeDirection({ ...currentGesture, delta }),
    };

    setCurrentGesture(updatedGesture);
    onGestureMove?.(updatedGesture);
  }, [currentGesture, calculateVelocity, getSwipeDirection, onGestureMove]);

  /**
   * Handle touch gesture end
   */
  const handleGestureEnd = useCallback((event: TouchEvent) => {
    if (!currentGesture) return;

    const finalGesture: TouchGesture = {
      ...currentGesture,
      isActive: false,
    };

    // Check if gesture should open/close drawer
    const shouldOpen = shouldOpenDrawer(finalGesture);
    const shouldClose = shouldCloseDrawer(finalGesture);

    if (shouldOpen) {
      openDrawer(shouldOpen);
    } else if (shouldClose) {
      closeAllDrawers();
    }

    setCurrentGesture(null);
    onGestureEnd?.(finalGesture);
  }, [currentGesture, onGestureEnd]);

  /**
   * Check if gesture should open drawer
   */
  const shouldOpenDrawer = useCallback((gesture: TouchGesture): DrawerPosition | null => {
    const { direction, delta, velocity } = gesture;
    const { openThreshold, velocityThreshold } = DEFAULT_ANIMATION_CONFIG;

    // Quick swipe detection
    if (Math.abs(velocity.x) > velocityThreshold || Math.abs(velocity.y) > velocityThreshold) {
      if (direction === 'right' && gesture.startPosition.x < 50) return 'left';
      if (direction === 'left' && gesture.startPosition.x > localLayoutState.screenDimensions.width - 50) return 'right';
      if (direction === 'up' && gesture.startPosition.y > localLayoutState.screenDimensions.height - 100) return 'bottom';
    }

    // Distance threshold detection
    if (Math.abs(delta.x) > openThreshold) {
      if (direction === 'right' && gesture.startPosition.x < 50) return 'left';
      if (direction === 'left' && gesture.startPosition.x > localLayoutState.screenDimensions.width - 50) return 'right';
    }

    if (Math.abs(delta.y) > openThreshold) {
      if (direction === 'up' && gesture.startPosition.y > localLayoutState.screenDimensions.height - 100) return 'bottom';
    }

    return null;
  }, [localLayoutState]);

  /**
   * Check if gesture should close drawer
   */
  const shouldCloseDrawer = useCallback((gesture: TouchGesture): boolean => {
    if (!localLayoutState.activeDrawer) return false;

    const { direction, delta, velocity } = gesture;
    const { closeThreshold, velocityThreshold } = DEFAULT_ANIMATION_CONFIG;
    const activeDrawer = localLayoutState.activeDrawer;

    // Quick swipe detection
    if (Math.abs(velocity.x) > velocityThreshold || Math.abs(velocity.y) > velocityThreshold) {
      if (activeDrawer === 'left' && direction === 'left') return true;
      if (activeDrawer === 'right' && direction === 'right') return true;
      if (activeDrawer === 'bottom' && direction === 'down') return true;
    }

    // Distance threshold detection
    if (Math.abs(delta.x) > closeThreshold) {
      if (activeDrawer === 'left' && direction === 'left') return true;
      if (activeDrawer === 'right' && direction === 'right') return true;
    }

    if (Math.abs(delta.y) > closeThreshold) {
      if (activeDrawer === 'bottom' && direction === 'down') return true;
    }

    return false;
  }, [localLayoutState]);

  /**
   * Get drawer transform for animation
   */
  const getDrawerTransform = useCallback((position: DrawerPosition): string => {
    const drawer = localLayoutState[position + 'Drawer' as keyof MobileLayoutState] as any;
    
    if (!drawer.isOpen && drawer.state === 'closed') {
      switch (position) {
      case 'left':
        return 'translateX(-100%)';
      case 'right':
        return 'translateX(100%)';
      case 'bottom':
        return 'translateY(100%)';
      default:
        return 'translateX(0)';
      }
    }

    return 'translateX(0) translateY(0)';
  }, [localLayoutState]);

  /**
   * Get backdrop opacity for animation
   */
  const getBackdropOpacity = useCallback((): number => {
    return localLayoutState.activeDrawer ? 0.5 : 0;
  }, [localLayoutState]);

  /**
   * Handle screen orientation change
   */
  const handleOrientationChange = useCallback(() => {
    const { innerWidth, innerHeight } = window;
    const newDimensions = { width: innerWidth, height: innerHeight };
    
    const updatedState = {
      ...localLayoutState,
      screenDimensions: newDimensions,
    };

    setLocalLayoutState(updatedState);
    onScreenResize?.(newDimensions);
  }, [localLayoutState, onScreenResize]);

  // Set up orientation change listener
  useEffect(() => {
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [handleOrientationChange]);

  return {
    openDrawer,
    closeDrawer,
    toggleDrawer,
    closeAllDrawers,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd,
    shouldOpenDrawer,
    shouldCloseDrawer,
    getDrawerTransform,
    getBackdropOpacity,
    handleOrientationChange,
  };
}; 