import React from 'react';
import { Group, ActionIcon } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLayoutGrid,
  IconMaximize,
  IconMinus,
  IconPlus
} from '@tabler/icons-react';
import type { ViewportControlsProps } from './ViewportControls.types';
import { ZoomText } from './ViewportControls.styles';
import { 
  shouldShowZoomControls, 
  shouldShowPageNavigation, 
  formatZoomPercentage,
  getIconSize,
  getGapSize
} from './ViewportControls.logic';

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  viewMode,
  zoom,
  touchTargetConfig,
  isMobile,
  canZoomIn,
  canZoomOut,
  canGoNext,
  canGoPrev,
  onViewModeChange,
  onZoomIn,
  onZoomOut,
  onPrevPage,
  onNextPage
}) => {
  const iconSize = getIconSize(isMobile);
  const gapSize = getGapSize(isMobile);

  return (
    <>
      {/* View Mode Controls */}
      <Group gap={gapSize}>
        <ActionIcon
          size={touchTargetConfig.minSize}
          variant={viewMode === 'single' ? 'filled' : 'light'}
          onClick={() => onViewModeChange('single')}
          title="Single page"
        >
          <IconMaximize size={iconSize} />
        </ActionIcon>
        
        <ActionIcon
          size={touchTargetConfig.minSize}
          variant={viewMode === 'infinite' ? 'filled' : 'light'}
          onClick={() => onViewModeChange('infinite')}
          title="Continuous scroll"
        >
          ⚘
        </ActionIcon>
        
        <ActionIcon
          size={touchTargetConfig.minSize}
          variant={viewMode === 'thumbnail' ? 'filled' : 'light'}
          onClick={() => onViewModeChange('thumbnail')}
          title="Thumbnail grid"
        >
          <IconLayoutGrid size={iconSize} />
        </ActionIcon>
      </Group>

      {/* Zoom Controls */}
      {shouldShowZoomControls(isMobile) && (
        <Group gap="xs">
          <ActionIcon
            size={touchTargetConfig.minSize}
            variant="light"
            onClick={onZoomOut}
            disabled={!canZoomOut}
          >
            <IconMinus size={16} />
          </ActionIcon>
          
          <ZoomText size="xs">
            {formatZoomPercentage(zoom)}
          </ZoomText>
          
          <ActionIcon
            size={touchTargetConfig.minSize}
            variant="light"
            onClick={onZoomIn}
            disabled={!canZoomIn}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      )}

      {/* Page Navigation */}
      {shouldShowPageNavigation(viewMode) && (
        <Group gap={gapSize}>
          <ActionIcon
            size={touchTargetConfig.minSize}
            variant="light"
            onClick={onPrevPage}
            disabled={!canGoPrev}
          >
            <IconChevronLeft size={iconSize} />
          </ActionIcon>
          
          <ActionIcon
            size={touchTargetConfig.minSize}
            variant="light"
            onClick={onNextPage}
            disabled={!canGoNext}
          >
            <IconChevronRight size={iconSize} />
          </ActionIcon>
        </Group>
      )}
    </>
  );
}; 