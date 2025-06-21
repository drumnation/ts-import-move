export interface ResizablePanelProps {
  /** Panel content */
  children: React.ReactNode;
  /** Initial width */
  initialWidth: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Panel position */
  position: 'left' | 'right';
  /** Whether panel is collapsed */
  isCollapsed: boolean;
  /** Width change handler */
  onWidthChange: (width: number) => void;
  /** Collapse toggle handler */
  onToggleCollapse: () => void;
  /** Rail content when collapsed */
  railContent?: React.ReactNode;
}

export interface ResizeState {
  currentWidth: number;
  isDragging: boolean;
  startX: number;
  startWidth: number;
}

export interface TouchConfig {
  minSize: number;
  spacing: number;
}

export type PanelPosition = 'left' | 'right'; 