/**
 * RightPanel Module - Level 3 Platform Separation
 * @module panels/RightPanel
 */

// Main component (platform router)
export { RightPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel';

// Platform-specific implementations
export { RightPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.desktop';
export { RightPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.mobile';

// Shared logic
export { useRightPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.logic';

// Redux integration
export { 
  useRightPanelRedux,
  rightPanelActions,
} from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.redux';

// Type exports
export type {
  RightPanelProps,
  RightPanelLogic,
} from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.types'; 