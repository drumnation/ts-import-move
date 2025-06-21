/**
 * LeftColumnResizer Component Types
 * TypeScript interfaces for left column resizing functionality
 */

/**
 * Props for LeftColumnResizer component
 */
export interface LeftColumnResizerProps {
  /** Current width of the left column */
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
 * Internal state for resize operations
 */
export interface ResizeState {
  /** Whether resize operation is active */
  isResizing: boolean;
  /** Starting X coordinate */
  startX: number;
  /** Starting width */
  startWidth: number;
  /** Current width */
  currentWidth: number;
}

/**
 * Resize constraints calculation
 */
export interface ResizeConstraints {
  /** Minimum allowed width */
  minWidth: number;
  /** Maximum allowed width */
  maxWidth: number;
  /** Available space for left column */
  availableSpace: number;
  /** Whether constraints are valid */
  isValid: boolean;
  /** Snap threshold for snapping */
  snapThreshold?: number;
  /** Snap points for snapping */
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

export interface LeftColumnResizerLogic {
  /** Current resize state */
  resizeState: ResizeState;
  /** Calculated constraints */
  constraints: ResizeConstraints;
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
  /** Container styles */
  container?: React.CSSProperties;
  /** Handle styles */
  handle?: React.CSSProperties;
  /** Preview line styles */
  preview?: React.CSSProperties;
  /** Width indicator styles */
  indicator?: React.CSSProperties;
  /** Whether resizer is resizing */
  $isResizing: boolean;
  /** Whether resizer is disabled */
  $disabled: boolean;
  /** Current width */
  $currentWidth: number;
}

// Animation variants for resizer components
export const resizerVariants = {
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

// Default constraints
export const DEFAULT_CONSTRAINTS = {
  minWidth: 200,
  maxWidth: 500,
  centerMinWidth: 400,
  containerPadding: 20
} as const;

// Resize event types
export type ResizeEventType = 'start' | 'move' | 'end' | 'cancel';

export interface ResizeHandlers {
  onResizeStart?: () => void;
  onResize?: (width: number) => void;
  onResizeEnd?: () => void;
  onResizeCancel?: () => void;
} 