/**
 * LazyPanelLoader Component Types
 * Type definitions for the lazy panel loading system
 */
import { ReactNode } from 'react';

// Component Props Interface
export interface LazyPanelLoaderProps {
  /** Panel content to lazy load */
  children: ReactNode;
  /** Panel ID for tracking */
  panelId: string;
  /** Whether panel is currently visible/active */
  isVisible: boolean;
  /** Loading fallback component */
  fallback?: ReactNode;
  /** Intersection threshold for triggering load */
  threshold?: number;
  /** Whether to use intersection observer */
  useIntersectionObserver?: boolean;
  /** Custom loading state component */
  loadingComponent?: ReactNode;
  /** Error boundary fallback */
  errorFallback?: ReactNode;
}

// Internal State Interface
export interface LazyPanelState {
  isLoaded: boolean;
  isIntersecting: boolean;
  hasError: boolean;
}

// Default Loading Component Props
export interface DefaultLoadingComponentProps {
  panelId: string;
}

// Default Error Fallback Props
export interface DefaultErrorFallbackProps {
  panelId: string;
  retry: () => void;
}

// Hook Return Type
export interface PanelLoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Performance Utils Interface
export interface PanelPerformanceUtils {
  preloadPanel: (panelId: string) => Promise<void>;
  clearPanelCache: (panelId?: string) => void;
  getPanelMemoryUsage: (panelId: string) => number;
}

// Loading States Record Type
export type LoadingStatesRecord = Record<string, boolean>; 