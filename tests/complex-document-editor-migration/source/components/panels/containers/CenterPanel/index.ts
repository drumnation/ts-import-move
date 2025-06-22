/**
 * CenterPanel Module - Level 3 Platform Separation
 * @module panels/CenterPanel
 */

// Main component (platform router)
export { CenterPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel';

// Platform-specific implementations
export { CenterPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.desktop';
export { CenterPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.mobile';

// Shared logic
export { useCenterPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.logic';

// Type exports
export type {
  CenterContent,
  CenterPanelProps,
  CenterPanelLogic,
} from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.types'; 