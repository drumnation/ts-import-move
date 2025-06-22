/**
 * DraggableDocumentEditor Component
 * 
 * Renders legal document as draggable nodes with drop zones
 * Enables spatial reordering of document structure
 * 
 * @module DraggableDocumentEditor
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Stack } from '@mantine/core';
import { EditorDraggableNode } from '@/shared-components/molecules/EditorDraggableNode';
import { EditorDropZone } from '@/shared-components/molecules/EditorDropZone';
import { LegoBrick } from '@/shared-components/atoms/LegoBrick';
import { useNodeSelectionContext } from '@/shared-components/organisms/NodeSelectionProvider';
import type { 
  DraggableDocumentEditorProps,
  DraggableNodeRendererProps,
  NodeRendererMap 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DraggableDocumentEditor/DraggableDocumentEditor.types';
import type { Node as ASTNode } from '@/types/legal-document-ast';
import { 
  executeDragDropOperation,
  createDragResult,
  getAllNodesWithContext 
} from '@/tests/complex-document-editor-migration/source/components/logic/dragDrop';
import {
  EditorContainer,
  SectionHeader,
  NodeContainer,
  ParagraphNode,
  ListNode,
  RecitalNode,
  TableNode,
  ExhibitNode,
  EmptyState,
  DragFeedback
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DraggableDocumentEditor/DraggableDocumentEditor.styles';

/**
 * Individual Node Renderers
 */

// Paragraph Node Renderer
const ParagraphRenderer: React.FC<DraggableNodeRendererProps> = ({
  node,
  index,
  nodeId,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  if (node.type !== 'paragraph') return null;
  
  const handleClick = useCallback(() => {
    onSelect?.(nodeId);
  }, [nodeId, onSelect]);

  return (
    <EditorDraggableNode
      nodeId={nodeId}
      nodeType="paragraph"
      index={index}
      content={node.text}
      isDraggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <NodeContainer isSelected={!!isSelected} onClick={handleClick}>
        <ParagraphNode>{node.text}</ParagraphNode>
      </NodeContainer>
    </EditorDraggableNode>
  );
};

// List Node Renderer
const ListRenderer: React.FC<DraggableNodeRendererProps> = ({
  node,
  index,
  nodeId,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  if (node.type !== 'list') return null;
  
  const handleClick = useCallback(() => {
    onSelect?.(nodeId);
  }, [nodeId, onSelect]);

  return (
    <EditorDraggableNode
      nodeId={nodeId}
      nodeType="list"
      index={index}
      content={`List with ${node.items.length} items`}
      isDraggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <NodeContainer isSelected={!!isSelected} onClick={handleClick}>
        <ListNode listStyle={node.style}>
          <ol style={{ listStyleType: node.style === 'decimal' ? 'decimal' : 'disc' }}>
            {node.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item.text}</li>
            ))}
          </ol>
        </ListNode>
      </NodeContainer>
    </EditorDraggableNode>
  );
};

// Recital Node Renderer
const RecitalRenderer: React.FC<DraggableNodeRendererProps> = ({
  node,
  index,
  nodeId,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  if (node.type !== 'recital') return null;
  
  const handleClick = useCallback(() => {
    onSelect?.(nodeId);
  }, [nodeId, onSelect]);

  return (
    <EditorDraggableNode
      nodeId={nodeId}
      nodeType="recital"
      index={index}
      content={node.text}
      isDraggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <NodeContainer isSelected={!!isSelected} onClick={handleClick}>
        <RecitalNode>{node.text}</RecitalNode>
      </NodeContainer>
    </EditorDraggableNode>
  );
};

// Table Node Renderer
const TableRenderer: React.FC<DraggableNodeRendererProps> = ({
  node,
  index,
  nodeId,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  if (node.type !== 'table') return null;
  
  const handleClick = useCallback(() => {
    onSelect?.(nodeId);
  }, [nodeId, onSelect]);

  return (
    <EditorDraggableNode
      nodeId={nodeId}
      nodeType="table"
      index={index}
      content={`Table: ${node.headers.join(' | ')}`}
      isDraggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <NodeContainer isSelected={!!isSelected} onClick={handleClick}>
        <TableNode>
          <thead>
            <tr>
              <th>{node.headers[0]}</th>
              <th>{node.headers[1]}</th>
            </tr>
          </thead>
          <tbody>
            {node.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </TableNode>
      </NodeContainer>
    </EditorDraggableNode>
  );
};

// Exhibit Node Renderer
const ExhibitRenderer: React.FC<DraggableNodeRendererProps> = ({
  node,
  index,
  nodeId,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  if (node.type !== 'exhibit') return null;
  
  const handleClick = useCallback(() => {
    onSelect?.(nodeId);
  }, [nodeId, onSelect]);

  return (
    <EditorDraggableNode
      nodeId={nodeId}
      nodeType="exhibit"
      index={index}
      content={node.text}
      isDraggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <NodeContainer isSelected={!!isSelected} onClick={handleClick}>
        <ExhibitNode>{node.text}</ExhibitNode>
      </NodeContainer>
    </EditorDraggableNode>
  );
};

// Node renderer mapping
const nodeRenderers: NodeRendererMap = {
  paragraph: ParagraphRenderer,
  list: ListRenderer,
  recital: RecitalRenderer,
  table: TableRenderer,
  exhibit: ExhibitRenderer
};

/**
 * Main DraggableDocumentEditor Component
 */
export const DraggableDocumentEditor: React.FC<DraggableDocumentEditorProps> = ({
  document,
  onDocumentChange,
  onNodeSelect,
  selectedNodeId,
  enableDragDrop = true,
  sectionIndex = 0,
  showDragFeedback = true,
  readOnly = false,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragFeedback, setDragFeedback] = useState<{ isValid: boolean; message: string } | null>(null);

  // Get current section and nodes
  const currentSection = document?.content.sections[sectionIndex];
  const nodes = currentSection?.content || [];

  // Handle drag start
  const handleDragStart = useCallback((item: any) => {
    setIsDragging(true);
    console.log('🎯 Drag started:', item);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((item: any, didDrop: boolean) => {
    setIsDragging(false);
    setDragFeedback(null);
    console.log('🎯 Drag ended:', { item, didDrop });
  }, []);

  // Handle drop
  const handleDrop = useCallback((item: any, targetIndex: number) => {
    if (!document || readOnly) return;

    const dragResult = createDragResult(item, targetIndex, `section-${sectionIndex}`);
    const result = executeDragDropOperation(document, dragResult, sectionIndex);

    if (result.success) {
      console.log('🎯 Drop successful:', result);
      onDocumentChange?.(result.updatedDocument);
    } else {
      console.warn('🎯 Drop failed:', result.error);
      setDragFeedback({ isValid: false, message: result.error || 'Drop failed' });
      setTimeout(() => setDragFeedback(null), 3000);
    }
  }, [document, onDocumentChange, readOnly, sectionIndex]);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    onNodeSelect?.(nodeId);
  }, [onNodeSelect]);

  // Generate node IDs
  const nodeIds = useMemo(() => {
    return nodes.map((_, index) => `${sectionIndex}-${index}`);
  }, [nodes, sectionIndex]);

  if (!document) {
    return (
      <EditorContainer className={className}>
        <EmptyState>
          <h3>No Document Loaded</h3>
          <p>Please load a document to start editing.</p>
        </EmptyState>
      </EditorContainer>
    );
  }

  if (!currentSection) {
    return (
      <EditorContainer className={className}>
        <EmptyState>
          <h3>Section Not Found</h3>
          <p>The requested section does not exist in this document.</p>
        </EmptyState>
      </EditorContainer>
    );
  }

  if (nodes.length === 0) {
    return (
      <EditorContainer className={className}>
        <SectionHeader>
          {currentSection.id}. {currentSection.heading}
        </SectionHeader>
        <EmptyState>
          <h3>Empty Section</h3>
          <p>This section contains no content. Add nodes using the node palette.</p>
        </EmptyState>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer className={className}>
      {/* Section Header */}
      <SectionHeader>
        {currentSection.id}. {currentSection.heading}
      </SectionHeader>

      {/* Draggable Nodes with Drop Zones */}
      <Stack gap="xs">
        {/* Drop zone at the beginning */}
        {enableDragDrop && (
          <EditorDropZone
            targetIndex={0}
            zoneId={`${sectionIndex}-start`}
            isActive={isDragging}
            onDrop={handleDrop}
            showFeedback={showDragFeedback}
          />
        )}

        {/* Render each node */}
        {nodes.map((node, index) => {
          const nodeId = nodeIds[index];
          const isSelected = selectedNodeId === nodeId;
          const isDraggable = enableDragDrop && !readOnly;
          
          // Get appropriate renderer
          const Renderer = nodeRenderers[node.type as keyof NodeRendererMap];
          
          if (!Renderer) {
            console.warn('🎯 No renderer found for node type:', node.type);
            return null;
          }

          return (
            <React.Fragment key={nodeId}>
              {/* Render the node */}
              <Renderer
                node={node}
                index={index}
                nodeId={nodeId}
                isSelected={isSelected}
                isDraggable={isDraggable}
                onSelect={handleNodeSelect}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />

              {/* Drop zone after each node */}
              {enableDragDrop && (
                <EditorDropZone
                  targetIndex={index + 1}
                  zoneId={`${sectionIndex}-${index}`}
                  isActive={isDragging}
                  onDrop={handleDrop}
                  showFeedback={showDragFeedback}
                />
              )}
            </React.Fragment>
          );
        })}
      </Stack>

      {/* Drag feedback overlay */}
      {showDragFeedback && dragFeedback && (
        <DragFeedback
          isVisible={true}
          isValid={dragFeedback.isValid}
        />
      )}
    </EditorContainer>
  );
}; 