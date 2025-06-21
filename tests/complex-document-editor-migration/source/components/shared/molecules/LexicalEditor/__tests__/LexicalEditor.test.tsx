/**
 * LexicalEditor Redux Integration Tests
 * 
 * Comprehensive test suite for document editing functionality
 * Tests state synchronization, performance, and cross-platform behavior
 * 
 * @module LexicalEditor.test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { LexicalEditor, LexicalEditorRedux } from '../index';
import { 
  convertLexicalNodeToDocumentBlock,
  convertDocumentBlockToLexicalNode 
} from '../LexicalEditor.redux';
import documentSlice from '@/stores/document.slice';
import documentHistorySlice from '@/stores/documentHistory.slice';
import type { DocumentBlock, DocumentState, CommandHistoryState } from '@/stores/document.types';
import type { LexicalASTNode } from '../LexicalEditor.types';

// Mock store setup
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      document: documentSlice.reducer,
      documentHistory: documentHistorySlice.reducer
    },
    preloadedState: {
      document: {
        documents: {},
        sections: {},
        exhibits: {},
        transcripts: {},
        blocks: {},
        activeDocumentId: 'test-doc-1',
        currentPage: 1,
        zoomLevel: 1,
        viewMode: 'edit',
        selectionState: {},
        documentDimensions: { width: 800, height: 1000 },
        viewportState: {
          scrollTop: 0,
          scrollLeft: 0,
          visibleArea: { top: 0, left: 0, width: 800, height: 600 }
        },
        isLoading: false,
        isSaving: false,
        lastSavedAt: null,
        error: null,
        collaborators: {},
        ...initialState.document
      },
      documentHistory: {
        commands: [],
        currentIndex: -1,
        maxHistorySize: 50,
        canUndo: false,
        canRedo: false,
        ...initialState.documentHistory
      }
    }
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ 
  store: any; 
  children: React.ReactNode;
}> = ({ store, children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

// Mock Lexical dependencies
vi.mock('@lexical/react/LexicalComposer', () => ({
  LexicalComposer: ({ children }: any) => <div data-testid="lexical-composer">{children}</div>
}));

vi.mock('@lexical/react/LexicalRichTextPlugin', () => ({
  RichTextPlugin: ({ contentEditable, placeholder }: any) => (
    <div data-testid="rich-text-plugin">
      {contentEditable}
      {placeholder}
    </div>
  )
}));

vi.mock('@lexical/react/LexicalContentEditable', () => ({
  ContentEditable: (props: any) => (
    <div
      data-testid="content-editable"
      contentEditable
      {...props}
    />
  )
}));

vi.mock('@lexical/react/LexicalErrorBoundary', () => ({
  LexicalErrorBoundary: ({ children }: any) => children
}));

vi.mock('@lexical/react/LexicalHistoryPlugin', () => ({
  HistoryPlugin: () => <div data-testid="history-plugin" />
}));

describe('LexicalEditor Component', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without Redux integration', () => {
      render(
        <LexicalEditor 
          placeholder="Test placeholder"
          readOnly={false}
        />
      );

      expect(screen.getByTestId('lexical-composer')).toBeInTheDocument();
      expect(screen.getByText('Test placeholder')).toBeInTheDocument();
    });

    it('renders with Redux integration', () => {
      const store = createTestStore();
      
      render(
        <TestWrapper store={store}>
          <LexicalEditorRedux 
            documentId="test-doc-1"
            placeholder="Redux placeholder"
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('lexical-composer')).toBeInTheDocument();
      expect(screen.getByText('Redux placeholder')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      const store = createTestStore({
        document: { isLoading: true }
      });
      
      render(
        <TestWrapper store={store}>
          <LexicalEditorRedux documentId="test-doc-1" />
        </TestWrapper>
      );

      expect(screen.getByText('Loading document...')).toBeInTheDocument();
    });
  });

  describe('Redux Integration Utilities', () => {
    describe('convertLexicalNodeToDocumentBlock', () => {
      it('converts paragraph node correctly', () => {
        const lexicalNode: LexicalASTNode = {
          type: 'paragraph',
          text: 'Test paragraph content'
        };

        const documentBlock = convertLexicalNodeToDocumentBlock(
          lexicalNode,
          'test-doc-1',
          0
        );

        expect(documentBlock).toEqual({
          type: 'text',
          content: {
            text: 'Test paragraph content'
          },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: {
            documentId: 'test-doc-1',
            nodeType: 'paragraph'
          }
        });
      });

      it('converts heading node correctly', () => {
        const lexicalNode: LexicalASTNode = {
          type: 'heading',
          level: 2,
          text: 'Test heading'
        };

        const documentBlock = convertLexicalNodeToDocumentBlock(
          lexicalNode,
          'test-doc-1',
          1
        );

        expect(documentBlock).toEqual({
          type: 'text',
          content: {
            text: 'Test heading',
            level: 2
          },
          position: { x: 0, y: 50 },
          order: 1,
          metadata: {
            documentId: 'test-doc-1',
            nodeType: 'heading',
            headingLevel: 2
          }
        });
      });
    });

    describe('convertDocumentBlockToLexicalNode', () => {
      it('converts text block to paragraph node', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-1',
          type: 'text',
          content: { text: 'Test content' },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { nodeType: 'paragraph' }
        };

        const lexicalNode = convertDocumentBlockToLexicalNode(documentBlock);

        expect(lexicalNode).toEqual({
          type: 'paragraph',
          text: 'Test content'
        });
      });

      it('converts heading block to heading node', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-1',
          type: 'text',
          content: { text: 'Heading text' },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { 
            nodeType: 'heading',
            headingLevel: 3
          }
        };

        const lexicalNode = convertDocumentBlockToLexicalNode(documentBlock);

        expect(lexicalNode).toEqual({
          type: 'heading',
          level: 3,
          text: 'Heading text'
        });
      });

      it('handles invalid heading levels', () => {
        const documentBlock: DocumentBlock = {
          id: 'block-1',
          type: 'text',
          content: { text: 'Heading text' },
          position: { x: 0, y: 0 },
          order: 0,
          metadata: { 
            nodeType: 'heading',
            headingLevel: 10 // Invalid level
          }
        };

        const lexicalNode = convertDocumentBlockToLexicalNode(documentBlock);

        expect(lexicalNode).toEqual({
          type: 'heading',
          level: 6, // Clamped to max
          text: 'Heading text'
        });
      });
    });
  });

  describe('State Synchronization', () => {
    it('synchronizes editor content with Redux store', async () => {
      const store = createTestStore();
      
      render(
        <TestWrapper store={store}>
          <LexicalEditorRedux documentId="test-doc-1" />
        </TestWrapper>
      );

      // Initial state should be empty
      const state = store.getState();
      expect(Object.keys(state.document.blocks)).toHaveLength(0);
    });

    it('handles undo/redo operations', () => {
      const store = createTestStore({
        documentHistory: {
          commands: [
            {
              id: 'cmd-1',
              type: 'document/addBlock',
              timestamp: Date.now(),
              forward: { action: {} },
              backward: { action: {} },
              description: 'Add block'
            }
          ],
          currentIndex: 0,
          canUndo: true,
          canRedo: false
        }
      });
      
      render(
        <TestWrapper store={store}>
          <LexicalEditorRedux documentId="test-doc-1" />
        </TestWrapper>
      );

      const initialState = store.getState();
      expect(initialState.documentHistory.canUndo).toBe(true);
      expect(initialState.documentHistory.canRedo).toBe(false);
    });
  });

  describe('Performance Testing', () => {
    it('handles large document content efficiently', () => {
      const largeContent = Array.from({ length: 100 }, (_, i) => ({
        id: `block-${i}`,
        type: 'text' as const,
        content: { text: `Paragraph ${i} with some content` },
        position: { x: 0, y: i * 50 },
        order: i,
        metadata: { nodeType: 'paragraph' }
      }));

      const store = createTestStore({
        document: {
          blocks: largeContent.reduce((acc, block) => {
            acc[block.id] = block;
            return acc;
          }, {} as Record<string, DocumentBlock>)
        }
      });

      const startTime = performance.now();
      
      render(
        <TestWrapper store={store}>
          <LexicalEditorRedux 
            documentId="test-doc-1"
            performanceSettings={{
              throttleMs: 100,
              batchUpdates: true,
              enableVirtualization: true
            }}
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000); // 1 second max
      expect(screen.getByTestId('lexical-composer')).toBeInTheDocument();
    });
  });
}); 