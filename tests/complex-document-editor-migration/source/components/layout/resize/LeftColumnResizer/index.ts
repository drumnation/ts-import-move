/**
 * LeftColumnResizer Barrel Export
 * Clean exports for all LeftColumnResizer functionality
 */

// Main component
export { LeftColumnResizer } from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer';

// Types
export type { LeftColumnResizerProps } from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.types';

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
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.logic';

// Custom hooks
export { 
  useLeftColumnResizer,
  useResizePerformance 
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.hook';

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
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/LeftColumnResizer/LeftColumnResizer.styles'; 