/**
 * PanelSplitter Module Exports
 * 
 * Centralized exports for vertical panel splitting functionality.
 * Split from BidirectionalResizer for better AI agent discoverability.
 * 
 * @module PanelSplitter
 */

// Main component
export { PanelSplitter as default, PanelSplitter } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter';

// Hooks
export { 
  usePanelSplitter,
  usePanelSplitHandlers,
  usePanelSplitConstraints 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.hook';

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
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.types';

// Styled components (for direct styling needs)
export {
  StyledPanelSplitter,
  StyledVerticalHandle,
  StyledSplitterContent,
  // Legacy exports for backward compatibility
  PanelSplitterContainer,
  VerticalSplitHandle
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.styles';

// Logic utilities (if needed for testing or custom implementations)
export {
  createPanelSplitState,
  calculateNewSplitRatio,
  validateSplitConfig,
  getVerticalSplitIcon
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.logic'; 