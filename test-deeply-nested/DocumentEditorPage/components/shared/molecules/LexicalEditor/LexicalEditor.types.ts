import { Node as ASTNode, LegalDocument } from '@/types/legal-document-ast';
import { DocumentBlock } from '@/stores/document.types';

/**
 * Lexical Editor Node Types
 */
export interface LexicalParagraphNode {
  type: 'paragraph';
  text: string;
}

export interface LexicalHeadingNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface LexicalListNode {
  type: 'list';
  listType: 'bullet' | 'number';
  items: LexicalListItemNode[];
}

export interface LexicalListItemNode {
  type: 'list-item';
  text: string;
  children?: LexicalListItemNode[];
}

export type LexicalASTNode = LexicalParagraphNode | LexicalHeadingNode | LexicalListNode | LexicalListItemNode;

/**
 * Props for the Lexical Editor component
 */
export interface LexicalEditorProps {
  /** Initial document content */
  document?: LegalDocument | null;
  /** Callback when document content changes */
  onContentChange?: (nodes: LexicalASTNode[]) => void;
  /** Callback when a node is selected in the editor */
  onNodeSelect?: (nodeId: string | null) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Enable Redux integration */
  useRedux?: boolean;
  /** Document ID for Redux integration */
  documentId?: string;
  /** Optional toolbar renderer function */
  renderToolbar?: () => React.ReactNode;
}

/**
 * Redux-integrated Lexical Editor Props
 */
export interface LexicalEditorReduxProps {
  /** Document ID to edit */
  documentId: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Enable collaborative editing features */
  enableCollaboration?: boolean;
  /** Performance optimization settings */
  performanceSettings?: {
    throttleMs?: number;
    batchUpdates?: boolean;
    enableVirtualization?: boolean;
  };
}

/**
 * Plugin Props Interfaces
 */
export interface OnChangePluginProps {
  onChange: (nodes: LexicalASTNode[]) => void;
}

export interface InitializerPluginProps {
  initialNodes: LexicalASTNode[];
} 