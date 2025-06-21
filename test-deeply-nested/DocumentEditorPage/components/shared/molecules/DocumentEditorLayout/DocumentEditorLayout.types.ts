/**
 * DocumentEditorLayout Component Types
 * 
 * TypeScript interfaces for the main document editor layout orchestrator
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout.types
 */

import type { PanelSlot, PanelResizeConfig, MultiPageDocument } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';

/**
 * Props for the DocumentEditorLayout component
 * Main interface for the document editor layout orchestrator
 */
export interface DocumentEditorLayoutProps {
  /** Document to display in the editor */
  document?: MultiPageDocument;
  /** Panel slots configuration for all layout areas */
  panelSlots: PanelSlot[];
  /** Handler for panel resize operations */
  onPanelResize?: (location: string, slot: string, newSize: number) => void;
  /** Handler for panel collapse/expand operations */
  onPanelToggle?: (location: string, slot: string, collapsed: boolean) => void;
  /** Handler for panel close operations */
  onPanelClose?: (location: string, slot: string) => void;
  /** Handler for panel split operations */
  onPanelSplit?: (location: string, slot: string) => void;
}

/**
 * Props for the layout container styled component
 * Handles safe area management and mobile/desktop differentiation
 */
export interface LayoutContainerProps {
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  isMobile: boolean;
}

/**
 * Props for desktop-specific layout configuration
 * Manages column widths and responsive behavior
 */
export interface DesktopLayoutProps {
  leftWidth: number;
  rightWidth: number;
}

/**
 * Props for panel slot containers
 * Manages vertical splitting and positioning
 */
export interface PanelSlotContainerProps {
  splitRatio: number;
  isTop: boolean;
}

/**
 * Grouped panel organization for layout management
 * Organizes panels by location and vertical position
 */
export interface GroupedPanels {
  left: { 
    top: PanelSlot | null; 
    bottom: PanelSlot | null; 
  };
  right: { 
    top: PanelSlot | null; 
    bottom: PanelSlot | null; 
  };
  center: { 
    top: PanelSlot | null; 
    bottom: PanelSlot | null; 
  };
}

/**
 * Panel calculation utilities
 * Provides size calculations and resize configurations
 */
export interface PanelCalculations {
  /** Calculate current size of a specific panel */
  calculatePanelSize: (location: string, slot: string) => number;
  /** Create resize configuration for a specific panel */
  createResizeConfig: (location: string, slot: string) => PanelResizeConfig;
}

/**
 * Panel event handlers
 * Centralized handlers for panel interactions
 */
export interface PanelHandlers {
  /** Handle panel resize operations with validation */
  handlePanelResize: (location: string, slot: string, newSize: number) => void;
  /** Handle panel collapse/expand operations */
  handlePanelToggle: (location: string, slot: string, collapsed: boolean) => void;
}

/**
 * Layout state for coordinated panel management
 * Tracks current layout configuration and constraints
 */
export interface LayoutState {
  /** Current column widths in pixels */
  columnSizes: {
    left: number;
    center: number;
    right: number;
  };
  /** Current split ratios for vertical panels */
  splitRatios: {
    leftVertical: number;
    centerVertical: number;
    rightVertical: number;
  };
  /** Panel visibility states */
  panelVisibility: {
    leftTop: boolean;
    leftBottom: boolean;
    rightTop: boolean;
    rightBottom: boolean;
    centerBottom: boolean;
  };
  /** Whether any resize operation is currently active */
  isResizing: boolean;
}

/**
 * Container dimensions for responsive calculations
 * Provides current viewport and container sizing information
 */
export interface ContainerDimensions {
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
} 