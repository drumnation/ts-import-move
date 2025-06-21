/**
 * DocumentEditorLayout Component Index
 * 
 * Main export file for the DocumentEditorLayout component
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout
 */

// Main component export
export { DocumentEditorLayout } from './DocumentEditorLayout';

// Hook exports
export { useDocumentEditorLayout } from './DocumentEditorLayout.hook';

// Type exports
export type {
  DocumentEditorLayoutProps,
  LayoutContainerProps,
  DesktopLayoutProps,
  PanelSlotContainerProps,
  GroupedPanels,
  PanelCalculations,
  PanelHandlers,
  LayoutState,
  ContainerDimensions
} from './DocumentEditorLayout.types';

// Logic function exports
export {
  groupPanelsByLocation,
  calculatePanelSize,
  createResizeConfig,
  calculateWidthPercent,
  calculateHeightRatio,
  getPanelId,
  validatePanelSize,
  getResponsiveBreakpoints
} from './DocumentEditorLayout.logic';

// Legacy compatibility exports (for gradual migration)
// These allow existing imports to continue working during refactor
export { DocumentEditorLayout as EditorCanvas } from './DocumentEditorLayout';
export { useDocumentEditorLayout as useEditorCanvas } from './DocumentEditorLayout.hook';
export type { DocumentEditorLayoutProps as EditorCanvasProps } from './DocumentEditorLayout.types';
export type { LayoutContainerProps as CanvasContainerProps } from './DocumentEditorLayout.types'; 