/**
 * VerticalSplitter TypeScript interfaces and types
 */

/**
 * Props for the VerticalSplitter component
 */
export interface VerticalSplitterProps {
  /** Current split ratio (0.0 to 1.0) */
  currentRatio: number;
  /** Column identifier for the split */
  column: 'left' | 'center' | 'right';
  /** Minimum ratio allowed */
  minRatio?: number;
  /** Maximum ratio allowed */
  maxRatio?: number;
  /** Callback when split operation starts */
  onSplitStart?: (ratio: number) => void;
  /** Callback during split operation */
  onSplit: (ratio: number) => void;
  /** Callback when split operation ends */
  onSplitEnd?: (ratio: number) => void;
  /** Whether the splitter is disabled */
  disabled?: boolean;
  /** Custom CSS className */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Internal state for split operation
 */
export interface SplitState {
  isSplitting: boolean;
  startY: number;
  startRatio: number;
  currentRatio: number;
  containerHeight: number;
}

/**
 * Split constraints configuration
 */
export interface SplitConstraints {
  minRatio: number;
  maxRatio: number;
  snapThreshold?: number;
  snapPoints?: number[];
}

/**
 * Split event data
 */
export interface SplitEvent {
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
  isTouch: boolean;
}

/**
 * Event handlers for split operations
 */
export interface SplitHandlers {
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleMove: (event: MouseEvent | TouchEvent) => void;
  handleEnd: () => void;
}

/**
 * Styled component props
 */
export interface SplitterStyles {
  $isSplitting: boolean;
  $disabled: boolean;
  $currentRatio: number;
  $column: 'left' | 'center' | 'right';
} 