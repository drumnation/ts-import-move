/**
 * LexicalEditor Component Exports
 * @module LexicalEditor
 */

// Main component exports
export { LexicalEditor } from './LexicalEditor';
export { LexicalEditorRedux } from './LexicalEditorRedux';

// Type exports
export type { 
  LexicalEditorProps,
  LexicalEditorReduxProps,
  LexicalASTNode,
  LexicalParagraphNode,
  LexicalHeadingNode,
  OnChangePluginProps,
  InitializerPluginProps
} from './LexicalEditor.types';

// Redux integration exports
export {
  useLexicalEditorRedux,
  convertLexicalNodeToDocumentBlock,
  convertDocumentBlockToLexicalNode,
  createOptimizedEditorTheme,
  isReduxIntegrationAvailable
} from './LexicalEditor.redux';

// Plugin exports
export {
  OnChangePlugin,
  InitializerPlugin,
  KeyboardShortcutsPlugin,
  SelectionPlugin,
  useContentChangeHandler
} from './LexicalEditor.hook'; 