/**
 * DocumentEditorLayout Component Index
 * 
 * Main export file for the DocumentEditorLayout component
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout
 */

// Main component export
export { DocumentEditorLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout';

// Hook exports
export { useDocumentEditorLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook';

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
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';

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
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.logic';

// Legacy compatibility exports (for gradual migration)
// These allow existing imports to continue working during refactor
export { DocumentEditorLayout as EditorCanvas } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout';
export { useDocumentEditorLayout as useEditorCanvas } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook';
export type { DocumentEditorLayoutProps as EditorCanvasProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';
export type { LayoutContainerProps as CanvasContainerProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types'; 