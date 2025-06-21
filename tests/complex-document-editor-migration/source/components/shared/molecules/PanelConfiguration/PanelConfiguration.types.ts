import type { PanelSlot } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';

export interface PanelConfigurationProps {
  /** Callback when document is updated by AI */
  onDocumentUpdate?: (doc: any) => void;
  /** Currently selected node ID */
  selectedNodeId?: string | null;
  /** Callback when a node is updated from InfoPanel */
  onNodeUpdate?: (nodeId: string, updates: any) => void;
  /** Callback when a new node is inserted from EditorNodePalette */
  onInsertNode?: (nodeData: any) => void;
}

export interface PanelConfigurationHookParams {
  /** Callback when document is updated by AI */
  onDocumentUpdate?: (doc: any) => void;
  /** Currently selected node ID */
  selectedNodeId?: string | null;
  /** Callback when a node is updated from InfoPanel */
  onNodeUpdate?: (nodeId: string, updates: any) => void;
  /** Callback when a new node is inserted from EditorNodePalette */
  onInsertNode?: (nodeData: any) => void;
}

export interface UsePanelConfigurationReturn {
  /** Panel slot configurations */
  panelSlots: PanelSlot[];
} 