/**
 * PageNavigator Component Index
 * 
 * Barrel exports for PageNavigator component and related types
 * Follows atomic design methodology and react-component-standards
 * 
 * @module PageNavigator
 */

// Main component export
export { PageNavigator } from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator';

// Platform-specific exports (for advanced usage)
export { PageNavigatorWeb } from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.web';
export { PageNavigatorMobile } from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.mobile';

// Type exports
export type {
  PageNavigatorProps,
  PageNavigatorWebProps,
  PageNavigatorMobileProps,
  PageThumbnail,
  PageNavigationState,
  PageNavigationActions,
  PageNavigatorLogicHook,
  PageNavigatorVariant,
  PageNavigatorStyleProps
} from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.types';

// Logic exports (for advanced usage)
export {
  usePageNavigatorLogic,
  calculatePageRange,
  validatePageNumber,
  formatPageDisplay,
  calculateThumbnailDimensions
} from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.logic'; 