/**
 * PageNavigator Component Index
 * 
 * Barrel exports for PageNavigator component and related types
 * Follows atomic design methodology and react-component-standards
 * 
 * @module PageNavigator
 */

// Main component export
export { PageNavigator } from './PageNavigator';

// Platform-specific exports (for advanced usage)
export { PageNavigatorWeb } from './PageNavigator.web';
export { PageNavigatorMobile } from './PageNavigator.mobile';

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
} from './PageNavigator.types';

// Logic exports (for advanced usage)
export {
  usePageNavigatorLogic,
  calculatePageRange,
  validatePageNumber,
  formatPageDisplay,
  calculateThumbnailDimensions
} from './PageNavigator.logic'; 