/**
 * LeftPanel Module - Level 3 Platform Separation
 * @module panels/LeftPanel
 */

// Main component (platform router)
export { LeftPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel';

// Platform-specific implementations
export { LeftPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.desktop';
export { LeftPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.mobile';

// Shared logic
export { useLeftPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.logic';

// Redux integration
export { 
  useLeftPanelRedux,
  leftPanelActions,
} from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.redux';

// Type exports
export type {
  PanelContent,
  LeftPanelProps,
  LeftPanelLogic,
} from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.types'; 