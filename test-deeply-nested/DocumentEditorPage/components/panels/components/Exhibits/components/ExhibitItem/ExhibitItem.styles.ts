import styled from '@emotion/styled';
import { Card, Box } from '@mantine/core';

export const StyledCard = styled(Card)<{ 
  isSelected: boolean; 
  isClickable: boolean; 
}>`
  cursor: ${({ isClickable }) => isClickable ? 'pointer' : 'default'};
  background-color: ${({ isSelected }) => 
    isSelected ? 'var(--mantine-color-blue-0)' : undefined};
  border-color: ${({ isSelected }) => 
    isSelected ? 'var(--mantine-color-blue-4)' : undefined};
  transition: all 0.2s ease;

  &:hover {
    ${({ isClickable }) => isClickable && `
      transform: translateY(-1px);
      box-shadow: var(--mantine-shadow-md);
    `}
  }
`;

export const ExhibitLabel = styled(Box)`
  background-color: var(--mantine-color-blue-6);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`; 