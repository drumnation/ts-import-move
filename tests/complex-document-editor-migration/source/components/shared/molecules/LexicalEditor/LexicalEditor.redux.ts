/**
 * LexicalEditor Redux Integration
 * 
 * Redux Toolkit integration for LexicalEditor with functional programming patterns
 * Provides document state management, collaborative editing support, and performance optimization
 * 
 * @module LexicalEditor.redux
 */

import { useCallback, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/store.hooks';
import {
  selectActiveDocumentWithContent,
  selectDocumentState,
  selectSelectionState,
  selectActiveDocument
} from '@/stores/selectors/document.selectors';
import { 
  updateBlock,
  addBlock,
  removeBlock,
  setSelection,
  setCurrentPage
} from '@/stores/document.slice';
import { 
  undo,
  redo
} from '@/stores/documentHistory.slice';
import type { 
  LexicalASTNode, 
  LexicalEditorReduxProps 
} from './LexicalEditor.types';
import type { DocumentBlock } from '@/stores/document.types';

/**
 * Performance settings for editor optimization
 */
interface EditorPerformanceSettings {
  throttleMs: number;
  batchUpdates: boolean;
  enableVirtualization: boolean;
}

/**
 * Default performance settings optimized for document editing
 */
const DEFAULT_PERFORMANCE_SETTINGS: EditorPerformanceSettings = {
  throttleMs: 300,
  batchUpdates: true,
  enableVirtualization: false
};

/**
 * Pure function to convert LexicalASTNode to DocumentBlock
 */
export const convertLexicalNodeToDocumentBlock = (
  node: LexicalASTNode,
  documentId: string,
  order: number
): Omit<DocumentBlock, 'id'> => ({
  type: node.type === 'heading' ? 'text' : 'text',
  content: {
    text: node.text,
    ...(node.type === 'heading' && { level: node.level })
  },
  position: { x: 0, y: order * 50 }, // Simple positioning
  order,
  metadata: {
    documentId,
    nodeType: node.type,
    ...(node.type === 'heading' && { headingLevel: node.level })
  }
});

/**
 * Pure function to convert DocumentBlock to LexicalASTNode
 */
export const convertDocumentBlockToLexicalNode = (
  block: DocumentBlock
): LexicalASTNode => {
  const text = typeof block.content.text === 'string' ? block.content.text : '';
  
  if (block.metadata?.nodeType === 'heading' && block.metadata?.headingLevel) {
    return {
      type: 'heading',
      level: Math.min(6, Math.max(1, block.metadata.headingLevel)) as 1 | 2 | 3 | 4 | 5 | 6,
      text
    };
  }
  
  return {
    type: 'paragraph',
    text
  };
};

/**
 * Throttle function for performance optimization
 */
const createThrottledFunction = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T>;
  
  return ((...args: Parameters<T>) => {
    lastArgs = args;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...lastArgs);
      timeoutId = null;
    }, delay);
  }) as T;
};

/**
 * Custom hook for LexicalEditor Redux integration
 */
export const useLexicalEditorRedux = ({
  documentId,
  readOnly = false,
  enableCollaboration = false,
  performanceSettings = DEFAULT_PERFORMANCE_SETTINGS
}: LexicalEditorReduxProps) => {
  const dispatch = useAppDispatch();
  
  // Redux selectors with memoization
  const documentWithContent = useAppSelector(selectActiveDocumentWithContent);
  const documentState = useAppSelector(selectDocumentState);
  const selectionState = useAppSelector(selectSelectionState);
  const activeDocument = useAppSelector(selectActiveDocument);
  
  // History selectors from state
  const historyState = useAppSelector((state: any) => state.documentHistory);
  const canUndoAction = historyState?.canUndo || false;
  const canRedoAction = historyState?.canRedo || false;
  
  // Performance settings with defaults
  const settings = useMemo(() => ({
    ...DEFAULT_PERFORMANCE_SETTINGS,
    ...performanceSettings
  }), [performanceSettings]);
  
  // Ref for tracking last update to prevent infinite loops
  const lastUpdateRef = useRef<string>('');
  
  // Convert document blocks to Lexical nodes
  const initialNodes = useMemo((): LexicalASTNode[] => {
    if (!documentWithContent?.blocks) return [];
    
    return documentWithContent.blocks
      .sort((a, b) => a.order - b.order)
      .map(convertDocumentBlockToLexicalNode);
  }, [documentWithContent?.blocks]);
  
  // Handle content changes from editor
  const handleContentChange = useMemo(() => {
    const updateContent = (nodes: LexicalASTNode[]) => {
      if (readOnly || !activeDocument) return;
      
      // Create content hash to prevent duplicate updates
      const contentHash = JSON.stringify(nodes);
      if (lastUpdateRef.current === contentHash) return;
      lastUpdateRef.current = contentHash;
      
      // Convert Lexical nodes to document blocks and dispatch updates
      nodes.forEach((node, index) => {
        const blockData = convertLexicalNodeToDocumentBlock(node, documentId, index);
        
        // For now, create new blocks - in real implementation would update existing ones
        dispatch(addBlock({ block: blockData }));
      });
    };
    
    // Apply throttling if enabled
    return settings.throttleMs > 0 
      ? createThrottledFunction(updateContent, settings.throttleMs)
      : updateContent;
  }, [readOnly, activeDocument, documentId, dispatch, settings.throttleMs]);
  
  // Selection state management
  const handleSelectionChange = useCallback((blockId?: string, range?: { start: number; end: number }) => {
    if (readOnly) return;
    
    dispatch(setSelection({
      blockId,
      range,
      cursor: undefined // Would be set by actual cursor position
    }));
  }, [readOnly, dispatch]);
  
  // Undo/Redo actions
  const undoAction = useCallback(() => {
    if (canUndoAction) {
      dispatch(undo());
    }
  }, [canUndoAction, dispatch]);
  
  const redoAction = useCallback(() => {
    if (canRedoAction) {
      dispatch(redo());
    }
  }, [canRedoAction, dispatch]);
  
  // Collaborative editing state (placeholder for future implementation)
  const collaborationState = useMemo(() => ({
    isEnabled: enableCollaboration,
    collaborators: documentState.collaborators || {},
    myUserId: 'current-user' // Would come from auth
  }), [enableCollaboration, documentState.collaborators]);
  
  // Document state computed properties
  const editorState = useMemo(() => ({
    isLoading: documentState.isLoading,
    isSaving: documentState.isSaving,
    error: documentState.error,
    lastSavedAt: documentState.lastSavedAt,
    hasUnsavedChanges: documentState.lastSavedAt !== null && 
                       documentState.lastSavedAt < new Date().toISOString(),
    currentPage: documentState.currentPage,
    zoomLevel: documentState.zoomLevel,
    viewMode: documentState.viewMode
  }), [documentState]);
  
  // Performance monitoring (placeholder)
  const performanceMetrics = useMemo(() => ({
    renderTime: 0,
    updateCount: 0,
    throttledUpdates: settings.throttleMs > 0
  }), [settings.throttleMs]);
  
  return {
    // Document state
    initialNodes,
    editorState,
    selectionState,
    
    // Actions
    onContentChange: handleContentChange,
    onSelectionChange: handleSelectionChange,
    undo: undoAction,
    redo: redoAction,
    
    // Capabilities
    canUndo: canUndoAction,
    canRedo: canRedoAction,
    
    // Collaboration
    collaboration: collaborationState,
    
    // Performance
    performance: {
      settings,
      metrics: performanceMetrics
    },
    
    // Configuration
    config: {
      readOnly,
      documentId,
      enableCollaboration
    }
  };
};

/**
 * Pure function to create editor theme with performance optimizations
 */
export const createOptimizedEditorTheme = (enableVirtualization: boolean = false) => ({
  paragraph: `editor-paragraph${enableVirtualization ? ' virtualized' : ''}`,
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  quote: 'editor-quote',
  list: {
    nested: {
      list: 'editor-list-nested',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-list-item',
  },
  link: 'editor-link',
  selection: 'editor-selection',
});

/**
 * Type guard to check if Redux integration is available
 */
export const isReduxIntegrationAvailable = (
  props: { useRedux?: boolean; documentId?: string }
): props is { useRedux: true; documentId: string } => {
  return props.useRedux === true && typeof props.documentId === 'string';
}; 