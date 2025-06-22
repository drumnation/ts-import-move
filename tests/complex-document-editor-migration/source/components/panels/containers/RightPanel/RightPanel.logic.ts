/**
 * RightPanel Shared Logic
 * 
 * Business logic and state management for right panel system
 * Platform-independent logic that can be shared across desktop/mobile
 * Mirrors LeftPanel.logic.ts pattern for consistency
 * 
 * @module RightPanel.logic
 */

import { useCallback, useState } from 'react';
import type { RightPanelProps, RightPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.types';

/**
 * Custom hook providing shared right panel logic
 * Follows React component standards for hooks
 */
export const useRightPanel = (props: RightPanelProps): RightPanelLogic => {
  const {
    onResize,
    onSplitChange,
    onToggle,
    onClose,
  } = props;

  // Track panel collapse states
  const [panelStates, setPanelStates] = useState({
    topCollapsed: false,
    bottomCollapsed: false,
  });

  /**
   * Handle panel width resize with validation
   * Right panel resizing logic (inverted from left)
   */
  const handleWidthResize = useCallback((newWidth: number) => {
    // Clamp width between 15% and 40%
    const clampedWidth = Math.max(15, Math.min(40, newWidth));
    onResize?.(clampedWidth);
  }, [onResize]);

  /**
   * Handle split ratio change with validation
   * Same logic as LeftPanel - consistent behavior
   */
  const handleSplitChange = useCallback((newRatio: number) => {
    // Clamp ratio between 0.2 and 0.8
    const clampedRatio = Math.max(0.2, Math.min(0.8, newRatio));
    onSplitChange?.(clampedRatio);
  }, [onSplitChange]);

  /**
   * Handle panel toggle (collapse/expand)
   * Consistent with LeftPanel implementation
   */
  const handlePanelToggle = useCallback((panelId: string, collapsed: boolean) => {
    setPanelStates(prev => {
      const key = panelId.includes('top') ? 'topCollapsed' : 'bottomCollapsed';
      return {
        ...prev,
        [key]: collapsed,
      };
    });
    onToggle?.(panelId, collapsed);
  }, [onToggle]);

  /**
   * Handle panel close
   * Consistent with LeftPanel implementation
   */
  const handlePanelClose = useCallback((panelId: string) => {
    onClose?.(panelId);
  }, [onClose]);

  return {
    handleWidthResize,
    handleSplitChange,
    handlePanelToggle,
    handlePanelClose,
    panelStates,
  };
}; 