/**
 * PanelManager Component Index
 * 
 * Main export file for the PanelManager component
 * Renamed from PanelConfiguration for better AI agent discoverability
 * 
 * @module PanelManager
 */

// Main component export
export { PanelManager } from './PanelManager';

// Hook exports
export { usePanelManager } from './PanelManager.hook';

// Type exports
export type {
  PanelManagerProps,
  UsePanelManagerReturn,
  PanelManagerHookParams,
  PanelManagerState,
  PanelSlotCreationConfig
} from './PanelManager.types';

// Logic function exports
export {
  PANEL_SIZES,
  PANEL_DATA,
  createPanelSlotConfig,
  validatePanelSlotConfig,
  generatePanelId,
  getRecommendedPanelSizes,
  PanelLifecycleManager
} from './PanelManager.logic';

// Legacy compatibility exports (for gradual migration)
// These allow existing imports to continue working during refactor
export { PanelManager as PanelConfiguration } from './PanelManager';
export { usePanelManager as usePanelConfiguration } from './PanelManager.hook';
export type { PanelManagerProps as PanelConfigurationProps } from './PanelManager.types';
export type { UsePanelManagerReturn as UsePanelConfigurationReturn } from './PanelManager.types';
export type { PanelManagerHookParams as PanelConfigurationHookParams } from './PanelManager.types'; 