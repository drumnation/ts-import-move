/**
 * LazyPanelLoader Module
 * @module components/LazyPanelLoader
 */

// Main component
export { LazyPanelLoader } from './LazyPanelLoader';

// Custom hook
export { useLazyPanelLoader } from './LazyPanelLoader.hook';

// Sub-components
export { DefaultLoadingComponent, DefaultErrorFallback } from './components';

// Type exports
export type {
  LazyPanelLoaderProps,
  LazyPanelState,
  DefaultLoadingComponentProps,
  DefaultErrorFallbackProps,
  PanelLoadingState,
  PanelPerformanceUtils,
  LoadingStatesRecord
} from './LazyPanelLoader.types';

// Logic utilities (for advanced usage)
export {
  shouldLoadPanel,
  createIntersectionObserverOptions,
  PanelPerformanceLogic,
  validatePanelLoaderProps
} from './LazyPanelLoader.logic'; 