/**
 * ConfigurablePanel Component Types
 * 
 * TypeScript interfaces and types for the ConfigurablePanel component
 * Renamed from SlotPanel for better AI agent discoverability
 * 
 * @module ConfigurablePanel.types
 */

import type { PanelSlot, PanelResizeConfig } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';

/**
 * Props for the ConfigurablePanel component
 * Provides a flexible interface for panel configuration and behavior
 */
export interface ConfigurablePanelProps extends PanelSlot {
  /** Panel size in pixels or percentage */
  size: number;
  /** Whether panel can be resized by the user */
  resizable?: boolean;
  /** Configuration for resize behavior and constraints */
  resizeConfig?: PanelResizeConfig;
  /** Handler called when user resizes the panel */
  onResize?: (newSize: number) => void;
  /** Handler called when user toggles collapse/expand */
  onToggle?: (collapsed: boolean) => void;
  /** Handler called when user closes the panel */
  onClose?: () => void;
  /** Handler called when user splits/unsplits the panel */
  onSplit?: () => void;
  /** Custom CSS class name for styling */
  className?: string;
}

/**
 * Styled props for the panel container
 * Controls layout positioning and visual state
 */
export interface StyledPanelContainerProps {
  /** Panel location (left/right sidebar or center) */
  location: 'left' | 'right' | 'center';
  /** Panel slot within the location (top/bottom) */
  slot: 'top' | 'bottom';
  /** Whether the panel is currently collapsed */
  collapsed: boolean;
  /** Current size of the panel in pixels */
  size: number;
  /** Whether rendering on mobile device */
  isMobile: boolean;
}

/**
 * Styled props for the panel header
 * Controls header appearance based on state
 */
export interface StyledPanelHeaderProps {
  /** Whether the panel is collapsed (affects header styling) */
  collapsed: boolean;
  /** Whether rendering on mobile device (affects sizing) */
  isMobile: boolean;
}

/**
 * Styled props for the panel content area
 * Controls content visibility and transitions
 */
export interface StyledPanelContentProps {
  /** Whether the panel is collapsed (hides content) */
  collapsed: boolean;
  /** Whether rendering on mobile device (affects layout) */
  isMobile: boolean;
}

/**
 * Direction for resize operations
 * Determines which axis the panel can be resized along
 */
export type ResizeDirection = 'horizontal' | 'vertical';

/**
 * Configuration for panel control icons
 * Ensures consistent sizing across platforms
 */
export interface IconConfig {
  /** Icon size in pixels */
  size: number;
  /** Minimum width for touch targets */
  minWidth: number;
  /** Minimum height for touch targets */
  minHeight: number;
}

// Legacy type exports for backward compatibility during transition
export type SlotPanelProps = ConfigurablePanelProps; 