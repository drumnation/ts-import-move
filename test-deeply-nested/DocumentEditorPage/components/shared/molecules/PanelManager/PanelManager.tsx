/**
 * PanelManager Component
 * 
 * Manages the coordination and lifecycle of panels in the document editor
 * Orchestrates panel content, state, and interactions across the interface
 * 
 * Renamed from PanelConfiguration for better AI agent discoverability
 * - "Configuration" implies static setup
 * - "Manager" correctly conveys active orchestration and coordination
 * 
 * @module PanelManager
 */

import React from 'react';
import type { PanelManagerProps } from './PanelManager.types';
import { usePanelManager } from './PanelManager.hook';

/**
 * PanelManager Component
 * 
 * A coordination component that manages panel slots and their lifecycle.
 * Responsibilities:
 * - Panel slot creation and configuration
 * - Document update coordination across panels
 * - AI assistant integration and state management
 * - Panel content orchestration
 * 
 * This component provides a clean API boundary between the layout system
 * and the business logic of panel management.
 */
export const PanelManager: React.FC<PanelManagerProps> = ({
  onDocumentUpdate,
  selectedNodeId
}) => {
  const { panelSlots } = usePanelManager({
    onDocumentUpdate,
    selectedNodeId
  });

  // This component serves as a coordination layer
  // It doesn't render UI directly but provides organized panel slots
  // to the layout system
  return null;
};

// Export the hook for direct usage when component wrapper isn't needed
export { usePanelManager } from './PanelManager.hook'; 