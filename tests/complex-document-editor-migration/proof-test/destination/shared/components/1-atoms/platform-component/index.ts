/**
 * Platform Detection System
 * 
 * Barrel exports for platform detection and routing
 * Provides clean imports for platform-aware components
 * 
 * @module platform/index
 */

// Components
export {
  PlatformProvider,
  PlatformRouter,
  PlatformDebug,
  PlatformShow,
  PlatformHide,
  usePlatformContext,
} from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection';

// Logic and hooks
export {
  usePlatformDetection,
  useMediaQuery,
  useResponsiveValue,
  usePlatformClasses,
  detectDeviceCapabilities,
  determinePlatform,
  createMediaQueryListener,
  getViewportDimensions,
  DEFAULT_BREAKPOINTS,
} from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection.logic';

// Types
export type {
  Platform,
  DeviceCapabilities,
  BreakpointConfig,
  PlatformState,
  PlatformDetectionHook,
  PlatformProviderProps,
  PlatformRouterProps,
  PlatformContextType,
  MediaQueryConfig,
  PlatformComponentProps,
} from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection.types'; 