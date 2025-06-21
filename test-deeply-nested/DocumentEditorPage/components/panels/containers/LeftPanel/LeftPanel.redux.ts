/**
 * LeftPanel Redux Integration
 * 
 * Functional Redux integration layer for LeftPanel component
 * Follows Redux Toolkit patterns for editor applications
 * Implements functional isolated concerns architecture
 * 
 * @module LeftPanel.redux
 */

import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../stores/store';
import {
  selectLeftTopPanel,
  selectLeftBottomPanel,
  selectSplitRatios,
} from '../../../../stores/selectors/panel.selectors';
import {
  openPanel,
  closePanel,
  resizePanel,
  adjustSplitRatio,
  collapsePanel,
  expandPanel,
} from '../../../../stores/panels.slice';
import type { LeftPanelProps } from './LeftPanel.types';

/**
 * Custom hook providing Redux-connected LeftPanel props
 * Follows Redux Toolkit patterns for editor state management
 */
export const useLeftPanelRedux = (): LeftPanelProps => {
  const dispatch = useAppDispatch();
  
  // Memoized selectors for performance optimization
  const topPanel = useAppSelector(selectLeftTopPanel);
  const bottomPanel = useAppSelector(selectLeftBottomPanel);
  const splitRatios = useAppSelector(selectSplitRatios);

  // Calculate panel visibility and dimensions
  const visible = topPanel.isOpen || bottomPanel.isOpen;
  const width = Math.max(topPanel.size.width || 25, bottomPanel.size.width || 25);

  // Action creators following functional patterns
  const handleResize = useCallback((newWidth: number) => {
    // Update both panels to maintain consistency
    if (topPanel.isOpen) {
      dispatch(resizePanel({ panelId: 'leftTop', size: { width: newWidth } }));
    }
    if (bottomPanel.isOpen) {
      dispatch(resizePanel({ panelId: 'leftBottom', size: { width: newWidth } }));
    }
  }, [dispatch, topPanel.isOpen, bottomPanel.isOpen]);

  const handleSplitChange = useCallback((newRatio: number) => {
    dispatch(adjustSplitRatio({ column: 'leftColumn', ratio: newRatio }));
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
    id: 'leftTop',
    title: 'Assets',
    content: React.createElement('div', null, 'Assets Panel Content'), // Placeholder content
    collapsible: true,
    closable: true,
  } : undefined;

  const bottomPanelData = bottomPanel.isOpen ? {
    id: 'leftBottom',
    title: 'Research',
    content: React.createElement('div', null, 'Research Panel Content'), // Placeholder content
    collapsible: true,
    closable: true,
  } : undefined;

  return {
    topPanel: topPanelData,
    bottomPanel: bottomPanelData,
    width,
    splitRatio: splitRatios.leftColumn,
    visible,
    onResize: handleResize,
    onSplitChange: handleSplitChange,
    onToggle: handlePanelToggle,
    onClose: handlePanelClose,
  };
};

/**
 * Redux action creators for LeftPanel operations
 * Functional approach to panel state management
 */
export const leftPanelActions = {
  /**
   * Open left top panel with optional content type
   */
  openTopPanel: (contentType?: string) => (dispatch: any) => {
    dispatch(openPanel('leftTop'));
    // Could dispatch additional actions to set content type
  },

  /**
   * Open left bottom panel with optional content type
   */
  openBottomPanel: (contentType?: string) => (dispatch: any) => {
    dispatch(openPanel('leftBottom'));
    // Could dispatch additional actions to set content type
  },

  /**
   * Close all left panels
   */
  closeAllPanels: () => (dispatch: any) => {
    dispatch(closePanel('leftTop'));
    dispatch(closePanel('leftBottom'));
  },

  /**
   * Reset left column to default configuration
   */
  resetConfiguration: () => (dispatch: any) => {
    dispatch(adjustSplitRatio({ column: 'leftColumn', ratio: 0.5 }));
    dispatch(resizePanel({ panelId: 'leftTop', size: { width: 300 } }));
    dispatch(resizePanel({ panelId: 'leftBottom', size: { width: 300 } }));
  },
}; 