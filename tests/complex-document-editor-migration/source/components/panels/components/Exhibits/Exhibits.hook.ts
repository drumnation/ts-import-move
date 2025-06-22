import { useState, useCallback, useMemo } from 'react';
import { 
  ExhibitItem, 
  ExhibitsState, 
  ExhibitOperations, 
  ExhibitFormData, 
  ExhibitFilters,
  ExhibitSortField,
  ExhibitSortDirection,
  ExhibitCitation,
  DocumentLocation
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/Exhibits.types';

// Helper functions (pure)
const generateExhibitLabel = (existingLabels: string[]): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let index = 0;
  
  while (index < alphabet.length) {
    const label = alphabet[index];
    if (existingLabels.indexOf(label) === -1) {
      return label;
    }
    index++;
  }
  
  // If we run out of single letters, use double letters
  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const label = alphabet[i] + alphabet[j];
      if (existingLabels.indexOf(label) === -1) {
        return label;
      }
    }
  }
  
  return 'Z1'; // Fallback
};

const filterExhibits = (exhibits: ExhibitItem[], filters: ExhibitFilters): ExhibitItem[] => {
  return exhibits.filter(exhibit => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (filters.status.indexOf(exhibit.status) === -1) {
        return false;
      }
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        exhibit.tags.indexOf(tag) !== -1
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    // Relevance filter
    if (filters.relevance && filters.relevance.length > 0) {
      if (!exhibit.metadata.relevance || filters.relevance.indexOf(exhibit.metadata.relevance) === -1) {
        return false;
      }
    }
    
    // Date range filter
    if (filters.dateRange) {
      const exhibitDate = new Date(exhibit.createdAt);
      if (exhibitDate < filters.dateRange.start || exhibitDate > filters.dateRange.end) {
        return false;
      }
    }
    
    // Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        exhibit.title,
        exhibit.description || '',
        exhibit.label,
        ...exhibit.tags,
        ...exhibit.metadata.keywords
      ].join(' ').toLowerCase();
      
      if (searchableText.indexOf(query) === -1) {
        return false;
      }
    }
    
    return true;
  });
};

const sortExhibits = (exhibits: ExhibitItem[], field: ExhibitSortField, direction: ExhibitSortDirection): ExhibitItem[] => {
  return [...exhibits].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;
    
    switch (field) {
    case 'label':
      aValue = a.label;
      bValue = b.label;
      break;
    case 'title':
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
      break;
    case 'createdAt':
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
      break;
    case 'status':
      aValue = a.status;
      bValue = b.status;
      break;
    case 'relevance':
      const relevanceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      aValue = relevanceOrder[a.metadata.relevance || 'low'];
      bValue = relevanceOrder[b.metadata.relevance || 'low'];
      break;
    default:
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
    }
    
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Mock data generator
const generateMockExhibits = (): ExhibitItem[] => [
  {
    id: 'exhibit-1',
    label: 'A',
    title: 'Contract Agreement',
    description: 'Original signed contract between parties',
    fileId: 'file-1',
    fileName: 'contract.pdf',
    fileType: 'pdf',
    pageNumber: 1,
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15),
    tags: ['contract', 'agreement', 'primary'],
    citations: [],
    status: 'approved',
    metadata: {
      author: 'Legal Dept',
      dateCreated: new Date(2024, 0, 10),
      source: 'Client Files',
      relevance: 'high',
      category: 'Contract',
      keywords: ['agreement', 'signature', 'terms']
    }
  },
  {
    id: 'exhibit-2',
    label: 'B',
    title: 'Email Correspondence',
    description: 'Email chain regarding contract modifications',
    fileId: 'file-2',
    fileName: 'emails.pdf',
    fileType: 'pdf',
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 0, 20),
    tags: ['email', 'correspondence', 'secondary'],
    citations: [],
    status: 'pending',
    metadata: {
      author: 'Client',
      dateCreated: new Date(2024, 0, 18),
      source: 'Email Archive',
      relevance: 'medium',
      category: 'Communication',
      keywords: ['email', 'modification', 'clarification']
    }
  }
];

export const useExhibits = (): ExhibitsState & ExhibitOperations => {
  // Core state
  const [exhibits, setExhibits] = useState<ExhibitItem[]>(generateMockExhibits());
  const [filters, setFilters] = useState<ExhibitFilters>({});
  const [sortField, setSortField] = useState<ExhibitSortField>('label');
  const [sortDirection, setSortDirection] = useState<ExhibitSortDirection>('asc');
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Derived state
  const filteredExhibits = useMemo(() => {
    const filtered = filterExhibits(exhibits, filters);
    return sortExhibits(filtered, sortField, sortDirection);
  }, [exhibits, filters, sortField, sortDirection]);

  const nextLabel = useMemo(() => {
    const existingLabels = exhibits.map(exhibit => exhibit.label);
    return generateExhibitLabel(existingLabels);
  }, [exhibits]);

  // CRUD operations
  const createExhibit = useCallback(async (data: ExhibitFormData): Promise<ExhibitItem> => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExhibit: ExhibitItem = {
        id: `exhibit-${Date.now()}`,
        label: generateExhibitLabel(exhibits.map(e => e.label)),
        title: data.title,
        description: data.description,
        fileId: data.fileId,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: data.tags,
        citations: [],
        status: 'draft',
        metadata: {
          relevance: 'medium',
          keywords: [],
          ...data.metadata
        }
      };
      
      setExhibits(prev => [...prev, newExhibit]);
      return newExhibit;
    } finally {
      setIsCreating(false);
    }
  }, [exhibits]);

  const updateExhibit = useCallback(async (id: string, data: Partial<ExhibitFormData>): Promise<ExhibitItem> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedExhibits = exhibits.map(exhibit => {
        if (exhibit.id === id) {
          return {
            ...exhibit,
            ...data,
            updatedAt: new Date(),
            metadata: {
              ...exhibit.metadata,
              ...data.metadata
            }
          };
        }
        return exhibit;
      });
      
      setExhibits(updatedExhibits);
      const updatedExhibit = updatedExhibits.find(e => e.id === id)!;
      
      if (selectedExhibit && selectedExhibit.id === id) {
        setSelectedExhibit(updatedExhibit);
      }
      
      return updatedExhibit;
    } finally {
      setIsLoading(false);
    }
  }, [exhibits, selectedExhibit]);

  const deleteExhibit = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExhibits(prev => prev.filter(exhibit => exhibit.id !== id));
      
      if (selectedExhibit && selectedExhibit.id === id) {
        setSelectedExhibit(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedExhibit]);

  // Citation operations
  const addCitation = useCallback(async (
    exhibitId: string, 
    citation: Omit<ExhibitCitation, 'id' | 'exhibitId' | 'createdAt'>
  ): Promise<ExhibitCitation> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCitation: ExhibitCitation = {
      id: `citation-${Date.now()}`,
      exhibitId,
      createdAt: new Date(),
      ...citation
    };
    
    setExhibits(prev => prev.map(exhibit => {
      if (exhibit.id === exhibitId) {
        return {
          ...exhibit,
          citations: [...exhibit.citations, newCitation],
          updatedAt: new Date()
        };
      }
      return exhibit;
    }));
    
    return newCitation;
  }, []);

  const removeCitation = useCallback(async (citationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setExhibits(prev => prev.map(exhibit => ({
      ...exhibit,
      citations: exhibit.citations.filter(citation => citation.id !== citationId),
      updatedAt: new Date()
    })));
  }, []);

  const verifyCitation = useCallback(async (citationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setExhibits(prev => prev.map(exhibit => ({
      ...exhibit,
      citations: exhibit.citations.map(citation => 
        citation.id === citationId 
          ? { ...citation, verified: true }
          : citation
      ),
      updatedAt: new Date()
    })));
  }, []);

  // Filtering and sorting
  const applyFilters = useCallback((newFilters: Partial<ExhibitFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setSorting = useCallback((field: ExhibitSortField, direction: ExhibitSortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  // Selection
  const selectExhibit = useCallback((exhibit: ExhibitItem | null) => {
    setSelectedExhibit(exhibit);
  }, []);

  // Label management
  const getNextAvailableLabel = useCallback(() => {
    return generateExhibitLabel(exhibits.map(e => e.label));
  }, [exhibits]);

  const relabelExhibits = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sort exhibits by creation date and reassign sequential labels
      const sortedExhibits = [...exhibits].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const relabeledExhibits = sortedExhibits.map((exhibit, index) => ({
        ...exhibit,
        label: alphabet[index] || `Z${index - 25}`,
        updatedAt: new Date()
      }));
      
      setExhibits(relabeledExhibits);
    } finally {
      setIsLoading(false);
    }
  }, [exhibits]);

  return {
    // State
    exhibits,
    filteredExhibits,
    filters,
    sortField,
    sortDirection,
    selectedExhibit,
    isLoading,
    isCreating,
    isEditing,
    nextLabel,
    
    // Operations
    createExhibit,
    updateExhibit,
    deleteExhibit,
    addCitation,
    removeCitation,
    verifyCitation,
    applyFilters,
    setSorting,
    selectExhibit,
    getNextAvailableLabel,
    relabelExhibits
  };
}; 