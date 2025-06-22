/**
 * PageNavigator Web Component
 * 
 * Desktop variant with sidebar page thumbnails
 * Implements Level 3 platform separation for complex responsive logic
 * 
 * @module PageNavigator.web
 */

import React, { memo, useCallback } from 'react';
import { Box, Text, ActionIcon, Tooltip } from '@mantine/core';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight,
  IconRefresh
} from '@tabler/icons-react';
import { usePageNavigatorLogic, formatPageDisplay } from './PageNavigator.logic';
import {
  PageNavigatorSidebar,
  PageControls,
  PageInputContainer,
  PageInput,
  PageDisplay,
  ThumbnailGrid,
  ThumbnailContainer,
  ThumbnailImage,
  ThumbnailPageNumber,
  NavigationButton,
  ErrorContainer,
  LoadingContainer
} from './PageNavigator.styles';
import type { PageNavigatorWebProps } from './PageNavigator.types';

/**
 * Web variant of PageNavigator with desktop-optimized interface
 * Features: Sidebar thumbnails, keyboard navigation, precise controls
 */
export const PageNavigatorWeb = memo<PageNavigatorWebProps>(({
  showThumbnails = true,
  thumbnailSize = 'medium',
  sidebarWidth = 240,
  enableReorder = false,
  className,
  ...baseProps
}) => {
  const { state, actions, computed } = usePageNavigatorLogic();

  // Handle direct page input
  const handlePageInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      actions.goToPage(value);
    }
  }, [actions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      actions.previousPage();
      break;
    case 'ArrowRight':
      event.preventDefault();
      actions.nextPage();
      break;
    case 'Home':
      event.preventDefault();
      actions.firstPage();
      break;
    case 'End':
      event.preventDefault();
      actions.lastPage();
      break;
    }
  }, [actions]);

  // Handle thumbnail click
  const handleThumbnailClick = useCallback((pageNumber: number) => {
    actions.goToPage(pageNumber);
  }, [actions]);

  // Render thumbnail for a specific page
  const renderThumbnail = useCallback((pageNumber: number) => {
    const isActive = pageNumber === state.currentPage;
    
    return (
      <ThumbnailContainer
        key={pageNumber}
        isActive={isActive}
        isLoading={false} // Would implement actual loading state
        onClick={() => handleThumbnailClick(pageNumber)}
      >
        <ThumbnailImage
          src={`/api/placeholder-thumbnail/${pageNumber}`} // Placeholder
          alt={`Page ${pageNumber}`}
          onError={(e) => {
            // Fallback to placeholder on error
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSI0MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFnZSB7cGFnZU51bWJlcn08L3RleHQ+PC9zdmc+';
          }}
        />
        <ThumbnailPageNumber>
          {pageNumber}
        </ThumbnailPageNumber>
      </ThumbnailContainer>
    );
  }, [state.currentPage, handleThumbnailClick]);

  // Generate array of page numbers to display thumbnails
  const pageNumbers = Array.from({ length: state.totalPages }, (_, i) => i + 1);

  if (state.error) {
    return (
      <PageNavigatorSidebar style={{ width: sidebarWidth }} className={className}>
        <ErrorContainer>
          <Text size="sm">Error loading pages: {state.error}</Text>
        </ErrorContainer>
      </PageNavigatorSidebar>
    );
  }

  if (state.isLoading) {
    return (
      <PageNavigatorSidebar style={{ width: sidebarWidth }} className={className}>
        <LoadingContainer>
          <Text size="sm">Loading pages...</Text>
        </LoadingContainer>
      </PageNavigatorSidebar>
    );
  }

  return (
    <PageNavigatorSidebar 
      style={{ width: sidebarWidth }} 
      className={className}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Page Controls Header */}
      <Box p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
        <PageControls>
          <Tooltip label="First page" position="bottom">
            <NavigationButton
              disabled={computed.isFirstPage}
              onClick={actions.firstPage}
              size="sm"
              variant="subtle"
            >
              <IconChevronsLeft size={16} />
            </NavigationButton>
          </Tooltip>

          <Tooltip label="Previous page" position="bottom">
            <NavigationButton
              disabled={!computed.canGoPrevious}
              onClick={actions.previousPage}
              size="sm"
              variant="subtle"
            >
              <IconChevronLeft size={16} />
            </NavigationButton>
          </Tooltip>

          <PageInputContainer>
            <PageInput
              type="number"
              min={1}
              max={state.totalPages}
              value={state.currentPage}
              onChange={handlePageInputChange}
              aria-label="Current page"
            />
            <PageDisplay>
              / {state.totalPages}
            </PageDisplay>
          </PageInputContainer>

          <Tooltip label="Next page" position="bottom">
            <NavigationButton
              disabled={!computed.canGoNext}
              onClick={actions.nextPage}
              size="sm"
              variant="subtle"
            >
              <IconChevronRight size={16} />
            </NavigationButton>
          </Tooltip>

          <Tooltip label="Last page" position="bottom">
            <NavigationButton
              disabled={computed.isLastPage}
              onClick={actions.lastPage}
              size="sm"
              variant="subtle"
            >
              <IconChevronsRight size={16} />
            </NavigationButton>
          </Tooltip>

          <Tooltip label="Refresh thumbnails" position="bottom">
            <NavigationButton
              onClick={actions.refreshThumbnails}
              size="sm"
              variant="subtle"
            >
              <IconRefresh size={16} />
            </NavigationButton>
          </Tooltip>
        </PageControls>

        <Text size="xs" c="dimmed" mt="xs">
          {formatPageDisplay(state.currentPage, state.totalPages, 'long')}
        </Text>
      </Box>

      {/* Thumbnail Grid */}
      {showThumbnails && (
        <ThumbnailGrid>
          {pageNumbers.map(renderThumbnail)}
        </ThumbnailGrid>
      )}

      {/* Alternative list view when thumbnails disabled */}
      {!showThumbnails && (
        <Box p="md">
          {pageNumbers.map((pageNumber) => (
            <Box
              key={pageNumber}
              p="xs"
              style={{
                backgroundColor: pageNumber === state.currentPage ? '#e7f5ff' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '4px'
              }}
              onClick={() => handleThumbnailClick(pageNumber)}
            >
              <Text size="sm" fw={pageNumber === state.currentPage ? 600 : 400}>
                Page {pageNumber}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </PageNavigatorSidebar>
  );
});

PageNavigatorWeb.displayName = 'PageNavigatorWeb'; 