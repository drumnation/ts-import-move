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
} from './PlatformDetection';

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
} from './PlatformDetection.logic';

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
} from './PlatformDetection.types'; 