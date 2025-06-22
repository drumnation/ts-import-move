import type { MultiPageDocument } from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.types';

export interface DocumentViewportProps {
  /** Document data */
  document: MultiPageDocument;
  /** Page change handler */
  onPageChange: (pageIndex: number) => void;
  /** View mode change handler */
  onViewModeChange: (mode: 'single' | 'infinite' | 'thumbnail') => void;
  /** Node insertion handler */
  onInsertNode?: (nodeType: string) => void;
}

export interface PageWrapperProps {
  isActive: boolean;
  viewMode: string;
  isMobile: boolean;
}

export interface PageContentProps {
  viewMode: string;
  isMobile: boolean;
}

export interface PageNumberProps {
  isMobile: boolean;
}

export interface NavigationControlsProps {
  isMobile: boolean;
}

export interface ThumbnailGridProps {
  isMobile: boolean;
}

export interface ViewportHeaderProps {
  isMobile: boolean;
}

export type ViewMode = 'single' | 'infinite' | 'thumbnail';

export interface ZoomState {
  level: number;
  min: number;
  max: number;
  step: number;
}

export interface NavigationState {
  canGoNext: boolean;
  canGoPrev: boolean;
  currentPage: number;
  totalPages: number;
} 