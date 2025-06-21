/**
 * EditorCanvas Component Types
 * @module EditorCanvas.types
 */

import type { PanelSlot, PanelResizeConfig, MultiPageDocument } from '../../DocumentEditorPage.types';

export interface EditorCanvasProps {
  /** Document to display */
  document?: MultiPageDocument;
  /** Panel slots configuration */
  panelSlots: PanelSlot[];
  /** Panel resize handlers */
  onPanelResize?: (location: string, slot: string, newSize: number) => void;
  /** Panel toggle handlers */
  onPanelToggle?: (location: string, slot: string, collapsed: boolean) => void;
  /** Panel close handlers */
  onPanelClose?: (location: string, slot: string) => void;
  /** Panel split handlers */
  onPanelSplit?: (location: string, slot: string) => void;
  /** Node insertion handler */
  onInsertNode?: (nodeType: string) => void;
}

export interface CanvasContainerProps {
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  isMobile: boolean;
}

export interface DesktopLayoutProps {
  leftWidth: number;
  rightWidth: number;
}

export interface PanelSlotContainerProps {
  splitRatio: number;
  isTop: boolean;
}

export interface GroupedPanels {
  left: { top: PanelSlot | null; bottom: PanelSlot | null };
  right: { top: PanelSlot | null; bottom: PanelSlot | null };
  center: { top: PanelSlot | null; bottom: PanelSlot | null };
}

export interface PanelCalculations {
  calculatePanelSize: (location: string, slot: string) => number;
  createResizeConfig: (location: string, slot: string) => PanelResizeConfig;
}

export interface PanelHandlers {
  handlePanelResize: (location: string, slot: string, newSize: number) => void;
  handlePanelToggle: (location: string, slot: string, collapsed: boolean) => void;
} 