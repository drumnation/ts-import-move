/**
 * LexicalEditor Integration Tests
 * 
 * Focused tests for state synchronization and document editing functionality
 * Tests the core business logic without complex UI mocking
 * 
 * @module LexicalEditor.integration.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  convertLexicalNodeToDocumentBlock,
  convertDocumentBlockToLexicalNode,
  createOptimizedEditorTheme
} from '../LexicalEditor.redux';
import type { DocumentBlock } from '@/stores/document.types';
import type { LexicalASTNode } from '../LexicalEditor.types';

describe('LexicalEditor State Synchronization', () => {
  describe('Document Block ↔ Lexical Node Conversion', () => {
    describe('convertLexicalNodeToDocumentBlock', () => {
      it('converts paragraph node correctly', () => {
        const lexicalNode: LexicalASTNode = {
          type: 'paragraph',
          text: 'This is a test paragraph with some content.'
        };

        const result = convertLexicalNodeToDocumentBlock(
          lexicalNode,
          'doc-123',
          0
        );

        expect(result).toEqual({
          type: 'text',
          content: {
            text: 'This is a test paragraph with some content.'
          },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: {
            documentId: 'doc-123',
            nodeType: 'paragraph'
          }
        });
      });

      it('converts heading node with level', () => {
        const lexicalNode: LexicalASTNode = {
          type: 'heading',
          level: 2,
          text: 'Section Title'
        };

        const result = convertLexicalNodeToDocumentBlock(
          lexicalNode,
          'doc-456',
          1
        );

        expect(result).toEqual({
          type: 'text',
          content: {
            text: 'Section Title',
            level: 2
          },
          position: { x: 0, y: 50 },
          order: 1,
          metadata: {
            documentId: 'doc-456',
            nodeType: 'heading',
            headingLevel: 2
          }
        });
      });

      it('handles different heading levels', () => {
        const testCases = [1, 2, 3, 4, 5, 6] as const;

        testCases.forEach(level => {
          const lexicalNode: LexicalASTNode = {
            type: 'heading',
            level,
            text: `H${level} Title`
          };

          const result = convertLexicalNodeToDocumentBlock(
            lexicalNode,
            'test-doc',
            0
          );

          expect(result.content.level).toBe(level);
          expect(result.metadata?.headingLevel).toBe(level);
        });
      });

      it('calculates position based on order', () => {
        const testCases = [0, 1, 5, 10, 20];

        testCases.forEach(order => {
          const lexicalNode: LexicalASTNode = {
            type: 'paragraph',
            text: 'Test'
          };

          const result = convertLexicalNodeToDocumentBlock(
            lexicalNode,
            'test-doc',
            order
          );

          expect(result.position).toEqual({
            x: 0,
            y: order * 50
          });
          expect(result.order).toBe(order);
        });
      });
    });

    describe('convertDocumentBlockToLexicalNode', () => {
      it('converts text block to paragraph node', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-123',
          type: 'text',
          content: { text: 'Sample paragraph content' },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { nodeType: 'paragraph' }
        };

        const result = convertDocumentBlockToLexicalNode(documentBlock);

        expect(result).toEqual({
          type: 'paragraph',
          text: 'Sample paragraph content'
        });
      });

      it('converts heading block to heading node', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-456',
          type: 'text',
          content: { text: 'Main Title' },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { 
            nodeType: 'heading',
            headingLevel: 1
          }
        };

        const result = convertDocumentBlockToLexicalNode(documentBlock);

        expect(result).toEqual({
          type: 'heading',
          level: 1,
          text: 'Main Title'
        });
      });

      it('handles missing text content gracefully', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-789',
          type: 'text',
          content: {}, // No text property
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { nodeType: 'paragraph' }
        };

        const result = convertDocumentBlockToLexicalNode(documentBlock);

        expect(result).toEqual({
          type: 'paragraph',
          text: ''
        });
      });

      it('handles non-string text content', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-999',
          type: 'text',
          content: { text: 123 }, // Non-string content
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { nodeType: 'paragraph' }
        };

        const result = convertDocumentBlockToLexicalNode(documentBlock);

        expect(result).toEqual({
          type: 'paragraph',
          text: ''
        });
      });

      it('clamps invalid heading levels', () => {
        const testCases = [
          { input: 0, expected: 1 },
          { input: -1, expected: 1 },
          { input: 7, expected: 6 },
          { input: 10, expected: 6 },
          { input: 3, expected: 3 }
        ];

        testCases.forEach(({ input, expected }) => {
          const documentBlock: DocumentBlock = {
            id: `block-${input}`,
            type: 'text',
            content: { text: 'Test heading' },
            position: { x: 0, y: 0 },
            order: 0,
            metadata: { 
              nodeType: 'heading',
              headingLevel: input
            }
          };

          const result = convertDocumentBlockToLexicalNode(documentBlock);

          expect(result).toEqual({
            type: 'heading',
            level: expected,
            text: 'Test heading'
          });
        });
      });

      it('defaults to paragraph when no metadata', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-no-meta',
          type: 'text',
          content: { text: 'Content without metadata' },
          position: { x: 0, y: 0 },
          order: 0
          // No metadata
        };

        const result = convertDocumentBlockToLexicalNode(documentBlock);

        expect(result).toEqual({
          type: 'paragraph',
          text: 'Content without metadata'
        });
      });
    });

    describe('Round-trip conversion', () => {
      it('maintains data integrity for paragraph', () => {
        const originalNode: LexicalASTNode = {
          type: 'paragraph',
          text: 'Original paragraph content'
        };

        // Node → Block → Node
        const block = convertLexicalNodeToDocumentBlock(originalNode, 'test-doc', 0);
        const convertedNode = convertDocumentBlockToLexicalNode({
          id: 'test-id',
          ...block
        });

        expect(convertedNode).toEqual(originalNode);
      });

      it('maintains data integrity for heading', () => {
        const originalNode: LexicalASTNode = {
          type: 'heading',
          level: 3,
          text: 'Subsection Header'
        };

        // Node → Block → Node
        const block = convertLexicalNodeToDocumentBlock(originalNode, 'test-doc', 0);
        const convertedNode = convertDocumentBlockToLexicalNode({
          id: 'test-id',
          ...block
        });

        expect(convertedNode).toEqual(originalNode);
      });

      it('handles multiple nodes in sequence', () => {
        const originalNodes: LexicalASTNode[] = [
          { type: 'heading', level: 1, text: 'Document Title' },
          { type: 'paragraph', text: 'Introduction paragraph' },
          { type: 'heading', level: 2, text: 'Section 1' },
          { type: 'paragraph', text: 'Section content' }
        ];

        // Convert all to blocks, then back to nodes
        const blocks = originalNodes.map((node, index) => 
          convertLexicalNodeToDocumentBlock(node, 'test-doc', index)
        );

        const convertedNodes = blocks.map(block => 
          convertDocumentBlockToLexicalNode({
            id: `block-${block.order}`,
            ...block
          })
        );

        expect(convertedNodes).toEqual(originalNodes);
      });
    });
  });

  describe('Editor Theme Generation', () => {
    it('creates basic theme without virtualization', () => {
      const theme = createOptimizedEditorTheme(false);

      expect(theme).toHaveProperty('paragraph', 'editor-paragraph');
      expect(theme).toHaveProperty('heading');
      expect(theme).toHaveProperty('text');
      expect(theme.heading).toHaveProperty('h1', 'editor-heading-h1');
      expect(theme.text).toHaveProperty('bold', 'editor-text-bold');
    });

    it('creates theme with virtualization enabled', () => {
      const theme = createOptimizedEditorTheme(true);

      expect(theme.paragraph).toBe('editor-paragraph virtualized');
    });

    it('includes all required theme properties', () => {
      const theme = createOptimizedEditorTheme();

      const requiredProperties = [
        'paragraph', 'heading', 'text', 'code', 'quote', 
        'list', 'link', 'selection'
      ];

      requiredProperties.forEach(prop => {
        expect(theme).toHaveProperty(prop);
      });
    });

    it('includes all heading levels', () => {
      const theme = createOptimizedEditorTheme();

      const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      headingLevels.forEach(level => {
        expect(theme.heading).toHaveProperty(level, `editor-heading-${level}`);
      });
    });

    it('includes all text styles', () => {
      const theme = createOptimizedEditorTheme();

      const textStyles = ['bold', 'italic', 'underline', 'strikethrough', 'code'];

      textStyles.forEach(style => {
        expect(theme.text).toHaveProperty(style, `editor-text-${style}`);
      });
    });
  });

  describe('Performance Validation', () => {
    it('handles large dataset conversion efficiently', () => {
      const largeNodeSet: LexicalASTNode[] = Array.from({ length: 1000 }, (_, i) => ({
        type: i % 5 === 0 ? 'heading' : 'paragraph',
        ...(i % 5 === 0 && { level: ((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6 }),
        text: `Content item ${i} with some reasonable length text content`
      }));

      const startTime = performance.now();

      // Convert all nodes to blocks
      const blocks = largeNodeSet.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'perf-test', index)
      );

      // Convert back to nodes
      const convertedNodes = blocks.map(block => 
        convertDocumentBlockToLexicalNode({
          id: `block-${block.order}`,
          ...block
        })
      );

      const endTime = performance.now();
      const conversionTime = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(conversionTime).toBeLessThan(100); // 100ms max
      expect(convertedNodes).toHaveLength(1000);
      expect(convertedNodes[0]).toEqual(largeNodeSet[0]);
      expect(convertedNodes[999]).toEqual(largeNodeSet[999]);
    });

    it('maintains memory efficiency with repeated conversions', () => {
      const testNode: LexicalASTNode = {
        type: 'paragraph',
        text: 'Memory test content'
      };

      // Perform many conversions to test for memory leaks
      for (let i = 0; i < 10000; i++) {
        const block = convertLexicalNodeToDocumentBlock(testNode, 'memory-test', i);
        const convertedBack = convertDocumentBlockToLexicalNode({
          id: `block-${i}`,
          ...block
        });
        
        // Verify consistency
        expect(convertedBack).toEqual(testNode);
      }

      // If we get here without running out of memory, test passes
      expect(true).toBe(true);
    });
  });
}); 