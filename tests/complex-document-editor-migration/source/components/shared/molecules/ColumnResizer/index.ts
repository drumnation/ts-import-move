/**
 * ColumnResizer Component Exports
 * 
 * Barrel export file for the ColumnResizer component
 * Split from BidirectionalResizer for better AI agent discoverability
 * 
 * @module ColumnResizer
 */

// Main component
export { ColumnResizer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer';

// Hooks
export { 
  useColumnResizeHandlers,
  useColumnConstraints
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.hook';

// Types
export type { 
  ColumnResizerProps,
  ColumnResizeConfig,
  ColumnResizeState,
  StyledColumnResizerProps,
  StyledHorizontalHandleProps,
  UseColumnResizeHandlers
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.types';

// Logic functions
export {
  calculateNewColumnWidth,
  applyColumnConstraints,
  createColumnResizeState,
  getHorizontalResizeIcon,
  validateColumnConfig,
  calculateOptimalColumnWidth
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.logic';

// Styled components
export {
  ColumnResizerContainer,
  HorizontalResizeHandle
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ColumnResizer/ColumnResizer.styles'; 