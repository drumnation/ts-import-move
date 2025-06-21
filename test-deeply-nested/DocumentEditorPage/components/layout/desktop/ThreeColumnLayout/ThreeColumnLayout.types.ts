/**
 * ThreeColumnLayout Component Types
 * 
 * TypeScript interfaces for desktop three-column layout system
 * Coordinates left, center, and right columns with resizing
 * Supports Redux state integration and column coordination
 * 
 * @module ThreeColumnLayout.types
 */

import React from 'react';

export interface ColumnConfiguration {
  /** Column width in pixels */
  width: number;
  /** Whether column is visible */
  visible: boolean;
  /** Whether column is collapsible */
  collapsible: boolean;
  /** Minimum width constraint */
  minWidth: number;
  /** Maximum width constraint */
  maxWidth: number;
  /** Whether column is currently collapsed */
  collapsed: boolean;
}

export interface ThreeColumnState {
  /** Left column configuration */
  leftColumn: ColumnConfiguration;
  /** Right column configuration */
  rightColumn: ColumnConfiguration;
  /** Center column takes remaining space */
  centerColumn: {
    /** Minimum width constraint */
    minWidth: number;
    /** Whether center has bottom panel */
    hasBottomPanel: boolean;
    /** Bottom panel height percentage */
    bottomPanelHeight: number;
  };
  /** Total container dimensions */
  containerDimensions: {
    width: number;
    height: number;
  };
}

export interface ThreeColumnLayoutProps {
  /** Current column state */
  columnState: ThreeColumnState;
  /** Left column content */
  leftContent?: React.ReactNode;
  /** Center column content */
  centerContent?: React.ReactNode;
  /** Right column content */
  rightContent?: React.ReactNode;
  /** Bottom panel content */
  bottomContent?: React.ReactNode;
  /** Column resize handlers */
  onColumnResize?: {
    left?: (width: number) => void;
    right?: (width: number) => void;
    bottom?: (height: number) => void;
  };
  /** Column visibility handlers */
  onColumnToggle?: {
    left?: (visible: boolean) => void;
    right?: (visible: boolean) => void;
    bottom?: (visible: boolean) => void;
  };
  /** Column collapse handlers */
  onColumnCollapse?: {
    left?: (collapsed: boolean) => void;
    right?: (collapsed: boolean) => void;
  };
  /** Container resize handler */
  onContainerResize?: (dimensions: { width: number; height: number }) => void;
}

export interface ThreeColumnLayoutLogic {
  /** Handle left column resize */
  handleLeftColumnResize: (width: number) => void;
  /** Handle right column resize */
  handleRightColumnResize: (width: number) => void;
  /** Handle bottom panel resize */
  handleBottomPanelResize: (height: number) => void;
  /** Handle column visibility toggle */
  handleColumnToggle: (column: 'left' | 'right' | 'bottom', visible: boolean) => void;
  /** Handle column collapse */
  handleColumnCollapse: (column: 'left' | 'right', collapsed: boolean) => void;
  /** Calculate center column width */
  calculateCenterWidth: () => number;
  /** Calculate available space for columns */
  calculateAvailableSpace: () => {
    totalWidth: number;
    usedWidth: number;
    remainingWidth: number;
  };
  /** Validate resize operation */
  validateResize: (column: 'left' | 'right', newWidth: number) => boolean;
  /** Get current layout metrics */
  getLayoutMetrics: () => {
    leftWidth: number;
    rightWidth: number;
    centerWidth: number;
    totalWidth: number;
  };
}

export interface ResizeOperation {
  /** Column being resized */
  column: 'left' | 'right';
  /** Current width */
  currentWidth: number;
  /** Proposed new width */
  newWidth: number;
  /** Delta change */
  delta: number;
  /** Whether operation is valid */
  isValid: boolean;
  /** Reason if invalid */
  invalidReason?: string;
}

export interface ColumnConstraints {
  /** Minimum widths for each column */
  minWidths: {
    left: number;
    right: number;
    center: number;
  };
  /** Maximum widths for side columns */
  maxWidths: {
    left: number;
    right: number;
  };
  /** Total container constraints */
  container: {
    minWidth: number;
    minHeight: number;
  };
} 