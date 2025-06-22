/**
 * RightPanel Redux Integration
 * 
 * Functional Redux integration layer for RightPanel component
 * Follows Redux Toolkit patterns for editor applications
 * Implements functional isolated concerns architecture
 * 
 * @module RightPanel.redux
 */

import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/tests/complex-document-editor-migration/source/stores/store';
import {
  selectRightTopPanel,
  selectRightBottomPanel,
  selectSplitRatios,
} from '@/tests/complex-document-editor-migration/source/stores/selectors/panel.selectors';
import {
  openPanel,
  closePanel,
  resizePanel,
  adjustSplitRatio,
  collapsePanel,
  expandPanel,
} from '@/tests/complex-document-editor-migration/source/stores/panels.slice';
import type { RightPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.types';

/**
 * Custom hook providing Redux-connected RightPanel props
 * Follows Redux Toolkit patterns for editor state management
 */
export const useRightPanelRedux = (): RightPanelProps => {
  const dispatch = useAppDispatch();
  
  // Memoized selectors for performance optimization
  const topPanel = useAppSelector(selectRightTopPanel);
  const bottomPanel = useAppSelector(selectRightBottomPanel);
  const splitRatios = useAppSelector(selectSplitRatios);

  // Calculate panel visibility and dimensions
  const visible = topPanel.isOpen || bottomPanel.isOpen;
  const width = Math.max(topPanel.size.width || 25, bottomPanel.size.width || 25);

  // Action creators following functional patterns
  const handleResize = useCallback((newWidth: number) => {
    // Update both panels to maintain consistency
    if (topPanel.isOpen) {
      dispatch(resizePanel({ panelId: 'rightTop', size: { width: newWidth } }));
    }
    if (bottomPanel.isOpen) {
      dispatch(resizePanel({ panelId: 'rightBottom', size: { width: newWidth } }));
    }
  }, [dispatch, topPanel.isOpen, bottomPanel.isOpen]);

  const handleSplitChange = useCallback((newRatio: number) => {
    dispatch(adjustSplitRatio({ column: 'rightColumn', ratio: newRatio }));
  }, [dispatch]);

  const handlePanelToggle = useCallback((panelId: string, collapsed: boolean) => {
    if (collapsed) {
      dispatch(collapsePanel(panelId));
    } else {
      dispatch(expandPanel(panelId));
    }
  }, [dispatch]);

  const handlePanelClose = useCallback((panelId: string) => {
    dispatch(closePanel(panelId));
  }, [dispatch]);

  // Transform Redux state to component props
  const topPanelData = topPanel.isOpen ? {
    id: 'rightTop',
    title: 'Properties',
    content: React.createElement('div', null, 'Properties Panel Content'), // Placeholder content
    collapsible: true,
    closable: true,
  } : undefined;

  const bottomPanelData = bottomPanel.isOpen ? {
    id: 'rightBottom',
    title: 'Layers',
    content: React.createElement('div', null, 'Layers Panel Content'), // Placeholder content
    collapsible: true,
    closable: true,
  } : undefined;

  return {
    topPanel: topPanelData,
    bottomPanel: bottomPanelData,
    width,
    splitRatio: splitRatios.rightColumn,
    visible,
    onResize: handleResize,
    onSplitChange: handleSplitChange,
    onToggle: handlePanelToggle,
    onClose: handlePanelClose,
  };
};

/**
 * Redux action creators for RightPanel operations
 * Functional approach to panel state management
 */
export const rightPanelActions = {
  /**
   * Open right top panel with optional content type
   */
  openTopPanel: (contentType?: string) => (dispatch: any) => {
    dispatch(openPanel('rightTop'));
    // Could dispatch additional actions to set content type
  },

  /**
   * Open right bottom panel with optional content type
   */
  openBottomPanel: (contentType?: string) => (dispatch: any) => {
    dispatch(openPanel('rightBottom'));
    // Could dispatch additional actions to set content type
  },

  /**
   * Close all right panels
   */
  closeAllPanels: () => (dispatch: any) => {
    dispatch(closePanel('rightTop'));
    dispatch(closePanel('rightBottom'));
  },

  /**
   * Reset right column to default configuration
   */
  resetConfiguration: () => (dispatch: any) => {
    dispatch(adjustSplitRatio({ column: 'rightColumn', ratio: 0.5 }));
    dispatch(resizePanel({ panelId: 'rightTop', size: { width: 300 } }));
    dispatch(resizePanel({ panelId: 'rightBottom', size: { width: 300 } }));
  },
}; 