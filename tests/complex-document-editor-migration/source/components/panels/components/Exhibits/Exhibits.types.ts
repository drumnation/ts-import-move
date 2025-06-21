export interface ExhibitItem {
  id: string;
  label: string; // e.g., "A", "B", "C", etc.
  title: string;
  description?: string;
  fileId?: string; // Reference to asset
  fileName?: string;
  fileType?: string;
  pageNumber?: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  citations: ExhibitCitation[];
  status: ExhibitStatus;
  metadata: ExhibitMetadata;
}

export interface ExhibitCitation {
  id: string;
  exhibitId: string;
  documentLocation: DocumentLocation;
  citationText: string;
  contextBefore: string;
  contextAfter: string;
  verified: boolean;
  createdAt: Date;
}

export interface DocumentLocation {
  pageNumber?: number;
  paragraphNumber?: number;
  lineNumber?: number;
  characterOffset?: number;
  selectionStart?: number;
  selectionEnd?: number;
}

export interface ExhibitMetadata {
  author?: string;
  dateCreated?: Date;
  source?: string;
  relevance?: 'high' | 'medium' | 'low';
  category?: string;
  keywords: string[];
}

export type ExhibitStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ExhibitSortField = 'label' | 'title' | 'createdAt' | 'status' | 'relevance';

export type ExhibitSortDirection = 'asc' | 'desc';

export interface ExhibitFilters {
  status?: ExhibitStatus[];
  tags?: string[];
  relevance?: ('high' | 'medium' | 'low')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface ExhibitFormData {
  title: string;
  description: string;
  fileId?: string;
  tags: string[];
  metadata: Partial<ExhibitMetadata>;
}

// Panel state and UI types
export interface ExhibitsState {
  exhibits: ExhibitItem[];
  filteredExhibits: ExhibitItem[];
  filters: ExhibitFilters;
  sortField: ExhibitSortField;
  sortDirection: ExhibitSortDirection;
  selectedExhibit: ExhibitItem | null;
  isLoading: boolean;
  isCreating: boolean;
  isEditing: boolean;
  nextLabel: string; // Next available exhibit label
}

export interface ExhibitOperations {
  // CRUD operations
  createExhibit: (data: ExhibitFormData) => Promise<ExhibitItem>;
  updateExhibit: (id: string, data: Partial<ExhibitFormData>) => Promise<ExhibitItem>;
  deleteExhibit: (id: string) => Promise<void>;
  
  // Citation operations
  addCitation: (exhibitId: string, citation: Omit<ExhibitCitation, 'id' | 'exhibitId' | 'createdAt'>) => Promise<ExhibitCitation>;
  removeCitation: (citationId: string) => Promise<void>;
  verifyCitation: (citationId: string) => Promise<void>;
  
  // Filtering and sorting
  applyFilters: (filters: Partial<ExhibitFilters>) => void;
  setSorting: (field: ExhibitSortField, direction: ExhibitSortDirection) => void;
  
  // Selection
  selectExhibit: (exhibit: ExhibitItem | null) => void;
  
  // Label management
  getNextAvailableLabel: () => string;
  relabelExhibits: () => Promise<void>;
} 