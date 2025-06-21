import { ExhibitItem, ExhibitFormData, ExhibitFilters, ExhibitSortField, ExhibitSortDirection } from './Exhibits.types';

/**
 * Props for ExhibitsPanel component
 */
export interface ExhibitsPanelProps {
  /**
   * Custom class name for styling
   */
  className?: string;
  
  /**
   * Whether the panel is in read-only mode
   */
  readOnly?: boolean;
  
  /**
   * Maximum height for the panel content
   */
  maxHeight?: string | number;
  
  /**
   * Callback fired when an exhibit is selected
   */
  onExhibitSelect?: (exhibit: ExhibitItem) => void;
  
  /**
   * Callback fired when exhibits are reordered
   */
  onExhibitsReorder?: (exhibits: ExhibitItem[]) => void;
}

/**
 * State interface for ExhibitsPanel component
 */
export interface ExhibitsPanelState {
  /**
   * All available exhibits
   */
  exhibits: ExhibitItem[];
  
  /**
   * Filtered exhibits based on current filters
   */
  filteredExhibits: ExhibitItem[];
  
  /**
   * Current filter settings
   */
  filters: ExhibitFilters;
  
  /**
   * Current sort field
   */
  sortField: ExhibitSortField;
  
  /**
   * Current sort direction
   */
  sortDirection: ExhibitSortDirection;
  
  /**
   * Currently selected exhibit
   */
  selectedExhibit: ExhibitItem | null;
  
  /**
   * Loading state for async operations
   */
  isLoading: boolean;
  
  /**
   * Creating state for new exhibit creation
   */
  isCreating: boolean;
  
  /**
   * Next available exhibit label
   */
  nextLabel: string;
}

/**
 * Form state for exhibit creation/editing modals
 */
export interface ExhibitFormState {
  /**
   * Modal open state for creation
   */
  createModalOpened: boolean;
  
  /**
   * Modal open state for editing
   */
  editModalOpened: boolean;
  
  /**
   * Currently edited exhibit (null for creation)
   */
  currentExhibit: ExhibitItem | null;
  
  /**
   * Form data for the exhibit
   */
  formData: ExhibitFormData;
}

/**
 * Actions interface for exhibit operations
 */
export interface ExhibitActions {
  /**
   * Create a new exhibit
   */
  createExhibit: (data: ExhibitFormData) => Promise<void>;
  
  /**
   * Update an existing exhibit
   */
  updateExhibit: (id: string, data: Partial<ExhibitFormData>) => Promise<void>;
  
  /**
   * Delete an exhibit
   */
  deleteExhibit: (id: string) => Promise<void>;
  
  /**
   * Add citation to an exhibit
   */
  addCitation: (exhibit: ExhibitItem) => void;
  
  /**
   * Apply filters to exhibit list
   */
  applyFilters: (filters: ExhibitFilters) => void;
  
  /**
   * Set sorting parameters
   */
  setSorting: (field: ExhibitSortField, direction: ExhibitSortDirection) => void;
  
  /**
   * Select an exhibit
   */
  selectExhibit: (exhibit: ExhibitItem) => void;
  
  /**
   * Re-label all exhibits in alphabetical order
   */
  relabelExhibits: () => Promise<void>;
}

/**
 * Platform-specific style props
 */
export interface PlatformStyleProps {
  /**
   * Whether the component is on mobile platform
   */
  isMobile: boolean;
}

/**
 * Modal configuration for exhibits panel
 */
export interface ExhibitModalConfig {
  /**
   * Modal size for different platforms
   */
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether modal should be fullscreen on mobile
   */
  fullScreen: boolean;
  
  /**
   * Modal title
   */
  title: string;
}

/**
 * Sorting configuration
 */
export interface SortingConfig {
  /**
   * Available sort options
   */
  options: Array<{
    value: ExhibitSortField;
    label: string;
  }>;
  
  /**
   * Current sort field
   */
  field: ExhibitSortField;
  
  /**
   * Current sort direction
   */
  direction: ExhibitSortDirection;
} 