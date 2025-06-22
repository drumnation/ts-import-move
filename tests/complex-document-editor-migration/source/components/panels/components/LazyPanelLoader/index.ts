/**
 * LazyPanelLoader Module
 * @module components/LazyPanelLoader
 */

// Main component
export { LazyPanelLoader } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader';

// Custom hook
export { useLazyPanelLoader } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.hook';

// Sub-components
export { DefaultLoadingComponent, DefaultErrorFallback } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components';

// Type exports
export type {
  LazyPanelLoaderProps,
  LazyPanelState,
  DefaultLoadingComponentProps,
  DefaultErrorFallbackProps,
  PanelLoadingState,
  PanelPerformanceUtils,
  LoadingStatesRecord
} from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.types';

// Logic utilities (for advanced usage)
export {
  shouldLoadPanel,
  createIntersectionObserverOptions,
  PanelPerformanceLogic,
  validatePanelLoaderProps
} from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.logic'; 