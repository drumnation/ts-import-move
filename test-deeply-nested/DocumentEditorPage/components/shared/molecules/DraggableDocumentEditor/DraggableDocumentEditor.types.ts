/**
 * DraggableDocumentEditor Types
 * @module DraggableDocumentEditor.types
 */

import type { LegalDocument, Node as ASTNode } from '@/types/legal-document-ast';
import type { DraggableNodeData } from '@/shared-components/providers/DragDropProvider/DragDropProvider.types';

/**
 * Props for DraggableDocumentEditor component
 */
export interface DraggableDocumentEditorProps {
  /** Document to render and edit */
  document: LegalDocument | null;
  /** Callback when document structure changes via drag-and-drop */
  onDocumentChange?: (document: LegalDocument) => void;
  /** Callback when a node is selected */
  onNodeSelect?: (nodeId: string | null) => void;
  /** Currently selected node ID */
  selectedNodeId?: string | null;
  /** Whether drag-and-drop is enabled */
  enableDragDrop?: boolean;
  /** Section index to render (defaults to first section) */
  sectionIndex?: number;
  /** Whether to show visual feedback during drag operations */
  showDragFeedback?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Props for individual draggable node renderers
 */
export interface DraggableNodeRendererProps {
  /** The AST node to render */
  node: ASTNode;
  /** Node index within the section */
  index: number;
  /** Generated node ID for drag operations */
  nodeId: string;
  /** Whether this node is currently selected */
  isSelected?: boolean;
  /** Whether drag-and-drop is enabled */
  isDraggable?: boolean;
  /** Callback when node is clicked/selected */
  onSelect?: (nodeId: string) => void;
  /** Callback when drag starts */
  onDragStart?: (item: DraggableNodeData) => void;
  /** Callback when drag ends */
  onDragEnd?: (item: DraggableNodeData, didDrop: boolean) => void;
}

/**
 * Node type to renderer mapping
 */
export interface NodeRendererMap {
  paragraph: React.ComponentType<DraggableNodeRendererProps>;
  list: React.ComponentType<DraggableNodeRendererProps>;
  recital: React.ComponentType<DraggableNodeRendererProps>;
  table: React.ComponentType<DraggableNodeRendererProps>;
  exhibit: React.ComponentType<DraggableNodeRendererProps>;
} 