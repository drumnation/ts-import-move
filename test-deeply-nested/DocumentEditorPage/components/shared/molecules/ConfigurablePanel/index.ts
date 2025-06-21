/**
 * ConfigurablePanel Component Exports
 * 
 * Barrel export file for the ConfigurablePanel component
 * Renamed from SlotPanel for better AI agent discoverability
 * 
 * @module ConfigurablePanel
 */

// Main component
export { ConfigurablePanel } from './ConfigurablePanel';

// Hooks
export { 
  useConfigurablePanel, 
  usePanelDragging 
} from './ConfigurablePanel.hook';

// Types
export type { 
  ConfigurablePanelProps,
  StyledPanelContainerProps,
  StyledPanelHeaderProps,
  StyledPanelContentProps,
  ResizeDirection,
  IconConfig
} from './ConfigurablePanel.types';

// Logic functions
export {
  getCollapseIconType,
  getResizerDirection,
  getIconConfig,
  getAnimationConfig,
  validatePanelSize,
  calculatePanelPosition
} from './ConfigurablePanel.logic';

// Styled components
export {
  PanelContainer,
  PanelHeader,
  PanelContent,
  MobileDragHandle
} from './ConfigurablePanel.styles';

// Legacy exports for backward compatibility during transition
export { ConfigurablePanel as SlotPanel };
export { useConfigurablePanel as useSlotPanel };
export type { ConfigurablePanelProps as SlotPanelProps }; 