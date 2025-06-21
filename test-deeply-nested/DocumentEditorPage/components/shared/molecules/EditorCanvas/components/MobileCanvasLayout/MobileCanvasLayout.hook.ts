import { useCallback } from 'react';
import { createPanelProps, type RenderPanelConfig } from './MobileCanvasLayout.logic';
import type { PanelSlot } from '../../../../DocumentEditorPage.types';
import type { PanelCalculations, PanelHandlers } from '../../EditorCanvas.types';

export interface UseMobileCanvasLayoutProps {
  panelSlots: PanelSlot[];
  layoutState: any;
  panelCalculations: PanelCalculations;
  panelHandlers: PanelHandlers;
  onPanelClose?: (location: string, slot: string) => void;
  onPanelSplit?: (location: string, slot: string) => void;
}

export const useMobileCanvasLayout = ({
  panelSlots,
  layoutState,
  panelCalculations,
  panelHandlers,
  onPanelClose,
  onPanelSplit,
}: UseMobileCanvasLayoutProps) => {
  const createPanelPropsCallback = useCallback(
    (panel: PanelSlot) => {
      const config: RenderPanelConfig = {
        panel,
        layoutState,
        panelCalculations,
        panelHandlers,
        onPanelClose,
        onPanelSplit,
      };
      return createPanelProps(config);
    },
    [layoutState, panelCalculations, panelHandlers, onPanelClose, onPanelSplit]
  );

  const handlePageChange = useCallback(() => {
    // Placeholder for page change logic
  }, []);

  const handleViewModeChange = useCallback(() => {
    // Placeholder for view mode change logic
  }, []);

  return {
    createPanelPropsCallback,
    handlePageChange,
    handleViewModeChange,
  };
}; 