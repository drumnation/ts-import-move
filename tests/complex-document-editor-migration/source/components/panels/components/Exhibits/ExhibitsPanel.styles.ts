import React from 'react';
import styled from '@emotion/styled';
import { Box, Group, Stack } from '@mantine/core';

interface StyledProps {
  isMobile: boolean;
  children?: React.ReactNode;
}

export const StyledContainer = styled(Box)<StyledProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--mantine-color-white);
  
  ${({ isMobile }) => !isMobile && `
    border-radius: var(--mantine-radius-md);
    box-shadow: var(--mantine-shadow-sm);
  `}
`;

export const StyledHeader = styled(Box)<StyledProps>`
  padding: var(--mantine-spacing-md);
  border-bottom: 1px solid var(--mantine-color-gray-3);
  background-color: var(--mantine-color-gray-0);
  
  ${({ isMobile }) => !isMobile && `
    border-top-left-radius: var(--mantine-radius-md);
    border-top-right-radius: var(--mantine-radius-md);
  `}
  
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-lg);
    border-bottom: 2px solid var(--mantine-color-gray-4);
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--mantine-color-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `}
`;

export const StyledHeaderActions = styled(Group)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    flex-direction: column;
    width: 100%;
    gap: var(--mantine-spacing-sm);
    
    button {
      width: 100%;
      justify-content: center;
    }
  `}
`;

export const StyledStats = styled(Group)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    flex-direction: column;
    align-items: flex-start;
    gap: var(--mantine-spacing-xs);
    
    > * {
      font-size: var(--mantine-font-size-lg);
    }
  `}
`;

export const StyledFiltersSection = styled(Box)<StyledProps>`
  padding: var(--mantine-spacing-md);
  border-bottom: 1px solid var(--mantine-color-gray-2);
  
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-lg);
    background-color: var(--mantine-color-gray-0);
  `}
`;

export const StyledContent = styled(Box)<StyledProps>`
  flex: 1;
  overflow: hidden;
  
  ${({ isMobile }) => !isMobile && `
    .mantine-ScrollArea-root {
      height: 100%;
    }
  `}
  
  ${({ isMobile }) => isMobile && `
    .mantine-ScrollArea-root {
      height: 100%;
    }
    
    .mantine-ScrollArea-viewport {
      padding-bottom: var(--mantine-spacing-xl);
    }
  `}
`;

export const StyledEmptyState = styled(Stack)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-xl);
    
    svg {
      align-self: center;
    }
    
    button {
      padding: var(--mantine-spacing-lg) var(--mantine-spacing-xl);
      font-size: var(--mantine-font-size-lg);
      border-radius: var(--mantine-radius-lg);
    }
  `}
`; 