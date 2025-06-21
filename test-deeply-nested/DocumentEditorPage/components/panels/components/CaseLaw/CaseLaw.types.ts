// Component props
export interface CaseLawProps {
  // No props needed for now, but could add config or callbacks
}

// Simplified citation interface for the streamlined implementation
export interface SimpleCitation {
  id: string;
  citation: string;
  title: string;
  court: string;
  year: number;
  isVerified: boolean;
  status: SimpleCitationStatus;
}

export type SimpleCitationStatus = 'draft' | 'verified' | 'failed' | 'pending';

export interface CaseLawCitation {
  id: string;
  citation: string; // e.g., "Brown v. Board, 347 U.S. 483 (1954)"
  title: string;
  court: string;
  year: number;
  volume?: number;
  page?: number;
  reporter?: string; // e.g., "U.S.", "F.3d", "Cal.App.4th"
  status: CitationStatus;
  verification: CitationVerification;
  metadata: CaseLawMetadata;
  content: CaseContent;
  references: DocumentReference[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CitationVerification {
  isVerified: boolean;
  verificationDate?: Date;
  verificationSource?: VerificationSource;
  confidence: number; // 0-1
  issues: VerificationIssue[];
  suggestedCorrections?: string[];
}

export interface VerificationIssue {
  type: 'format' | 'accuracy' | 'completeness' | 'availability';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
}

export type VerificationSource = 
  | 'westlaw' 
  | 'lexis' 
  | 'google_scholar' 
  | 'court_listener' 
  | 'justia' 
  | 'manual';

export type CitationStatus = 
  | 'draft' 
  | 'pending_verification' 
  | 'verified' 
  | 'failed_verification' 
  | 'outdated';

export interface CaseLawMetadata {
  jurisdiction: string;
  caseType: 'civil' | 'criminal' | 'constitutional' | 'administrative' | 'other';
  importance: 'landmark' | 'precedential' | 'persuasive' | 'routine';
  subject: string[];
  judges?: string[];
  attorneys?: string[];
  docketNumber?: string;
  decisionDate?: Date;
  filedDate?: Date;
}

export interface CaseContent {
  summary?: string;
  headnotes?: string[];
  keyQuotes?: CaseQuote[];
  disposition?: string;
  procedureHistory?: string;
  legalIssues?: string[];
  holdings?: string[];
  reasoning?: string[];
}

export interface CaseQuote {
  id: string;
  text: string;
  context: string;
  page?: number;
  relevance: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface DocumentReference {
  id: string;
  citationId: string;
  documentLocation: DocumentLocation;
  context: string;
  purpose: ReferencePurpose;
  strength: ReferenceStrength;
  createdAt: Date;
}

export interface DocumentLocation {
  pageNumber?: number;
  paragraphNumber?: number;
  lineNumber?: number;
  characterOffset?: number;
  selectionStart?: number;
  selectionEnd?: number;
  sectionId?: string;
}

export type ReferencePurpose = 
  | 'support' 
  | 'distinguish' 
  | 'overrule' 
  | 'background' 
  | 'comparison' 
  | 'example';

export type ReferenceStrength = 'strong' | 'moderate' | 'weak';

// Search and filtering types
export interface CaseLawFilters {
  searchQuery?: string;
  status?: CitationStatus[];
  court?: string[];
  jurisdiction?: string[];
  yearRange?: {
    start: number;
    end: number;
  };
  importance?: ('landmark' | 'precedential' | 'persuasive' | 'routine')[];
  caseType?: ('civil' | 'criminal' | 'constitutional' | 'administrative' | 'other')[];
  verificationStatus?: boolean; // true = verified, false = unverified
  subject?: string[];
}

export type CaseLawSortField = 
  | 'citation' 
  | 'title' 
  | 'court' 
  | 'year' 
  | 'importance' 
  | 'verificationDate' 
  | 'createdAt';

export type CaseLawSortDirection = 'asc' | 'desc';

// Panel state and operations
export interface CaseLawState {
  citations: CaseLawCitation[];
  filteredCitations: CaseLawCitation[];
  filters: CaseLawFilters;
  sortField: CaseLawSortField;
  sortDirection: CaseLawSortDirection;
  selectedCitation: CaseLawCitation | null;
  isLoading: boolean;
  isVerifying: boolean;
  isSearching: boolean;
  searchResults: SearchResult[];
  verificationQueue: string[]; // citation IDs
}

export interface SearchResult {
  citation: string;
  title: string;
  court: string;
  year: number;
  url?: string;
  snippet?: string;
  source: VerificationSource;
  confidence: number;
  metadata?: Partial<CaseLawMetadata>;
}

export interface CaseLawOperations {
  // CRUD operations
  addCitation: (citation: Partial<CaseLawCitation>) => Promise<CaseLawCitation>;
  updateCitation: (id: string, data: Partial<CaseLawCitation>) => Promise<CaseLawCitation>;
  deleteCitation: (id: string) => Promise<void>;
  
  // Verification operations
  verifyCitation: (id: string, source?: VerificationSource) => Promise<CitationVerification>;
  bulkVerify: (ids: string[]) => Promise<void>;
  reVerify: (id: string) => Promise<CitationVerification>;
  
  // Search operations
  searchCaseLaw: (query: string, source?: VerificationSource) => Promise<SearchResult[]>;
  importFromSearch: (result: SearchResult) => Promise<CaseLawCitation>;
  
  // Reference operations
  addReference: (citationId: string, reference: Omit<DocumentReference, 'id' | 'citationId' | 'createdAt'>) => Promise<DocumentReference>;
  removeReference: (referenceId: string) => Promise<void>;
  
  // Filtering and sorting
  applyFilters: (filters: Partial<CaseLawFilters>) => void;
  setSorting: (field: CaseLawSortField, direction: CaseLawSortDirection) => void;
  
  // Selection
  selectCitation: (citation: CaseLawCitation | null) => void;
  
  // Utility operations
  formatCitation: (citation: Partial<CaseLawCitation>) => string;
  parseCitation: (citationString: string) => Partial<CaseLawCitation>;
  generateBluebookCitation: (citation: CaseLawCitation) => string;
}

// Form data types
export interface CitationFormData {
  citation: string;
  title?: string;
  court?: string;
  year?: number;
  volume?: number;
  page?: number;
  reporter?: string;
  metadata: Partial<CaseLawMetadata>;
  content: Partial<CaseContent>;
}

// Legal database integration types
export interface DatabaseConfig {
  source: VerificationSource;
  apiKey?: string;
  baseUrl?: string;
  rateLimit: number; // requests per minute
  enabled: boolean;
}

export interface DatabaseQuery {
  citation?: string;
  title?: string;
  court?: string;
  year?: number;
  docketNumber?: string;
  parties?: string;
  limit?: number;
}

export interface DatabaseResponse {
  results: SearchResult[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
  source: VerificationSource;
  queryTime: number; // milliseconds
} 