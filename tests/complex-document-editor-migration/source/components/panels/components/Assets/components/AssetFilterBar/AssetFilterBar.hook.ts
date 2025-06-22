/**
 * Asset Filter Bar Custom Hook
 * @module AssetFilterBar.hook
 */

import { useCallback } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { AssetFilterBarProps, AssetFilterBarHookReturn, AssetType } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.types';
import { hasActiveFilters as checkActiveFilters, createDefaultFilter, toggleSortDirection as toggleDirection } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.logic';

/**
 * Custom hook for AssetFilterBar component logic
 */
export const useAssetFilterBar = ({
  filter,
  onFilterChange
}: Pick<AssetFilterBarProps, 'filter' | 'onFilterChange'>): AssetFilterBarHookReturn => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const hasActiveFilters = checkActiveFilters(filter);

  const handleSearchChange = useCallback((searchQuery: string) => {
    onFilterChange({ searchQuery });
  }, [onFilterChange]);

  const handleTypeChange = useCallback((type: string | null) => {
    onFilterChange({ type: (type as AssetType) || 'all' });
  }, [onFilterChange]);

  const handleSortChange = useCallback((sortBy: string | null) => {
    if (sortBy) {
      onFilterChange({ sortBy: sortBy as any });
    }
  }, [onFilterChange]);

  const toggleSortDirection = useCallback(() => {
    const newDirection = toggleDirection(filter.sortDirection);
    onFilterChange({ sortDirection: newDirection });
  }, [filter.sortDirection, onFilterChange]);

  const clearFilters = useCallback(() => {
    const defaultFilter = createDefaultFilter();
    onFilterChange(defaultFilter);
  }, [onFilterChange]);

  return {
    isMobile,
    hasActiveFilters,
    handleSearchChange,
    handleTypeChange,
    handleSortChange,
    toggleSortDirection,
    clearFilters
  };
}; 