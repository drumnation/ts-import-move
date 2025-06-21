import styled from '@emotion/styled';
import { Box } from '@mantine/core';

export const Container = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--mantine-color-white);
  
  /* Level 1 Responsive: Basic mobile optimization */
  @media (max-width: 768px) {
    border-radius: 0;
  }
  
  @media (min-width: 769px) {
    border-radius: var(--mantine-radius-md);
    box-shadow: var(--mantine-shadow-sm);
  }
`;

export const Header = styled(Box)`
  padding: var(--mantine-spacing-md);
  border-bottom: 1px solid var(--mantine-color-gray-3);
  background-color: var(--mantine-color-gray-0);
  
  /* Mobile: Larger padding and sticky header */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-lg);
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--mantine-color-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid var(--mantine-color-gray-4);
  }
  
  /* Desktop: Rounded corners */
  @media (min-width: 769px) {
    border-top-left-radius: var(--mantine-radius-md);
    border-top-right-radius: var(--mantine-radius-md);
  }
`;

export const StatsContainer = styled(Box)`
  display: flex;
  gap: var(--mantine-spacing-md);
  margin-bottom: var(--mantine-spacing-md);
  
  /* Mobile: Stack stats vertically */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--mantine-spacing-xs);
    margin-bottom: var(--mantine-spacing-lg);
    
    > * {
      font-size: var(--mantine-font-size-lg);
    }
  }
  
  /* Mobile landscape and small tablets */
  @media (max-width: 768px) and (orientation: landscape) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const SearchContainer = styled(Box)`
  /* Mobile: Larger search input */
  @media (max-width: 768px) {
    .mantine-TextInput-root {
      .mantine-TextInput-input {
        font-size: var(--mantine-font-size-lg);
        padding: var(--mantine-spacing-md);
        min-height: 48px;
      }
    }
  }
`;

export const ContentContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
  
  /* Mobile: Bottom padding for safe area */
  @media (max-width: 768px) {
    .mantine-ScrollArea-viewport {
      padding-bottom: var(--mantine-spacing-xl);
    }
  }
`;

export const EmptyStateContainer = styled(Box)`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Mobile: Larger empty state */
  @media (max-width: 768px) {
    height: 300px;
    padding: var(--mantine-spacing-xl);
    
    svg {
      width: 64px;
      height: 64px;
    }
    
    text {
      font-size: var(--mantine-font-size-lg);
    }
  }
`; 