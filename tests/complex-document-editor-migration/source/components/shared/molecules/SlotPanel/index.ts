/**
 * SlotPanel Component Exports
 * 
 * Barrel export for SlotPanel component and related types
 * 
 * @module SlotPanel
 */

export { SlotPanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel';
export type { 
  SlotPanelProps, 
  StyledPanelContainerProps,
  StyledPanelHeaderProps,
  StyledPanelContentProps,
  ResizeDirection,
  IconConfig
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.types';
export { useSlotPanel, usePanelDragging } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.hook';
export { 
  getCollapseIconType, 
  getResizerDirection, 
  getIconConfig,
  getAnimationConfig 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.logic'; 