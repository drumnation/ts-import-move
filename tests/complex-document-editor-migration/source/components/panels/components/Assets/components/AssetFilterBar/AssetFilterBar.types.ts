/**
 * Asset Filter Bar Types
 * @module AssetFilterBar.types
 */

import type { AssetType as BaseAssetType, AssetFilter } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/Assets.types';

export type AssetType = BaseAssetType | 'all';

export interface AssetFilterBarProps {
  /** Current filter state */
  filter: AssetFilter;
  /** Available asset types for filter */
  availableTypes: AssetType[];
  /** Available tags for filter */
  availableTags: string[];
  /** Filter change handler */
  onFilterChange: (filter: Partial<AssetFilter>) => void;
  /** Whether to show advanced filters */
  showAdvanced?: boolean;
}

export interface AssetFilterBarHookReturn {
  /** Whether device is mobile */
  isMobile: boolean;
  /** Check if filters are active */
  hasActiveFilters: boolean;
  /** Search change handler */
  handleSearchChange: (searchQuery: string) => void;
  /** Type change handler */
  handleTypeChange: (type: string | null) => void;
  /** Sort change handler */
  handleSortChange: (sortBy: string | null) => void;
  /** Sort direction toggle */
  toggleSortDirection: () => void;
  /** Clear all filters */
  clearFilters: () => void;
} 