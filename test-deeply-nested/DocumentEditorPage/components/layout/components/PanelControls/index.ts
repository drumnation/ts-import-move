/**
 * PanelControls Module
 * @module layout/PanelControls
 */

// Main component
export { PanelControls } from './PanelControls';

// Custom hook
export { usePanelControls } from './PanelControls.hook';

// Sub-components
export { ControlGroup, ControlButton } from './components';

// Type exports
export type {
  PanelControlsProps,
  PanelAction,
  PanelPosition,
  ControlButtonProps,
  ControlGroupProps,
  PanelControlConfig
} from './PanelControls.types';

// Logic utilities (for advanced usage)
export {
  createPanelControlConfig,
  formatActionLabel,
  formatPositionLabel,
  getPanelSide,
  getPanelLocation,
  getButtonVariant
} from './PanelControls.logic'; 