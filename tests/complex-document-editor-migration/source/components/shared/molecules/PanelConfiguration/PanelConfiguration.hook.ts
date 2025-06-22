import React from 'react';
import type { PanelConfigurationHookParams, UsePanelConfigurationReturn } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/PanelConfiguration.types';
import { AiAssistant } from '@/pages/DocumentEditorPage/components/panels/components/AiAssistant';
import { InfoPanel } from '@/shared-components/molecules/InfoPanel';
import { PanelContentBox } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/components/PanelContentBox';
import { PANEL_SIZES, PANEL_DATA, createPanelSlotConfig } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/PanelConfiguration.logic';
import { EditorNodePalette } from '@/shared-components/molecules/EditorNodePalette';
import { PreviewDebugTabbedPanel } from '@/pages/DocumentEditorPage/components/panels/components/PreviewDebugTabbedPanel';
import type { Node } from '@/types/legal-document-ast';
import type { NodeCommandWithMetadata } from '@/shared-components/molecules/EditorNodePalette/EditorNodePalette.types';

export const usePanelConfiguration = ({
  onDocumentUpdate,
  selectedNodeId,
  onNodeUpdate,
  onInsertNode
}: PanelConfigurationHookParams): UsePanelConfigurationReturn => {
  
  const handleDocumentUpdate = React.useCallback((updatedDoc: any) => {
    console.log('Document updated by AI:', updatedDoc);
    onDocumentUpdate?.(updatedDoc);
  }, [onDocumentUpdate]);

  // Handle node property updates
  const handleNodeUpdate = React.useCallback((nodeId: string, updatedNode: Partial<Node>) => {
    console.log('Node updated:', nodeId, updatedNode);
    // Call the parent's onNodeUpdate handler if provided
    onNodeUpdate?.(nodeId, updatedNode);
    // Also trigger document update for full sync
    onDocumentUpdate?.(updatedNode);
  }, [onNodeUpdate, onDocumentUpdate]);

  // Handle node insertion from EditorNodePalette
  const handleNodeInsertion = React.useCallback((command: NodeCommandWithMetadata) => {
    console.log('🎨 Node palette command selected:', command);
    
    // Map command to node type for insertion
    const nodeType = command.name.toLowerCase();
    
    // Special handling for section insertion with auto-numbering
    if (command.name === 'Section' || command.id === 'section') {
      // Insert a section with Roman numeral numbering
      // This would be enhanced to determine the next section number
      const sectionData = {
        type: 'section',
        title: 'PARTIES & BACKGROUND', // Default title, user can edit via InfoPanel
        number: 'I', // TODO: Calculate next roman numeral
        content: []
      };
      console.log('🏛️ Inserting section:', sectionData);
      onInsertNode?.(sectionData);
      return;
    }
    
    // Handle other node types
    switch (nodeType) {
    case 'paragraph':
      onInsertNode?.({ type: 'paragraph', text: 'New paragraph...' });
      break;
    case 'heading':
      onInsertNode?.({ type: 'heading', level: 1, text: 'New Heading' });
      break;
    case 'list':
      onInsertNode?.({ 
        type: 'list', 
        style: 'decimal',
        items: [
          { text: '1. First list item...' },
          { text: '2. Second list item...' }
        ]
      });
      break;
    case 'recital':
      onInsertNode?.({ 
        type: 'recital', 
        text: 'WHEREAS, new recital clause establishing the relevant facts and circumstances...',
        style: 'italic small-caps',
        metadata: {
          isWhereasClause: true,
          formattingRules: ['italic', 'small-caps', 'indent']
        }
      });
      break;
    case 'exhibit':
    case 'exhibitlabel':
      onInsertNode?.({
        type: 'exhibit',
        nodeType: 'exhibit',
        id: `exhibit-${Date.now()}`,
        exhibitId: 'A',
        text: 'Exhibit A - Document Title',
        documentPoolId: undefined // Will be linked to document pool later
      });
      break;
    default:
      console.warn(`⚠️ Unknown node type for insertion: ${nodeType}`);
      onInsertNode?.({ type: 'paragraph', text: `New ${command.name}...` });
    }
  }, [onInsertNode]);

  // Create actual selected node from document state
  // TODO: Replace this with actual node lookup from document state
  const selectedNode = React.useMemo((): Node | null => {
    if (!selectedNodeId) return null;
    
    // Mock different node types for demonstration - this should come from document state
    // In a real implementation, this would look up the node by ID from the document AST
    
    // Create different mock nodes based on the ID for testing
    if (selectedNodeId.includes('list')) {
      return {
        id: selectedNodeId,
        type: 'list',
        style: 'decimal',
        items: [
          { text: '1. First list item...' },
          { text: '2. Second list item...' }
        ]
      } as Node;
    }
    
    if (selectedNodeId.includes('recital')) {
      return {
        id: selectedNodeId,
        type: 'recital',
        text: 'WHEREAS, the parties have entered into negotiations concerning the matter at hand...',
        style: 'italic small-caps',
        metadata: {
          isWhereasClause: true,
          formattingRules: ['italic', 'small-caps', 'indent']
        }
      } as Node;
    }
    
    if (selectedNodeId.includes('exhibit')) {
      return {
        id: selectedNodeId,
        type: 'exhibit',
        nodeType: 'exhibit',
        exhibitId: 'A',
        text: 'Exhibit A - Contract Agreement',
        documentPoolId: 'pool-1' // Links to mock pool item
      } as Node;
    }
    
    return {
      id: selectedNodeId,
      type: 'paragraph',
      text: `This is a live-editable paragraph node with ID: ${selectedNodeId}. You can edit this text and see the changes in real-time.`
    } as Node;
  }, [selectedNodeId]);

  const panelSlots = React.useMemo(() => [
    // Left column panels
    createPanelSlotConfig(
      'left',
      'top',
      PANEL_DATA.DOCUMENT_OUTLINE.title,
      React.createElement(PanelContentBox, {
        title: 'Sections',
        description: PANEL_DATA.DOCUMENT_OUTLINE.description,
        items: PANEL_DATA.DOCUMENT_OUTLINE.items
      }),
      PANEL_SIZES.LEFT_TOP_MIN,
      PANEL_SIZES.LEFT_TOP_DEFAULT
    ),
    createPanelSlotConfig(
      'left',
      'bottom',
      'Insert Nodes',
      React.createElement(EditorNodePalette, {
        isOpen: true,
        embedded: true,
        showCategories: true,
        maxHeight: 500,
        onCommandSelect: handleNodeInsertion
      }),
      PANEL_SIZES.LEFT_BOTTOM_MIN,
      PANEL_SIZES.LEFT_BOTTOM_DEFAULT
    ),

    // Right column panels - Task 3B: Tabbed Preview & Debug Panel
    createPanelSlotConfig(
      'right',
      'top',
      'Preview & Debug',
      React.createElement(PreviewDebugTabbedPanel, {
        key: 'preview-debug-tabs',
        astData: [], // TODO: Wire up actual AST data from editor
        title: 'Document Preview',
        expanded: true,
        isLoading: false,
        height: 300,
        maxHeight: 200,
        activeTab: 'preview', // Default to preview tab
        hasContext: true,
        viewMode: 'json',
        onDownloadPdf: () => console.log('📄 Download PDF - M6.3 implementation'),
        onViewModeChange: (mode) => console.log('AST Debug view mode changed:', mode),
        onRefresh: () => console.log('🔄 AST debug panel refresh'),
        onTabChange: (tabId) => console.log('📑 Tab changed to:', tabId)
      }),
      PANEL_SIZES.RIGHT_TOP_MIN,
      PANEL_SIZES.RIGHT_TOP_DEFAULT
    ),
    createPanelSlotConfig(
      'right',
      'bottom',
      'AI Assistant & Properties',
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }
      }, [
        // AI Assistant
        React.createElement(AiAssistant, {
          key: 'ai-assistant',
          document: null,
          onDocumentUpdate: handleDocumentUpdate,
          selectedNodeId: selectedNodeId,
          expanded: false // Start collapsed to save space
        }),
        // Node Properties
        React.createElement(InfoPanel, {
          key: 'info-panel',
          selectedNode: selectedNode,
          onNodeUpdate: handleNodeUpdate,
          readOnly: false
        })
      ]),
      PANEL_SIZES.RIGHT_BOTTOM_MIN,
      PANEL_SIZES.RIGHT_BOTTOM_DEFAULT
    )
  ], [handleDocumentUpdate, selectedNodeId, handleNodeUpdate, selectedNode, handleNodeInsertion]);

  return { panelSlots };
}; 