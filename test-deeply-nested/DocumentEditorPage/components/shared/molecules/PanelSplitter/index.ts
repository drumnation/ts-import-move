/**
 * PanelSplitter Module Exports
 * 
 * Centralized exports for vertical panel splitting functionality.
 * Split from BidirectionalResizer for better AI agent discoverability.
 * 
 * @module PanelSplitter
 */

// Main component
export { PanelSplitter as default, PanelSplitter } from './PanelSplitter';

// Hooks
export { 
  usePanelSplitter,
  usePanelSplitHandlers,
  usePanelSplitConstraints 
} from './PanelSplitter.hook';

// Types
export type {
  PanelSplitterProps,
  PanelSplitConfig,
  PanelSplitState,
  PanelSplitterHookReturn,
  PanelSplitConstraints,
  ColumnType,
  StyledPanelSplitterProps,
  StyledVerticalHandleProps,
  UsePanelSplitHandlers
} from './PanelSplitter.types';

// Styled components (for direct styling needs)
export {
  StyledPanelSplitter,
  StyledVerticalHandle,
  StyledSplitterContent,
  // Legacy exports for backward compatibility
  PanelSplitterContainer,
  VerticalSplitHandle
} from './PanelSplitter.styles';

// Logic utilities (if needed for testing or custom implementations)
export {
  createPanelSplitState,
  calculateNewSplitRatio,
  validateSplitConfig,
  getVerticalSplitIcon
} from './PanelSplitter.logic'; 