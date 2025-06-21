/**
 * PanelSplitter Component Logic
 * 
 * Pure business logic functions for vertical panel splitting calculations
 * Split from BidirectionalResizer for better separation of concerns
 * 
 * @module PanelSplitter.logic
 */

import type { PanelSplitConfig, PanelSplitState } from './PanelSplitter.types';

/**
 * Calculates the new split ratio based on mouse/touch movement
 * 
 * Logic rules:
 * - Dragging up increases bottom panel height (higher ratio)
 * - Dragging down decreases bottom panel height (lower ratio)
 * - Movement is converted to ratio based on container height
 */
export const calculateNewSplitRatio = (
  config: PanelSplitConfig,
  startState: PanelSplitState,
  clientY: number
): number => {
  const deltaY = startState.y - clientY; // Inverted: up = positive
  
  // Get container height for ratio calculation
  const containerHeight = config.containerDimensions?.height || window.innerHeight;
  
  // Convert pixel movement to ratio change
  const ratioChange = deltaY / containerHeight;
  const newRatio = startState.ratio + ratioChange;
  
  return applySplitConstraints(config, newRatio);
};

/**
 * Applies ratio constraints specific to panel splitting
 * Ensures split ratio stays within acceptable bounds
 */
export const applySplitConstraints = (
  config: PanelSplitConfig,
  ratio: number
): number => {
  // Apply absolute ratio constraints first
  let constrainedRatio = Math.max(config.minRatio, Math.min(config.maxRatio, ratio));
  
  // Apply percentage constraints for additional validation
  const minRatioFromPercent = config.constraints.minPercent / 100;
  const maxRatioFromPercent = config.constraints.maxPercent / 100;
  
  constrainedRatio = Math.max(
    minRatioFromPercent,
    Math.min(maxRatioFromPercent, constrainedRatio)
  );
  
  // Round to avoid floating point precision issues
  return Math.round(constrainedRatio * 1000) / 1000; // 3 decimal places
};

/**
 * Creates initial split state for tracking drag operations
 */
export const createPanelSplitState = (
  clientY: number,
  currentRatio: number
): PanelSplitState => ({
  y: clientY,
  ratio: currentRatio
});

/**
 * Gets the vertical split icon for panel splitting
 * Uses horizontal dots to indicate vertical split capability
 */
export const getVerticalSplitIcon = (): string => {
  return '⋯'; // Horizontal dots indicating vertical split capability
};

/**
 * Validates panel split configuration
 * Ensures configuration values are sensible and consistent
 */
export const validateSplitConfig = (config: PanelSplitConfig): boolean => {
  // Check basic ratio constraints
  if (config.minRatio < 0 || config.maxRatio > 1) {
    console.warn('PanelSplitter: Split ratios must be between 0 and 1');
    return false;
  }
  
  if (config.minRatio >= config.maxRatio) {
    console.warn('PanelSplitter: minRatio must be less than maxRatio');
    return false;
  }
  
  // Check current ratio is within bounds
  if (config.currentRatio < config.minRatio || config.currentRatio > config.maxRatio) {
    console.warn('PanelSplitter: currentRatio is outside min/max bounds');
    return false;
  }
  
  // Check percentage constraints
  if (config.constraints.minPercent < 0 || config.constraints.maxPercent > 100) {
    console.warn('PanelSplitter: Percentage constraints must be between 0 and 100');
    return false;
  }
  
  if (config.constraints.minPercent >= config.constraints.maxPercent) {
    console.warn('PanelSplitter: minPercent must be less than maxPercent');
    return false;
  }
  
  return true;
};

/**
 * Calculates optimal split ratio based on content requirements
 * Provides intelligent default sizing for panels
 */
export const calculateOptimalSplitRatio = (
  config: PanelSplitConfig,
  contentHint?: 'minimal' | 'moderate' | 'extensive'
): number => {
  let targetPercent: number;
  
  switch (contentHint) {
    case 'minimal':
      // Small bottom panel for minimal content (e.g., status bar)
      targetPercent = Math.max(config.constraints.minPercent, 25);
      break;
    case 'extensive':
      // Large bottom panel for extensive content (e.g., detailed logs)
      targetPercent = Math.min(config.constraints.maxPercent, 70);
      break;
    case 'moderate':
    default:
      // Balanced split for moderate content
      targetPercent = (config.constraints.minPercent + config.constraints.maxPercent) / 2;
      break;
  }
  
  const targetRatio = targetPercent / 100;
  return applySplitConstraints(config, targetRatio);
};

/**
 * Converts split ratio to pixel heights for layout calculations
 * Helper function for CSS layout computations
 */
export const splitRatioToPixels = (
  ratio: number,
  containerHeight: number
): { topHeight: number; bottomHeight: number } => {
  const bottomHeight = Math.round(containerHeight * ratio);
  const topHeight = containerHeight - bottomHeight;
  
  return {
    topHeight,
    bottomHeight
  };
};

/**
 * Converts pixel heights to split ratio
 * Helper function for reverse calculations
 */
export const pixelsToSplitRatio = (
  bottomHeight: number,
  containerHeight: number
): number => {
  if (containerHeight <= 0) return 0;
  return bottomHeight / containerHeight;
}; 