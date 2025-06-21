/**
 * Layout Components Index
 * 
 * Barrel exports for all layout-related components
 * Provides clean imports for the document editor layout system
 * 
 * @module layout/index
 */

// Organized layout components
export * from './components';

// Desktop layout components
export { 
  ThreeColumnLayout, 
  useThreeColumnLayout 
} from './desktop';

// Mobile layout components
export { 
  DrawerLayout, 
  useDrawerLayout 
} from './mobile';

// Resize components
export { 
  LeftColumnResizer, 
  RightColumnResizer, 
  VerticalSplitter 
} from './resize';

// Platform detection system
export {
  PlatformProvider,
  PlatformRouter,
  PlatformDebug,
  PlatformShow,
  PlatformHide,
  usePlatformContext,
  usePlatformDetection,
  useMediaQuery,
  useResponsiveValue,
  usePlatformClasses,
} from './platform';

// Desktop layout types
export type {
  ThreeColumnLayoutProps,
  ThreeColumnLayoutLogic,
  ColumnConfiguration,
  ColumnConstraints,
} from './desktop';

// Mobile layout types
export type {
  DrawerLayoutProps,
  DrawerLayoutLogic,
  MobileLayoutState,
  DrawerConfiguration,
  DrawerPosition,
  DrawerState,
  TouchGesture,
  SwipeDirection,
  DrawerAnimationConfig,
  DrawerConstraints,
} from './mobile';

// Resize component types
export type {
  LeftColumnResizerProps,
  RightColumnResizerProps,
  VerticalSplitterProps,
} from './resize';

// Platform detection types
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
} from './platform'; 