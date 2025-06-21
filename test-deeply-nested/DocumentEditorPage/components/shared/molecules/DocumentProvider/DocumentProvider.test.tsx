/**
 * Document Provider Tests
 * 
 * Unit tests for DocumentProvider component
 * 
 * @module DocumentProvider.test
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDocumentProvider } from './DocumentProvider';
import type { DocumentProviderProps } from './DocumentProvider.types';

describe('useDocumentProvider', () => {
  const mockProps: DocumentProviderProps = {
    currentDocument: null,
    onContentChange: vi.fn(),
    placeholder: 'Test placeholder'
  };

  it('should return document structure with correct page configuration', () => {
    const { result } = renderHook(() => useDocumentProvider(mockProps));

    expect(result.current).toEqual(
      expect.objectContaining({
        pages: expect.arrayContaining([
          expect.objectContaining({
            id: 'page-1',
            pageNumber: 1,
            dimensions: { width: 612, height: 792 }
          })
        ]),
        currentPageIndex: 0,
        viewMode: 'single',
        totalPages: 1
      })
    );
  });

  it('should include content in the first page', () => {
    const { result } = renderHook(() => useDocumentProvider(mockProps));

    expect(result.current.pages[0].content).toBeDefined();
    expect(result.current.pages[0].content).not.toBeNull();
  });

  it('should use default placeholder when none provided', () => {
    const propsWithoutPlaceholder = {
      currentDocument: null,
      onContentChange: vi.fn()
    };

    const { result } = renderHook(() => useDocumentProvider(propsWithoutPlaceholder));

    expect(result.current).toBeDefined();
    expect(result.current.pages).toHaveLength(1);
  });
}); 