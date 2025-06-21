/**
 * RightPanel Module - Level 3 Platform Separation
 * @module panels/RightPanel
 */

// Main component (platform router)
export { RightPanel } from './RightPanel';

// Platform-specific implementations
export { RightPanelDesktop } from './RightPanel.desktop';
export { RightPanelMobile } from './RightPanel.mobile';

// Shared logic
export { useRightPanel } from './RightPanel.logic';

// Redux integration
export { 
  useRightPanelRedux,
  rightPanelActions,
} from './RightPanel.redux';

// Type exports
export type {
  RightPanelProps,
  RightPanelLogic,
} from './RightPanel.types'; 