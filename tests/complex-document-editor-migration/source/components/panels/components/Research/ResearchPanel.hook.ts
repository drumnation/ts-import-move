/**
 * Research Panel Hooks
 * @module ResearchPanel.hook
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type {
  ResearchState,
  ResearchActions,
  ResearchQuery,
  ResearchResults,
  DocumentPassage,
  ResearchDocument,
  VectorStoreConfig
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.types';

// Default query configuration
const DEFAULT_QUERY: ResearchQuery = {
  query: '',
  maxResults: 10,
  minScore: 0.7,
  searchMode: 'semantic',
  includeMetadata: true
};

// Default vector store configuration
const DEFAULT_VECTOR_CONFIG: VectorStoreConfig = {
  provider: 'local',
  embeddingModel: 'all-MiniLM-L6-v2',
  dimensions: 384,
  indexName: 'legal-documents'
};

/**
 * Hook for managing document research and vector database operations
 */
export const useDocumentResearch = (): ResearchState & ResearchActions => {
  const [state, setState] = useState<ResearchState>({
    documents: [],
    currentQuery: null,
    results: null,
    queryHistory: [],
    selectedPassages: [],
    isLoading: false,
    isIndexing: false,
    error: null,
    vectorConfig: DEFAULT_VECTOR_CONFIG
  });

  // Helper function to generate unique IDs
  const generateId = useCallback((): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Format file size helper
  const formatFileSize = useCallback((bytes: number): string => {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

  // Simulate vector search (replace with actual implementation)
  const performVectorSearch = useCallback(async (query: ResearchQuery): Promise<DocumentPassage[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results based on query
    const mockPassages: DocumentPassage[] = [
      {
        id: generateId(),
        documentId: 'doc-1',
        documentTitle: 'Smith v. Jones (2023)',
        content: `The court held that ${query.query} is a fundamental principle in contract interpretation. This precedent establishes clear guidelines for similar cases going forward.`,
        pageNumber: 15,
        startPosition: 1250,
        endPosition: 1450,
        relevanceScore: 0.92,
        metadata: {
          extractedAt: new Date().toISOString(),
          source: 'pdf',
          section: 'Analysis',
          keywords: query.query.split(' ').slice(0, 3)
        }
      },
      {
        id: generateId(),
        documentId: 'doc-2',
        documentTitle: 'Legal Research Methodology (2024)',
        content: `Research shows that ${query.query} significantly impacts legal outcomes. The methodology presented here provides a framework for understanding these implications.`,
        pageNumber: 8,
        startPosition: 850,
        endPosition: 1100,
        relevanceScore: 0.87,
        metadata: {
          extractedAt: new Date().toISOString(),
          source: 'pdf',
          section: 'Methodology',
          keywords: ['research', 'methodology', 'framework']
        }
      }
    ];

    return mockPassages.filter(passage => passage.relevanceScore >= query.minScore);
  }, [generateId]);

  // Execute a search query
  const executeQuery = useCallback(async (query: ResearchQuery): Promise<void> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentQuery: query
    }));

    try {
      const startTime = Date.now();
      const passages = await performVectorSearch(query);
      const executionTime = Date.now() - startTime;

      const results: ResearchResults = {
        query,
        passages,
        totalResults: passages.length,
        executionTime,
        searchedAt: new Date().toISOString(),
        suggestions: [
          `Try "${query.query} precedent"`,
          `Search for "${query.query} definition"`,
          `Look up "${query.query} case law"`
        ],
        relatedQueries: [
          `${query.query} analysis`,
          `${query.query} interpretation`,
          `${query.query} application`
        ]
      };

      setState(prev => ({
        ...prev,
        results,
        isLoading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false
      }));
    }
  }, [performVectorSearch]);

  // Upload and index documents
  const indexDocuments = useCallback(async (files: File[]): Promise<void> => {
    setState(prev => ({
      ...prev,
      isIndexing: true,
      error: null
    }));

    try {
      // Simulate document processing
      for (const file of files) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const document: ResearchDocument = {
          id: generateId(),
          title: file.name,
          url: URL.createObjectURL(file),
          type: file.type.includes('pdf') ? 'pdf' : 'docx',
          fileSize: file.size,
          indexedAt: new Date().toISOString(),
          status: 'indexed',
          passageCount: Math.floor(Math.random() * 50) + 10,
          metadata: {
            tags: ['uploaded', 'user-document']
          }
        };

        setState(prev => ({
          ...prev,
          documents: [...prev.documents, document]
        }));
      }

      setState(prev => ({
        ...prev,
        isIndexing: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Indexing failed',
        isIndexing: false
      }));
    }
  }, [generateId]);

  // Delete documents from index
  const deleteDocuments = useCallback(async (documentIds: string[]): Promise<void> => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => documentIds.indexOf(doc.id) === -1)
    }));
  }, []);

  // Toggle passage selection
  const togglePassageSelection = useCallback((passageId: string, selected?: boolean): void => {
    setState(prev => {
      const isSelected = selected ?? prev.selectedPassages.indexOf(passageId) === -1;
      return {
        ...prev,
        selectedPassages: isSelected
          ? [...prev.selectedPassages, passageId]
          : prev.selectedPassages.filter(id => id !== passageId)
      };
    });
  }, []);

  // Clear selections
  const clearSelection = useCallback((): void => {
    setState(prev => ({
      ...prev,
      selectedPassages: []
    }));
  }, []);

  // Save query to history
  const saveQuery = useCallback((results: ResearchResults): void => {
    setState(prev => ({
      ...prev,
      queryHistory: [results, ...prev.queryHistory.slice(0, 19)] // Keep last 20
    }));
  }, []);

  // Clear query history
  const clearHistory = useCallback((): void => {
    setState(prev => ({
      ...prev,
      queryHistory: []
    }));
  }, []);

  // Update vector store configuration
  const updateVectorConfig = useCallback((config: Partial<VectorStoreConfig>): void => {
    setState(prev => ({
      ...prev,
      vectorConfig: { ...prev.vectorConfig, ...config }
    }));
  }, []);

  // Refresh document list
  const refreshDocuments = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Auto-save successful queries to history
  useEffect(() => {
    if (state.results && state.results.passages.length > 0) {
      saveQuery(state.results);
    }
  }, [state.results, saveQuery]);

  // Computed values
  const computedValues = useMemo(() => ({
    hasResults: state.results !== null,
    hasDocuments: state.documents.length > 0,
    totalIndexedPassages: state.documents.reduce((sum, doc) => sum + doc.passageCount, 0),
    availableDocumentTypes: [...new Set(state.documents.map(doc => doc.type))],
    availableJurisdictions: [...new Set(
      state.documents
        .map(doc => doc.metadata.jurisdiction)
        .filter(Boolean) as string[]
    )]
  }), [state.documents, state.results]);

  return {
    // State
    ...state,
    ...computedValues,
    
    // Actions
    executeQuery,
    indexDocuments,
    deleteDocuments,
    togglePassageSelection,
    clearSelection,
    saveQuery,
    clearHistory,
    updateVectorConfig,
    refreshDocuments
  };
}; 