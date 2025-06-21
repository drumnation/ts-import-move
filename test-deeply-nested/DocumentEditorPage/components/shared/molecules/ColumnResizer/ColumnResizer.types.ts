/**
 * ColumnResizer Component Types
 * 
 * TypeScript interfaces for column-specific resize operations
 * Split from BidirectionalResizer for better type safety and clarity
 * 
 * @module ColumnResizer.types
 */

import React from 'react';

/**
 * Configuration for column resize behavior
 * Specialized for sidebar column width adjustments
 */
export interface ColumnResizeConfig {
  /** Which column this resizer controls */
  columnPosition: 'left' | 'right';
  /** Current column width in pixels */
  currentWidth: number;
  /** Minimum column width in pixels */
  minWidth: number;
  /** Maximum column width in pixels */
  maxWidth: number;
  /** Container dimensions for constraint calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
  /** Constraint percentages */
  constraints: {
    minPercent: number; // e.g., 15 for 15% of container width
    maxPercent: number; // e.g., 50 for 50% of container width
  };
}

/**
 * Props for the ColumnResizer component
 * Focused on horizontal column resizing functionality
 */
export interface ColumnResizerProps {
  /** Column resize configuration */
  columnConfig: ColumnResizeConfig;
  /** Handler for column width changes */
  onColumnResize: (newWidth: number) => void;
  /** Whether resizer is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Children content (optional handle content) */
  children?: React.ReactNode;
}

/**
 * Resize state for tracking drag operations
 */
export interface ColumnResizeState {
  x: number;           // Starting X position
  width: number;       // Starting column width
}

/**
 * Styled component props for the resizer container
 */
export interface StyledColumnResizerProps {
  columnPosition: 'left' | 'right';
  isActive: boolean;
  touchSize: number;
}

/**
 * Styled component props for the resize handle
 */
export interface StyledHorizontalHandleProps {
  columnPosition: 'left' | 'right';
}

/**
 * Return type for the useColumnResizeHandlers hook
 */
export interface UseColumnResizeHandlers {
  isResizing: boolean;
  isHovered: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  setIsHovered: (hovered: boolean) => void;
}

/**
 * Resize direction type alias
 */
export type ResizeDirection = 'left' | 'right';

/**
 * Constraints for column resizing
 */
export interface ColumnConstraints {
  min: number;
  max: number;
}

/**
 * Return type for the useColumnResizer hook
 */
export interface ColumnResizerHookReturn {
  isDragging: boolean;
  isResizing: boolean;
  currentSize: number;
  constraints: ColumnConstraints;
  dragRef: React.RefObject<HTMLDivElement>;
  handlers: {
    onMouseDown: (event: React.MouseEvent | React.TouchEvent) => void;
    onTouchStart: (event: React.MouseEvent | React.TouchEvent) => void;
  };
  actions: {
    resetToDefault: () => void;
    toggleLock: () => void;
  };
} 