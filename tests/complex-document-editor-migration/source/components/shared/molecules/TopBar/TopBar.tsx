/**
 * TopBar Component
 * @module TopBar
 */

import React from 'react';
import { ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconBookmark,
  IconSearch,
  IconDownload,
  IconPrinter,
  IconShare,
  IconEye,
  IconDotsVertical
} from '@tabler/icons-react';
import type { TopBarProps, StatusIndicatorProps, ActionBarProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/TopBar/TopBar.types';
import {
  TopBarContainer,
  TitleBarSection,
  ActionBarSection,
  StatusIndicatorContainer,
  StatusDot,
  StatusText,
  MobileActionsMenu
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/TopBar/TopBar.styles';

/**
 * Status indicator component
 * Shows current editor status with visual indicator
 */
export const StatusIndicator = React.memo<StatusIndicatorProps>(({ status }) => (
  <StatusIndicatorContainer>
    <StatusDot status={status} />
    <StatusText>{status}</StatusText>
  </StatusIndicatorContainer>
));

StatusIndicator.displayName = 'StatusIndicator';

/**
 * Action bar component
 * Displays action buttons with responsive behavior
 */
export const ActionBar = React.memo<ActionBarProps>(({ 
  onSearch, 
  onDownload, 
  onPrint, 
  onShare, 
  onExportPreview 
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    // Mobile: Show only essential actions, rest in menu
    return (
      <ActionBarSection>
        <ActionIcon 
          variant="light" 
          size="lg"
          onClick={onSearch}
          aria-label="Search document"
        >
          <IconSearch size={16} />
        </ActionIcon>
        <ActionIcon 
          variant="light" 
          size="lg"
          onClick={onExportPreview}
          aria-label="Preview document"
        >
          <IconEye size={16} />
        </ActionIcon>
        <ActionIcon 
          variant="light" 
          size="lg"
          aria-label="More actions"
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </ActionBarSection>
    );
  }

  // Desktop: Show all actions
  return (
    <ActionBarSection>
      <ActionIcon 
        variant="light" 
        size="sm" 
        onClick={onSearch}
        aria-label="Search document"
      >
        <IconSearch size={14} />
      </ActionIcon>
      <ActionIcon 
        variant="light" 
        size="sm" 
        onClick={onExportPreview}
        aria-label="Preview document"
      >
        <IconEye size={14} />
      </ActionIcon>
      <ActionIcon 
        variant="light" 
        size="sm" 
        onClick={onDownload}
        aria-label="Download document"
      >
        <IconDownload size={14} />
      </ActionIcon>
      <ActionIcon 
        variant="light" 
        size="sm" 
        onClick={onPrint}
        aria-label="Print document"
      >
        <IconPrinter size={14} />
      </ActionIcon>
      <ActionIcon 
        variant="light" 
        size="sm" 
        onClick={onShare}
        aria-label="Share document"
      >
        <IconShare size={14} />
      </ActionIcon>
    </ActionBarSection>
  );
});

ActionBar.displayName = 'ActionBar';

/**
 * TopBar component for document editor
 * Responsive header with title, status, and actions
 */
export const TopBar = React.memo<TopBarProps>(({ 
  title = 'Legal Document Editor',
  status = 'ready',
  onSearch,
  onExportPreview,
  onDownload,
  onPrint,
  onShare
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <TopBarContainer>
      <TitleBarSection>
        <IconBookmark size={isMobile ? 18 : 20} />
        <h1>{title}</h1>
        {!isMobile && <StatusIndicator status={status} />}
      </TitleBarSection>
      
      <ActionBar 
        onSearch={onSearch}
        onExportPreview={onExportPreview}
        onDownload={onDownload}
        onPrint={onPrint}
        onShare={onShare}
      />
    </TopBarContainer>
  );
});

TopBar.displayName = 'TopBar'; 