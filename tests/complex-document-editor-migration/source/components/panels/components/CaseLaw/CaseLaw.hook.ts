import { useState, useCallback, useMemo } from 'react';
import {
  CaseLawCitation,
  CaseLawState,
  CaseLawOperations,
  CaseLawFilters,
  CaseLawSortField,
  CaseLawSortDirection,
  CitationVerification,
  SearchResult,
  DocumentReference,
  VerificationSource,
  CitationStatus,
  VerificationIssue
} from '@/tests/complex-document-editor-migration/source/components/panels/components/CaseLaw/CaseLaw.types';

// Helper functions (pure)
const filterCitations = (citations: CaseLawCitation[], filters: CaseLawFilters): CaseLawCitation[] => {
  return citations.filter(citation => {
    // Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        citation.citation,
        citation.title,
        citation.court,
        citation.metadata.jurisdiction,
        ...citation.metadata.subject,
        citation.content.summary || ''
      ].join(' ').toLowerCase();
      
      if (searchableText.indexOf(query) === -1) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (filters.status.indexOf(citation.status) === -1) {
        return false;
      }
    }
    
    // Court filter
    if (filters.court && filters.court.length > 0) {
      if (filters.court.indexOf(citation.court) === -1) {
        return false;
      }
    }
    
    // Jurisdiction filter
    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      if (filters.jurisdiction.indexOf(citation.metadata.jurisdiction) === -1) {
        return false;
      }
    }
    
    // Year range filter
    if (filters.yearRange) {
      if (citation.year < filters.yearRange.start || citation.year > filters.yearRange.end) {
        return false;
      }
    }
    
    // Importance filter
    if (filters.importance && filters.importance.length > 0) {
      if (filters.importance.indexOf(citation.metadata.importance) === -1) {
        return false;
      }
    }
    
    // Case type filter
    if (filters.caseType && filters.caseType.length > 0) {
      if (filters.caseType.indexOf(citation.metadata.caseType) === -1) {
        return false;
      }
    }
    
    // Verification status filter
    if (filters.verificationStatus !== undefined) {
      if (citation.verification.isVerified !== filters.verificationStatus) {
        return false;
      }
    }
    
    // Subject filter
    if (filters.subject && filters.subject.length > 0) {
      const hasMatchingSubject = filters.subject.some(subject => 
        citation.metadata.subject.indexOf(subject) !== -1
      );
      if (!hasMatchingSubject) {
        return false;
      }
    }
    
    return true;
  });
};

const sortCitations = (citations: CaseLawCitation[], field: CaseLawSortField, direction: CaseLawSortDirection): CaseLawCitation[] => {
  return [...citations].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;
    
    switch (field) {
    case 'citation':
      aValue = a.citation.toLowerCase();
      bValue = b.citation.toLowerCase();
      break;
    case 'title':
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
      break;
    case 'court':
      aValue = a.court.toLowerCase();
      bValue = b.court.toLowerCase();
      break;
    case 'year':
      aValue = a.year;
      bValue = b.year;
      break;
    case 'importance':
      const importanceOrder = { 'landmark': 4, 'precedential': 3, 'persuasive': 2, 'routine': 1 };
      aValue = importanceOrder[a.metadata.importance];
      bValue = importanceOrder[b.metadata.importance];
      break;
    case 'verificationDate':
      aValue = a.verification.verificationDate?.getTime() || 0;
      bValue = b.verification.verificationDate?.getTime() || 0;
      break;
    case 'createdAt':
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
      break;
    default:
      aValue = a.citation.toLowerCase();
      bValue = b.citation.toLowerCase();
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

// Citation formatting utilities
const formatCitation = (citation: Partial<CaseLawCitation>): string => {
  if (citation.citation) return citation.citation;
  
  const parts: string[] = [];
  if (citation.title) parts.push(citation.title);
  if (citation.volume && citation.reporter && citation.page) {
    parts.push(`${citation.volume} ${citation.reporter} ${citation.page}`);
  }
  if (citation.court && citation.year) {
    parts.push(`(${citation.court} ${citation.year})`);
  }
  
  return parts.join(', ') || 'Untitled Citation';
};

const parseCitation = (citationString: string): Partial<CaseLawCitation> => {
  // Simple parser - could be enhanced with more sophisticated regex
  const yearMatch = citationString.match(/\(.*?(\d{4})\)/);
  const volumeMatch = citationString.match(/(\d+)\s+([A-Za-z.]+)\s+(\d+)/);
  
  const parsed: Partial<CaseLawCitation> = {
    citation: citationString
  };
  
  if (yearMatch) {
    parsed.year = parseInt(yearMatch[1], 10);
  }
  
  if (volumeMatch) {
    parsed.volume = parseInt(volumeMatch[1], 10);
    parsed.reporter = volumeMatch[2];
    parsed.page = parseInt(volumeMatch[3], 10);
  }
  
  // Extract title (text before first comma or volume)
  const titleMatch = citationString.match(/^([^,]+)(?:,|$)/);
  if (titleMatch) {
    parsed.title = titleMatch[1].trim();
  }
  
  return parsed;
};

// Mock data generator
const generateMockCitations = (): CaseLawCitation[] => [
  {
    id: 'citation-1',
    citation: 'Brown v. Board of Education, 347 U.S. 483 (1954)',
    title: 'Brown v. Board of Education',
    court: 'Supreme Court',
    year: 1954,
    volume: 347,
    page: 483,
    reporter: 'U.S.',
    status: 'verified',
    verification: {
      isVerified: true,
      verificationDate: new Date(2024, 0, 15),
      verificationSource: 'court_listener',
      confidence: 0.98,
      issues: [],
      suggestedCorrections: []
    },
    metadata: {
      jurisdiction: 'Federal',
      caseType: 'constitutional',
      importance: 'landmark',
      subject: ['Education', 'Civil Rights', 'Equal Protection'],
      docketNumber: 'No. 1',
      decisionDate: new Date(1954, 4, 17)
    },
    content: {
      summary: 'Landmark case declaring racial segregation in public schools unconstitutional.',
      headnotes: [
        'Separate educational facilities are inherently unequal',
        'Equal protection clause applies to public education'
      ],
      keyQuotes: [{
        id: 'quote-1',
        text: 'Separate educational facilities are inherently unequal.',
        context: 'Constitutional analysis of segregation',
        relevance: 'high',
        tags: ['equal protection', 'segregation']
      }],
      holdings: ['Racial segregation in public schools violates Equal Protection Clause']
    },
    references: [],
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 0, 15)
  },
  {
    id: 'citation-2',
    citation: 'Miranda v. Arizona, 384 U.S. 436 (1966)',
    title: 'Miranda v. Arizona',
    court: 'Supreme Court',
    year: 1966,
    volume: 384,
    page: 436,
    reporter: 'U.S.',
    status: 'pending_verification',
    verification: {
      isVerified: false,
      confidence: 0.85,
      issues: [{
        type: 'completeness',
        severity: 'medium',
        message: 'Page citation needs verification',
        suggestion: 'Check original reporter for exact page number'
      }],
      suggestedCorrections: []
    },
    metadata: {
      jurisdiction: 'Federal',
      caseType: 'criminal',
      importance: 'landmark',
      subject: ['Criminal Procedure', 'Fifth Amendment', 'Self-Incrimination'],
      docketNumber: 'No. 759',
      decisionDate: new Date(1966, 5, 13)
    },
    content: {
      summary: 'Established requirement for police to inform suspects of their rights.',
      headnotes: [
        'Suspects must be informed of right to remain silent',
        'Suspects must be informed of right to counsel'
      ],
      keyQuotes: [{
        id: 'quote-2',
        text: 'You have the right to remain silent.',
        context: 'Miranda warning requirements',
        relevance: 'high',
        tags: ['miranda rights', 'fifth amendment']
      }]
    },
    references: [],
    createdAt: new Date(2024, 0, 12),
    updatedAt: new Date(2024, 0, 12)
  }
];

// Mock search function
const mockSearchCaseLaw = async (query: string, source: VerificationSource = 'court_listener'): Promise<SearchResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockResults: SearchResult[] = [
    {
      citation: 'Roe v. Wade, 410 U.S. 113 (1973)',
      title: 'Roe v. Wade',
      court: 'Supreme Court',
      year: 1973,
      url: 'https://scholar.google.com/case1',
      snippet: 'Constitutional right to privacy includes reproductive decisions...',
      source,
      confidence: 0.95,
      metadata: {
        jurisdiction: 'Federal',
        caseType: 'constitutional',
        importance: 'landmark',
        subject: ['Privacy', 'Reproductive Rights', 'Due Process']
      }
    },
    {
      citation: 'Marbury v. Madison, 5 U.S. 137 (1803)',
      title: 'Marbury v. Madison',
      court: 'Supreme Court',
      year: 1803,
      url: 'https://scholar.google.com/case2',
      snippet: 'Establishes principle of judicial review...',
      source,
      confidence: 0.97,
      metadata: {
        jurisdiction: 'Federal',
        caseType: 'constitutional',
        importance: 'landmark',
        subject: ['Judicial Review', 'Separation of Powers']
      }
    }
  ];
  
  return mockResults.filter(result => 
    result.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
    result.citation.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
};

export const useCaseLaw = (): CaseLawState & CaseLawOperations => {
  // Core state
  const [citations, setCitations] = useState<CaseLawCitation[]>(generateMockCitations());
  const [filters, setFilters] = useState<CaseLawFilters>({});
  const [sortField, setSortField] = useState<CaseLawSortField>('year');
  const [sortDirection, setSortDirection] = useState<CaseLawSortDirection>('desc');
  const [selectedCitation, setSelectedCitation] = useState<CaseLawCitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [verificationQueue, setVerificationQueue] = useState<string[]>([]);

  // Derived state
  const filteredCitations = useMemo(() => {
    const filtered = filterCitations(citations, filters);
    return sortCitations(filtered, sortField, sortDirection);
  }, [citations, filters, sortField, sortDirection]);

  // CRUD operations
  const addCitation = useCallback(async (citationData: Partial<CaseLawCitation>): Promise<CaseLawCitation> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCitation: CaseLawCitation = {
        id: `citation-${Date.now()}`,
        citation: citationData.citation || '',
        title: citationData.title || 'Untitled Case',
        court: citationData.court || 'Unknown Court',
        year: citationData.year || new Date().getFullYear(),
        volume: citationData.volume,
        page: citationData.page,
        reporter: citationData.reporter,
        status: 'draft',
        verification: {
          isVerified: false,
          confidence: 0,
          issues: []
        },
        metadata: {
          jurisdiction: 'Unknown',
          caseType: 'other',
          importance: 'routine',
          subject: [],
          ...citationData.metadata
        },
        content: {
          summary: '',
          headnotes: [],
          keyQuotes: [],
          ...citationData.content
        },
        references: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCitations(prev => [...prev, newCitation]);
      return newCitation;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCitation = useCallback(async (id: string, data: Partial<CaseLawCitation>): Promise<CaseLawCitation> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCitations = citations.map(citation => {
        if (citation.id === id) {
          return {
            ...citation,
            ...data,
            updatedAt: new Date()
          };
        }
        return citation;
      });
      
      setCitations(updatedCitations);
      const updatedCitation = updatedCitations.find(c => c.id === id)!;
      
      if (selectedCitation && selectedCitation.id === id) {
        setSelectedCitation(updatedCitation);
      }
      
      return updatedCitation;
    } finally {
      setIsLoading(false);
    }
  }, [citations, selectedCitation]);

  const deleteCitation = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCitations(prev => prev.filter(citation => citation.id !== id));
      
      if (selectedCitation && selectedCitation.id === id) {
        setSelectedCitation(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCitation]);

  // Verification operations
  const verifyCitation = useCallback(async (id: string, source: VerificationSource = 'court_listener'): Promise<CitationVerification> => {
    setIsVerifying(true);
    setVerificationQueue(prev => [...prev, id]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const verification: CitationVerification = {
        isVerified: Math.random() > 0.3, // 70% success rate
        verificationDate: new Date(),
        verificationSource: source,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        issues: Math.random() > 0.8 ? [{
          type: 'format',
          severity: 'low',
          message: 'Citation format could be improved',
          suggestion: 'Consider using Bluebook format'
        }] : [],
        suggestedCorrections: []
      };
      
      setCitations(prev => prev.map(citation => {
        if (citation.id === id) {
          return {
            ...citation,
            verification,
            status: verification.isVerified ? 'verified' : 'failed_verification',
            updatedAt: new Date()
          };
        }
        return citation;
      }));
      
      return verification;
    } finally {
      setIsVerifying(false);
      setVerificationQueue(prev => prev.filter(qId => qId !== id));
    }
  }, []);

  const bulkVerify = useCallback(async (ids: string[]): Promise<void> => {
    for (const id of ids) {
      await verifyCitation(id);
    }
  }, [verifyCitation]);

  const reVerify = useCallback(async (id: string): Promise<CitationVerification> => {
    return verifyCitation(id);
  }, [verifyCitation]);

  // Search operations
  const searchCaseLaw = useCallback(async (query: string, source: VerificationSource = 'court_listener'): Promise<SearchResult[]> => {
    setIsSearching(true);
    
    try {
      const results = await mockSearchCaseLaw(query, source);
      setSearchResults(results);
      return results;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const importFromSearch = useCallback(async (result: SearchResult): Promise<CaseLawCitation> => {
    const citationData: Partial<CaseLawCitation> = {
      citation: result.citation,
      title: result.title,
      court: result.court,
      year: result.year,
      metadata: result.metadata
    };
    
    return addCitation(citationData);
  }, [addCitation]);

  // Reference operations
  const addReference = useCallback(async (
    citationId: string, 
    reference: Omit<DocumentReference, 'id' | 'citationId' | 'createdAt'>
  ): Promise<DocumentReference> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newReference: DocumentReference = {
      id: `ref-${Date.now()}`,
      citationId,
      createdAt: new Date(),
      ...reference
    };
    
    setCitations(prev => prev.map(citation => {
      if (citation.id === citationId) {
        return {
          ...citation,
          references: [...citation.references, newReference],
          updatedAt: new Date()
        };
      }
      return citation;
    }));
    
    return newReference;
  }, []);

  const removeReference = useCallback(async (referenceId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCitations(prev => prev.map(citation => ({
      ...citation,
      references: citation.references.filter(ref => ref.id !== referenceId),
      updatedAt: new Date()
    })));
  }, []);

  // Filtering and sorting
  const applyFilters = useCallback((newFilters: Partial<CaseLawFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setSorting = useCallback((field: CaseLawSortField, direction: CaseLawSortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  // Selection
  const selectCitation = useCallback((citation: CaseLawCitation | null) => {
    setSelectedCitation(citation);
  }, []);

  // Utility operations
  const generateBluebookCitation = useCallback((citation: CaseLawCitation): string => {
    // Simplified Bluebook format
    const parts: string[] = [];
    
    if (citation.title) {
      parts.push(citation.title);
    }
    
    if (citation.volume && citation.reporter && citation.page) {
      parts.push(`${citation.volume} ${citation.reporter} ${citation.page}`);
    }
    
    if (citation.court && citation.year) {
      parts.push(`(${citation.court} ${citation.year})`);
    }
    
    return parts.join(', ');
  }, []);

  return {
    // State
    citations,
    filteredCitations,
    filters,
    sortField,
    sortDirection,
    selectedCitation,
    isLoading,
    isVerifying,
    isSearching,
    searchResults,
    verificationQueue,
    
    // Operations
    addCitation,
    updateCitation,
    deleteCitation,
    verifyCitation,
    bulkVerify,
    reVerify,
    searchCaseLaw,
    importFromSearch,
    addReference,
    removeReference,
    applyFilters,
    setSorting,
    selectCitation,
    formatCitation,
    parseCitation,
    generateBluebookCitation
  };
}; 