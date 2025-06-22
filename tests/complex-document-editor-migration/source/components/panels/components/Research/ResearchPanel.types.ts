/**
 * Research Panel Types
 * @module ResearchPanel.types
 */

import { ReactNode } from 'react';
import type { LegalCase, Citation, SearchQuery, ResearchSession } from '@/tests/complex-document-editor-migration/stores/research.slice';

export interface DocumentPassage {
  /** Unique passage identifier */
  id: string;
  /** Document source ID */
  documentId: string;
  /** Document title */
  documentTitle: string;
  /** Passage text content */
  content: string;
  /** Passage summary */
  summary?: string;
  /** Page number where passage appears */
  pageNumber?: number;
  /** Character start position in document */
  startPosition: number;
  /** Character end position in document */
  endPosition: number;
  /** Relevance score (0-1) */
  relevanceScore: number;
  /** Embedding vector metadata */
  embedding?: {
    model: string;
    dimensions: number;
    similarity: number;
  };
  /** Passage metadata */
  metadata: {
    extractedAt: string;
    source: 'pdf' | 'docx' | 'txt' | 'web';
    language?: string;
    section?: string;
    keywords?: string[];
  };
}

export interface ResearchDocument {
  /** Unique document identifier */
  id: string;
  /** Document title */
  title: string;
  /** Document description */
  description?: string;
  /** File URL or path */
  url: string;
  /** Document type */
  type: 'pdf' | 'docx' | 'txt' | 'web' | 'case-law' | 'statute';
  /** File size in bytes */
  fileSize: number;
  /** Upload/index timestamp */
  indexedAt: string;
  /** Processing status */
  status: 'processing' | 'indexed' | 'error';
  /** Total passages extracted */
  passageCount: number;
  /** Document metadata */
  metadata: {
    author?: string;
    publishedAt?: string;
    jurisdiction?: string;
    court?: string;
    docketNumber?: string;
    citations?: string[];
    tags?: string[];
  };
  /** Processing error if any */
  error?: string;
}

export interface ResearchQuery {
  /** Query text */
  query: string;
  /** Maximum number of results */
  maxResults: number;
  /** Minimum relevance score threshold */
  minScore: number;
  /** Document type filters */
  documentTypes?: string[];
  /** Date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Jurisdiction filter */
  jurisdictions?: string[];
  /** Search mode */
  searchMode: 'semantic' | 'keyword' | 'hybrid';
  /** Include document metadata in results */
  includeMetadata: boolean;
}

export interface ResearchResults {
  /** Search query that generated results */
  query: ResearchQuery;
  /** Found passages */
  passages: DocumentPassage[];
  /** Total number of passages found */
  totalResults: number;
  /** Query execution time in milliseconds */
  executionTime: number;
  /** Query timestamp */
  searchedAt: string;
  /** Suggested refinements */
  suggestions?: string[];
  /** Related queries */
  relatedQueries?: string[];
}

export interface VectorStoreConfig {
  /** Vector store provider */
  provider: 'pinecone' | 'chroma' | 'weaviate' | 'local';
  /** Embedding model */
  embeddingModel: string;
  /** Vector dimensions */
  dimensions: number;
  /** Index name */
  indexName: string;
  /** API configuration */
  apiConfig?: {
    endpoint?: string;
    apiKey?: string;
    region?: string;
  };
}

export interface ResearchState {
  /** Available documents in vector store */
  documents: ResearchDocument[];
  /** Current search query */
  currentQuery: ResearchQuery | null;
  /** Search results */
  results: ResearchResults | null;
  /** Query history */
  queryHistory: ResearchResults[];
  /** Selected passages */
  selectedPassages: string[];
  /** Loading state */
  isLoading: boolean;
  /** Indexing state */
  isIndexing: boolean;
  /** Error state */
  error: string | null;
  /** Vector store configuration */
  vectorConfig: VectorStoreConfig;
}

export interface ResearchActions {
  /** Execute a search query */
  executeQuery: (query: ResearchQuery) => Promise<void>;
  /** Upload and index documents */
  indexDocuments: (files: File[]) => Promise<void>;
  /** Delete documents from index */
  deleteDocuments: (documentIds: string[]) => Promise<void>;
  /** Select/deselect passages */
  togglePassageSelection: (passageId: string, selected?: boolean) => void;
  /** Clear selections */
  clearSelection: () => void;
  /** Save query to history */
  saveQuery: (results: ResearchResults) => void;
  /** Clear query history */
  clearHistory: () => void;
  /** Update vector store configuration */
  updateVectorConfig: (config: Partial<VectorStoreConfig>) => void;
  /** Refresh document list */
  refreshDocuments: () => Promise<void>;
}

export interface PassagePreviewProps {
  /** Passage to preview */
  passage: DocumentPassage;
  /** Preview mode */
  mode: 'compact' | 'expanded';
  /** Whether passage is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: (passage: DocumentPassage) => void;
  /** Action buttons to show */
  actions?: ('use' | 'copy' | 'cite' | 'view')[];
  /** Custom styling */
  className?: string;
}

export interface QueryBuilderProps {
  /** Current query */
  query: ResearchQuery;
  /** Available document types */
  availableTypes: string[];
  /** Available jurisdictions */
  availableJurisdictions: string[];
  /** Query change handler */
  onQueryChange: (query: Partial<ResearchQuery>) => void;
  /** Search execution handler */
  onExecuteSearch: (query: ResearchQuery) => void;
  /** Whether search is in progress */
  isSearching?: boolean;
  /** Query suggestions */
  suggestions?: string[];
}

export interface DocumentIndexerProps {
  /** Upload configuration */
  uploadConfig: {
    acceptedTypes: string[];
    maxFileSize: number;
    maxFiles: number;
  };
  /** Upload handler */
  onUpload: (files: File[]) => void;
  /** Whether indexing is in progress */
  isIndexing: boolean;
  /** Indexing progress */
  indexingProgress?: number;
  /** Upload error */
  error?: string;
}

export interface ResearchHistoryProps {
  /** Query history */
  history: ResearchResults[];
  /** History item click handler */
  onHistoryClick: (results: ResearchResults) => void;
  /** Clear history handler */
  onClearHistory: () => void;
  /** Maximum items to show */
  maxItems?: number;
}

export interface PassageDragData {
  /** Passage being dragged */
  passage: DocumentPassage;
  /** Drag source */
  source: 'research-results' | 'history';
  /** Drag type */
  dragType: 'passage-insert' | 'passage-cite';
}

/**
 * Search form configuration
 */
export interface SearchFormProps {
  onSearch: (query: string) => void;
  onQuickSearch: (query: string) => void;
  onClearForm: () => void;
  isSearching: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Search filters configuration
 */
export interface SearchFiltersProps {
  jurisdiction: string[];
  court: string[];
  categories: string[];
  availableJurisdictions: string[];
  availableCourts: string[];
  availableCategories: string[];
  onJurisdictionChange: (jurisdictions: string[]) => void;
  onCourtChange: (courts: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onClearFilters: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Search results display
 */
export interface SearchResultsProps {
  results: LegalCase[];
  selectedCases: string[];
  bookmarkedCases: LegalCase[];
  onCaseSelect: (caseId: string) => void;
  onToggleSelection: (caseId: string) => void;
  onBookmark: (caseId: string) => void;
  onUnbookmark: (caseId: string) => void;
  onAddCitation: (case_: LegalCase, note?: string) => void;
  hasResults: boolean;
  isSearching: boolean;
  viewMode: 'list' | 'cards' | 'table';
  onViewModeChange: (mode: 'list' | 'cards' | 'table') => void;
  formatRelevanceScore: (score: number) => string;
  formatCaseDate: (dateStr: string) => string;
  getCaseRelevanceColor: (relevance: number) => string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Case card display
 */
export interface CaseCardProps {
  case_: LegalCase;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelect: () => void;
  onToggleSelection: () => void;
  onBookmark: () => void;
  onUnbookmark: () => void;
  onAddCitation: (note?: string) => void;
  formatRelevanceScore: (score: number) => string;
  formatCaseDate: (dateStr: string) => string;
  getCaseRelevanceColor: (relevance: number) => string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'list' | 'compact';
}

/**
 * Search history management
 */
export interface SearchHistoryProps {
  history: SearchQuery[];
  onRerunSearch: (query: SearchQuery) => void;
  onClearHistory: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Citation management
 */
export interface CitationManagerProps {
  citations: Citation[];
  onRemoveCitation: (citationId: string) => void;
  onToggleBookmark: (citationId: string) => void;
  onUpdateNotes: (citationId: string, notes: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Research session management
 */
export interface SessionManagerProps {
  sessions: ResearchSession[];
  currentSession: ResearchSession | null;
  onCreateSession: (name: string, description?: string) => void;
  onSetCurrentSession: (sessionId: string | null) => void;
  onUpdateSessionNotes: (sessionId: string, notes: string) => void;
  onDeleteSession: (sessionId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Quick actions bar
 */
export interface QuickActionsProps {
  hasSelection: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onBookmarkSelected: () => void;
  onExportCitations: () => void;
  onClearResults: () => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Main research panel props (shared across platforms)
 */
export interface BaseResearchPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Desktop-specific research panel props
 */
export interface DesktopResearchPanelProps extends BaseResearchPanelProps {
  sidebarWidth?: number;
  onSidebarResize?: (width: number) => void;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  splitRatio?: number;
  onSplitRatioChange?: (ratio: number) => void;
}

/**
 * Mobile-specific research panel props
 */
export interface MobileResearchPanelProps extends BaseResearchPanelProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showFilterDrawer?: boolean;
  onToggleFilterDrawer?: () => void;
  activeTab?: 'search' | 'results' | 'history' | 'citations';
  onTabChange?: (tab: 'search' | 'results' | 'history' | 'citations') => void;
}

/**
 * Research panel layout configuration
 */
export interface ResearchPanelLayout {
  desktop: {
    searchColumn: {
      width: string;
      minWidth: number;
      maxWidth: number;
    };
    resultsColumn: {
      width: string;
      minWidth: number;
    };
    filtersPanel: {
      height: string;
      collapsible: boolean;
    };
  };
  mobile: {
    tabHeight: number;
    headerHeight: number;
    filterDrawerHeight: string;
    searchFormSpacing: string;
  };
}

/**
 * Research panel state interface
 */
export interface ResearchPanelState {
  // Search state
  query: string;
  filters: {
    jurisdiction: string[];
    court: string[];
    categories: string[];
  };
  
  // View state
  activeTab: 'search' | 'results' | 'history' | 'citations';
  viewMode: 'list' | 'cards' | 'table';
  showFilters: boolean;
  showSidebar: boolean;
  
  // Selection state
  selectedCases: string[];
  expandedCases: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

/**
 * Research panel context for sharing state between components
 */
export interface ResearchPanelContextValue {
  state: ResearchPanelState;
  actions: {
    setQuery: (query: string) => void;
    setFilters: (filters: Partial<ResearchPanelState['filters']>) => void;
    setActiveTab: (tab: ResearchPanelState['activeTab']) => void;
    setViewMode: (mode: ResearchPanelState['viewMode']) => void;
    toggleFilters: () => void;
    toggleSidebar: () => void;
    toggleCaseSelection: (caseId: string) => void;
    toggleCaseExpansion: (caseId: string) => void;
    clearSelection: () => void;
    setError: (error: string | null) => void;
  };
}

/**
 * Platform detection props
 */
export interface PlatformProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Responsive breakpoint configuration
 */
export interface ResearchPanelBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

/**
 * Component size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Component variant types
 */
export type ComponentVariant = 'default' | 'compact' | 'expanded';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  stagger: number;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  announceSearchResults: boolean;
  announceSelectionChanges: boolean;
  keyboardShortcuts: boolean;
  highContrastMode: boolean;
}

/**
 * Export all types for external use
 */
export type {
  LegalCase,
  Citation,
  SearchQuery,
  ResearchSession,
} from '@/tests/complex-document-editor-migration/stores/research.slice'; 