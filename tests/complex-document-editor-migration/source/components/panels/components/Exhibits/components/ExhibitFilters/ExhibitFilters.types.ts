import { ExhibitFilters as ExhibitFiltersType, ExhibitStatus } from '../Exhibits.types';

export interface ExhibitFiltersProps {
  filters: ExhibitFiltersType;
  onFiltersChange: (filters: Partial<ExhibitFiltersType>) => void;
  availableTags: string[];
  totalCount: number;
  filteredCount: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface DateRangeState {
  start: Date | null;
  end: Date | null;
}

export interface FilterCounts {
  search: number;
  status: number;
  tags: number;
  relevance: number;
  dateRange: number;
}

export type { ExhibitFiltersType, ExhibitStatus }; 