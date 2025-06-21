/**
 * RightColumnResizer Barrel Export
 * 
 * Centralized exports for RightColumnResizer component
 * Following React Component Standards pattern
 * 
 * @module RightColumnResizer
 */

// Main component
export { RightColumnResizer, RightColumnResizerMemo } from './RightColumnResizer';

// Types
export type { 
  RightColumnResizerProps,
  ResizeState,
  ResizeConstraints,
  ResizeEvent,
  ResizeHandlers,
  ResizerStyles,
} from './RightColumnResizer.types';

// Logic utilities (for testing or advanced usage)
export {
  calculateConstrainedWidth,
  calculateSnapWidth,
  extractEventCoordinates,
  calculateNewWidth,
  useRightColumnResizerLogic,
  createResizeConstraints,
  validateResizeState,
} from './RightColumnResizer.logic';

// Styled components (for customization)
export { RightColumnResizerStyles } from './RightColumnResizer.styles'; 