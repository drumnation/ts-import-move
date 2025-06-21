import styled from '@emotion/styled';
import { Stack, Group, Text } from '@mantine/core';

export const UploadingContainer = styled(Stack)`
  padding: var(--mantine-spacing-md);
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
`;

export const DropzoneContent = styled(Group)<{ isMobile: boolean }>`
  min-height: ${({ isMobile }) => isMobile ? '120px' : '80px'};
  pointer-events: none;
`;

export const IconContainer = styled(Group)`
  gap: var(--mantine-spacing-sm);
`;

export const FileTypeIcon = styled.div<{ color: string }>`
  color: ${({ color }) => color};
`;

export const StyledText = styled.div`
  &.mobile-text {
    font-size: var(--mantine-font-size-sm);
    font-weight: 500;
    text-align: center;
  }

  &.desktop-text {
    font-size: var(--mantine-font-size-lg);
    font-weight: 500;
  }

  &.sub-text {
    font-size: var(--mantine-font-size-sm);
    color: var(--mantine-color-gray-6);
  }

  &.tiny-text {
    font-size: var(--mantine-font-size-xs);
    color: var(--mantine-color-gray-6);
  }
`; 