/**
 * ConfigurablePanel Component Logic
 * 
 * Pure business logic functions for the ConfigurablePanel component
 * Renamed from SlotPanel for better AI agent discoverability
 * 
 * @module ConfigurablePanel.logic
 */

import type { ResizeDirection, IconConfig } from './ConfigurablePanel.types';

/**
 * Determines the appropriate collapse icon based on panel location and mobile state
 * 
 * Logic rules:
 * - Mobile: Always up/down (bottom sheet behavior)
 * - Desktop center bottom: up/down (vertical collapse)
 * - Desktop left sidebar: left/right (horizontal collapse toward edge)
 * - Desktop right sidebar: left/right (horizontal collapse toward edge)
 */
export const getCollapseIconType = (
  isMobile: boolean,
  collapsed: boolean,
  location: 'left' | 'right' | 'center',
  slot: 'top' | 'bottom'
): 'chevron-up' | 'chevron-down' | 'chevron-left' | 'chevron-right' => {
  if (isMobile) {
    return collapsed ? 'chevron-up' : 'chevron-down';
  }
  
  if (location === 'center' && slot === 'bottom') {
    return collapsed ? 'chevron-up' : 'chevron-down';
  }
  
  if (location === 'left') {
    return collapsed ? 'chevron-right' : 'chevron-left';
  }
  
  return collapsed ? 'chevron-left' : 'chevron-right';
};

/**
 * Determines the resize direction based on panel location and slot
 * 
 * Logic rules:
 * - Center bottom panels: vertical resize (height adjustment)
 * - Left/right sidebar panels: horizontal resize (width adjustment)
 */
export const getResizerDirection = (
  location: 'left' | 'right' | 'center',
  slot: 'top' | 'bottom'
): ResizeDirection => {
  if (location === 'center' && slot === 'bottom') {
    return 'vertical';
  }
  return 'horizontal';
};

/**
 * Calculates icon configuration based on mobile state
 * Ensures touch targets meet accessibility guidelines (minimum 44px)
 * 
 * @param isMobile - Whether the device is mobile
 * @returns IconConfig with appropriate sizes for platform
 */
export const getIconConfig = (isMobile: boolean): IconConfig => {
  return {
    size: isMobile ? 20 : 14,
    minWidth: isMobile ? 44 : 32,
    minHeight: isMobile ? 44 : 32
  };
};

/**
 * Gets animation configuration for panel entrance/exit
 * Uses platform-optimized animation settings
 * 
 * Mobile: Bottom sheet style with scale and translate
 * Desktop: Simple opacity fade
 */
export const getAnimationConfig = (isMobile: boolean) => {
  return {
    initial: { 
      opacity: 0, 
      scale: isMobile ? 0.95 : 1,
      y: isMobile ? 100 : 0 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0 
    },
    exit: { 
      opacity: 0, 
      scale: isMobile ? 0.95 : 1,
      y: isMobile ? 100 : 0 
    },
    transition: { duration: 0.2 }
  };
};

/**
 * Validates panel size constraints
 * Ensures panel size stays within acceptable bounds
 */
export const validatePanelSize = (
  newSize: number,
  minSize: number = 200,
  maxSize: number = 800
): number => {
  return Math.max(minSize, Math.min(maxSize, newSize));
};

/**
 * Calculates panel position based on location and platform
 * Returns CSS positioning properties for proper panel placement
 */
export const calculatePanelPosition = (
  location: 'left' | 'right' | 'center',
  slot: 'top' | 'bottom',
  isMobile: boolean
) => {
  if (isMobile) {
    return {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100
    };
  }

  const basePosition = {
    position: 'relative',
    zIndex: 1
  };

  return basePosition;
}; 