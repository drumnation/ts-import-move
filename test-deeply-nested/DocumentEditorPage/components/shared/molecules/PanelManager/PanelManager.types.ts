/**
 * PanelManager Component Types
 * 
 * TypeScript interfaces for the panel management system
 * Renamed from PanelConfiguration for better AI agent discoverability
 * 
 * @module PanelManager.types
 */

import type { PanelSlot } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';

/**
 * Props for the PanelManager component
 * Main interface for panel coordination and management
 */
export interface PanelManagerProps {
  /** Callback when document is updated by AI assistant or other panels */
  onDocumentUpdate?: (doc: any) => void;
  /** Currently selected node ID for panel context */
  selectedNodeId?: string | null;
}

/**
 * Return interface for the usePanelManager hook
 * Provides organized panel slots for the layout system
 */
export interface UsePanelManagerReturn {
  /** Array of configured panel slots ready for layout */
  panelSlots: PanelSlot[];
}

/**
 * Parameters for the usePanelManager hook
 * Extends PanelManagerProps for consistency
 */
export interface PanelManagerHookParams extends PanelManagerProps {
  // Hook-specific parameters can be added here if needed
}

/**
 * Panel management state interface
 * For tracking panel lifecycle and interactions
 */
export interface PanelManagerState {
  /** Map of active panel instances */
  activePanels: Map<string, React.ComponentType>;
  /** Panel interaction handlers */
  handlers: {
    onDocumentUpdate: (doc: any) => void;
    onPanelMount: (panelId: string) => void;
    onPanelUnmount: (panelId: string) => void;
  };
  /** Current selection context */
  context: {
    selectedNodeId?: string | null;
    activeDocument?: any;
  };
}

/**
 * Panel slot creation configuration
 * Used internally by the panel management logic
 */
export interface PanelSlotCreationConfig {
  location: 'left' | 'right' | 'center';
  slot: 'top' | 'bottom';
  title: string;
  content: React.ReactElement;
  minSize: number;
  defaultSize: number;
  metadata?: Record<string, any>;
} 