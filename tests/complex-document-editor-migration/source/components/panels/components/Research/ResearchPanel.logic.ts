import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../hooks/store.hooks';
import {
  performSearch,
  addCitation,
  removeCitation,
  toggleCitationBookmark,
  createSession,
  setCurrentSession,
  updateSessionNotes,
  deleteSession,
  clearSearchResults,
  toggleCaseSelection,
  bookmarkCase,
  unbookmarkCase,
  clearAllFilters,
  setViewMode,
  setSortBy,
  setSortOrder,
  setSelectedCase,
} from '../../../../../stores/research.slice';
import type { 
  LegalCase, 
  Citation, 
  SearchQuery,
  ResearchSession,
} from '../../../../../stores/research.slice';

/**
 * Research Panel Query Form State
 */
export interface ResearchQueryForm {
  query: string;
  jurisdiction: string[];
  court: string[];
  categories: string[];
}

/**
 * Shared research panel logic hook
 */
export const useResearchPanelLogic = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const researchState = useAppSelector((state) => state.research);
  const currentSession = useAppSelector((state) => 
    state.research.sessions.find(s => s.id === state.research.currentSession)
  );
  
  // Local form state
  const [queryForm, setQueryForm] = useState<ResearchQueryForm>({
    query: '',
    jurisdiction: [],
    court: [],
    categories: [],
  });

  // Available filter options from current results
  const availableJurisdictions = useMemo(() => {
    const jurisdictions = new Set<string>();
    researchState.searchResults.forEach(case_ => {
      if (case_.court) jurisdictions.add(case_.court);
    });
    return Array.from(jurisdictions).sort();
  }, [researchState.searchResults]);

  const availableCourts = useMemo(() => {
    const courts = new Set<string>();
    researchState.searchResults.forEach(case_ => {
      if (case_.court) courts.add(case_.court);
    });
    return Array.from(courts).sort();
  }, [researchState.searchResults]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    researchState.searchResults.forEach(case_ => {
      case_.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [researchState.searchResults]);

  // Form handlers
  const handleQueryFormChange = useCallback(<K extends keyof ResearchQueryForm>(
    field: K,
    value: ResearchQueryForm[K]
  ) => {
    setQueryForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClearForm = useCallback(() => {
    setQueryForm({
      query: '',
      jurisdiction: [],
      court: [],
      categories: [],
    });
  }, []);

  // Search operations
  const handleSearch = useCallback(async () => {
    if (!queryForm.query.trim()) return;

    const searchParams = {
      query: queryForm.query,
      filters: {
        jurisdiction: queryForm.jurisdiction.length > 0 ? queryForm.jurisdiction : undefined,
        court: queryForm.court.length > 0 ? queryForm.court : undefined,
        categories: queryForm.categories.length > 0 ? queryForm.categories : undefined,
      }
    };

    dispatch(performSearch(searchParams));
  }, [dispatch, queryForm]);

  const handleQuickSearch = useCallback((query: string) => {
    setQueryForm(prev => ({ ...prev, query }));
    
    const searchParams = {
      query,
      filters: {}
    };

    dispatch(performSearch(searchParams));
  }, [dispatch]);

  // Case management
  const handleToggleCaseSelection = useCallback((caseId: string) => {
    dispatch(toggleCaseSelection(caseId));
  }, [dispatch]);

  const handleBookmarkCase = useCallback((caseId: string) => {
    dispatch(bookmarkCase(caseId));
  }, [dispatch]);

  const handleUnbookmarkCase = useCallback((caseId: string) => {
    dispatch(unbookmarkCase(caseId));
  }, [dispatch]);

  const handleSelectCase = useCallback((caseId: string | null) => {
    dispatch(setSelectedCase(caseId));
  }, [dispatch]);

  // Citation management
  const handleAddCitation = useCallback((case_: LegalCase, note?: string) => {
    const citation: Citation = {
      id: `citation_${Date.now()}`,
      text: case_.citation,
      caseId: case_.id,
      pageNumber: undefined,
      addedAt: new Date().toISOString(),
      notes: note,
      isBookmarked: false,
    };

    dispatch(addCitation(citation));
  }, [dispatch]);

  const handleRemoveCitation = useCallback((citationId: string) => {
    dispatch(removeCitation(citationId));
  }, [dispatch]);

  const handleToggleCitationBookmark = useCallback((citationId: string) => {
    dispatch(toggleCitationBookmark(citationId));
  }, [dispatch]);

  // Session management
  const handleCreateSession = useCallback((name: string, description?: string) => {
    dispatch(createSession({ name, description }));
  }, [dispatch]);

  const handleSetCurrentSession = useCallback((sessionId: string | null) => {
    dispatch(setCurrentSession(sessionId));
  }, [dispatch]);

  const handleUpdateSessionNotes = useCallback((sessionId: string, notes: string) => {
    dispatch(updateSessionNotes({ sessionId, notes }));
  }, [dispatch]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    dispatch(deleteSession(sessionId));
  }, [dispatch]);

  // Filter and view management
  const handleClearFilters = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  const handleSetViewMode = useCallback((viewMode: 'list' | 'cards' | 'table') => {
    dispatch(setViewMode(viewMode));
  }, [dispatch]);

  const handleSetSorting = useCallback((sortBy: 'relevance' | 'date' | 'court' | 'title', sortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy(sortBy));
    dispatch(setSortOrder(sortOrder));
  }, [dispatch]);

  const handleClearResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  // Utility functions
  const formatRelevanceScore = useCallback((score: number): string => {
    return `${Math.round(score * 100)}%`;
  }, []);

  const formatCaseDate = useCallback((dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString();
  }, []);

  const getCaseRelevanceColor = useCallback((relevance: number): string => {
    if (relevance >= 0.8) return 'green';
    if (relevance >= 0.6) return 'yellow';
    return 'red';
  }, []);

  // Computed properties
  const hasResults = useMemo(() => {
    return researchState.searchResults.length > 0;
  }, [researchState.searchResults.length]);

  const selectedCases = useMemo(() => {
    return researchState.selectedCases;
  }, [researchState.selectedCases]);

  const hasSelection = useMemo(() => {
    return researchState.selectedCases.length > 0;
  }, [researchState.selectedCases.length]);

  const isSearching = useMemo(() => {
    return researchState.isSearching;
  }, [researchState.isSearching]);

  const searchHistory = useMemo(() => {
    return researchState.searchHistory.slice().reverse(); // Most recent first
  }, [researchState.searchHistory]);

  const citations = useMemo(() => {
    return researchState.citations;
  }, [researchState.citations]);

  const bookmarkedCases = useMemo(() => {
    return researchState.bookmarkedCases;
  }, [researchState.bookmarkedCases]);

  return {
    // State
    researchState,
    currentSession,
    queryForm,
    hasResults,
    selectedCases,
    hasSelection,
    isSearching,
    searchHistory,
    citations,
    bookmarkedCases,
    
    // Filter options
    availableJurisdictions,
    availableCourts,
    availableCategories,
    
    // Form handlers
    handleQueryFormChange,
    handleClearForm,
    
    // Search operations
    handleSearch,
    handleQuickSearch,
    
    // Case management
    handleToggleCaseSelection,
    handleBookmarkCase,
    handleUnbookmarkCase,
    handleSelectCase,
    
    // Citation management
    handleAddCitation,
    handleRemoveCitation,
    handleToggleCitationBookmark,
    
    // Session management
    handleCreateSession,
    handleSetCurrentSession,
    handleUpdateSessionNotes,
    handleDeleteSession,
    
    // Filter and view management
    handleClearFilters,
    handleSetViewMode,
    handleSetSorting,
    handleClearResults,
    
    // Utilities
    formatRelevanceScore,
    formatCaseDate,
    getCaseRelevanceColor,
  };
}; 