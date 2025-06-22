/**
 * DocumentEditorPage Exports
 * @module DocumentEditorPage
 */

// Main components
export { DocumentEditorPage, DocumentEditorPageContent } from '@/tests/complex-document-editor-migration/source/DocumentEditorPage';

// Navigation aids for AI agents
export { 
  VISUAL_TO_CODE_MAP, 
  TASK_TO_LOCATION_MAP, 
  BUG_FIX_LOCATIONS,
  findLocation 
} from '@/tests/complex-document-editor-migration/source/NAVIGATION_MAP';
export { 
  useDocumentEditor, 
  useDocumentStats, 
  usePlatformDetection,
  useDocumentContent 
} from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.hook';
export { 
  generateMockDocument,
  calculateDocumentStats,
  validateDocumentType,
  getDocumentTypeOptions,
  getSampleDocumentPool,
  getRecentDocuments,
  formatFileSize,
  validatePrompt,
  generateDocumentOutline,
  getSampleDocumentText,
  createSampleLegalDocument
} from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.logic';
export type {
  DocumentEditorPageProps,
  PanelState,
  DocumentState,
  AIAgentState,
  AIAgentAction,
  DocumentStats,
  QuickAction,
  DocumentPoolEntry,
  RecentDocument,
  CanvasVariant
} from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.types';

// Sub-component exports
export { TopBar, StatusIndicator, ActionBar } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/TopBar';
export { usePanelConfiguration } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration';
export { useDocumentProvider } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentProvider';
export { SampleDocumentContent } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SampleDocumentContent'; 