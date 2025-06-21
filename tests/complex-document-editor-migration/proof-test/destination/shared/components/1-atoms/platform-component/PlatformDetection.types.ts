/**
 * Platform Detection Types
 * 
 * TypeScript interfaces for platform detection and routing
 * Supports responsive breakpoints and device capabilities
 * 
 * @module PlatformDetection.types
 */

/**
 * Platform type enumeration
 */
export type Platform = 'desktop' | 'mobile' | 'tablet';

/**
 * Device capabilities detection
 */
export interface DeviceCapabilities {
  /** Whether device supports touch input */
  hasTouch: boolean;
  /** Whether device supports hover interactions */
  hasHover: boolean;
  /** Whether device has a physical keyboard */
  hasKeyboard: boolean;
  /** Screen pixel density ratio */
  pixelRatio: number;
  /** Available screen width */
  screenWidth: number;
  /** Available screen height */
  screenHeight: number;
  /** Whether device is in landscape orientation */
  isLandscape: boolean;
  /** Whether device supports pointer events */
  hasPointer: boolean;
}

/**
 * Breakpoint configuration
 */
export interface BreakpointConfig {
  /** Mobile breakpoint (max width) */
  mobile: number;
  /** Tablet breakpoint (max width) */
  tablet: number;
  /** Desktop breakpoint (min width) */
  desktop: number;
}

/**
 * Platform detection state
 */
export interface PlatformState {
  /** Current detected platform */
  platform: Platform;
  /** Device capabilities */
  capabilities: DeviceCapabilities;
  /** Whether platform detection is complete */
  isReady: boolean;
  /** Current viewport dimensions */
  viewport: {
    width: number;
    height: number;
  };
  /** Breakpoint configuration */
  breakpoints: BreakpointConfig;
}

/**
 * Platform detection hook return type
 */
export interface PlatformDetectionHook {
  /** Current platform state */
  platform: Platform;
  /** Device capabilities */
  capabilities: DeviceCapabilities;
  /** Whether detection is ready */
  isReady: boolean;
  /** Current viewport dimensions */
  viewport: { width: number; height: number };
  /** Platform check utilities */
  is: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    touch: boolean;
    hover: boolean;
  };
  /** Force platform override (for testing) */
  setPlatform: (platform: Platform) => void;
}

/**
 * Platform provider props
 */
export interface PlatformProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Custom breakpoint configuration */
  breakpoints?: Partial<BreakpointConfig>;
  /** Force platform override */
  forcePlatform?: Platform;
  /** Debug mode for development */
  debug?: boolean;
}

/**
 * Platform router props
 */
export interface PlatformRouterProps {
  /** Desktop component */
  desktop: React.ComponentType<any>;
  /** Mobile component */
  mobile: React.ComponentType<any>;
  /** Tablet component (optional, falls back to mobile) */
  tablet?: React.ComponentType<any>;
  /** Props to pass to platform components */
  componentProps?: Record<string, any>;
  /** Loading component while detecting platform */
  loading?: React.ComponentType;
  /** Fallback component if detection fails */
  fallback?: React.ComponentType;
}

/**
 * Platform context type
 */
export interface PlatformContextType extends PlatformDetectionHook {
  /** Update platform state */
  updatePlatform: (state: Partial<PlatformState>) => void;
}

/**
 * Media query configuration
 */
export interface MediaQueryConfig {
  /** Media query string */
  query: string;
  /** Whether query currently matches */
  matches: boolean;
  /** Callback when match state changes */
  onChange?: (matches: boolean) => void;
}

/**
 * Platform-specific component props
 */
export interface PlatformComponentProps {
  /** Current platform */
  platform: Platform;
  /** Device capabilities */
  capabilities: DeviceCapabilities;
  /** Viewport dimensions */
  viewport: { width: number; height: number };
} 