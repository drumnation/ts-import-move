/**
 * VerticalSplitter Barrel Export
 * 
 * Centralized exports for VerticalSplitter component and related utilities
 * 
 * @module VerticalSplitter
 */

// Main component
export { VerticalSplitter, VerticalSplitterMemo } from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter';

// Types
export type { 
  VerticalSplitterProps,
  SplitState,
  SplitConstraints,
  SplitEvent,
  SplitHandlers,
  SplitterStyles,
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.types';

// Logic utilities (for testing or advanced usage)
export {
  calculateConstrainedRatio,
  calculateSnapRatio,
  extractEventCoordinates,
  calculateNewRatio,
  getContainerHeight,
  useVerticalSplitterLogic,
  createSplitConstraints,
  validateSplitState,
} from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.logic';

// Styled components (for customization)
export { VerticalSplitterStyles } from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.styles'; 