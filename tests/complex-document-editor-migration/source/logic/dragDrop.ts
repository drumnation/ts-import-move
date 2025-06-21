/**
 * Drag and Drop Logic for Document Editor
 * 
 * Handles node reordering operations within AST structure
 * Provides pure functions for array manipulation and state management
 * 
 * @module dragDrop
 */

import type { Node as ASTNode, LegalDocument, Section } from '@/types/legal-document-ast';
import type { DraggableNodeData, DragResult } from '@/shared-components/providers/DragDropProvider/DragDropProvider.types';

/**
 * Reorder nodes within an array by moving an item from source to target index
 */
export const reorderNodes = <T>(
  nodes: T[],
  sourceIndex: number,
  targetIndex: number
): T[] => {
  if (sourceIndex === targetIndex) {
    return nodes; // No change needed
  }

  if (sourceIndex < 0 || sourceIndex >= nodes.length) {
    console.warn('🎯 Invalid source index:', sourceIndex);
    return nodes;
  }

  if (targetIndex < 0 || targetIndex > nodes.length) {
    console.warn('🎯 Invalid target index:', targetIndex);
    return nodes;
  }

  const result = [...nodes];
  const [movedItem] = result.splice(sourceIndex, 1);
  
  // Adjust target index if moving item down
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  
  result.splice(adjustedTargetIndex, 0, movedItem);
  
  console.log('🎯 Nodes reordered:', {
    sourceIndex,
    targetIndex: adjustedTargetIndex,
    nodeType: (movedItem as any)?.type || 'unknown',
    totalNodes: result.length
  });

  return result;
};

/**
 * Get all nodes from all sections flattened with their section and index info
 */
export const getAllNodesWithContext = (document: LegalDocument): Array<{
  node: ASTNode;
  sectionIndex: number;
  nodeIndex: number;
  nodeId: string; // Generated ID for drag operations
}> => {
  const allNodes: Array<{
    node: ASTNode;
    sectionIndex: number;
    nodeIndex: number;
    nodeId: string;
  }> = [];

  document.content.sections.forEach((section, sectionIndex) => {
    section.content.forEach((node, nodeIndex) => {
      allNodes.push({
        node,
        sectionIndex,
        nodeIndex,
        nodeId: `${sectionIndex}-${nodeIndex}` // Create unique ID
      });
    });
  });

  return allNodes;
};

/**
 * Update document structure with reordered nodes in a specific section
 */
export const updateDocumentWithReorderedSection = (
  document: LegalDocument,
  sectionIndex: number,
  reorderedNodes: ASTNode[]
): LegalDocument => {
  const updatedSections = document.content.sections.map((section, index) => {
    if (index === sectionIndex) {
      return {
        ...section,
        content: reorderedNodes
      };
    }
    return section;
  });

  return {
    ...document,
    content: {
      ...document.content,
      sections: updatedSections
    },
    metadata: {
      ...document.metadata,
      updatedAt: new Date().toISOString(),
      version: document.metadata.version || '1.0'
    }
  };
};

/**
 * Find node by generated ID within document
 */
export const findNodeByGeneratedId = (
  document: LegalDocument,
  nodeId: string
): { sectionIndex: number; nodeIndex: number; node: ASTNode } | null => {
  const [sectionStr, nodeStr] = nodeId.split('-');
  const sectionIndex = parseInt(sectionStr, 10);
  const nodeIndex = parseInt(nodeStr, 10);

  if (
    isNaN(sectionIndex) || 
    isNaN(nodeIndex) ||
    !document.content.sections[sectionIndex] ||
    !document.content.sections[sectionIndex].content[nodeIndex]
  ) {
    return null;
  }

  return {
    sectionIndex,
    nodeIndex,
    node: document.content.sections[sectionIndex].content[nodeIndex]
  };
};

/**
 * Validate drag operation before execution
 */
export const validateDragOperation = (
  sourceItem: DraggableNodeData,
  targetIndex: number,
  document: LegalDocument,
  targetSectionIndex: number = 0
): { isValid: boolean; reason?: string } => {
  const sourceNode = findNodeByGeneratedId(document, sourceItem.id);
  
  if (!sourceNode) {
    return { isValid: false, reason: 'Source node not found' };
  }

  const targetSection = document.content.sections[targetSectionIndex];
  if (!targetSection) {
    return { isValid: false, reason: 'Target section not found' };
  }

  // Check target index bounds
  if (targetIndex < 0 || targetIndex > targetSection.content.length) {
    return { isValid: false, reason: 'Invalid target position' };
  }

  // If dragging within same section, check if it's a no-op
  if (sourceNode.sectionIndex === targetSectionIndex) {
    if (sourceNode.nodeIndex === targetIndex || sourceNode.nodeIndex === targetIndex - 1) {
      return { isValid: false, reason: 'No change needed' };
    }
  }

  return { isValid: true };
};

/**
 * Execute drag and drop operation on document
 */
export const executeDragDropOperation = (
  document: LegalDocument,
  dragResult: DragResult,
  targetSectionIndex: number = 0
): { 
  updatedDocument: LegalDocument; 
  success: boolean; 
  error?: string 
} => {
  try {
    const validation = validateDragOperation(
      dragResult.item,
      dragResult.targetIndex,
      document,
      targetSectionIndex
    );

    if (!validation.isValid) {
      return {
        updatedDocument: document,
        success: false,
        error: validation.reason
      };
    }

    const sourceNode = findNodeByGeneratedId(document, dragResult.item.id);
    if (!sourceNode) {
      return {
        updatedDocument: document,
        success: false,
        error: 'Source node not found'
      };
    }

    // For now, only handle reordering within the same section
    if (sourceNode.sectionIndex !== targetSectionIndex) {
      return {
        updatedDocument: document,
        success: false,
        error: 'Cross-section dragging not yet supported'
      };
    }

    const section = document.content.sections[targetSectionIndex];
    const reorderedNodes = reorderNodes(
      section.content, 
      sourceNode.nodeIndex, 
      dragResult.targetIndex
    );
    
    const updatedDocument = updateDocumentWithReorderedSection(
      document,
      targetSectionIndex,
      reorderedNodes
    );

    return {
      updatedDocument,
      success: true
    };
  } catch (error) {
    console.error('🎯 Drag drop operation failed:', error);
    return {
      updatedDocument: document,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Create drag result from drag data
 */
export const createDragResult = (
  item: DraggableNodeData,
  targetIndex: number,
  zoneId: string
): DragResult => {
  return {
    sourceIndex: item.index,
    targetIndex,
    item,
    dropZone: {
      targetIndex,
      zoneId,
      accepts: ['node', 'block', 'element']
    }
  };
};

/**
 * Generate visual feedback data for drag operations
 */
export const getDragFeedback = (
  sourceItem: DraggableNodeData,
  targetIndex: number,
  document: LegalDocument,
  targetSectionIndex: number = 0
) => {
  const validation = validateDragOperation(sourceItem, targetIndex, document, targetSectionIndex);
  const section = document.content.sections[targetSectionIndex];
  const totalNodes = section?.content.length || 0;
  
  return {
    isValid: validation.isValid,
    message: validation.reason || `Move "${sourceItem.type}" to position ${targetIndex + 1} of ${totalNodes}`,
    previewText: `${sourceItem.type}: ${sourceItem.content?.substring(0, 30)}${sourceItem.content && sourceItem.content.length > 30 ? '...' : ''}`,
    sourcePosition: sourceItem.index + 1,
    targetPosition: targetIndex + 1,
    totalNodes
  };
}; 