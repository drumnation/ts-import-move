import { useState, useCallback } from 'react';
import { ExhibitFiltersType, ExhibitStatus, DateRangeState } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitFilters/ExhibitFilters.types';
import {
  calculateActiveFilters,
  calculateFilterCounts,
  getTotalActiveFilterCount,
  createClearFiltersPayload,
  createDateRangeFilter,
  parseInputDate
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitFilters/ExhibitFilters.logic';

export const useExhibitFilters = (
  filters: ExhibitFiltersType,
  onFiltersChange: (filters: Partial<ExhibitFiltersType>) => void
) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(
    filters.dateRange?.start || null
  );
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(
    filters.dateRange?.end || null
  );

  const hasActiveFilters = calculateActiveFilters(filters);
  const filterCounts = calculateFilterCounts(filters);
  const activeFilterCount = getTotalActiveFilterCount(filterCounts);

  const handleSearchChange = useCallback((value: string) => {
    onFiltersChange({ searchQuery: value || undefined });
  }, [onFiltersChange]);

  const handleStatusChange = useCallback((value: string[]) => {
    onFiltersChange({ 
      status: value.length > 0 ? value as ExhibitStatus[] : undefined 
    });
  }, [onFiltersChange]);

  const handleTagsChange = useCallback((value: string[]) => {
    onFiltersChange({ 
      tags: value.length > 0 ? value : undefined 
    });
  }, [onFiltersChange]);

  const handleRelevanceChange = useCallback((value: string[]) => {
    onFiltersChange({ 
      relevance: value.length > 0 ? value as ('high' | 'medium' | 'low')[] : undefined 
    });
  }, [onFiltersChange]);

  const handleDateRangeChange = useCallback(() => {
    const dateRangeFilter = createDateRangeFilter(dateRangeStart, dateRangeEnd);
    onFiltersChange(dateRangeFilter);
  }, [dateRangeStart, dateRangeEnd, onFiltersChange]);

  const handleDateRangeStartChange = useCallback((value: string) => {
    setDateRangeStart(parseInputDate(value));
  }, []);

  const handleDateRangeEndChange = useCallback((value: string) => {
    setDateRangeEnd(parseInputDate(value));
  }, []);

  const clearAllFilters = useCallback(() => {
    onFiltersChange(createClearFiltersPayload());
    setDateRangeStart(null);
    setDateRangeEnd(null);
  }, [onFiltersChange]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const removeStatusFilter = useCallback((statusToRemove: string) => {
    const newStatus = filters.status?.filter(s => s !== statusToRemove);
    handleStatusChange(newStatus || []);
  }, [filters.status, handleStatusChange]);

  const removeRelevanceFilter = useCallback((relevanceToRemove: string) => {
    const newRelevance = filters.relevance?.filter(r => r !== relevanceToRemove);
    handleRelevanceChange(newRelevance || []);
  }, [filters.relevance, handleRelevanceChange]);

  const removeTagFilter = useCallback((tagToRemove: string) => {
    const newTags = filters.tags?.filter(t => t !== tagToRemove);
    handleTagsChange(newTags || []);
  }, [filters.tags, handleTagsChange]);

  const removeDateRangeFilter = useCallback(() => {
    onFiltersChange({ dateRange: undefined });
    setDateRangeStart(null);
    setDateRangeEnd(null);
  }, [onFiltersChange]);

  return {
    // State
    isExpanded,
    dateRangeStart,
    dateRangeEnd,
    hasActiveFilters,
    activeFilterCount,
    
    // Handlers
    handleSearchChange,
    handleStatusChange,
    handleTagsChange,
    handleRelevanceChange,
    handleDateRangeChange,
    handleDateRangeStartChange,
    handleDateRangeEndChange,
    clearAllFilters,
    toggleExpanded,
    removeStatusFilter,
    removeRelevanceFilter,
    removeTagFilter,
    removeDateRangeFilter
  };
}; 