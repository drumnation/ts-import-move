/**
 * DocumentLayout Shared Logic
 * 
 * Business logic and state management for document editor layout
 * Platform-independent logic for three-panel coordination
 * Handles resize calculations and panel state management
 * 
 * @module DocumentLayout.logic
 */

import { useCallback, useState, useMemo, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { 
  DocumentLayoutProps, 
  DocumentLayoutLogic, 
  LayoutConfiguration,
  PanelVisibility,
  ResizeConstraints 
} from './DocumentLayout.types';

/**
 * Default layout configuration
 */
const DEFAULT_LAYOUT_CONFIG: LayoutConfiguration = {
  panelVisibility: {
    leftPanel: true,
    rightPanel: true,
    bottomPanel: false,
  },
  dimensions: {
    width: 1200,
    height: 800,
    leftPanelWidth: 300,
    rightPanelWidth: 300,
    bottomPanelHeight: 30,
  },
  isMobile: false,
  activeMobilePanel: null,
  animations: {
    enableTransitions: true,
    transitionDuration: 300,
  },
};

/**
 * Resize constraints for panels
 */
const RESIZE_CONSTRAINTS: ResizeConstraints = {
  minWidths: {
    left: 200,
    right: 200,
    center: 400,
  },
  maxWidths: {
    left: 500,
    right: 500,
  },
  bottomHeight: {
    min: 10,
    max: 60,
  },
};

/**
 * Custom hook providing shared document layout logic
 * Follows React component standards for hooks
 */
export const useDocumentLayout = (props: DocumentLayoutProps): DocumentLayoutLogic => {
  const {
    config = DEFAULT_LAYOUT_CONFIG,
    onConfigChange,
    onPanelResize,
    onPanelToggle,
    onMobilePanelChange,
  } = props;

  // Platform detection
  const isMobileBreakpoint = useMediaQuery('(max-width: 768px)');
  
  // Local state for layout configuration
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfiguration>(config);

  // Update mobile state when breakpoint changes
  useEffect(() => {
    if (isMobileBreakpoint !== layoutConfig.isMobile) {
      const updatedConfig = {
        ...layoutConfig,
        isMobile: isMobileBreakpoint,
        // Reset mobile panel when switching to desktop
        activeMobilePanel: isMobileBreakpoint ? layoutConfig.activeMobilePanel : null,
      };
      setLayoutConfig(updatedConfig);
      onConfigChange?.(updatedConfig);
    }
  }, [isMobileBreakpoint, layoutConfig, onConfigChange]);

  /**
   * Handle left panel resize with constraints
   */
  const handleLeftPanelResize = useCallback((width: number) => {
    const constrainedWidth = Math.max(
      RESIZE_CONSTRAINTS.minWidths.left,
      Math.min(RESIZE_CONSTRAINTS.maxWidths.left, width)
    );

    // Ensure center panel maintains minimum width
    const availableWidth = layoutConfig.dimensions.width - layoutConfig.dimensions.rightPanelWidth;
    const maxLeftWidth = availableWidth - RESIZE_CONSTRAINTS.minWidths.center;
    const finalWidth = Math.min(constrainedWidth, maxLeftWidth);

    const updatedConfig = {
      ...layoutConfig,
      dimensions: {
        ...layoutConfig.dimensions,
        leftPanelWidth: finalWidth,
      },
    };

    setLayoutConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
    onPanelResize?.left?.(finalWidth);
  }, [layoutConfig, onConfigChange, onPanelResize]);

  /**
   * Handle right panel resize with constraints
   */
  const handleRightPanelResize = useCallback((width: number) => {
    const constrainedWidth = Math.max(
      RESIZE_CONSTRAINTS.minWidths.right,
      Math.min(RESIZE_CONSTRAINTS.maxWidths.right, width)
    );

    // Ensure center panel maintains minimum width
    const availableWidth = layoutConfig.dimensions.width - layoutConfig.dimensions.leftPanelWidth;
    const maxRightWidth = availableWidth - RESIZE_CONSTRAINTS.minWidths.center;
    const finalWidth = Math.min(constrainedWidth, maxRightWidth);

    const updatedConfig = {
      ...layoutConfig,
      dimensions: {
        ...layoutConfig.dimensions,
        rightPanelWidth: finalWidth,
      },
    };

    setLayoutConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
    onPanelResize?.right?.(finalWidth);
  }, [layoutConfig, onConfigChange, onPanelResize]);

  /**
   * Handle bottom panel resize with constraints
   */
  const handleBottomPanelResize = useCallback((height: number) => {
    const constrainedHeight = Math.max(
      RESIZE_CONSTRAINTS.bottomHeight.min,
      Math.min(RESIZE_CONSTRAINTS.bottomHeight.max, height)
    );

    const updatedConfig = {
      ...layoutConfig,
      dimensions: {
        ...layoutConfig.dimensions,
        bottomPanelHeight: constrainedHeight,
      },
    };

    setLayoutConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
    onPanelResize?.bottom?.(constrainedHeight);
  }, [layoutConfig, onConfigChange, onPanelResize]);

  /**
   * Handle panel visibility toggle
   */
  const handlePanelToggle = useCallback((panel: keyof PanelVisibility, visible: boolean) => {
    const updatedConfig = {
      ...layoutConfig,
      panelVisibility: {
        ...layoutConfig.panelVisibility,
        [panel]: visible,
      },
    };

    setLayoutConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
    onPanelToggle?.[panel]?.(visible);
  }, [layoutConfig, onConfigChange, onPanelToggle]);

  /**
   * Handle mobile panel navigation
   */
  const handleMobilePanelNavigation = useCallback((panel: 'left' | 'right' | 'bottom' | null) => {
    if (!layoutConfig.isMobile) return;

    const updatedConfig = {
      ...layoutConfig,
      activeMobilePanel: panel,
    };

    setLayoutConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
    onMobilePanelChange?.(panel);
  }, [layoutConfig, onConfigChange, onMobilePanelChange]);

  /**
   * Calculate available document area
   * Memoized for performance optimization
   */
  const calculateDocumentArea = useMemo(() => {
    return () => {
      const { dimensions, panelVisibility, isMobile } = layoutConfig;

      if (isMobile) {
        // Mobile: full screen minus any mobile UI elements
        return {
          width: dimensions.width,
          height: dimensions.height - 60, // Account for mobile navigation
        };
      }

      // Desktop: subtract visible panel widths
      const leftWidth = panelVisibility.leftPanel ? dimensions.leftPanelWidth : 0;
      const rightWidth = panelVisibility.rightPanel ? dimensions.rightPanelWidth : 0;
      const bottomHeight = panelVisibility.bottomPanel 
        ? (dimensions.height * dimensions.bottomPanelHeight) / 100 
        : 0;

      return {
        width: Math.max(RESIZE_CONSTRAINTS.minWidths.center, dimensions.width - leftWidth - rightWidth),
        height: Math.max(200, dimensions.height - bottomHeight),
      };
    };
  }, [layoutConfig]);

  /**
   * Get current layout state
   */
  const getLayoutState = useCallback(() => layoutConfig, [layoutConfig]);

  return {
    handleLeftPanelResize,
    handleRightPanelResize,
    handleBottomPanelResize,
    handlePanelToggle,
    handleMobilePanelNavigation,
    calculateDocumentArea,
    getLayoutState,
    isMobileLayout: layoutConfig.isMobile,
  };
}; 