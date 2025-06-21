/**
 * Asset Filter Bar Styled Components
 * @module AssetFilterBar.styles
 */

import styled from '@emotion/styled';
import { Stack, Group, TextInput, Select, ActionIcon } from '@mantine/core';

export const FilterContainer = styled(Stack)`
  padding: 0.75rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const SearchInput = styled(TextInput)`
  @media (min-width: 769px) {
    width: 200px;
  }
`;

export const TypeSelect = styled(Select)`
  @media (min-width: 769px) {
    width: 120px;
  }
`;

export const SortSelect = styled(Select)`
  @media (min-width: 769px) {
    width: 100px;
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const SortActionIcon = styled(ActionIcon)<any>`
  @media (max-width: 768px) {
    min-width: 36px;
    min-height: 36px;
  }
`;

export const MobileGroup = styled(Group)`
  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const FiltersGroup = styled(Group)`
  gap: 0.5rem;
`; 