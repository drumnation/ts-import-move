/**
 * DesktopCanvasLayout Component Logic
 * @module DesktopCanvasLayout.logic
 */

import type { GroupedPanels, PanelCalculations, PanelHandlers } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.types';
import type { LayoutState } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.types';

export interface RenderPanelParams {
  panel: any;
  location: string;
  slot: string;
  layoutState: LayoutState;
  panelCalculations: PanelCalculations;
  panelHandlers: PanelHandlers;
  onPanelClose?: (location: string, slot: string) => void;
  onPanelSplit?: (location: string, slot: string) => void;
}

export interface PanelRenderData {
  panelId: string;
  panelState: any;
  size: number;
  resizeConfig: any;
}

/**
 * Calculates panel render data for a given panel configuration
 */
export const calculatePanelRenderData = (
  panel: any,
  location: string,
  slot: string,
  layoutState: LayoutState,
  panelCalculations: PanelCalculations
): PanelRenderData | null => {
  if (!panel) return null;
  
  const panelId = `${location}-${slot}`;
  const panelState = layoutState.panels[panelId];
  const size = panelCalculations.calculatePanelSize(location, slot);
  const resizeConfig = panelCalculations.createResizeConfig(location, slot);

  return {
    panelId,
    panelState,
    size,
    resizeConfig,
  };
};

/**
 * Determines if a split resizer should be rendered for a given location
 */
export const shouldRenderSplitResizer = (
  location: 'left' | 'right',
  groupedPanels: GroupedPanels
): boolean => {
  const hasTopPanel = !!groupedPanels[location].top;
  const hasBottomPanel = !!groupedPanels[location].bottom;
  
  return hasTopPanel && hasBottomPanel;
};

/**
 * Creates the resize handler for split resizers
 */
export const createSplitResizeHandler = (
  location: string,
  panelHandlers: PanelHandlers
) => {
  return (newSize: number) => {
    // newSize is the new split ratio (0-1)
    const clampedSplit = Math.max(0.2, Math.min(0.8, newSize));
    panelHandlers.handlePanelResize(location, 'split', clampedSplit);
  };
};

/**
 * Creates panel event handlers for a specific panel
 */
export const createPanelHandlers = (
  location: string,
  slot: string,
  panelHandlers: PanelHandlers,
  onPanelClose?: (location: string, slot: string) => void,
  onPanelSplit?: (location: string, slot: string) => void
) => {
  return {
    onResize: (newSize: number) => panelHandlers.handlePanelResize(location, slot, newSize),
    onToggle: (collapsed: boolean) => panelHandlers.handlePanelToggle(location, slot, collapsed),
    onClose: () => onPanelClose?.(location, slot),
    onSplit: () => onPanelSplit?.(location, slot),
  };
}; 