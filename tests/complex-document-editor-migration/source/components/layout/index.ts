/**
 * Layout Components Index
 * 
 * Barrel exports for all layout-related components
 * Provides clean imports for the document editor layout system
 * 
 * @module layout/index
 */

// Organized layout components
export * from '@/tests/complex-document-editor-migration/source/components/layout/components';

// Desktop layout components
export { 
  ThreeColumnLayout, 
  useThreeColumnLayout 
} from '@/tests/complex-document-editor-migration/source/components/layout/desktop';

// Mobile layout components
export { 
  DrawerLayout, 
  useDrawerLayout 
} from '@/tests/complex-document-editor-migration/source/components/layout/mobile';

// Resize components
export { 
  LeftColumnResizer, 
  RightColumnResizer, 
  VerticalSplitter 
} from '@/tests/complex-document-editor-migration/source/components/layout/resize';

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
} from '@/tests/complex-document-editor-migration/source/components/layout/platform';

// Desktop layout types
export type {
  ThreeColumnLayoutProps,
  ThreeColumnLayoutLogic,
  ColumnConfiguration,
  ColumnConstraints,
} from '@/tests/complex-document-editor-migration/source/components/layout/desktop';

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
} from '@/tests/complex-document-editor-migration/source/components/layout/mobile';

// Resize component types
export type {
  LeftColumnResizerProps,
  RightColumnResizerProps,
  VerticalSplitterProps,
} from '@/tests/complex-document-editor-migration/source/components/layout/resize';

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
} from '@/tests/complex-document-editor-migration/source/components/layout/platform'; 