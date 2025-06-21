/**
 * CenterPanel Module - Level 3 Platform Separation
 * @module panels/CenterPanel
 */

// Main component (platform router)
export { CenterPanel } from './CenterPanel';

// Platform-specific implementations
export { CenterPanelDesktop } from './CenterPanel.desktop';
export { CenterPanelMobile } from './CenterPanel.mobile';

// Shared logic
export { useCenterPanel } from './CenterPanel.logic';

// Type exports
export type {
  CenterContent,
  CenterPanelProps,
  CenterPanelLogic,
} from './CenterPanel.types'; 