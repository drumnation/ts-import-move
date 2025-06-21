import styled from '@emotion/styled';
import { Paper, Group, TextInput, Button, Badge, ActionIcon } from '@mantine/core';

export const FilterContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[3]};
`;

export const SearchContainer = styled.div`
  flex: 1;
`;

export const FilterToggleGroup = styled(Group)`
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const FilterButton = styled(Button)<{ hasActiveFilters?: boolean }>`
  ${({ hasActiveFilters, theme }) => hasActiveFilters && `
    background-color: ${theme.colors.blue[6]};
    color: white;
    
    &:hover {
      background-color: ${theme.colors.blue[7]};
    }
  `}
`;

export const FilterBadge = styled(Badge)`
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

export const ResultsSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ResultsText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[6]};
`;

export const ClearAllButton = styled(Button)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const DateRangeGroup = styled(Group)`
  flex-grow: 1;
`;

export const ApplyDateButton = styled(Button)`
  width: 100%;
`;

export const ActiveFiltersContainer = styled(Group)`
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ActiveFiltersLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[6]};
`;

export const FilterTag = styled(Badge)<{ filterType?: 'search' | 'status' | 'relevance' | 'tags' | 'dateRange' }>`
  ${({ filterType, theme }) => {
    const colorMap = {
      search: theme.colors.gray[6],
      status: theme.colors.blue[6],
      relevance: theme.colors.orange[6],
      tags: theme.colors.green[6],
      dateRange: theme.colors.purple[6]
    };
    
    return filterType && `
      background-color: ${colorMap[filterType]}20;
      color: ${colorMap[filterType]};
      border: 1px solid ${colorMap[filterType]}40;
    `;
  }}
`;

export const RemoveFilterButton = styled(ActionIcon)`
  font-size: 8px;
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
`;

export const SearchInput = styled(TextInput)`
  flex: 1;
`;

export const ClearSearchButton = styled(ActionIcon)`
  font-size: 12px;
`; 