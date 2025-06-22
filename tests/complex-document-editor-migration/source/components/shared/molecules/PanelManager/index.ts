/**
 * PanelManager Component Index
 * 
 * Main export file for the PanelManager component
 * Renamed from PanelConfiguration for better AI agent discoverability
 * 
 * @module PanelManager
 */

// Main component export
export { PanelManager } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager';

// Hook exports
export { usePanelManager } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.hook';

// Type exports
export type {
  PanelManagerProps,
  UsePanelManagerReturn,
  PanelManagerHookParams,
  PanelManagerState,
  PanelSlotCreationConfig
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.types';

// Logic function exports
export {
  PANEL_SIZES,
  PANEL_DATA,
  createPanelSlotConfig,
  validatePanelSlotConfig,
  generatePanelId,
  getRecommendedPanelSizes,
  PanelLifecycleManager
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.logic';

// Legacy compatibility exports (for gradual migration)
// These allow existing imports to continue working during refactor
export { PanelManager as PanelConfiguration } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager';
export { usePanelManager as usePanelConfiguration } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.hook';
export type { PanelManagerProps as PanelConfigurationProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.types';
export type { UsePanelManagerReturn as UsePanelConfigurationReturn } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.types';
export type { PanelManagerHookParams as PanelConfigurationHookParams } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/PanelManager.types'; 