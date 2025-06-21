/**
 * PanelSplitter Component Types
 * 
 * TypeScript interfaces for vertical panel splitting operations
 * Split from BidirectionalResizer for better type safety and clarity
 * 
 * @module PanelSplitter.types
 */

import React from 'react';

/**
 * Column identifier for panel splitting
 */
export type ColumnType = 'left' | 'center' | 'right';

/**
 * Configuration for panel split behavior
 * Specialized for vertical splitting within columns
 */
export interface PanelSplitConfig {
  /** Which column contains this splitter */
  column: ColumnType;
  /** Current split ratio (0.0 to 1.0) */
  currentRatio: number;
  /** Minimum split ratio */
  minRatio: number;
  /** Maximum split ratio */
  maxRatio: number;
  /** Container dimensions for constraint calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Props for the PanelSplitter component
 * Focused on vertical panel splitting functionality
 */
export interface PanelSplitterProps {
  /** Panel split configuration */
  splitConfig: PanelSplitConfig;
  /** Handler for split ratio changes */
  onSplitChange: (newRatio: number) => void;
  /** Whether splitter is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Children content (optional handle content) */
  children?: React.ReactNode;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * Split state for tracking drag operations
 */
export interface PanelSplitState {
  y: number;           // Starting Y position
  ratio: number;       // Starting split ratio
}

/**
 * Styled component props for the splitter container
 */
export interface StyledPanelSplitterProps {
  column: ColumnType;
  isActive: boolean;
  touchSize: number;
}

/**
 * Styled component props for the split handle
 */
export interface StyledVerticalHandleProps {
  column: ColumnType;
}

/**
 * Constraints for panel splitting
 */
export interface PanelSplitConstraints {
  min: number;
  max: number;
}

/**
 * Return type for the usePanelSplitter hook
 */
export interface PanelSplitterHookReturn {
  isDragging: boolean;
  isResizing: boolean;
  currentRatio: number;
  constraints: PanelSplitConstraints;
  splitterRef: React.RefObject<HTMLDivElement>;
  handlers: {
    onMouseDown: (event: React.MouseEvent | React.TouchEvent) => void;
    onTouchStart: (event: React.MouseEvent | React.TouchEvent) => void;
  };
  actions: {
    resetToDefault: () => void;
    toggleLock: () => void;
  };
}

/**
 * Return type for the usePanelSplitHandlers hook (legacy compatibility)
 */
export interface UsePanelSplitHandlers {
  isResizing: boolean;
  isHovered: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  setIsHovered: (hovered: boolean) => void;
} 