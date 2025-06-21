/**
 * LeftPanel Module - Level 3 Platform Separation
 * @module panels/LeftPanel
 */

// Main component (platform router)
export { LeftPanel } from './LeftPanel';

// Platform-specific implementations
export { LeftPanelDesktop } from './LeftPanel.desktop';
export { LeftPanelMobile } from './LeftPanel.mobile';

// Shared logic
export { useLeftPanel } from './LeftPanel.logic';

// Redux integration
export { 
  useLeftPanelRedux,
  leftPanelActions,
} from './LeftPanel.redux';

// Type exports
export type {
  PanelContent,
  LeftPanelProps,
  LeftPanelLogic,
} from './LeftPanel.types'; 