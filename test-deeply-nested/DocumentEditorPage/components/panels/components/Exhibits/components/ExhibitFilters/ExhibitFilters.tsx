import React from 'react';
import {
  Group,
  MultiSelect,
  TextInput,
  Button,
  Stack,
  Text,
  Collapse
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconX,
  IconCalendar,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';

import { ExhibitFiltersProps } from './ExhibitFilters.types';
import { useExhibitFilters } from './ExhibitFilters.hook';
import {
  statusOptions,
  relevanceOptions,
  createTagOptions,
  formatDateForInput,
  formatDateRangeForDisplay,
  shouldShowDateRangeButton
} from './ExhibitFilters.logic';
import {
  FilterContainer,
  SearchContainer,
  FilterToggleGroup,
  FilterButton,
  FilterBadge,
  ResultsSummary,
  ResultsText,
  ClearAllButton,
  FilterSection,
  DateRangeGroup,
  ApplyDateButton,
  ActiveFiltersContainer,
  ActiveFiltersLabel,
  FilterTag,
  RemoveFilterButton,
  SearchInput,
  ClearSearchButton
} from './ExhibitFilters.styles';

export const ExhibitFilters: React.FC<ExhibitFiltersProps> = ({
  filters,
  onFiltersChange,
  availableTags,
  totalCount,
  filteredCount
}) => {
  const {
    isExpanded,
    dateRangeStart,
    dateRangeEnd,
    hasActiveFilters,
    activeFilterCount,
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
  } = useExhibitFilters(filters, onFiltersChange);

  const tagOptions = createTagOptions(availableTags);

  return (
    <FilterContainer>
      <Stack gap="sm">
        {/* Header with search and expand button */}
        <Group justify="space-between" align="center">
          <SearchContainer>
            <SearchInput
              placeholder="Search exhibits..."
              leftSection={<IconSearch size={16} />}
              value={filters.searchQuery || ''}
              onChange={(event) => handleSearchChange(event.currentTarget.value)}
              rightSection={
                filters.searchQuery ? (
                  <ClearSearchButton
                    size="sm"
                    variant="transparent"
                    onClick={() => handleSearchChange('')}
                  >
                    <IconX size={12} />
                  </ClearSearchButton>
                ) : null
              }
            />
          </SearchContainer>

          <FilterToggleGroup>
            <FilterButton
              variant={hasActiveFilters ? 'filled' : 'light'}
              size="sm"
              leftSection={<IconFilter size={16} />}
              rightSection={
                isExpanded ? 
                  <IconChevronUp size={16} /> : 
                  <IconChevronDown size={16} />
              }
              onClick={toggleExpanded}
              hasActiveFilters={hasActiveFilters}
            >
              Filters
              {activeFilterCount > 0 && (
                <FilterBadge size="xs" variant="white">
                  {activeFilterCount}
                </FilterBadge>
              )}
            </FilterButton>
          </FilterToggleGroup>
        </Group>

        {/* Results summary */}
        <ResultsSummary>
          <ResultsText>
            Showing {filteredCount} of {totalCount} exhibits
          </ResultsText>
          
          {hasActiveFilters && (
            <ClearAllButton
              variant="subtle"
              size="xs"
              onClick={clearAllFilters}
              leftSection={<IconX size={12} />}
            >
              Clear all
            </ClearAllButton>
          )}
        </ResultsSummary>

        {/* Expanded filters */}
        <Collapse in={isExpanded}>
          <FilterSection>
            {/* Status filter */}
            <MultiSelect
              label="Status"
              placeholder="Select status..."
              data={statusOptions}
              value={filters.status || []}
              onChange={handleStatusChange}
              clearable
              searchable={false}
            />

            {/* Relevance filter */}
            <MultiSelect
              label="Relevance"
              placeholder="Select relevance..."
              data={relevanceOptions}
              value={filters.relevance || []}
              onChange={handleRelevanceChange}
              clearable
              searchable={false}
            />

            {/* Tags filter */}
            <MultiSelect
              label="Tags"
              placeholder="Select tags..."
              data={tagOptions}
              value={filters.tags || []}
              onChange={handleTagsChange}
              clearable
              searchable
            />

            {/* Date range filter */}
            <DateRangeGroup grow>
              <TextInput
                label="From date"
                placeholder="YYYY-MM-DD"
                value={formatDateForInput(dateRangeStart)}
                onChange={(event) => handleDateRangeStartChange(event.currentTarget.value)}
                leftSection={<IconCalendar size={16} />}
              />
              <TextInput
                label="To date"
                placeholder="YYYY-MM-DD"
                value={formatDateForInput(dateRangeEnd)}
                onChange={(event) => handleDateRangeEndChange(event.currentTarget.value)}
                leftSection={<IconCalendar size={16} />}
              />
            </DateRangeGroup>

            {/* Apply date range button */}
            {shouldShowDateRangeButton(dateRangeStart, dateRangeEnd) && (
              <ApplyDateButton
                variant="light"
                size="sm"
                onClick={handleDateRangeChange}
              >
                Apply Date Range
              </ApplyDateButton>
            )}
          </FilterSection>
        </Collapse>

        {/* Active filters display */}
        {hasActiveFilters && (
          <ActiveFiltersContainer gap="xs">
            <ActiveFiltersLabel>Active filters:</ActiveFiltersLabel>
            
            {filters.searchQuery && (
              <FilterTag
                variant="light"
                filterType="search"
                rightSection={
                  <RemoveFilterButton
                    variant="transparent"
                    onClick={() => handleSearchChange('')}
                  >
                    <IconX size={8} />
                  </RemoveFilterButton>
                }
              >
                Search: {filters.searchQuery}
              </FilterTag>
            )}
            
            {filters.status?.map((status) => (
              <FilterTag
                key={status}
                variant="light"
                filterType="status"
                rightSection={
                  <RemoveFilterButton
                    variant="transparent"
                    onClick={() => removeStatusFilter(status)}
                  >
                    <IconX size={8} />
                  </RemoveFilterButton>
                }
              >
                {status}
              </FilterTag>
            ))}
            
            {filters.relevance?.map((relevance) => (
              <FilterTag
                key={relevance}
                variant="light"
                filterType="relevance"
                rightSection={
                  <RemoveFilterButton
                    variant="transparent"
                    onClick={() => removeRelevanceFilter(relevance)}
                  >
                    <IconX size={8} />
                  </RemoveFilterButton>
                }
              >
                {relevance}
              </FilterTag>
            ))}
            
            {filters.tags?.map((tag) => (
              <FilterTag
                key={tag}
                variant="light"
                filterType="tags"
                rightSection={
                  <RemoveFilterButton
                    variant="transparent"
                    onClick={() => removeTagFilter(tag)}
                  >
                    <IconX size={8} />
                  </RemoveFilterButton>
                }
              >
                {tag}
              </FilterTag>
            ))}
            
            {filters.dateRange && (
              <FilterTag
                variant="light"
                filterType="dateRange"
                rightSection={
                  <RemoveFilterButton
                    variant="transparent"
                    onClick={removeDateRangeFilter}
                  >
                    <IconX size={8} />
                  </RemoveFilterButton>
                }
              >
                {formatDateRangeForDisplay(filters.dateRange.start, filters.dateRange.end)}
              </FilterTag>
            )}
          </ActiveFiltersContainer>
        )}
      </Stack>
    </FilterContainer>
  );
}; 