/**
 * ThreeColumnLayout Shared Logic
 * 
 * Business logic and state management for desktop three-column layout
 * Handles column resizing, validation, and coordination
 * Ensures layout constraints and prevents conflicts
 * 
 * @module ThreeColumnLayout.logic
 */

import { useCallback, useState, useMemo, useEffect } from 'react';
import type { 
  ThreeColumnLayoutProps, 
  ThreeColumnLayoutLogic, 
  ThreeColumnState,
  ColumnConstraints,
  ResizeOperation 
} from '@/tests/complex-document-editor-migration/source/components/layout/desktop/ThreeColumnLayout/ThreeColumnLayout.types';

/**
 * Default column constraints
 */
const DEFAULT_CONSTRAINTS: ColumnConstraints = {
  minWidths: {
    left: 200,
    right: 200,
    center: 400,
  },
  maxWidths: {
    left: 500,
    right: 500,
  },
  container: {
    minWidth: 1000,
    minHeight: 600,
  },
};

/**
 * Default three-column state
 */
const DEFAULT_COLUMN_STATE: ThreeColumnState = {
  leftColumn: {
    width: 300,
    visible: true,
    collapsible: true,
    minWidth: 200,
    maxWidth: 500,
    collapsed: false,
  },
  rightColumn: {
    width: 300,
    visible: true,
    collapsible: true,
    minWidth: 200,
    maxWidth: 500,
    collapsed: false,
  },
  centerColumn: {
    minWidth: 400,
    hasBottomPanel: false,
    bottomPanelHeight: 30,
  },
  containerDimensions: {
    width: 1200,
    height: 800,
  },
};

/**
 * Custom hook providing shared three-column layout logic
 * Follows React component standards for hooks
 */
export const useThreeColumnLayout = (props: ThreeColumnLayoutProps): ThreeColumnLayoutLogic => {
  const {
    columnState = DEFAULT_COLUMN_STATE,
    onColumnResize,
    onColumnToggle,
    onColumnCollapse,
    onContainerResize,
  } = props;

  // Local state for column configuration
  const [localColumnState, setLocalColumnState] = useState<ThreeColumnState>(columnState);

  // Update local state when props change
  useEffect(() => {
    setLocalColumnState(columnState);
  }, [columnState]);

  /**
   * Validate resize operation against constraints
   */
  const validateResize = useCallback((column: 'left' | 'right', newWidth: number): boolean => {
    const constraints = DEFAULT_CONSTRAINTS;
    const { containerDimensions } = localColumnState;
    
    // Check minimum and maximum width constraints
    if (column === 'left') {
      if (newWidth < constraints.minWidths.left || newWidth > constraints.maxWidths.left) {
        return false;
      }
    } else {
      if (newWidth < constraints.minWidths.right || newWidth > constraints.maxWidths.right) {
        return false;
      }
    }

    // Calculate remaining space for center column
    const otherColumnWidth = column === 'left' 
      ? localColumnState.rightColumn.width 
      : localColumnState.leftColumn.width;
    
    const remainingWidth = containerDimensions.width - newWidth - otherColumnWidth;
    
    // Ensure center column maintains minimum width
    if (remainingWidth < constraints.minWidths.center) {
      return false;
    }

    return true;
  }, [localColumnState]);

  /**
   * Handle left column resize with validation
   */
  const handleLeftColumnResize = useCallback((width: number) => {
    if (!validateResize('left', width)) {
      return;
    }

    const updatedState = {
      ...localColumnState,
      leftColumn: {
        ...localColumnState.leftColumn,
        width,
      },
    };

    setLocalColumnState(updatedState);
    onColumnResize?.left?.(width);
  }, [localColumnState, validateResize, onColumnResize]);

  /**
   * Handle right column resize with validation
   */
  const handleRightColumnResize = useCallback((width: number) => {
    if (!validateResize('right', width)) {
      return;
    }

    const updatedState = {
      ...localColumnState,
      rightColumn: {
        ...localColumnState.rightColumn,
        width,
      },
    };

    setLocalColumnState(updatedState);
    onColumnResize?.right?.(width);
  }, [localColumnState, validateResize, onColumnResize]);

  /**
   * Handle bottom panel resize
   */
  const handleBottomPanelResize = useCallback((height: number) => {
    // Clamp height between 10% and 60%
    const clampedHeight = Math.max(10, Math.min(60, height));

    const updatedState = {
      ...localColumnState,
      centerColumn: {
        ...localColumnState.centerColumn,
        bottomPanelHeight: clampedHeight,
      },
    };

    setLocalColumnState(updatedState);
    onColumnResize?.bottom?.(clampedHeight);
  }, [localColumnState, onColumnResize]);

  /**
   * Handle column visibility toggle
   */
  const handleColumnToggle = useCallback((column: 'left' | 'right' | 'bottom', visible: boolean) => {
    if (column === 'bottom') {
      const updatedState = {
        ...localColumnState,
        centerColumn: {
          ...localColumnState.centerColumn,
          hasBottomPanel: visible,
        },
      };
      setLocalColumnState(updatedState);
      onColumnToggle?.bottom?.(visible);
    } else {
      const updatedState = {
        ...localColumnState,
        [column + 'Column']: {
          ...localColumnState[column + 'Column' as keyof ThreeColumnState],
          visible,
        },
      };
      setLocalColumnState(updatedState);
      onColumnToggle?.[column]?.(visible);
    }
  }, [localColumnState, onColumnToggle]);

  /**
   * Handle column collapse
   */
  const handleColumnCollapse = useCallback((column: 'left' | 'right', collapsed: boolean) => {
    const updatedState = {
      ...localColumnState,
      [column + 'Column']: {
        ...localColumnState[column + 'Column' as keyof ThreeColumnState],
        collapsed,
      },
    };

    setLocalColumnState(updatedState);
    onColumnCollapse?.[column]?.(collapsed);
  }, [localColumnState, onColumnCollapse]);

  /**
   * Calculate center column width
   * Memoized for performance optimization
   */
  const calculateCenterWidth = useMemo(() => {
    return () => {
      const { leftColumn, rightColumn, containerDimensions } = localColumnState;
      
      const leftWidth = leftColumn.visible && !leftColumn.collapsed ? leftColumn.width : 0;
      const rightWidth = rightColumn.visible && !rightColumn.collapsed ? rightColumn.width : 0;
      
      const centerWidth = containerDimensions.width - leftWidth - rightWidth;
      
      return Math.max(DEFAULT_CONSTRAINTS.minWidths.center, centerWidth);
    };
  }, [localColumnState]);

  /**
   * Calculate available space for columns
   */
  const calculateAvailableSpace = useMemo(() => {
    return () => {
      const { leftColumn, rightColumn, containerDimensions } = localColumnState;
      
      const leftWidth = leftColumn.visible && !leftColumn.collapsed ? leftColumn.width : 0;
      const rightWidth = rightColumn.visible && !rightColumn.collapsed ? rightColumn.width : 0;
      const usedWidth = leftWidth + rightWidth;
      
      return {
        totalWidth: containerDimensions.width,
        usedWidth,
        remainingWidth: containerDimensions.width - usedWidth,
      };
    };
  }, [localColumnState]);

  /**
   * Get current layout metrics
   */
  const getLayoutMetrics = useCallback(() => {
    const { leftColumn, rightColumn, containerDimensions } = localColumnState;
    
    const leftWidth = leftColumn.visible && !leftColumn.collapsed ? leftColumn.width : 0;
    const rightWidth = rightColumn.visible && !rightColumn.collapsed ? rightColumn.width : 0;
    const centerWidth = calculateCenterWidth();
    
    return {
      leftWidth,
      rightWidth,
      centerWidth,
      totalWidth: containerDimensions.width,
    };
  }, [localColumnState, calculateCenterWidth]);

  return {
    handleLeftColumnResize,
    handleRightColumnResize,
    handleBottomPanelResize,
    handleColumnToggle,
    handleColumnCollapse,
    calculateCenterWidth,
    calculateAvailableSpace,
    validateResize,
    getLayoutMetrics,
  };
}; 