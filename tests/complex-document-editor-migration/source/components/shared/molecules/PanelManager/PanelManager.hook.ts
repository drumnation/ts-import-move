/**
 * PanelManager Component Hook
 * 
 * Custom hook for managing panel coordination and lifecycle
 * Handles panel slot creation, document updates, and AI assistant integration
 * 
 * Renamed from usePanelConfiguration for better AI agent discoverability
 * 
 * @module PanelManager.hook
 */

import React from 'react';
import type { 
  PanelManagerHookParams, 
  UsePanelManagerReturn 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.types';
import { AiAssistant } from '@/pages/DocumentEditorPage/components/panels/components/AiAssistant';
import { PanelContentBox } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/components/PanelContentBox';
import { DocumentInfoPanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/components/DocumentInfoPanel';
import { 
  PANEL_SIZES, 
  PANEL_DATA, 
  createPanelSlotConfig,
  generatePanelId,
  PanelLifecycleManager,
  getRecommendedPanelSizes
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.logic';

/**
 * Custom hook for panel management and coordination
 * 
 * Manages the complete lifecycle of panels in the document editor:
 * - Panel slot creation and configuration
 * - Document update coordination across panels
 * - AI assistant integration and state management
 * - Panel content orchestration and event handling
 * 
 * This hook serves as the central coordination point for all panel-related
 * functionality and provides a clean interface for the layout system.
 */
export const usePanelManager = ({
  onDocumentUpdate,
  selectedNodeId
}: PanelManagerHookParams): UsePanelManagerReturn => {
  
  /**
   * Document update handler with coordinated event management
   * Ensures document updates are properly propagated across all panels
   */
  const handleDocumentUpdate = React.useCallback((updatedDoc: any) => {
    console.log('Document updated by AI assistant:', updatedDoc);
    
    // Notify panel lifecycle manager
    PanelLifecycleManager.onPanelResize('ai-assistant', 0);
    
    // Propagate to parent component
    onDocumentUpdate?.(updatedDoc);
  }, [onDocumentUpdate]);

  /**
   * Panel slot configuration with enhanced management
   * Creates organized panel slots for the document editor layout
   */
  const panelSlots = React.useMemo(() => {
    // Get content-aware sizing for different panel types
    const navigationSizes = getRecommendedPanelSizes('left', 'top', 'navigation');
    const resourcesSizes = getRecommendedPanelSizes('left', 'bottom', 'resources');
    const aiSizes = getRecommendedPanelSizes('right', 'top', 'ai');
    const metadataSizes = getRecommendedPanelSizes('right', 'bottom', 'metadata');

    const slots = [
      // Left column panels - Navigation and Resources
      createPanelSlotConfig(
        'left',
        'top',
        PANEL_DATA.DOCUMENT_OUTLINE.title,
        React.createElement(PanelContentBox, {
          title: 'Sections',
          description: PANEL_DATA.DOCUMENT_OUTLINE.description,
          items: PANEL_DATA.DOCUMENT_OUTLINE.items
        }),
        navigationSizes.minSize,
        navigationSizes.defaultSize
      ),
      createPanelSlotConfig(
        'left',
        'bottom',
        PANEL_DATA.ASSETS_RESOURCES.title,
        React.createElement(PanelContentBox, {
          title: 'Resources',
          description: PANEL_DATA.ASSETS_RESOURCES.description,
          items: PANEL_DATA.ASSETS_RESOURCES.items
        }),
        resourcesSizes.minSize,
        resourcesSizes.defaultSize
      ),

      // Right column panels - AI and Metadata with content-aware constraints
      createPanelSlotConfig(
        'right',
        'top',
        PANEL_DATA.AI_ASSISTANT.title,
        React.createElement(AiAssistant, {
          document: null,
          onDocumentUpdate: handleDocumentUpdate,
          selectedNodeId: selectedNodeId,
          expanded: true
        }),
        aiSizes.minSize,
        aiSizes.defaultSize,
        aiSizes.maxSize // Content-aware max width: 420px
      ),
      createPanelSlotConfig(
        'right',
        'bottom',
        PANEL_DATA.PROPERTIES_METADATA.title,
        React.createElement(DocumentInfoPanel),
        metadataSizes.minSize,
        metadataSizes.defaultSize,
        metadataSizes.maxSize // Content-aware max width: 380px
      )
    ];

    // Notify lifecycle manager of panel creation
    slots.forEach(slot => {
      const panelId = generatePanelId(slot.location, slot.slot, slot.title);
      PanelLifecycleManager.onPanelMount(panelId, slot);
    });

    return slots;
  }, [handleDocumentUpdate, selectedNodeId]);

  /**
   * Cleanup effect for panel lifecycle management
   * Ensures proper cleanup when component unmounts or dependencies change
   */
  React.useEffect(() => {
    return () => {
      // Cleanup panels on unmount
      panelSlots.forEach(slot => {
        const panelId = generatePanelId(slot.location, slot.slot, slot.title);
        PanelLifecycleManager.onPanelUnmount(panelId);
      });
    };
  }, [panelSlots]);

  return { 
    panelSlots 
  };
}; 