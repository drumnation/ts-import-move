/**
 * Lexical Rich Text Editor for Legal Documents
 * 
 * Headless editor integration with AST-based document model
 * Supports paragraph, heading, and list node types with type safety
 * 
 * @module LexicalEditor
 */

import React, { useMemo } from 'react';
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
  ListPlugin as LexicalListPlugin 
} from '@lexical/react/LexicalListPlugin';
import { 
  HeadingNode
} from '@lexical/rich-text';
import { 
  ListNode,
  ListItemNode
} from '@lexical/list';

import { LexicalEditorProps } from './LexicalEditor.types';
import { EditorContainer, PlaceholderContainer } from './LexicalEditor.styles';
import { convertDocumentToLexicalNodes } from './LexicalEditor.logic';
import { 
  OnChangePlugin,
  InitializerPlugin,
  KeyboardShortcutsPlugin,
  SelectionPlugin,
  BulkContentPlugin,
  useContentChangeHandler
} from './LexicalEditor.hook';

// Local enhanced list plugin for list state tracking and indentation controls
import { 
  ListPlugin as ListStatePlugin 
} from './plugins/ListPlugin';

/**
 * Main Lexical Editor Component
 */
export const LexicalEditor: React.FC<LexicalEditorProps> = ({
  document,
  onContentChange,
  onNodeSelect,
  readOnly = false,
  placeholder = 'Begin typing your legal document...',
  renderToolbar
}) => {
  // Convert initial document to Lexical nodes
  const initialNodes = useMemo(() => {
    return convertDocumentToLexicalNodes(document);
  }, [document]);

  // Handle content changes
  const handleContentChange = useContentChangeHandler(onContentChange);

  // Lexical editor configuration
  const initialConfig: InitialConfigType = useMemo(() => ({
    namespace: 'LegalDocumentEditor',
    nodes: [HeadingNode, ListNode, ListItemNode],
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
    editorState: null,
    theme: {
      paragraph: 'editor-paragraph',
      heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
      },
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
      },
      list: {
        nested: {
          list: 'editor-list-nested',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-list-item',
      }
    },
    editable: !readOnly
  }), [readOnly]);

  return (
    <EditorContainer>
      <LexicalComposer initialConfig={initialConfig}>
        {/* Render toolbar inside Lexical context if provided */}
        {renderToolbar && renderToolbar()}
        
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="editor-content" 
              style={{ outline: 'none' }}
            />
          }
          placeholder={
            <PlaceholderContainer>
              {placeholder}
            </PlaceholderContainer>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {/* Default Lexical list behavior */}
        <LexicalListPlugin />
        {/* Custom plugin for list state tracking and enhanced commands */}
        <ListStatePlugin />
        <KeyboardShortcutsPlugin />
        <SelectionPlugin onNodeSelect={onNodeSelect} />
        <BulkContentPlugin />
        <OnChangePlugin onChange={handleContentChange} />
        <InitializerPlugin initialNodes={initialNodes} />
      </LexicalComposer>
    </EditorContainer>
  );
};

export default LexicalEditor; 