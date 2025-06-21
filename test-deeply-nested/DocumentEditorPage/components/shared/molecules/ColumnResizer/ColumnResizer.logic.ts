/**
 * ColumnResizer Component Logic
 * 
 * Pure business logic functions for column resize calculations
 * Split from BidirectionalResizer for better separation of concerns
 * 
 * @module ColumnResizer.logic
 */

import type { ColumnResizeConfig, ColumnResizeState } from './ColumnResizer.types';

/**
 * Calculates the new column width based on mouse/touch movement
 * 
 * Logic rules:
 * - Left column: Dragging right increases width (positive delta)
 * - Right column: Dragging left increases width (negative delta becomes positive)
 */
export const calculateNewColumnWidth = (
  config: ColumnResizeConfig,
  startState: ColumnResizeState,
  clientX: number
): number => {
  const deltaX = clientX - startState.x;
  
  let newWidth: number;
  if (config.columnPosition === 'left') {
    // Left column: dragging right increases width
    newWidth = startState.width + deltaX;
  } else {
    // Right column: dragging left increases width (invert delta)
    newWidth = startState.width - deltaX;
  }
  
  return applyColumnConstraints(config, newWidth);
};

/**
 * Applies width constraints specific to column resizing
 * Ensures column stays within acceptable bounds for UI usability
 */
export const applyColumnConstraints = (
  config: ColumnResizeConfig,
  width: number
): number => {
  // Apply absolute pixel constraints first
  let constrainedWidth = Math.max(config.minWidth, Math.min(config.maxWidth, width));
  
  // Apply percentage constraints if container dimensions are available
  if (config.containerDimensions) {
    const containerWidth = config.containerDimensions.width;
    const minWidthFromPercent = (config.constraints.minPercent / 100) * containerWidth;
    const maxWidthFromPercent = (config.constraints.maxPercent / 100) * containerWidth;
    
    constrainedWidth = Math.max(
      minWidthFromPercent,
      Math.min(maxWidthFromPercent, constrainedWidth)
    );
  }
  
  return Math.round(constrainedWidth); // Round to avoid sub-pixel issues
};

/**
 * Creates initial resize state for tracking drag operations
 */
export const createColumnResizeState = (
  clientX: number,
  currentWidth: number
): ColumnResizeState => ({
  x: clientX,
  width: currentWidth
});

/**
 * Gets the horizontal resize icon for column resizing
 * Uses a consistent icon for all column resize operations
 */
export const getHorizontalResizeIcon = (): string => {
  return '⋮'; // Vertical dots indicating horizontal resize capability
};

/**
 * Validates column resize configuration
 * Ensures configuration values are sensible and consistent
 */
export const validateColumnConfig = (config: ColumnResizeConfig): boolean => {
  // Check basic numeric constraints
  if (config.minWidth <= 0 || config.maxWidth <= 0) {
    console.warn('ColumnResizer: Width constraints must be positive');
    return false;
  }
  
  if (config.minWidth >= config.maxWidth) {
    console.warn('ColumnResizer: minWidth must be less than maxWidth');
    return false;
  }
  
  // Check percentage constraints
  if (config.constraints.minPercent <= 0 || config.constraints.maxPercent <= 0) {
    console.warn('ColumnResizer: Percentage constraints must be positive');
    return false;
  }
  
  if (config.constraints.minPercent >= config.constraints.maxPercent) {
    console.warn('ColumnResizer: minPercent must be less than maxPercent');
    return false;
  }
  
  return true;
};

/**
 * Calculates optimal column width based on content and constraints
 * Provides intelligent default sizing for columns
 */
export const calculateOptimalColumnWidth = (
  config: ColumnResizeConfig,
  contentHint?: 'narrow' | 'medium' | 'wide'
): number => {
  const containerWidth = config.containerDimensions?.width || window.innerWidth;
  
  let targetPercent: number;
  switch (contentHint) {
    case 'narrow':
      targetPercent = Math.max(config.constraints.minPercent, 20);
      break;
    case 'wide':
      targetPercent = Math.min(config.constraints.maxPercent, 40);
      break;
    case 'medium':
    default:
      targetPercent = (config.constraints.minPercent + config.constraints.maxPercent) / 2;
      break;
  }
  
  const targetWidth = (targetPercent / 100) * containerWidth;
  return applyColumnConstraints(config, targetWidth);
}; 