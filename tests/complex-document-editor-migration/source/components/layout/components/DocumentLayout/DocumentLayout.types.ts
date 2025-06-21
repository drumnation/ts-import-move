/**
 * DocumentLayout Component Types
 * 
 * TypeScript interfaces for main document editor layout system
 * Coordinates three-panel layout with platform-specific implementations
 * Supports Redux state integration and responsive behavior
 * 
 * @module DocumentLayout.types
 */

import React from 'react';

export interface LayoutDimensions {
  /** Total container width */
  width: number;
  /** Total container height */
  height: number;
  /** Left panel width in pixels */
  leftPanelWidth: number;
  /** Right panel width in pixels */
  rightPanelWidth: number;
  /** Bottom panel height percentage (0-100) */
  bottomPanelHeight: number;
}

export interface PanelVisibility {
  /** Left panel visibility state */
  leftPanel: boolean;
  /** Right panel visibility state */
  rightPanel: boolean;
  /** Bottom panel visibility state */
  bottomPanel: boolean;
}

export interface LayoutConfiguration {
  /** Panel visibility states */
  panelVisibility: PanelVisibility;
  /** Layout dimensions */
  dimensions: LayoutDimensions;
  /** Whether layout is in mobile mode */
  isMobile: boolean;
  /** Active mobile panel (when in mobile mode) */
  activeMobilePanel?: 'left' | 'right' | 'bottom' | null;
  /** Layout animation preferences */
  animations: {
    enableTransitions: boolean;
    transitionDuration: number;
  };
}

export interface DocumentLayoutProps {
  /** Layout configuration */
  config: LayoutConfiguration;
  /** Left panel content */
  leftPanelContent?: React.ReactNode;
  /** Right panel content */
  rightPanelContent?: React.ReactNode;
  /** Center document content */
  documentContent?: React.ReactNode;
  /** Bottom panel content */
  bottomPanelContent?: React.ReactNode;
  /** Layout configuration change handler */
  onConfigChange?: (newConfig: Partial<LayoutConfiguration>) => void;
  /** Panel resize handlers */
  onPanelResize?: {
    left?: (width: number) => void;
    right?: (width: number) => void;
    bottom?: (height: number) => void;
  };
  /** Panel toggle handlers */
  onPanelToggle?: {
    left?: (visible: boolean) => void;
    right?: (visible: boolean) => void;
    bottom?: (visible: boolean) => void;
  };
  /** Mobile panel navigation handler */
  onMobilePanelChange?: (panel: 'left' | 'right' | 'bottom' | null) => void;
}

export interface DocumentLayoutLogic {
  /** Handle left panel resize */
  handleLeftPanelResize: (width: number) => void;
  /** Handle right panel resize */
  handleRightPanelResize: (width: number) => void;
  /** Handle bottom panel resize */
  handleBottomPanelResize: (height: number) => void;
  /** Handle panel visibility toggle */
  handlePanelToggle: (panel: keyof PanelVisibility, visible: boolean) => void;
  /** Handle mobile panel navigation */
  handleMobilePanelNavigation: (panel: 'left' | 'right' | 'bottom' | null) => void;
  /** Calculate available document area */
  calculateDocumentArea: () => {
    width: number;
    height: number;
  };
  /** Get current layout state */
  getLayoutState: () => LayoutConfiguration;
  /** Check if layout is in mobile mode */
  isMobileLayout: boolean;
}

export interface ResizeConstraints {
  /** Minimum panel widths */
  minWidths: {
    left: number;
    right: number;
    center: number;
  };
  /** Maximum panel widths */
  maxWidths: {
    left: number;
    right: number;
  };
  /** Minimum/maximum bottom panel height percentages */
  bottomHeight: {
    min: number;
    max: number;
  };
} 