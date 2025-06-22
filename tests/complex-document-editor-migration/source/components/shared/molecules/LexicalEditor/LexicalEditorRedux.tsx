/**
 * Redux-Integrated Lexical Editor for Legal Documents
 * 
 * Full Redux Toolkit integration with collaborative editing support
 * Performance-optimized with throttling and state synchronization
 * 
 * @module LexicalEditorRedux
 */

import React, { useMemo, useCallback } from 'react';
import { 
  LexicalComposer,
  InitialConfigType 
} from '@lexical/react/LexicalComposer';
import { 
  RichTextPlugin 
} from '@lexical/react/LexicalRichTextPlugin';
import { 
  ContentEditable 
} from '@lexical/react/LexicalContentEditable';
import { 
  LexicalErrorBoundary 
} from '@lexical/react/LexicalErrorBoundary';
import { 
  HistoryPlugin 
} from '@lexical/react/LexicalHistoryPlugin';
import { 
  HeadingNode,
  QuoteNode
} from '@lexical/rich-text';
import { 
  ListNode,
  ListItemNode
} from '@lexical/list';
import { 
  CodeNode,
  CodeHighlightNode
} from '@lexical/code';

import { 
  useLexicalEditorRedux,
  createOptimizedEditorTheme
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.redux';
import { 
  OnChangePlugin,
  InitializerPlugin,
  KeyboardShortcutsPlugin,
  SelectionPlugin
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.hook';
import { EditorContainer, PlaceholderContainer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.styles';
import type { LexicalEditorReduxProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';

import { 
  ListPlugin as LexicalListPlugin 
} from '@lexical/react/LexicalListPlugin';

import { 
  ListPlugin as ListStatePlugin 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/plugins/ListPlugin';

/**
 * Performance-optimized editor plugins for Redux integration
 */
const ReduxOnChangePlugin: React.FC<{ onContentChange: (nodes: any[]) => void }> = ({ onContentChange }) => {
  const memoizedOnChange = useCallback(onContentChange, [onContentChange]);
  return <OnChangePlugin onChange={memoizedOnChange} />;
};

const ReduxInitializerPlugin: React.FC<{ initialNodes: any[] }> = ({ initialNodes }) => {
  const memoizedNodes = useMemo(() => initialNodes, [initialNodes]);
  return <InitializerPlugin initialNodes={memoizedNodes} />;
};

/**
 * Collaborative editing plugin (placeholder for future implementation)
 */
const CollaborationPlugin: React.FC<{ 
  isEnabled: boolean;
  collaborators: Record<string, any>;
  userId: string;
}> = ({ isEnabled, collaborators, userId }) => {
  // Placeholder for real-time collaboration features
  // Would integrate with WebSocket or similar real-time service
  
  if (!isEnabled) return null;
  
  // This would contain cursors, selections, and real-time updates
  return null;
};

/**
 * Performance monitoring plugin (development only)
 */
const PerformancePlugin: React.FC<{ 
  settings: any;
  onMetricsUpdate?: (metrics: any) => void;
}> = ({ settings, onMetricsUpdate }) => {
  // Placeholder for performance monitoring
  // Would track render times, update frequencies, etc.
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return null;
};

/**
 * Redux-Integrated Lexical Editor Component
 */
export const LexicalEditorRedux: React.FC<LexicalEditorReduxProps> = ({
  documentId,
  readOnly = false,
  placeholder = 'Begin typing your legal document...',
  enableCollaboration = false,
  performanceSettings
}) => {
  // Redux integration hook
  const {
    initialNodes,
    editorState,
    selectionState,
    onContentChange,
    onSelectionChange,
    undo,
    redo,
    canUndo,
    canRedo,
    collaboration,
    performance,
    config
  } = useLexicalEditorRedux({
    documentId,
    readOnly,
    enableCollaboration,
    performanceSettings
  });

  // Optimized editor theme with performance settings
  const editorTheme = useMemo(() => 
    createOptimizedEditorTheme(performance.settings.enableVirtualization),
  [performance.settings.enableVirtualization]
  );

  // Enhanced Lexical editor configuration with all features
  const initialConfig: InitialConfigType = useMemo(() => ({
    namespace: 'LegalDocumentEditor',
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode
    ],
    onError: (error) => {
      console.error('Lexical Error:', error);
      // Could dispatch error to Redux store here
    },
    editorState: null,
    theme: editorTheme,
    editable: !readOnly
  }), [readOnly, editorTheme]);

  // Handle keyboard shortcuts with Redux integration
  const handleUndo = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
      return true;
    }
    return false;
  }, [undo]);

  const handleRedo = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && (
      (event.key === 'y') || 
      (event.key === 'z' && event.shiftKey)
    )) {
      event.preventDefault();
      redo();
      return true;
    }
    return false;
  }, [redo]);

  // Error boundary fallback
  const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#fee', 
      border: '1px solid #fcc',
      borderRadius: '4px',
      color: '#c33'
    }}>
      <h3>Editor Error</h3>
      <p>Something went wrong with the document editor.</p>
      <details>
        <summary>Error Details</summary>
        <pre style={{ fontSize: '12px', marginTop: '8px' }}>
          {error.message}
        </pre>
      </details>
    </div>
  );

  return (
    <EditorContainer>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="editor-content" 
              style={{ 
                outline: 'none',
                minHeight: '200px',
                padding: '16px'
              }}
              data-testid="lexical-editor-content"
            />
          }
          placeholder={
            <PlaceholderContainer>
              {editorState.isLoading ? 'Loading document...' : placeholder}
            </PlaceholderContainer>
          }
          ErrorBoundary={({ error, children }) => 
            error ? <ErrorFallback error={error} /> : <>{children}</>
          }
        />
        
        {/* Core Lexical plugins */}
        <HistoryPlugin />
        
        {/* Redux-integrated plugins */}
        <ReduxOnChangePlugin onContentChange={onContentChange} />
        <ReduxInitializerPlugin initialNodes={initialNodes} />
        
        {/* List plugins */}
        <LexicalListPlugin />
        <ListStatePlugin />
        
        {/* Enhanced plugins with Redux */}
        <KeyboardShortcutsPlugin />
        <SelectionPlugin />
        
        {/* Collaboration features */}
        <CollaborationPlugin
          isEnabled={collaboration.isEnabled}
          collaborators={collaboration.collaborators}
          userId={collaboration.myUserId}
        />
        
        {/* Performance monitoring (development only) */}
        <PerformancePlugin
          settings={performance.settings}
          onMetricsUpdate={(metrics) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Editor Performance Metrics:', metrics);
            }
          }}
        />
      </LexicalComposer>
      
      {/* Development-only info panel */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '3px',
          zIndex: 1000
        }}>
          {editorState.isSaving && '💾 '}
          {editorState.hasUnsavedChanges && '● '}
          Redux: {canUndo ? '↶' : '⊘'}|{canRedo ? '↷' : '⊘'} | 
          Collab: {collaboration.isEnabled ? '👥' : '👤'} |
          Perf: {performance.metrics.throttledUpdates ? '🚀' : '⚡'}
        </div>
      )}
    </EditorContainer>
  );
};

export default LexicalEditorRedux; 