/**
 * PanelControls Module
 * @module layout/PanelControls
 */

// Main component
export { PanelControls } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls';

// Custom hook
export { usePanelControls } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.hook';

// Sub-components
export { ControlGroup, ControlButton } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components';

// Type exports
export type {
  PanelControlsProps,
  PanelAction,
  PanelPosition,
  ControlButtonProps,
  ControlGroupProps,
  PanelControlConfig
} from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.types';

// Logic utilities (for advanced usage)
export {
  createPanelControlConfig,
  formatActionLabel,
  formatPositionLabel,
  getPanelSide,
  getPanelLocation,
  getButtonVariant
} from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.logic'; 