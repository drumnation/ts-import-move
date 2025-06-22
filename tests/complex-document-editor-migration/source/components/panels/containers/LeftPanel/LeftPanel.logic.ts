/**
 * LeftPanel Shared Logic
 * 
 * Business logic and state management for left panel system
 * Platform-independent logic that can be shared across desktop/mobile
 * 
 * @module LeftPanel.logic
 */

import { useCallback, useState } from 'react';
import type { LeftPanelProps, LeftPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.types';

/**
 * Custom hook providing shared left panel logic
 */
export const useLeftPanel = (props: LeftPanelProps): LeftPanelLogic => {
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
   */
  const handleWidthResize = useCallback((newWidth: number) => {
    // Clamp width between 15% and 40%
    const clampedWidth = Math.max(15, Math.min(40, newWidth));
    onResize?.(clampedWidth);
  }, [onResize]);

  /**
   * Handle split ratio change with validation
   */
  const handleSplitChange = useCallback((newRatio: number) => {
    // Clamp ratio between 0.2 and 0.8
    const clampedRatio = Math.max(0.2, Math.min(0.8, newRatio));
    onSplitChange?.(clampedRatio);
  }, [onSplitChange]);

  /**
   * Handle panel toggle (collapse/expand)
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