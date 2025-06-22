/**
 * SlotPanel Component Types
 * 
 * TypeScript interfaces and types for the SlotPanel component
 * 
 * @module SlotPanel.types
 */

import type { PanelSlot, PanelResizeConfig } from '@/tests/complex-document-editor-migration/source/components/shared/DocumentEditorPage.types';

export interface SlotPanelProps extends PanelSlot {
  /** Panel size in pixels or percentage */
  size: number;
  /** Whether panel can be resized */
  resizable?: boolean;
  /** Resize configuration */
  resizeConfig?: PanelResizeConfig;
  /** Resize handler */
  onResize?: (newSize: number) => void;
  /** Collapse/expand handler */
  onToggle?: (collapsed: boolean) => void;
  /** Close handler */
  onClose?: () => void;
  /** Split/unsplit handler */
  onSplit?: () => void;
  /** Custom class name */
  className?: string;
}

export interface StyledPanelContainerProps {
  location: 'left' | 'right' | 'center';
  slot: 'top' | 'bottom';
  collapsed: boolean;
  size: number;
  isMobile: boolean;
}

export interface StyledPanelHeaderProps {
  collapsed: boolean;
  isMobile: boolean;
}

export interface StyledPanelContentProps {
  collapsed: boolean;
  isMobile: boolean;
}

export type ResizeDirection = 'horizontal' | 'vertical';

export interface IconConfig {
  size: number;
  minWidth: number;
  minHeight: number;
} 