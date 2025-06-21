/**
 * Asset Filter Bar Business Logic
 * @module AssetFilterBar.logic
 */

import type { AssetFilter, AssetType } from './AssetFilterBar.types';

/**
 * Check if any filters are currently active
 */
export const hasActiveFilters = (filter: AssetFilter): boolean => {
  return (
    filter.type !== 'all' ||
    Boolean(filter.searchQuery) ||
    Boolean(filter.tags && filter.tags.length > 0)
  );
};

/**
 * Create default filter state
 */
export const createDefaultFilter = (): AssetFilter => ({
  type: 'all',
  searchQuery: '',
  tags: [],
  sortBy: 'uploadedAt',
  sortDirection: 'desc'
});

/**
 * Transform asset type string for display
 */
export const formatAssetTypeLabel = (type: AssetType): string => {
  if (type === 'all') return 'All Types';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Create sort options for select dropdown
 */
export const getSortOptions = () => [
  { value: 'uploadedAt', label: 'Date' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'fileSize', label: 'Size' }
];

/**
 * Create type filter options
 */
export const getTypeFilterOptions = (availableTypes: AssetType[]) => [
  { value: 'all', label: 'All Types' },
  ...availableTypes
    .filter(type => type !== 'all')
    .map(type => ({
      value: type,
      label: formatAssetTypeLabel(type)
    }))
];

/**
 * Toggle sort direction
 */
export const toggleSortDirection = (currentDirection: 'asc' | 'desc'): 'asc' | 'desc' => {
  return currentDirection === 'asc' ? 'desc' : 'asc';
}; 