/**
 * SlotPanel Component Exports
 * 
 * Barrel export for SlotPanel component and related types
 * 
 * @module SlotPanel
 */

export { SlotPanel } from './SlotPanel';
export type { 
  SlotPanelProps, 
  StyledPanelContainerProps,
  StyledPanelHeaderProps,
  StyledPanelContentProps,
  ResizeDirection,
  IconConfig
} from './SlotPanel.types';
export { useSlotPanel, usePanelDragging } from './SlotPanel.hook';
export { 
  getCollapseIconType, 
  getResizerDirection, 
  getIconConfig,
  getAnimationConfig 
} from './SlotPanel.logic'; 