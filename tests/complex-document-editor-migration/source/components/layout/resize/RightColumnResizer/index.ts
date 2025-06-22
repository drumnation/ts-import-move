/**
 * RightColumnResizer Barrel Export
 * 
 * Centralized exports for RightColumnResizer component
 * Following React Component Standards pattern
 * 
 * @module RightColumnResizer
 */

// Main component
export { RightColumnResizer, RightColumnResizerMemo } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer';

// Types
export type { 
  RightColumnResizerProps,
  ResizeState,
  ResizeConstraints,
  ResizeEvent,
  ResizeHandlers,
  ResizerStyles,
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.types';

// Logic utilities (for testing or advanced usage)
export {
  calculateConstrainedWidth,
  calculateSnapWidth,
  extractEventCoordinates,
  calculateNewWidth,
  useRightColumnResizerLogic,
  createResizeConstraints,
  validateResizeState,
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.logic';

// Styled components (for customization)
export { RightColumnResizerStyles } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.styles'; 