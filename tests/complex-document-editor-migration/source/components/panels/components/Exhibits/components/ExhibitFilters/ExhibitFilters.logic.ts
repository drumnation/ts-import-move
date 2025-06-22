import { ExhibitFiltersType, ExhibitStatus, FilterOption, FilterCounts } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitFilters/ExhibitFilters.types';

export const statusOptions: FilterOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export const relevanceOptions: FilterOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export const calculateActiveFilters = (filters: ExhibitFiltersType): boolean => {
  return Boolean(
    filters.searchQuery ||
    filters.status?.length ||
    filters.tags?.length ||
    filters.relevance?.length ||
    filters.dateRange
  );
};

export const calculateFilterCounts = (filters: ExhibitFiltersType): FilterCounts => {
  return {
    search: filters.searchQuery ? 1 : 0,
    status: filters.status?.length || 0,
    tags: filters.tags?.length || 0,
    relevance: filters.relevance?.length || 0,
    dateRange: filters.dateRange ? 1 : 0
  };
};

export const getTotalActiveFilterCount = (counts: FilterCounts): number => {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
};

export const createTagOptions = (availableTags: string[]): FilterOption[] => {
  return availableTags.map(tag => ({ value: tag, label: tag }));
};

export const createClearFiltersPayload = (): Partial<ExhibitFiltersType> => ({
  searchQuery: undefined,
  status: undefined,
  tags: undefined,
  relevance: undefined,
  dateRange: undefined
});

export const formatDateForInput = (date: Date | null): string => {
  return date?.toISOString().split('T')[0] || '';
};

export const formatDateRangeForDisplay = (start: Date, end: Date): string => {
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};

export const parseInputDate = (value: string): Date | null => {
  return value ? new Date(value) : null;
};

export const shouldShowDateRangeButton = (start: Date | null, end: Date | null): boolean => {
  return Boolean(start || end);
};

export const createDateRangeFilter = (start: Date | null, end: Date | null): { dateRange?: { start: Date; end: Date } } => {
  if (start && end) {
    return {
      dateRange: {
        start,
        end
      }
    };
  }
  return { dateRange: undefined };
}; 