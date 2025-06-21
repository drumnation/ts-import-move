import type { PanelSlot } from '../../../../DocumentEditorPage.types';
import type { PanelCalculations, PanelHandlers } from '../../EditorCanvas.types';

export interface RenderPanelConfig {
  panel: PanelSlot;
  layoutState: any;
  panelCalculations: PanelCalculations;
  panelHandlers: PanelHandlers;
  onPanelClose?: (location: string, slot: string) => void;
  onPanelSplit?: (location: string, slot: string) => void;
}

export const createPanelProps = (config: RenderPanelConfig) => {
  const { panel, layoutState, panelCalculations, panelHandlers } = config;
  const panelId = `${panel.location}-${panel.slot}`;
  const panelState = layoutState.panels[panelId];
  const size = panelCalculations.calculatePanelSize(panel.location, panel.slot);
  const resizeConfig = panelCalculations.createResizeConfig(panel.location, panel.slot);

  return {
    ...panel,
    key: panelId,
    size,
    collapsed: panelState?.collapsed || false,
    resizeConfig,
    onResize: (newSize: number) => panelHandlers.handlePanelResize(panel.location, panel.slot, newSize),
    onToggle: (collapsed: boolean) => panelHandlers.handlePanelToggle(panel.location, panel.slot, collapsed),
    onClose: () => config.onPanelClose?.(panel.location, panel.slot),
    onSplit: () => config.onPanelSplit?.(panel.location, panel.slot),
  };
}; 