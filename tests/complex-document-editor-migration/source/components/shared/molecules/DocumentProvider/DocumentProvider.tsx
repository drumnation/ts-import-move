/**
 * Document Provider Component
 * 
 * Handles document creation and state management for the editor
 * Creates mock documents and manages document page structure
 * 
 * @module DocumentProvider
 */

import React from 'react';
import { LexicalEditor } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor';
import { FormattingToolbar } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/FormattingToolbar/FormattingToolbar';
import { DocumentPageContainer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentProvider/DocumentProvider.styles';
import type { DocumentProviderProps, UseDocumentProviderReturn } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentProvider/DocumentProvider.types';

/**
 * Creates a mock document structure for the editor
 */
export const useDocumentProvider = ({
  currentDocument,
  onContentChange,
  onNodeSelect,
  placeholder = 'Start typing your legal document...'
}: DocumentProviderProps): UseDocumentProviderReturn => {
  const renderPageContent = React.useCallback(() => (
    <DocumentPageContainer>
      <LexicalEditor 
        document={currentDocument}
        onContentChange={onContentChange}
        onNodeSelect={onNodeSelect}
        placeholder={placeholder}
        renderToolbar={() => <FormattingToolbar />}
      />
    </DocumentPageContainer>
  ), [currentDocument, onContentChange, onNodeSelect, placeholder]);

  return React.useMemo(() => ({
    pages: [
      {
        id: 'page-1',
        content: renderPageContent(),
        pageNumber: 1,
        dimensions: { width: 612, height: 792 }
      }
    ],
    currentPageIndex: 0,
    viewMode: 'single' as const,
    totalPages: 1
  }), [renderPageContent]);
}; 