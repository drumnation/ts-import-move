/**
 * CenterPanel Shared Logic
 * 
 * Business logic and state management for center panel system
 * Platform-independent logic for document area and bottom panel
 * Follows established panel pattern for consistency
 * 
 * @module CenterPanel.logic
 */

import { useCallback, useState, useMemo } from 'react';
import type { CenterPanelProps, CenterPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.types';

/**
 * Custom hook providing shared center panel logic
 * Follows React component standards for hooks
 */
export const useCenterPanel = (props: CenterPanelProps): CenterPanelLogic => {
  const {
    onBottomResize,
    onBottomToggle,
    containerDimensions,
    leftPanelWidth = 0,
    rightPanelWidth = 0,
  } = props;

  // Track panel collapse states
  const [panelStates, setPanelStates] = useState({
    bottomCollapsed: false,
    documentFocused: false,
  });

  /**
   * Handle bottom panel height resize with validation
   * Center panel bottom resizing logic
   */
  const handleBottomResize = useCallback((newHeight: number) => {
    // Clamp height between 10% and 60% of available space
    const clampedHeight = Math.max(10, Math.min(60, newHeight));
    onBottomResize?.(clampedHeight);
  }, [onBottomResize]);

  /**
   * Handle bottom panel toggle (show/hide)
   * Updates local state and calls parent handler
   */
  const handleBottomToggle = useCallback((visible: boolean) => {
    setPanelStates(prev => ({
      ...prev,
      bottomCollapsed: !visible,
    }));
    onBottomToggle?.(visible);
  }, [onBottomToggle]);

  /**
   * Calculate available document area based on panel widths
   * Memoized for performance optimization
   */
  const calculateDocumentArea = useMemo(() => {
    return () => {
      if (!containerDimensions) {
        return { width: 800, height: 600 }; // Default fallback
      }

      const availableWidth = containerDimensions.width - leftPanelWidth - rightPanelWidth;
      const availableHeight = containerDimensions.height;

      return {
        width: Math.max(200, availableWidth), // Minimum 200px width
        height: Math.max(200, availableHeight), // Minimum 200px height
      };
    };
  }, [containerDimensions, leftPanelWidth, rightPanelWidth]);

  return {
    handleBottomResize,
    handleBottomToggle,
    calculateDocumentArea,
    panelStates,
  };
}; 