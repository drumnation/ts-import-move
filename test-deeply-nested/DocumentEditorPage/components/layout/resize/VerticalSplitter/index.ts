/**
 * VerticalSplitter Barrel Export
 * 
 * Centralized exports for VerticalSplitter component and related utilities
 * 
 * @module VerticalSplitter
 */

// Main component
export { VerticalSplitter, VerticalSplitterMemo } from './VerticalSplitter';

// Types
export type { 
  VerticalSplitterProps,
  SplitState,
  SplitConstraints,
  SplitEvent,
  SplitHandlers,
  SplitterStyles,
} from './VerticalSplitter.types';

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
} from './VerticalSplitter.logic';

// Styled components (for customization)
export { VerticalSplitterStyles } from './VerticalSplitter.styles'; 