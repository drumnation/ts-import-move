/**
 * PageNavigator Mobile Component
 * 
 * Mobile variant with bottom navigation bar
 * Implements Level 3 platform separation with touch-optimized interface
 * 
 * @module PageNavigator.mobile
 */

import React, { memo, useCallback } from 'react';
import { Box, Text, ActionIcon, Group } from '@mantine/core';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight 
} from '@tabler/icons-react';
import { usePageNavigatorLogic, formatPageDisplay } from './PageNavigator.logic';
import {
  PageNavigatorBottomBar,
  PageControls,
  PageDisplay,
  PageIndicators,
  PageIndicator,
  NavigationButton,
  CompactControls,
  ErrorContainer,
  LoadingContainer
} from './PageNavigator.styles';
import type { PageNavigatorMobileProps } from './PageNavigator.types';

/**
 * Mobile variant of PageNavigator with touch-optimized interface
 * Features: Bottom navigation bar, touch gestures, compact controls
 */
export const PageNavigatorMobile = memo<PageNavigatorMobileProps>(({
  position = 'bottom',
  showIndicators = true,
  enableSwipe = true,
  compact = false,
  className,
  ...baseProps
}) => {
  const { state, actions, computed } = usePageNavigatorLogic();

  // Handle touch/swipe navigation (simplified implementation)
  const handleSwipeLeft = useCallback(() => {
    if (enableSwipe && computed.canGoNext) {
      actions.nextPage();
    }
  }, [enableSwipe, computed.canGoNext, actions]);

  const handleSwipeRight = useCallback(() => {
    if (enableSwipe && computed.canGoPrevious) {
      actions.previousPage();
    }
  }, [enableSwipe, computed.canGoPrevious, actions]);

  // Handle page indicator click
  const handleIndicatorClick = useCallback((pageNumber: number) => {
    actions.goToPage(pageNumber);
  }, [actions]);

  // Render page indicators (dots) for small page counts
  const renderPageIndicators = useCallback(() => {
    if (!showIndicators || state.totalPages > 10) return null;

    const indicators = Array.from({ length: state.totalPages }, (_, i) => i + 1);

    return (
      <PageIndicators>
        {indicators.map((pageNumber) => (
          <PageIndicator
            key={pageNumber}
            isActive={pageNumber === state.currentPage}
            onClick={() => handleIndicatorClick(pageNumber)}
            role="button"
            aria-label={`Go to page ${pageNumber}`}
          />
        ))}
      </PageIndicators>
    );
  }, [showIndicators, state.totalPages, state.currentPage, handleIndicatorClick]);

  if (state.error) {
    return (
      <PageNavigatorBottomBar className={className}>
        <ErrorContainer>
          <Text size="sm">Error: {state.error}</Text>
        </ErrorContainer>
      </PageNavigatorBottomBar>
    );
  }

  if (state.isLoading) {
    return (
      <PageNavigatorBottomBar className={className}>
        <LoadingContainer>
          <Text size="sm">Loading...</Text>
        </LoadingContainer>
      </PageNavigatorBottomBar>
    );
  }

  const ControlsContainer = compact ? CompactControls : PageNavigatorBottomBar;

  return (
    <ControlsContainer 
      className={className}
      style={{ 
        position: position === 'top' ? 'fixed' : 'fixed',
        top: position === 'top' ? 0 : 'auto',
        bottom: position === 'bottom' ? 0 : 'auto'
      }}
    >
      <Group gap="md" justify="center">
        {/* Navigation Controls */}
        <Group gap="xs">
          <NavigationButton
            disabled={computed.isFirstPage}
            onClick={actions.firstPage}
            size="lg"
            variant="subtle"
            aria-label="First page"
          >
            <IconChevronsLeft size={20} />
          </NavigationButton>

          <NavigationButton
            disabled={!computed.canGoPrevious}
            onClick={actions.previousPage}
            size="lg"
            variant="subtle"
            aria-label="Previous page"
          >
            <IconChevronLeft size={20} />
          </NavigationButton>
        </Group>

        {/* Page Display */}
        <Group gap="sm" align="center">
          <PageDisplay>
            {formatPageDisplay(state.currentPage, state.totalPages, 'short')}
          </PageDisplay>
          
          {/* Page Indicators for small page counts */}
          {renderPageIndicators()}
        </Group>

        {/* Navigation Controls */}
        <Group gap="xs">
          <NavigationButton
            disabled={!computed.canGoNext}
            onClick={actions.nextPage}
            size="lg"
            variant="subtle"
            aria-label="Next page"
          >
            <IconChevronRight size={20} />
          </NavigationButton>

          <NavigationButton
            disabled={computed.isLastPage}
            onClick={actions.lastPage}
            size="lg"
            variant="subtle"
            aria-label="Last page"
          >
            <IconChevronsRight size={20} />
          </NavigationButton>
        </Group>
      </Group>

      {/* Extended info for larger screens in mobile view */}
      {!compact && state.totalPages > 10 && (
        <Text size="xs" c="dimmed" ta="center" mt="xs">
          {formatPageDisplay(state.currentPage, state.totalPages, 'long')}
        </Text>
      )}
    </ControlsContainer>
  );
});

PageNavigatorMobile.displayName = 'PageNavigatorMobile'; 