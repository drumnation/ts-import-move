/**
 * Asset Filter Bar Component
 * @module AssetFilterBar
 */

import React from 'react';
import {
  Group,
  Button,
  Badge,
  ActionIcon
} from '@mantine/core';
import {
  IconSearch,
  IconX,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import type { AssetFilterBarProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.types';
import { useAssetFilterBar } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.hook';
import { getSortOptions, getTypeFilterOptions } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.logic';
import {
  FilterContainer,
  SearchInput,
  TypeSelect,
  SortSelect,
  SortActionIcon,
  MobileGroup,
  FiltersGroup
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/AssetFilterBar.styles';

export const AssetFilterBar: React.FC<AssetFilterBarProps> = ({
  filter,
  availableTypes,
  availableTags,
  onFilterChange,
  showAdvanced = false
}) => {
  const {
    isMobile,
    hasActiveFilters,
    handleSearchChange,
    handleTypeChange,
    handleSortChange,
    toggleSortDirection,
    clearFilters
  } = useAssetFilterBar({ filter, onFilterChange });

  const sortOptions = getSortOptions();
  const typeOptions = getTypeFilterOptions(availableTypes);

  if (isMobile) {
    return (
      <FilterContainer gap="sm">
        {/* Search */}
        <SearchInput
          placeholder="Search assets..."
          leftSection={<IconSearch size={16} />}
          rightSection={
            filter.searchQuery ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => handleSearchChange('')}
              >
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          value={filter.searchQuery || ''}
          onChange={(event) => handleSearchChange(event.target.value)}
        />

        {/* Type and Sort */}
        <Group grow>
          <TypeSelect
            placeholder="All types"
            data={typeOptions}
            value={filter.type || 'all'}
            onChange={handleTypeChange}
          />
          
          <MobileGroup gap="xs">
            <SortSelect
              placeholder="Sort by"
              data={sortOptions}
              value={filter.sortBy}
              onChange={handleSortChange}
            />
            <SortActionIcon
              variant="light"
              onClick={toggleSortDirection}
              size={36}
            >
              {filter.sortDirection === 'asc' ? 
                <IconSortAscending size={16} /> : 
                <IconSortDescending size={16} />
              }
            </SortActionIcon>
          </MobileGroup>
        </Group>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="light"
            size="sm"
            onClick={clearFilters}
            leftSection={<IconX size={14} />}
          >
            Clear Filters
          </Button>
        )}
      </FilterContainer>
    );
  }

  // Desktop layout
  return (
    <FilterContainer gap="sm">
      <Group justify="space-between">
        {/* Search */}
        <SearchInput
          placeholder="Search assets..."
          leftSection={<IconSearch size={16} />}
          rightSection={
            filter.searchQuery ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => handleSearchChange('')}
              >
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          value={filter.searchQuery || ''}
          onChange={(event) => handleSearchChange(event.target.value)}
        />

        {/* Type Filter */}
        <TypeSelect
          placeholder="All types"
          data={typeOptions}
          value={filter.type || 'all'}
          onChange={handleTypeChange}
        />

        {/* Sort Controls */}
        <Group gap="xs">
          <SortSelect
            placeholder="Sort by"
            data={sortOptions}
            value={filter.sortBy}
            onChange={handleSortChange}
          />
          <ActionIcon
            variant="light"
            onClick={toggleSortDirection}
          >
            {filter.sortDirection === 'asc' ? 
              <IconSortAscending size={16} /> : 
              <IconSortDescending size={16} />
            }
          </ActionIcon>
        </Group>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="light"
            size="sm"
            onClick={clearFilters}
            leftSection={<IconX size={14} />}
          >
            Clear
          </Button>
        )}
      </Group>

      {/* Active Filters */}
      {hasActiveFilters && (
        <FiltersGroup>
          {filter.type !== 'all' && (
            <Badge variant="light" size="sm">
              Type: {filter.type}
            </Badge>
          )}
          {filter.tags && filter.tags.map(tag => (
            <Badge key={tag} variant="light" size="sm">
              {tag}
            </Badge>
          ))}
        </FiltersGroup>
      )}
    </FilterContainer>
  );
}; 