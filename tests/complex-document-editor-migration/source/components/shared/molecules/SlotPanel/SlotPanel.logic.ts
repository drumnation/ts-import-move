/**
 * SlotPanel Component Logic
 * 
 * Pure business logic functions for the SlotPanel component
 * 
 * @module SlotPanel.logic
 */

import type { ResizeDirection, IconConfig } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.types';

/**
 * Determines the appropriate collapse icon based on panel location and mobile state
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