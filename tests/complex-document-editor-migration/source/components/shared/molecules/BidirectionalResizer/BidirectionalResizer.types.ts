import React from 'react';

export interface BidirectionalResizerProps {
  /** Resize configuration */
  config: any; // Will be properly typed later
  /** Resize handler */
  onResize: (newSize: number) => void;
  /** Whether resizer is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Children content (optional handle content) */
  children?: React.ReactNode;
  /** Type of resize operation - 'column' for width, 'split' for vertical panel division */
  resizeType?: 'column' | 'split' | 'panel';
}

export interface ResizePosition {
  x: number;
  y: number;
  size: number;
}

export interface StyledResizerProps {
  direction: 'horizontal' | 'vertical';
  panelPosition?: 'left' | 'right' | 'center';
  isActive: boolean;
  touchSize: number;
  resizeType?: 'column' | 'split' | 'panel';
  currentSize?: number;
}

export interface StyledHandleProps {
  direction: 'horizontal' | 'vertical';
} 