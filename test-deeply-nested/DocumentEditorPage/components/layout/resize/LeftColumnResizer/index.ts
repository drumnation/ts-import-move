/**
 * LeftColumnResizer Barrel Export
 * Clean exports for all LeftColumnResizer functionality
 */

// Main component
export { LeftColumnResizer } from './LeftColumnResizer';

// Types
export type { LeftColumnResizerProps } from './LeftColumnResizer.types';

// Business logic functions
export {
  calculateMaxWidth,
  validateWidth,
  calculateConstraints,
  canResize,
  calculateWidthDelta,
  formatWidthDisplay,
  getConstraintPositions,
  calculatePreviewPosition,
  calculateIndicatorPosition,
  hasLayoutConflicts,
  suggestOptimalWidth,
  createResizeState,
  updateResizeState,
  resetResizeState,
  validateResizeConfig,
  calculateResizeMetrics
} from './LeftColumnResizer.logic';

// Custom hooks
export { 
  useLeftColumnResizer,
  useResizePerformance 
} from './LeftColumnResizer.hook';

// Styled components (for advanced usage)
export {
  ResizerContainer,
  ResizerHandle,
  ResizePreview,
  WidthIndicator,
  ConstraintIndicator,
  ResizerTooltip,
  containerVariants,
  handleVariants,
  previewVariants,
  indicatorVariants
} from './LeftColumnResizer.styles'; 