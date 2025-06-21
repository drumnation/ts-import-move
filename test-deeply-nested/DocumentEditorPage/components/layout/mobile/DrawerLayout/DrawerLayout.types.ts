/**
 * DrawerLayout Component Types
 * 
 * TypeScript interfaces for mobile drawer layout system
 * Supports slide-out panels, bottom sheets, and touch interactions
 * Optimized for mobile document editing experience
 * 
 * @module DrawerLayout.types
 */

import React from 'react';

export type DrawerPosition = 'left' | 'right' | 'bottom';
export type DrawerState = 'closed' | 'opening' | 'open' | 'closing';
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface DrawerConfiguration {
  /** Drawer position */
  position: DrawerPosition;
  /** Whether drawer is currently open */
  isOpen: boolean;
  /** Current drawer state for animations */
  state: DrawerState;
  /** Whether drawer can be swiped to open/close */
  swipeEnabled: boolean;
  /** Whether drawer has backdrop overlay */
  hasBackdrop: boolean;
  /** Whether backdrop closes drawer on tap */
  backdropClosable: boolean;
  /** Drawer size configuration */
  size: {
    /** Width for side drawers (percentage) */
    width: number;
    /** Height for bottom drawer (percentage) */
    height: number;
    /** Maximum width/height in pixels */
    maxSize: number;
    /** Minimum width/height in pixels */
    minSize: number;
  };
}

export interface MobileLayoutState {
  /** Left drawer configuration */
  leftDrawer: DrawerConfiguration;
  /** Right drawer configuration */
  rightDrawer: DrawerConfiguration;
  /** Bottom drawer configuration */
  bottomDrawer: DrawerConfiguration;
  /** Currently active drawer (only one can be open) */
  activeDrawer: DrawerPosition | null;
  /** Screen dimensions */
  screenDimensions: {
    width: number;
    height: number;
  };
  /** Safe area insets for notched devices */
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface TouchGesture {
  /** Touch start position */
  startPosition: { x: number; y: number };
  /** Current touch position */
  currentPosition: { x: number; y: number };
  /** Touch delta from start */
  delta: { x: number; y: number };
  /** Touch velocity */
  velocity: { x: number; y: number };
  /** Gesture direction */
  direction: SwipeDirection | null;
  /** Whether gesture is active */
  isActive: boolean;
  /** Gesture timestamp */
  timestamp: number;
}

export interface DrawerLayoutProps {
  /** Current mobile layout state */
  layoutState: MobileLayoutState;
  /** Left drawer content */
  leftContent?: React.ReactNode;
  /** Right drawer content */
  rightContent?: React.ReactNode;
  /** Bottom drawer content */
  bottomContent?: React.ReactNode;
  /** Main content (document canvas) */
  mainContent?: React.ReactNode;
  /** Drawer open/close handlers */
  onDrawerToggle?: (position: DrawerPosition, isOpen: boolean) => void;
  /** Drawer state change handler */
  onDrawerStateChange?: (position: DrawerPosition, state: DrawerState) => void;
  /** Touch gesture handlers */
  onGestureStart?: (gesture: TouchGesture) => void;
  onGestureMove?: (gesture: TouchGesture) => void;
  onGestureEnd?: (gesture: TouchGesture) => void;
  /** Screen resize handler */
  onScreenResize?: (dimensions: { width: number; height: number }) => void;
}

export interface DrawerLayoutLogic {
  /** Open specific drawer */
  openDrawer: (position: DrawerPosition) => void;
  /** Close specific drawer */
  closeDrawer: (position: DrawerPosition) => void;
  /** Toggle drawer open/close */
  toggleDrawer: (position: DrawerPosition) => void;
  /** Close all drawers */
  closeAllDrawers: () => void;
  /** Handle touch gesture start */
  handleGestureStart: (event: TouchEvent) => void;
  /** Handle touch gesture move */
  handleGestureMove: (event: TouchEvent) => void;
  /** Handle touch gesture end */
  handleGestureEnd: (event: TouchEvent) => void;
  /** Check if gesture should open drawer */
  shouldOpenDrawer: (gesture: TouchGesture) => DrawerPosition | null;
  /** Check if gesture should close drawer */
  shouldCloseDrawer: (gesture: TouchGesture) => boolean;
  /** Get drawer transform for animation */
  getDrawerTransform: (position: DrawerPosition) => string;
  /** Get backdrop opacity for animation */
  getBackdropOpacity: () => number;
  /** Handle screen orientation change */
  handleOrientationChange: () => void;
}

export interface DrawerAnimationConfig {
  /** Animation duration in milliseconds */
  duration: number;
  /** Animation easing function */
  easing: string;
  /** Spring animation config */
  spring: {
    tension: number;
    friction: number;
  };
  /** Gesture threshold for opening */
  openThreshold: number;
  /** Gesture threshold for closing */
  closeThreshold: number;
  /** Velocity threshold for quick gestures */
  velocityThreshold: number;
}

export interface DrawerConstraints {
  /** Maximum drawer sizes */
  maxSizes: {
    leftWidth: number;
    rightWidth: number;
    bottomHeight: number;
  };
  /** Minimum drawer sizes */
  minSizes: {
    leftWidth: number;
    rightWidth: number;
    bottomHeight: number;
  };
  /** Screen size constraints */
  screen: {
    minWidth: number;
    minHeight: number;
  };
  /** Safe area constraints */
  safeArea: {
    minTop: number;
    minBottom: number;
  };
} 