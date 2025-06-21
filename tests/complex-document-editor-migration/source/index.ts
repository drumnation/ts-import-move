/**
 * DocumentEditorPage Exports
 * @module DocumentEditorPage
 */

// Main components
export { DocumentEditorPage, DocumentEditorPageContent } from './DocumentEditorPage';

// Navigation aids for AI agents
export { 
  VISUAL_TO_CODE_MAP, 
  TASK_TO_LOCATION_MAP, 
  BUG_FIX_LOCATIONS,
  findLocation 
} from './NAVIGATION_MAP';
export { 
  useDocumentEditor, 
  useDocumentStats, 
  usePlatformDetection,
  useDocumentContent 
} from './DocumentEditorPage.hook';
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
} from './DocumentEditorPage.logic';
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
} from './DocumentEditorPage.types';

// Sub-component exports
export { TopBar, StatusIndicator, ActionBar } from './components/shared/molecules/TopBar';
export { usePanelConfiguration } from './components/shared/molecules/PanelConfiguration';
export { useDocumentProvider } from './components/shared/molecules/DocumentProvider';
export { SampleDocumentContent } from './components/shared/molecules/SampleDocumentContent'; 