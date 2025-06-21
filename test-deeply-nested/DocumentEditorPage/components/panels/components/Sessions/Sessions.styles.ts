import styled from '@emotion/styled';
import { Box, type BoxProps } from '@mantine/core';

export const SessionsContainer = styled(Box)<BoxProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SessionsHeader = styled(Box)<BoxProps>`
  padding: var(--mantine-spacing-md);
  border-bottom: 1px solid var(--mantine-color-gray-3);
`;

export const SessionsContent = styled(Box)<BoxProps>`
  flex: 1;
  overflow: hidden;
`;

export const SessionsScrollArea = styled(Box)<BoxProps>`
  height: 100%;
  padding: var(--mantine-spacing-md);
`;

export const SessionsFooter = styled(Box)<BoxProps>`
  padding: var(--mantine-spacing-md);
  border-top: 1px solid var(--mantine-color-gray-3);
`;

export const EmptyStateContainer = styled(Box)<BoxProps>`
  text-align: center;
  margin-top: var(--mantine-spacing-xl);
`; 