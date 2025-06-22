import type { ViewMode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.types';

export interface ViewportControlsProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Current zoom level */
  zoom: number;
  /** Touch target configuration */
  touchTargetConfig: { minSize: string | number };
  /** Whether device is mobile */
  isMobile: boolean;
  /** Can zoom in */
  canZoomIn: boolean;
  /** Can zoom out */
  canZoomOut: boolean;
  /** Can go to next page */
  canGoNext: boolean;
  /** Can go to previous page */
  canGoPrev: boolean;
  /** View mode change handler */
  onViewModeChange: (mode: ViewMode) => void;
  /** Zoom in handler */
  onZoomIn: () => void;
  /** Zoom out handler */
  onZoomOut: () => void;
  /** Previous page handler */
  onPrevPage: () => void;
  /** Next page handler */
  onNextPage: () => void;
} 