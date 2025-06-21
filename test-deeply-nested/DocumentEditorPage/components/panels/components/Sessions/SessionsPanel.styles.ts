import styled from '@emotion/styled';
import { Box, Group } from '@mantine/core';

interface StyledProps {
  isMobile: boolean;
  maxHeight?: string | number;
}

export const StyledContainer = styled(Box)<StyledProps>`
  height: ${({ maxHeight = '100%' }) => typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};
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

export const StyledSessionInfo = styled(Box)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    text-align: center;
    padding: var(--mantine-spacing-md);
    border-radius: var(--mantine-radius-md);
    background-color: var(--mantine-color-blue-0);
    border: 1px solid var(--mantine-color-blue-2);
  `}
`;

export const StyledContent = styled(Box)<StyledProps>`
  flex: 1;
  overflow: hidden;
  padding: var(--mantine-spacing-md);
  
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-lg);
  `}
`;

export const StyledTimeline = styled(Box)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    .mantine-Timeline-root {
      margin-left: var(--mantine-spacing-md);
    }
    
    .mantine-Timeline-itemTitle {
      margin-bottom: var(--mantine-spacing-sm);
    }
    
    .mantine-Timeline-itemBody {
      padding-bottom: var(--mantine-spacing-lg);
    }
  `}
`;

export const StyledFooter = styled(Box)<StyledProps>`
  padding: var(--mantine-spacing-md);
  border-top: 1px solid var(--mantine-color-gray-3);
  background-color: var(--mantine-color-gray-0);
  
  ${({ isMobile }) => !isMobile && `
    border-bottom-left-radius: var(--mantine-radius-md);
    border-bottom-right-radius: var(--mantine-radius-md);
  `}
  
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-lg);
    border-top: 2px solid var(--mantine-color-gray-4);
    position: sticky;
    bottom: 0;
    z-index: 10;
    background-color: var(--mantine-color-white);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  `}
`;

export const StyledEmptyState = styled(Box)<StyledProps>`
  text-align: center;
  padding: var(--mantine-spacing-xl);
  
  ${({ isMobile }) => isMobile && `
    padding: var(--mantine-spacing-xxl);
  `}
`;

export const StyledSessionStats = styled(Group)<StyledProps>`
  ${({ isMobile }) => isMobile && `
    > div {
      flex: 1;
      padding: var(--mantine-spacing-md);
      border-radius: var(--mantine-radius-md);
      background-color: var(--mantine-color-gray-0);
      border: 1px solid var(--mantine-color-gray-2);
    }
    
    gap: var(--mantine-spacing-md);
  `}
`; 