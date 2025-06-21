/**
 * PageNavigator Component
 * 
 * Entry point component with platform detection and routing
 * Implements Level 3 platform separation using Platform Pathways pattern
 * 
 * @module PageNavigator
 */

import React, { memo } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { PageNavigatorWeb } from './PageNavigator.web';
import { PageNavigatorMobile } from './PageNavigator.mobile';
import type { PageNavigatorProps } from './PageNavigator.types';

/**
 * PageNavigator with automatic platform detection
 * Routes to appropriate platform-specific implementation based on screen size
 */
export const PageNavigator = memo<PageNavigatorProps>(({
  className,
  ...props
}) => {
  // Use Mantine's responsive breakpoint for platform detection
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Route to appropriate platform implementation
  if (isMobile) {
    return (
      <PageNavigatorMobile 
        {...props}
        className={className}
        position="bottom"
        showIndicators={true}
        enableSwipe={true}
        compact={false}
      />
    );
  }

  return (
    <PageNavigatorWeb
      {...props}
      className={className}
      showThumbnails={true}
      thumbnailSize="medium"
      sidebarWidth={240}
      enableReorder={false}
    />
  );
});

PageNavigator.displayName = 'PageNavigator'; 