/**
 * CenterPanel Component Types
 * 
 * TypeScript interfaces for center panel component system
 * Adapted from LeftPanel/RightPanel pattern for center content area
 * Handles document canvas and bottom panel integration
 * 
 * @module CenterPanel.types
 */

import React from 'react';

export interface CenterContent {
  /** Content unique identifier */
  id: string;
  /** Content display title */
  title: string;
  /** Content component */
  content: React.ReactNode;
  /** Whether content is scrollable */
  scrollable?: boolean;
  /** Whether content fills available space */
  fillSpace?: boolean;
  /** Custom styling for content area */
  className?: string;
}

export interface CenterPanelProps {
  /** Main document content */
  documentContent?: CenterContent;
  /** Bottom panel content (timeline, properties, etc.) */
  bottomPanel?: CenterContent;
  /** Current bottom panel height percentage (0-100) */
  bottomHeight: number;
  /** Whether bottom panel is visible */
  bottomVisible: boolean;
  /** Bottom panel resize handler */
  onBottomResize?: (newHeight: number) => void;
  /** Bottom panel toggle handler */
  onBottomToggle?: (visible: boolean) => void;
  /** Container dimensions for calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
  /** Left panel width for layout calculations */
  leftPanelWidth?: number;
  /** Right panel width for layout calculations */
  rightPanelWidth?: number;
}

export interface CenterPanelLogic {
  /** Handle bottom panel height resize */
  handleBottomResize: (newHeight: number) => void;
  /** Handle bottom panel toggle */
  handleBottomToggle: (visible: boolean) => void;
  /** Calculate available document area */
  calculateDocumentArea: () => {
    width: number;
    height: number;
  };
  /** Current panel states */
  panelStates: {
    bottomCollapsed: boolean;
    documentFocused: boolean;
  };
} 