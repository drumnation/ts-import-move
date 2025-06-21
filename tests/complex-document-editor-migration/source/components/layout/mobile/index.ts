/**
 * Mobile Layout Components
 * 
 * Barrel exports for mobile-specific layout components
 * Provides clean imports for mobile drawer layout system
 * 
 * @module mobile/index
 */

export { DrawerLayout, useDrawerLayout } from './DrawerLayout';
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
} from './DrawerLayout'; 