/**
 * LexicalEditor Cross-Platform Validation Tests
 * 
 * Validates document editing functionality works correctly across different platforms
 * Tests mobile/desktop responsiveness and state synchronization
 * 
 * @module LexicalEditor.platform-validation.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  convertLexicalNodeToDocumentBlock,
  convertDocumentBlockToLexicalNode,
  createOptimizedEditorTheme
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.redux';
import type { DocumentBlock } from '@/stores/document.types';
import type { LexicalASTNode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';

// Mock platform detection utilities
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Setup global mocks
beforeEach(() => {
  global.window = global.window || {};
  global.window.matchMedia = global.window.matchMedia || mockMatchMedia;
});

describe('LexicalEditor Cross-Platform Validation', () => {
  describe('Desktop Platform Testing', () => {
    beforeEach(() => {
      // Mock desktop viewport
      vi.mocked(global.window.matchMedia).mockImplementation((query: string) => ({
        ...mockMatchMedia(query),
        matches: query.includes('min-width: 769px') // Desktop breakpoint
      }));
    });

    it('validates document editing for desktop interface', () => {
      // Test complex document structure that would be typical on desktop
      const desktopDocumentContent: LexicalASTNode[] = [
        { type: 'heading', level: 1, text: 'Legal Brief: Motion for Summary Judgment' },
        { type: 'paragraph', text: 'This motion is filed pursuant to Federal Rule of Civil Procedure 56(a) requesting that the Court grant summary judgment in favor of Plaintiff on all claims asserted in the Complaint.' },
        { type: 'heading', level: 2, text: 'I. STATEMENT OF FACTS' },
        { type: 'paragraph', text: 'The undisputed material facts establish that:' },
        { type: 'paragraph', text: '1. Defendant breached the contract on multiple occasions;' },
        { type: 'paragraph', text: '2. Plaintiff suffered damages as a direct result;' },
        { type: 'heading', level: 2, text: 'II. LEGAL STANDARD' },
        { type: 'paragraph', text: 'Summary judgment is appropriate when there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. Fed. R. Civ. P. 56(a).' }
      ];

      // Convert to document blocks (simulating Redux state)
      const documentBlocks = desktopDocumentContent.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'desktop-doc-1', index)
      );

      // Verify conversion integrity
      expect(documentBlocks).toHaveLength(8);
      expect(documentBlocks[0].metadata?.nodeType).toBe('heading');
      expect(documentBlocks[0].metadata?.headingLevel).toBe(1);
      expect(documentBlocks[2].metadata?.nodeType).toBe('heading');
      expect(documentBlocks[2].metadata?.headingLevel).toBe(2);

      // Convert back to verify round-trip integrity
      const convertedBack = documentBlocks.map(block => 
        convertDocumentBlockToLexicalNode({
          id: `block-${block.order}`,
          ...block
        })
      );

      expect(convertedBack).toEqual(desktopDocumentContent);
    });

    it('validates editor theme optimizations for desktop', () => {
      const desktopTheme = createOptimizedEditorTheme(false); // No virtualization

      // Desktop should have full theme support
      expect(desktopTheme.paragraph).toBe('editor-paragraph');
      expect(desktopTheme.heading.h1).toBe('editor-heading-h1');
      expect(desktopTheme.text.bold).toBe('editor-text-bold');
      expect(desktopTheme.list.ul).toBe('editor-list-ul');
      expect(desktopTheme.quote).toBe('editor-quote');
    });

    it('handles large document performance on desktop', () => {
      // Test performance with larger document that desktop can handle
      const largeDocument = Array.from({ length: 500 }, (_, i) => ({
        type: i % 4 === 0 ? 'heading' : 'paragraph',
        ...(i % 4 === 0 && { level: ((i % 3) + 1) as 1 | 2 | 3 }),
        text: `Desktop content section ${i + 1}. This represents detailed legal content that would be typical in a desktop environment with more screen real estate and processing power.`
      })) as LexicalASTNode[];

      const startTime = performance.now();
      const blocks = largeDocument.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'large-desktop-doc', index)
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should be very fast on desktop
      expect(blocks).toHaveLength(500);
    });
  });

  describe('Mobile Platform Testing', () => {
    beforeEach(() => {
      // Mock mobile viewport
      vi.mocked(global.window.matchMedia).mockImplementation((query: string) => ({
        ...mockMatchMedia(query),
        matches: query.includes('max-width: 768px') // Mobile breakpoint
      }));
    });

    it('validates document editing for mobile interface', () => {
      // Test simpler document structure optimized for mobile
      const mobileDocumentContent: LexicalASTNode[] = [
        { type: 'heading', level: 1, text: 'Motion Summary' },
        { type: 'paragraph', text: 'Key Facts:' },
        { type: 'paragraph', text: '• Contract breach occurred' },
        { type: 'paragraph', text: '• Damages resulted' },
        { type: 'heading', level: 2, text: 'Relief Sought' },
        { type: 'paragraph', text: 'Summary judgment granted.' }
      ];

      // Convert to document blocks
      const documentBlocks = mobileDocumentContent.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'mobile-doc-1', index)
      );

      // Verify mobile-optimized structure
      expect(documentBlocks).toHaveLength(6);
      expect(documentBlocks.every(block => 
        typeof block.content.text === 'string' && block.content.text.length < 200
      )).toBe(true); // Mobile content should be concise

      // Verify round-trip integrity
      const convertedBack = documentBlocks.map(block => 
        convertDocumentBlockToLexicalNode({
          id: `mobile-block-${block.order}`,
          ...block
        })
      );

      expect(convertedBack).toEqual(mobileDocumentContent);
    });

    it('validates editor theme optimizations for mobile', () => {
      const mobileTheme = createOptimizedEditorTheme(true); // With virtualization

      // Mobile should have optimized theme with virtualization
      expect(mobileTheme.paragraph).toBe('editor-paragraph virtualized');
      expect(mobileTheme.heading.h1).toBe('editor-heading-h1');
      expect(mobileTheme.text.bold).toBe('editor-text-bold');
    });

    it('handles memory constraints on mobile', () => {
      // Test with smaller document optimized for mobile memory constraints
      const mobileDocument = Array.from({ length: 50 }, (_, i) => ({
        type: i % 6 === 0 ? 'heading' : 'paragraph',
        ...(i % 6 === 0 && { level: 2 as const }),
        text: `Mobile section ${i + 1}` // Shorter content for mobile
      })) as LexicalASTNode[];

      const startTime = performance.now();
      const blocks = mobileDocument.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'mobile-optimized-doc', index)
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(25); // Should be fast even on mobile
      expect(blocks).toHaveLength(50);
      
      // Verify memory-efficient structure
      expect(blocks.every(block => 
        JSON.stringify(block).length < 500 // Keep blocks small for mobile
      )).toBe(true);
    });
  });

  describe('State Synchronization Across Platforms', () => {
    it('maintains state consistency between platforms', () => {
      // Create document content that should work on both platforms
      const universalContent: LexicalASTNode[] = [
        { type: 'heading', level: 1, text: 'Universal Document' },
        { type: 'paragraph', text: 'This content works on all platforms.' },
        { type: 'heading', level: 2, text: 'Section A' },
        { type: 'paragraph', text: 'Compatible across mobile and desktop.' }
      ];

      // Test on "desktop"
      vi.mocked(global.window.matchMedia).mockImplementation((query: string) => ({
        ...mockMatchMedia(query),
        matches: query.includes('min-width: 769px')
      }));

      const desktopBlocks = universalContent.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'universal-doc', index)
      );

      // Test on "mobile"
      vi.mocked(global.window.matchMedia).mockImplementation((query: string) => ({
        ...mockMatchMedia(query),
        matches: query.includes('max-width: 768px')
      }));

      const mobileBlocks = universalContent.map((node, index) => 
        convertLexicalNodeToDocumentBlock(node, 'universal-doc', index)
      );

      // State should be identical regardless of platform
      expect(desktopBlocks).toEqual(mobileBlocks);

      // Convert back should be identical
      const desktopConverted = desktopBlocks.map(block => 
        convertDocumentBlockToLexicalNode({ id: `d-${block.order}`, ...block })
      );
      const mobileConverted = mobileBlocks.map(block => 
        convertDocumentBlockToLexicalNode({ id: `m-${block.order}`, ...block })
      );

      expect(desktopConverted).toEqual(mobileConverted);
      expect(desktopConverted).toEqual(universalContent);
    });

    it('handles platform-specific optimizations without breaking state', () => {
      const testContent: LexicalASTNode = {
        type: 'paragraph',
        text: 'Platform test content'
      };

      // Test with different platform contexts
      const platforms = [
        { name: 'desktop', breakpoint: 'min-width: 1024px' },
        { name: 'tablet', breakpoint: 'max-width: 1023px' },
        { name: 'mobile', breakpoint: 'max-width: 768px' }
      ];

      const results = platforms.map(platform => {
        vi.mocked(global.window.matchMedia).mockImplementation((query: string) => ({
          ...mockMatchMedia(query),
          matches: query.includes(platform.breakpoint)
        }));

        const block = convertLexicalNodeToDocumentBlock(testContent, `${platform.name}-doc`, 0);
        const converted = convertDocumentBlockToLexicalNode({ id: `${platform.name}-block`, ...block });
        
        return { platform: platform.name, original: testContent, converted };
      });

      // All platforms should produce identical converted content
      const firstResult = results[0].converted;
      results.forEach(result => {
        expect(result.converted).toEqual(firstResult);
        expect(result.converted).toEqual(result.original);
      });
    });
  });

  describe('Error Handling Across Platforms', () => {
    it('gracefully handles platform detection failures', () => {
      // Mock failed platform detection
      vi.mocked(global.window.matchMedia).mockImplementation(() => {
        throw new Error('Platform detection failed');
      });

      // Should still work with fallback behavior
      const testNode: LexicalASTNode = {
        type: 'paragraph',
        text: 'Fallback test content'
      };

      expect(() => {
        const block = convertLexicalNodeToDocumentBlock(testNode, 'fallback-doc', 0);
        const converted = convertDocumentBlockToLexicalNode({ id: 'fallback-block', ...block });
        expect(converted).toEqual(testNode);
      }).not.toThrow();
    });

    it('handles missing theme properties gracefully', () => {
      // Test theme creation without throwing errors
      expect(() => {
        const theme1 = createOptimizedEditorTheme(true);
        const theme2 = createOptimizedEditorTheme(false);
        const theme3 = createOptimizedEditorTheme();
        
        // Should have basic required properties
        [theme1, theme2, theme3].forEach(theme => {
          expect(theme).toHaveProperty('paragraph');
          expect(theme).toHaveProperty('heading');
          expect(theme).toHaveProperty('text');
        });
      }).not.toThrow();
    });
  });

  describe('Performance Validation Across Platforms', () => {
    it('meets performance requirements on all platforms', () => {
      const performanceTest = (documentSize: number, expectedMaxTime: number) => {
        const testDocument = Array.from({ length: documentSize }, (_, i) => ({
          type: i % 3 === 0 ? 'heading' : 'paragraph',
          ...(i % 3 === 0 && { level: 2 as const }),
          text: `Performance test content ${i}`
        })) as LexicalASTNode[];

        const startTime = performance.now();
        
        const blocks = testDocument.map((node, index) => 
          convertLexicalNodeToDocumentBlock(node, 'perf-test', index)
        );
        
        const converted = blocks.map(block => 
          convertDocumentBlockToLexicalNode({ id: `perf-${block.order}`, ...block })
        );
        
        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(expectedMaxTime);
        expect(converted).toEqual(testDocument);
        
        return duration;
      };

      // Test different document sizes with appropriate time limits
      const smallDocTime = performanceTest(10, 10);   // Small docs: < 10ms
      const mediumDocTime = performanceTest(100, 50); // Medium docs: < 50ms  
      const largeDocTime = performanceTest(500, 200); // Large docs: < 200ms

      // Ensure performance scales reasonably
      expect(mediumDocTime).toBeGreaterThan(smallDocTime);
      expect(largeDocTime).toBeGreaterThan(mediumDocTime);
    });
  });
}); 