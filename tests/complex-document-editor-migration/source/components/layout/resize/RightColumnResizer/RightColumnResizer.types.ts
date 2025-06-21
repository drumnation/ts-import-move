/**
 * RightColumnResizer Component Types
 * TypeScript interfaces for right column resizing functionality
 */

/**
 * RightColumnResizer Props
 */
export interface RightColumnResizerProps {
  /** Current width of the right column */
  currentWidth: number;
  /** Minimum allowed width */
  minWidth?: number;
  /** Maximum allowed width */
  maxWidth?: number;
  /** Callback when resize operation starts */
  onResizeStart?: (width: number) => void;
  /** Callback during resize operation */
  onResize: (width: number) => void;
  /** Callback when resize operation ends */
  onResizeEnd?: (width: number) => void;
  /** Whether the resizer is disabled */
  disabled?: boolean;
  /** Custom CSS className */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * RightResizeState
 */
export interface RightResizeState {
  /** Whether resize operation is active */
  isResizing: boolean;
  /** Preview width during resize */
  previewWidth: number;
  /** Starting X coordinate */
  startX: number;
  /** Starting width */
  startWidth: number;
}

/**
 * RightResizeConstraints
 */
export interface RightResizeConstraints {
  /** Minimum allowed width */
  minWidth: number;
  /** Maximum allowed width */
  maxWidth: number;
  /** Available space for right column */
  availableSpace: number;
  /** Whether constraints are valid */
  isValid: boolean;
}

/**
 * RightResizeEvent
 */
export interface RightResizeEvent {
  /** Event type */
  type: 'start' | 'move' | 'end';
  /** Current width */
  width: number;
  /** Delta from start (negative for right column) */
  deltaX: number;
  /** Timestamp */
  timestamp: number;
}

/**
 * RightColumnResizerLogic
 */
export interface RightColumnResizerLogic {
  /** Current resize state */
  resizeState: RightResizeState;
  /** Calculated constraints */
  constraints: RightResizeConstraints;
  /** Whether resizer is active */
  isActive: boolean;
  /** Preview width for visualization */
  previewWidth: number;
  /** Formatted width display */
  widthDisplay: string;
  /** Mouse down handler */
  handleMouseDown: (event: React.MouseEvent) => void;
  /** Calculate maximum allowed width */
  calculateMaxWidth: () => number;
  /** Validate and clamp width */
  validateWidth: (width: number) => number;
  /** Check if resize is allowed */
  canResize: (newWidth: number) => boolean;
}

/**
 * RightResizerStyles
 */
export interface RightResizerStyles {
  /** Container styles */
  container?: React.CSSProperties;
  /** Handle styles */
  handle?: React.CSSProperties;
  /** Preview line styles */
  preview?: React.CSSProperties;
  /** Width indicator styles */
  indicator?: React.CSSProperties;
}

// Animation variants for resizer components
export const rightResizerVariants = {
  idle: {
    scale: 1,
    opacity: 0.6
  },
  hover: {
    scale: 1.1,
    opacity: 0.8
  },
  active: {
    scale: 1.2,
    opacity: 1
  }
};

// Default constraints for right column
export const DEFAULT_RIGHT_CONSTRAINTS = {
  minWidth: 200,
  maxWidth: 500,
  centerMinWidth: 400,
  containerPadding: 20
} as const;

// Resize event types
export type RightResizeEventType = 'start' | 'move' | 'end' | 'cancel';

export interface RightResizeHandlers {
  onResizeStart?: () => void;
  onResize?: (width: number) => void;
  onResizeEnd?: () => void;
  onResizeCancel?: () => void;
}

/**
 * Internal state for resize operation
 */
export interface ResizeState {
  isResizing: boolean;
  startX: number;
  startWidth: number;
  currentWidth: number;
}

/**
 * Resize constraints configuration
 */
export interface ResizeConstraints {
  minWidth: number;
  maxWidth: number;
  snapThreshold?: number;
  snapPoints?: number[];
}

/**
 * Resize event data
 */
export interface ResizeEvent {
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
  isTouch: boolean;
}

/**
 * Event handlers for resize operations
 */
export interface ResizeHandlers {
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleMove: (event: MouseEvent | TouchEvent) => void;
  handleEnd: () => void;
}

/**
 * Styled component props
 */
export interface ResizerStyles {
  $isResizing: boolean;
  $disabled: boolean;
  $currentWidth: number;
} 