/**
 * PageNavigator Component Types
 * 
 * TypeScript interfaces for page navigation functionality across platforms
 * Desktop: Sidebar with page thumbnails
 * Mobile: Bottom navigation bar
 * 
 * @module PageNavigator.types
 */

import { Document } from '@/stores/document.types';

export interface PageNavigatorProps {
  /** Current document for page navigation */
  document?: Document;
  /** Current active page number (1-indexed) */
  currentPage: number;
  /** Total number of pages in document */
  totalPages: number;
  /** Callback when page is selected */
  onPageChange: (pageNumber: number) => void;
  /** Loading state for page thumbnails */
  isLoading?: boolean;
  /** Error state for page navigation */
  error?: string | null;
  /** Additional CSS classes */
  className?: string;
}

export interface PageNavigatorWebProps extends PageNavigatorProps {
  /** Desktop-specific: Show page thumbnails */
  showThumbnails?: boolean;
  /** Desktop-specific: Thumbnail size */
  thumbnailSize?: 'small' | 'medium' | 'large';
  /** Desktop-specific: Sidebar width */
  sidebarWidth?: number;
  /** Desktop-specific: Enable drag to reorder pages */
  enableReorder?: boolean;
}

export interface PageNavigatorMobileProps extends PageNavigatorProps {
  /** Mobile-specific: Position of navigation bar */
  position?: 'bottom' | 'top';
  /** Mobile-specific: Show page indicators */
  showIndicators?: boolean;
  /** Mobile-specific: Enable swipe navigation */
  enableSwipe?: boolean;
  /** Mobile-specific: Compact mode for small screens */
  compact?: boolean;
}

export interface PageThumbnail {
  /** Page number (1-indexed) */
  pageNumber: number;
  /** Thumbnail image URL or base64 */
  thumbnailUrl?: string;
  /** Page title or label */
  title?: string;
  /** Page dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Loading state for individual thumbnail */
  isLoading?: boolean;
  /** Error state for thumbnail generation */
  error?: string | null;
}

export interface PageNavigationState {
  /** Currently selected page */
  currentPage: number;
  /** Total pages available */
  totalPages: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Page thumbnails cache */
  thumbnails: Map<number, PageThumbnail>;
  /** Navigation history for back/forward */
  history: number[];
  /** Current position in history */
  historyIndex: number;
}

export interface PageNavigationActions {
  /** Navigate to specific page */
  goToPage: (pageNumber: number) => void;
  /** Navigate to next page */
  nextPage: () => void;
  /** Navigate to previous page */
  previousPage: () => void;
  /** Navigate to first page */
  firstPage: () => void;
  /** Navigate to last page */
  lastPage: () => void;
  /** Go back in navigation history */
  goBack: () => void;
  /** Go forward in navigation history */
  goForward: () => void;
  /** Generate thumbnail for page */
  generateThumbnail: (pageNumber: number) => Promise<string>;
  /** Refresh thumbnails */
  refreshThumbnails: () => void;
}

export interface PageNavigatorLogicHook {
  /** Navigation state */
  state: PageNavigationState;
  /** Navigation actions */
  actions: PageNavigationActions;
  /** Computed properties */
  computed: {
    canGoBack: boolean;
    canGoForward: boolean;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    pageRange: { start: number; end: number };
  };
}

export type PageNavigatorVariant = 'web' | 'mobile';

export interface PageNavigatorStyleProps {
  /** Variant for platform-specific styling */
  variant: PageNavigatorVariant;
  /** Current theme mode */
  theme?: 'light' | 'dark';
  /** Component size */
  size?: 'small' | 'medium' | 'large';
} 