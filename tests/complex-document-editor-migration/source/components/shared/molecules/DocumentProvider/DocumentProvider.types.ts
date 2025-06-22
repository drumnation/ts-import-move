/**
 * Document Provider Types
 * 
 * Type definitions for document provider component and hooks
 * 
 * @module DocumentProvider.types
 */

import type { LegalDocument } from '@/tests/complex-document-editor-migration/source/types/legal-document-ast';
import type { LexicalASTNode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';
import type { MultiPageDocument } from '@/tests/complex-document-editor-migration/source/components/shared/DocumentEditorPage.types';

/**
 * Props for the DocumentProvider hook
 */
export interface DocumentProviderProps {
  /** Current document being edited */
  currentDocument: LegalDocument | null;
  /** Handler for content changes */
  onContentChange: (nodes: LexicalASTNode[]) => void;
  /** Handler for node selection changes */
  onNodeSelect?: (nodeId: string | null) => void;
  /** Placeholder text for empty editor */
  placeholder?: string;
}

/**
 * Alternative interface name for consistency
 */
export interface UseDocumentProviderProps extends DocumentProviderProps {}

/**
 * Return type for the useDocumentProvider hook
 */
export interface UseDocumentProviderReturn extends MultiPageDocument {} 