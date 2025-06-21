/**
 * LeftPanel Component Types
 * 
 * TypeScript interfaces for left panel component system
 * @module LeftPanel.types
 */

import React from 'react';

export interface PanelContent {
  /** Panel unique identifier */
  id: string;
  /** Panel display title */
  title: string;
  /** Panel content component */
  content: React.ReactNode;
  /** Minimum panel size in pixels */
  minSize?: number;
  /** Maximum panel size in pixels */
  maxSize?: number;
  /** Default panel size */
  defaultSize?: number;
  /** Whether panel is collapsible */
  collapsible?: boolean;
  /** Whether panel is closable */
  closable?: boolean;
}

export interface LeftPanelProps {
  /** Top panel content */
  topPanel?: PanelContent;
  /** Bottom panel content */
  bottomPanel?: PanelContent;
  /** Current panel width percentage (0-100) */
  width: number;
  /** Vertical split ratio between top/bottom (0-1) */
  splitRatio: number;
  /** Whether left panel is visible */
  visible: boolean;
  /** Panel resize handler */
  onResize?: (newWidth: number) => void;
  /** Split ratio change handler */
  onSplitChange?: (newRatio: number) => void;
  /** Panel toggle handler */
  onToggle?: (panelId: string, collapsed: boolean) => void;
  /** Panel close handler */
  onClose?: (panelId: string) => void;
  /** Container dimensions for calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
}

export interface LeftPanelLogic {
  /** Handle panel width resize */
  handleWidthResize: (newWidth: number) => void;
  /** Handle split ratio change */
  handleSplitChange: (newRatio: number) => void;
  /** Handle panel toggle */
  handlePanelToggle: (panelId: string, collapsed: boolean) => void;
  /** Handle panel close */
  handlePanelClose: (panelId: string) => void;
  /** Current panel states */
  panelStates: {
    topCollapsed: boolean;
    bottomCollapsed: boolean;
  };
} 