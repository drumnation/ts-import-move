/**
 * Platform Detection Logic
 * 
 * Business logic for platform detection and device capabilities
 * Handles responsive breakpoints and media query management
 * 
 * @module PlatformDetection.logic
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Platform,
  DeviceCapabilities,
  BreakpointConfig,
  PlatformState,
  PlatformDetectionHook,
  MediaQueryConfig,
} from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection.types';

/**
 * Default breakpoint configuration
 */
export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
};

/**
 * Detect device capabilities
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  // Safe defaults for SSR
  if (typeof window === 'undefined') {
    return {
      hasTouch: false,
      hasHover: true,
      hasKeyboard: true,
      pixelRatio: 1,
      screenWidth: 1920,
      screenHeight: 1080,
      isLandscape: true,
      hasPointer: true,
    };
  }

  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasPointer = window.matchMedia('(pointer: fine)').matches;
  
  return {
    hasTouch,
    hasHover,
    hasKeyboard: !hasTouch || hasPointer, // Assume keyboard if not touch-only
    pixelRatio: window.devicePixelRatio || 1,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isLandscape: window.screen.width > window.screen.height,
    hasPointer,
  };
};

/**
 * Determine platform based on viewport width and capabilities
 */
export const determinePlatform = (
  width: number,
  capabilities: DeviceCapabilities,
  breakpoints: BreakpointConfig
): Platform => {
  // Mobile-first approach with capability consideration
  if (width <= breakpoints.mobile) {
    return 'mobile';
  }
  
  if (width <= breakpoints.tablet) {
    // Use touch capability to distinguish tablet from small desktop
    return capabilities.hasTouch && !capabilities.hasKeyboard ? 'tablet' : 'desktop';
  }
  
  return 'desktop';
};

/**
 * Create media query listener
 */
export const createMediaQueryListener = (config: MediaQueryConfig): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia(config.query);
  
  const handleChange = (event: MediaQueryListEvent) => {
    config.onChange?.(event.matches);
  };

  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

/**
 * Get current viewport dimensions
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Platform detection hook
 */
export const usePlatformDetection = (
  customBreakpoints?: Partial<BreakpointConfig>,
  forcePlatform?: Platform,
  debug = false
): PlatformDetectionHook => {
  const breakpoints = useMemo(() => ({
    ...DEFAULT_BREAKPOINTS,
    ...customBreakpoints,
  }), [customBreakpoints]);

  const [state, setState] = useState<PlatformState>(() => {
    const capabilities = detectDeviceCapabilities();
    const viewport = getViewportDimensions();
    const platform = forcePlatform || determinePlatform(viewport.width, capabilities, breakpoints);

    return {
      platform,
      capabilities,
      isReady: false,
      viewport,
      breakpoints,
    };
  });

  /**
   * Update viewport and recalculate platform
   */
  const updateViewport = useCallback(() => {
    const viewport = getViewportDimensions();
    const capabilities = detectDeviceCapabilities();
    const platform = forcePlatform || determinePlatform(viewport.width, capabilities, breakpoints);

    setState(prev => ({
      ...prev,
      platform,
      capabilities,
      viewport,
      isReady: true,
    }));

    if (debug) {
      console.log('[PlatformDetection] Updated:', { platform, viewport, capabilities });
    }
  }, [breakpoints, forcePlatform, debug]);

  /**
   * Force platform override
   */
  const setPlatform = useCallback((platform: Platform) => {
    setState(prev => ({
      ...prev,
      platform,
    }));

    if (debug) {
      console.log('[PlatformDetection] Platform forced:', platform);
    }
  }, [debug]);

  // Set up viewport listeners
  useEffect(() => {
    // Initial detection
    updateViewport();

    // Listen for viewport changes
    const handleResize = () => {
      updateViewport();
    };

    const handleOrientationChange = () => {
      // Delay to allow orientation change to complete
      setTimeout(updateViewport, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateViewport]);

  // Create platform check utilities
  const is = useMemo(() => ({
    mobile: state.platform === 'mobile',
    tablet: state.platform === 'tablet',
    desktop: state.platform === 'desktop',
    touch: state.capabilities.hasTouch,
    hover: state.capabilities.hasHover,
  }), [state.platform, state.capabilities]);

  return {
    platform: state.platform,
    capabilities: state.capabilities,
    isReady: state.isReady,
    viewport: state.viewport,
    is,
    setPlatform,
  };
};

/**
 * Media query hook for custom breakpoints
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * Responsive value hook
 * Returns different values based on current platform
 */
export const useResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}): T => {
  const { platform } = usePlatformDetection();

  return useMemo(() => {
    switch (platform) {
    case 'mobile':
      return values.mobile;
    case 'tablet':
      return values.tablet || values.mobile;
    case 'desktop':
      return values.desktop;
    default:
      return values.desktop;
    }
  }, [platform, values]);
};

/**
 * Platform-specific CSS classes
 */
export const usePlatformClasses = (): string => {
  const { platform, capabilities } = usePlatformDetection();

  return useMemo(() => {
    const classes = [
      `platform-${platform}`,
      capabilities.hasTouch && 'has-touch',
      capabilities.hasHover && 'has-hover',
      capabilities.hasKeyboard && 'has-keyboard',
      capabilities.hasPointer && 'has-pointer',
    ].filter(Boolean);

    return classes.join(' ');
  }, [platform, capabilities]);
}; 