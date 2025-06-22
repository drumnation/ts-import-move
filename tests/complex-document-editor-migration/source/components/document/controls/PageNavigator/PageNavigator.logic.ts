/**
 * PageNavigator Component Logic
 * 
 * Pure business logic functions for page navigation functionality
 * Implements Redux integration and functional programming patterns
 * 
 * @module PageNavigator.logic
 */

import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/store.hooks';
import { 
  selectActiveDocumentWithContent,
  selectDocumentState,
  selectCurrentPage
} from '@/stores/selectors/document.selectors';
import { setCurrentPage } from '@/stores/document.slice';
import type { 
  PageNavigatorLogicHook,
  PageNavigationState,
  PageNavigationActions,
  PageThumbnail
} from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.types';

/**
 * Pure function to calculate page range for pagination
 */
export const calculatePageRange = (
  currentPage: number, 
  totalPages: number, 
  maxVisible: number = 5
): { start: number; end: number } => {
  if (totalPages <= maxVisible) {
    return { start: 1, end: totalPages };
  }
  
  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  const end = Math.min(totalPages, start + maxVisible - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  return { start, end };
};

/**
 * Pure function to validate page number
 */
export const validatePageNumber = (
  pageNumber: number, 
  totalPages: number
): boolean => {
  return pageNumber >= 1 && pageNumber <= totalPages && Number.isInteger(pageNumber);
};

/**
 * Pure function to generate page navigation history
 */
export const updateNavigationHistory = (
  currentHistory: number[],
  currentIndex: number,
  newPage: number,
  maxHistorySize: number = 20
): { history: number[]; index: number } => {
  // Remove any forward history if we're not at the end
  const trimmedHistory = currentHistory.slice(0, currentIndex + 1);
  
  // Add new page if it's different from current
  if (trimmedHistory[trimmedHistory.length - 1] !== newPage) {
    trimmedHistory.push(newPage);
  }
  
  // Trim history if it exceeds max size
  const finalHistory = trimmedHistory.length > maxHistorySize 
    ? trimmedHistory.slice(-maxHistorySize)
    : trimmedHistory;
    
  return {
    history: finalHistory,
    index: finalHistory.length - 1
  };
};

/**
 * Pure function to generate thumbnail URL (placeholder implementation)
 */
export const generateThumbnailUrl = async (
  documentId: string,
  pageNumber: number,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<string> => {
  // Placeholder implementation - would integrate with actual thumbnail service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`/api/documents/${documentId}/pages/${pageNumber}/thumbnail?size=${size}`);
    }, 100);
  });
};

/**
 * Custom hook for PageNavigator logic with Redux integration
 */
export const usePageNavigatorLogic = (): PageNavigatorLogicHook => {
  const dispatch = useAppDispatch();
  
  // Redux selectors with memoization
  const document = useAppSelector(selectActiveDocumentWithContent);
  const documentState = useAppSelector(selectDocumentState);
  const currentPage = useAppSelector(selectCurrentPage);
  
  // Calculate total pages from document content (simplified approach)
  const totalPages = useMemo(() => {
    if (!document?.sections) return 1;
    // For now, assume each section is a page - would be more sophisticated in real implementation
    return Math.max(1, document.sections.length);
  }, [document?.sections]);
  
  // Local state derived from Redux
  const navigationState = useMemo((): PageNavigationState => ({
    currentPage,
    totalPages,
    isLoading: documentState.isLoading,
    error: documentState.error,
    thumbnails: new Map(), // Would be managed in Redux for caching
    history: [currentPage], // Simplified - would be in Redux for persistence
    historyIndex: 0
  }), [currentPage, totalPages, documentState.isLoading, documentState.error]);

  // Navigation actions with Redux dispatch
  const actions = useMemo((): PageNavigationActions => ({
    goToPage: (pageNumber: number) => {
      if (validatePageNumber(pageNumber, totalPages)) {
        dispatch(setCurrentPage(pageNumber));
      }
    },
    
    nextPage: () => {
      if (currentPage < totalPages) {
        dispatch(setCurrentPage(currentPage + 1));
      }
    },
    
    previousPage: () => {
      if (currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }
    },
    
    firstPage: () => {
      dispatch(setCurrentPage(1));
    },
    
    lastPage: () => {
      dispatch(setCurrentPage(totalPages));
    },
    
    goBack: () => {
      // Simplified implementation - would use history from Redux
      if (currentPage > 1) {
        dispatch(setCurrentPage(currentPage - 1));
      }
    },
    
    goForward: () => {
      // Simplified implementation - would use history from Redux
      if (currentPage < totalPages) {
        dispatch(setCurrentPage(currentPage + 1));
      }
    },
    
    generateThumbnail: async (pageNumber: number) => {
      if (document?.document.id) {
        return generateThumbnailUrl(document.document.id, pageNumber);
      }
      return '';
    },
    
    refreshThumbnails: () => {
      // Would dispatch action to refresh thumbnail cache
      console.log('Refreshing thumbnails...');
    }
  }), [dispatch, currentPage, totalPages, document?.document.id]);

  // Computed properties with memoization
  const computed = useMemo(() => ({
    canGoBack: currentPage > 1,
    canGoForward: currentPage < totalPages,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    pageRange: calculatePageRange(currentPage, totalPages)
  }), [currentPage, totalPages]);

  return {
    state: navigationState,
    actions,
    computed
  };
};

/**
 * Pure function to format page display text
 */
export const formatPageDisplay = (
  currentPage: number,
  totalPages: number,
  format: 'short' | 'long' = 'short'
): string => {
  if (format === 'long') {
    return `Page ${currentPage} of ${totalPages}`;
  }
  return `${currentPage} / ${totalPages}`;
};

/**
 * Pure function to calculate thumbnail dimensions
 */
export const calculateThumbnailDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}; 