/**
 * LexicalEditor Component Exports
 * @module LexicalEditor
 */

// Main component exports
export { LexicalEditor } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor';
export { LexicalEditorRedux } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditorRedux';

// Type exports
export type { 
  LexicalEditorProps,
  LexicalEditorReduxProps,
  LexicalASTNode,
  LexicalParagraphNode,
  LexicalHeadingNode,
  OnChangePluginProps,
  InitializerPluginProps
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';

// Redux integration exports
export {
  useLexicalEditorRedux,
  convertLexicalNodeToDocumentBlock,
  convertDocumentBlockToLexicalNode,
  createOptimizedEditorTheme,
  isReduxIntegrationAvailable
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.redux';

// Plugin exports
export {
  OnChangePlugin,
  InitializerPlugin,
  KeyboardShortcutsPlugin,
  SelectionPlugin,
  useContentChangeHandler
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.hook'; 