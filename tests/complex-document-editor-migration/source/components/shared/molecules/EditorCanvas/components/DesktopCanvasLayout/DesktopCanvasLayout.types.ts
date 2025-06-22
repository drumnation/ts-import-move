/**
 * DesktopCanvasLayout Component Types
 * @module DesktopCanvasLayout.types
 */

import type { MultiPageDocument } from '@/tests/complex-document-editor-migration/source/components/shared/DocumentEditorPage.types';
import type { GroupedPanels, PanelCalculations, PanelHandlers } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.types';

export interface DesktopCanvasLayoutProps {
  /** Document to display */
  document?: MultiPageDocument;
  /** Grouped panels */
  groupedPanels: GroupedPanels;
  /** Panel calculations */
  panelCalculations: PanelCalculations;
  /** Panel handlers */
  panelHandlers: PanelHandlers;
  /** Layout state */
  layoutState: LayoutState;
  /** Panel close handler */
  onPanelClose?: (location: string, slot: string) => void;
  /** Panel split handler */
  onPanelSplit?: (location: string, slot: string) => void;
  /** Container dimensions for reactive calculations */
  containerDimensions?: ContainerDimensions;
}

export interface LayoutState {
  layout: {
    leftWidth: number;
    rightWidth: number;
    leftSplit: number;
    rightSplit: number;
  };
  panels: Record<string, PanelState>;
}

export interface PanelState {
  collapsed?: boolean;
}

export interface ContainerDimensions {
  width: number;
  height: number;
}

export interface DesktopLayoutProps {
  leftWidth: number;
  rightWidth: number;
}

export interface PanelSlotContainerProps {
  splitRatio: number;
  isTop: boolean;
} 