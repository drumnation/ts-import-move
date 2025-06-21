/**
 * ColumnResizer Component Exports
 * 
 * Barrel export file for the ColumnResizer component
 * Split from BidirectionalResizer for better AI agent discoverability
 * 
 * @module ColumnResizer
 */

// Main component
export { ColumnResizer } from './ColumnResizer';

// Hooks
export { 
  useColumnResizeHandlers,
  useColumnConstraints
} from './ColumnResizer.hook';

// Types
export type { 
  ColumnResizerProps,
  ColumnResizeConfig,
  ColumnResizeState,
  StyledColumnResizerProps,
  StyledHorizontalHandleProps,
  UseColumnResizeHandlers
} from './ColumnResizer.types';

// Logic functions
export {
  calculateNewColumnWidth,
  applyColumnConstraints,
  createColumnResizeState,
  getHorizontalResizeIcon,
  validateColumnConfig,
  calculateOptimalColumnWidth
} from './ColumnResizer.logic';

// Styled components
export {
  ColumnResizerContainer,
  HorizontalResizeHandle
} from './ColumnResizer.styles'; 