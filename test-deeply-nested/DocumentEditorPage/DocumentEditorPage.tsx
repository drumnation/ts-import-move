/**
 * Document Editor Page - "Photoshop meets Cursor IDE for Law"
 * 
 * AI-driven legal document creation with collapsible panels
 * No manual typing - pure agentic document production
 * 
 * @module DocumentEditorPage
 */

import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from '../../shared-components/ErrorBoundary';
import { DragDropProvider } from '@/shared-components/providers/DragDropProvider';
import { usePlatformDetection, useDocumentContent } from './DocumentEditorPage.hook';
import type { DocumentEditorPageProps, PanelSlot } from './DocumentEditorPage.types';
import { EditorCanvas } from './components/shared/molecules/EditorCanvas';
import { usePanelConfiguration } from './components/shared/molecules/PanelConfiguration';
import { useDocumentProvider } from './components/shared/molecules/DocumentProvider';

/**
 * AI-Powered Document Editor with Slot-Based Panel System
 */
export const DocumentEditorPageContent = (props: DocumentEditorPageProps) => {
  const { 
    initialDocument, 
    onDocumentChange, 
    readOnly = false 
  } = props;

  // Platform detection
  const { platform } = usePlatformDetection();

  // Document content state management
  const { 
    currentDocument, 
    updateDocument,
    handleContentChange,
    handleInsertNode
  } = useDocumentContent();

  // Placeholder for node selection state (to be implemented)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Document provider for page structure
  const multiPageDocument = useDocumentProvider({
    currentDocument,
    onContentChange: handleContentChange,
    onNodeSelect: handleNodeSelect
  });

  // Panel configuration with Redux integration
  const { 
    panelSlots
  } = usePanelConfiguration({
    selectedNodeId,
    onNodeUpdate: (nodeId: string, updates: any) => {
      console.log('Node updated:', nodeId, updates);
    },
    onInsertNode: handleInsertNode,
    onDocumentUpdate: (doc: any) => {
      console.log('Document updated:', doc);
    }
  });

  // handleInsertNode already provided by useDocumentContent hook

  // Create editor canvas properties
  const editorCanvasProps = {
    document: multiPageDocument,
    panelSlots,
    onPanelResize: (panelId: string, newSize: number) => console.log('Panel resize:', panelId, newSize),
    onPanelToggle: (panelId: string) => console.log('Panel toggle:', panelId), 
    onPanelClose: (panelId: string) => console.log('Panel close:', panelId),
    onPanelSplit: (panelId: string, direction: 'horizontal' | 'vertical') => console.log('Panel split:', panelId, direction),
    onInsertNode: handleInsertNode
  };

  return (
    <DragDropProvider debugMode={false}>
      <EditorCanvas {...editorCanvasProps} />
    </DragDropProvider>
  );
};

/**
 * Main DocumentEditorPage component with error boundary and drag-drop support
 */
export const DocumentEditorPage = (props: DocumentEditorPageProps) => (
  <ErrorBoundary level="page">
    <DocumentEditorPageContent {...props} />
  </ErrorBoundary>
); 