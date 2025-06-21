import {
  reorderNodes,
  updateDocumentWithReorderedSection,
  findNodeByGeneratedId,
  validateDragOperation,
  executeDragDropOperation,
  getAllNodesWithContext
} from './dragDrop';

// Mock legal document structure for testing
const mockDocument = {
  metadata: {
    title: 'Test Document',
    caseNumber: 'TEST-001',
    dateFiled: '2024-01-01'
  },
  content: {
    title: 'Test Legal Document',
    sections: [
      {
        id: 'section-1',
        title: 'Introduction',
        content: [
          { id: 'node-1', type: 'paragraph', text: 'First paragraph' },
          { id: 'node-2', type: 'paragraph', text: 'Second paragraph' },
          { id: 'node-3', type: 'list', style: 'decimal', items: [{ text: 'List item 1' }] }
        ]
      },
      {
        id: 'section-2', 
        title: 'Background',
        content: [
          { id: 'node-4', type: 'paragraph', text: 'Background paragraph' },
          { id: 'node-5', type: 'recital', text: 'WHEREAS this is important' }
        ]
      }
    ]
  }
};

describe('Drag-Drop Logic Functions', () => {
  
  describe('reorderNodes', () => {
    it('reorders nodes correctly when moving forward', () => {
      const nodes = ['A', 'B', 'C', 'D'];
      const result = reorderNodes(nodes, 1, 3);
      
      expect(result).toEqual(['A', 'C', 'D', 'B']);
    });

    it('reorders nodes correctly when moving backward', () => {
      const nodes = ['A', 'B', 'C', 'D'];  
      const result = reorderNodes(nodes, 2, 0);
      
      expect(result).toEqual(['C', 'A', 'B', 'D']);
    });

    it('handles same position move gracefully', () => {
      const nodes = ['A', 'B', 'C'];
      const result = reorderNodes(nodes, 1, 1);
      
      expect(result).toEqual(['A', 'B', 'C']);
    });

    it('handles edge case: move to end', () => {
      const nodes = ['A', 'B', 'C'];
      const result = reorderNodes(nodes, 0, 2);
      
      expect(result).toEqual(['B', 'C', 'A']);
    });

    it('handles empty array gracefully', () => {
      const nodes: string[] = [];
      const result = reorderNodes(nodes, 0, 0);
      
      expect(result).toEqual([]);
    });

    it('handles single element array', () => {
      const nodes = ['A'];
      const result = reorderNodes(nodes, 0, 0);
      
      expect(result).toEqual(['A']);
    });

    it('throws error for invalid indices', () => {
      const nodes = ['A', 'B', 'C'];
      
      expect(() => reorderNodes(nodes, -1, 0)).toThrow();
      expect(() => reorderNodes(nodes, 0, -1)).toThrow();
      expect(() => reorderNodes(nodes, 3, 0)).toThrow();
      expect(() => reorderNodes(nodes, 0, 3)).toThrow();
    });
  });

  describe('findNodeByGeneratedId', () => {
    it('finds node in first section', () => {
      const result = findNodeByGeneratedId(mockDocument, '0-1');
      
      expect(result).toEqual({
        node: { id: 'node-2', type: 'paragraph', text: 'Second paragraph' },
        sectionIndex: 0,
        nodeIndex: 1,
        section: mockDocument.content.sections[0]
      });
    });

    it('finds node in second section', () => {
      const result = findNodeByGeneratedId(mockDocument, '1-0');
      
      expect(result).toEqual({
        node: { id: 'node-4', type: 'paragraph', text: 'Background paragraph' },
        sectionIndex: 1,
        nodeIndex: 0,
        section: mockDocument.content.sections[1]
      });
    });

    it('returns null for invalid section index', () => {
      const result = findNodeByGeneratedId(mockDocument, '5-0');
      
      expect(result).toBeNull();
    });

    it('returns null for invalid node index', () => {
      const result = findNodeByGeneratedId(mockDocument, '0-10');
      
      expect(result).toBeNull();
    });

    it('returns null for malformed ID', () => {
      const result = findNodeByGeneratedId(mockDocument, 'invalid-id');
      
      expect(result).toBeNull();
    });

    it('handles empty sections gracefully', () => {
      const emptyDoc = {
        ...mockDocument,
        content: {
          ...mockDocument.content,
          sections: []
        }
      };
      
      const result = findNodeByGeneratedId(emptyDoc, '0-0');
      expect(result).toBeNull();
    });
  });

  describe('validateDragOperation', () => {
    it('validates successful reorder within same section', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 0,
        targetIndex: 0,
        operation: 'reorder' as const
      };
      
      const result = validateDragOperation(mockDocument, operation);
      
      expect(result.isValid).toBe(true);
      expect(result.canExecute).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('rejects reorder to same position', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 0,
        targetIndex: 1,
        operation: 'reorder' as const
      };
      
      const result = validateDragOperation(mockDocument, operation);
      
      expect(result.isValid).toBe(false);
      expect(result.canExecute).toBe(false);
      expect(result.errors).toContain('Cannot move node to the same position');
    });

    it('rejects invalid source node', () => {
      const operation = {
        sourceId: '10-10',
        targetSectionIndex: 0,
        targetIndex: 0,
        operation: 'reorder' as const
      };
      
      const result = validateDragOperation(mockDocument, operation);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Source node not found');
    });

    it('rejects invalid target section', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 10,
        targetIndex: 0,
        operation: 'reorder' as const
      };
      
      const result = validateDragOperation(mockDocument, operation);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Target section not found');
    });

    it('rejects out-of-bounds target index', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 0,
        targetIndex: 10,
        operation: 'reorder' as const
      };
      
      const result = validateDragOperation(mockDocument, operation);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Target index out of bounds');
    });
  });

  describe('updateDocumentWithReorderedSection', () => {
    it('updates document with reordered nodes', () => {
      const targetSection = mockDocument.content.sections[0];
      const reorderedNodes = [
        targetSection.content[1], // Move second item first
        targetSection.content[0],
        targetSection.content[2]
      ];
      
      const result = updateDocumentWithReorderedSection(
        mockDocument,
        0,
        reorderedNodes
      );
      
      expect(result.content.sections[0].content).toEqual(reorderedNodes);
      expect(result.content.sections[1]).toEqual(mockDocument.content.sections[1]); // Unchanged
    });

    it('preserves other sections when updating', () => {
      const targetSection = mockDocument.content.sections[1];
      const reorderedNodes = [targetSection.content[1], targetSection.content[0]];
      
      const result = updateDocumentWithReorderedSection(
        mockDocument,
        1,
        reorderedNodes
      );
      
      expect(result.content.sections[0]).toEqual(mockDocument.content.sections[0]); // Unchanged
      expect(result.content.sections[1].content).toEqual(reorderedNodes);
    });

    it('preserves document metadata', () => {
      const result = updateDocumentWithReorderedSection(
        mockDocument,
        0,
        mockDocument.content.sections[0].content
      );
      
      expect(result.metadata).toEqual(mockDocument.metadata);
      expect(result.content.title).toEqual(mockDocument.content.title);
    });
  });

  describe('executeDragDropOperation', () => {
    it('executes successful reorder operation', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 0,
        targetIndex: 0,
        operation: 'reorder' as const
      };
      
      const result = executeDragDropOperation(mockDocument, operation);
      
      expect(result.success).toBe(true);
      expect(result.updatedDocument).toBeDefined();
      expect(result.errors).toEqual([]);
      
      // Verify the actual reordering
      const newFirstNode = result.updatedDocument!.content.sections[0].content[0];
      expect(newFirstNode.text).toBe('Second paragraph');
    });

    it('fails gracefully on invalid operation', () => {
      const operation = {
        sourceId: '10-10',
        targetSectionIndex: 0,
        targetIndex: 0,
        operation: 'reorder' as const
      };
      
      const result = executeDragDropOperation(mockDocument, operation);
      
      expect(result.success).toBe(false);
      expect(result.updatedDocument).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('provides detailed error information', () => {
      const operation = {
        sourceId: '0-1',
        targetSectionIndex: 0,
        targetIndex: 1, // Same position
        operation: 'reorder' as const
      };
      
      const result = executeDragDropOperation(mockDocument, operation);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Cannot move node to the same position');
      expect(result.validationResult).toBeDefined();
    });
  });

  describe('getAllNodesWithContext', () => {
    it('returns all nodes with correct context', () => {
      const result = getAllNodesWithContext(mockDocument);
      
      expect(result).toHaveLength(5); // Total nodes across both sections
      
      // Check first node
      expect(result[0]).toEqual({
        node: { id: 'node-1', type: 'paragraph', text: 'First paragraph' },
        generatedId: '0-0',
        sectionIndex: 0,
        nodeIndex: 0,
        sectionTitle: 'Introduction'
      });
      
      // Check last node
      expect(result[4]).toEqual({
        node: { id: 'node-5', type: 'recital', text: 'WHEREAS this is important' },
        generatedId: '1-1',
        sectionIndex: 1,
        nodeIndex: 1,
        sectionTitle: 'Background'
      });
    });

    it('handles empty document gracefully', () => {
      const emptyDoc = {
        ...mockDocument,
        content: {
          ...mockDocument.content,
          sections: []
        }
      };
      
      const result = getAllNodesWithContext(emptyDoc);
      expect(result).toEqual([]);
    });

    it('handles sections with no content', () => {
      const docWithEmptySection = {
        ...mockDocument,
        content: {
          ...mockDocument.content,
          sections: [
            { id: 'empty', title: 'Empty Section', content: [] },
            mockDocument.content.sections[0]
          ]
        }
      };
      
      const result = getAllNodesWithContext(docWithEmptySection);
      expect(result).toHaveLength(3); // Only nodes from second section
      expect(result[0].sectionIndex).toBe(1); // Skip empty section
    });
  });

  describe('Error Edge Cases', () => {
    it('handles malformed document structure', () => {
      const malformedDoc = {
        metadata: {},
        content: {
          sections: null as any
        }
      };
      
      expect(() => getAllNodesWithContext(malformedDoc)).not.toThrow();
    });

    it('handles missing document properties gracefully', () => {
      const incompleteDoc = {
        content: {
          sections: []
        }
      } as any;
      
      const result = getAllNodesWithContext(incompleteDoc);
      expect(result).toEqual([]);
    });
  });

  describe('Performance Considerations', () => {
    it('handles large documents efficiently', () => {
      // Create a large mock document
      const largeDoc = {
        ...mockDocument,
        content: {
          ...mockDocument.content,
          sections: Array(100).fill(null).map((_, sectionIndex) => ({
            id: `section-${sectionIndex}`,
            title: `Section ${sectionIndex}`,
            content: Array(50).fill(null).map((_, nodeIndex) => ({
              id: `node-${sectionIndex}-${nodeIndex}`,
              type: 'paragraph',
              text: `Content ${sectionIndex}-${nodeIndex}`
            }))
          }))
        }
      };
      
      const startTime = performance.now();
      const result = getAllNodesWithContext(largeDoc);
      const endTime = performance.now();
      
      expect(result).toHaveLength(5000); // 100 sections * 50 nodes
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
}); 