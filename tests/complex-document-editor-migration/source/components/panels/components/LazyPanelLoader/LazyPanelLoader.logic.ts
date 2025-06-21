/**
 * LazyPanelLoader Business Logic
 * Pure functions for panel loading logic
 */
import type { LazyPanelState } from './LazyPanelLoader.types';

// Panel Loading Decision Logic
export const shouldLoadPanel = (
  isMobile: boolean,
  isVisible: boolean,
  isIntersecting: boolean,
  isLoaded: boolean,
  hasError: boolean
): boolean => {
  // Desktop loads immediately
  if (!isMobile) return true;
  
  // Don't load if already loaded or has error
  if (isLoaded || hasError) return false;
  
  // Load if visible or intersecting on mobile
  return isVisible || isIntersecting;
};

// Intersection Observer Configuration
export const createIntersectionObserverOptions = (
  threshold: number
): IntersectionObserverInit => ({
  threshold,
  rootMargin: '50px' // Start loading 50px before panel comes into view
});

// Error Handler Configuration
export const createErrorHandler = (
  panelId: string,
  setState: (updater: (prev: LazyPanelState) => LazyPanelState) => void
) => (error: ErrorEvent) => {
  console.error(`Panel ${panelId} loading error:`, error);
  setState(prev => ({ 
    ...prev, 
    hasError: true, 
    isLoaded: false 
  }));
};

// State Update Helpers
export const updateIntersectionState = (
  isIntersecting: boolean
) => (prev: LazyPanelState): LazyPanelState => ({
  ...prev,
  isIntersecting
});

export const updateLoadedState = (
  isLoaded: boolean
) => (prev: LazyPanelState): LazyPanelState => ({
  ...prev,
  isLoaded
});

export const resetErrorState = () => (prev: LazyPanelState): LazyPanelState => ({
  ...prev,
  hasError: false,
  isLoaded: false
});

// Performance Utilities Logic
export const PanelPerformanceLogic = {
  /**
   * Preload panel content for anticipated navigation
   */
  preloadPanel: async (panelId: string): Promise<void> => {
    // Implementation for preloading panel content
    console.log(`Preloading panel: ${panelId}`);
    // In real implementation, this would trigger module loading
  },

  /**
   * Clear panel cache to free memory
   */
  clearPanelCache: (panelId?: string): void => {
    if (panelId) {
      console.log(`Clearing cache for panel: ${panelId}`);
    } else {
      console.log('Clearing all panel caches');
    }
    // In real implementation, this would clear cached modules/components
  },

  /**
   * Get panel memory usage estimate
   */
  getPanelMemoryUsage: (panelId: string): number => {
    // Mock implementation - in real app would measure actual memory
    return Math.floor(Math.random() * 1000000); // Returns bytes
  }
};

// Initial State Factory
export const createInitialPanelState = (isMobile: boolean): LazyPanelState => ({
  isLoaded: !isMobile, // Desktop loads immediately, mobile lazy loads
  isIntersecting: false,
  hasError: false
});

// Component Props Validation
export const validatePanelLoaderProps = (
  panelId: string,
  threshold: number
): boolean => {
  if (!panelId || panelId.trim() === '') {
    console.warn('LazyPanelLoader: panelId is required');
    return false;
  }
  
  if (threshold < 0 || threshold > 1) {
    console.warn('LazyPanelLoader: threshold must be between 0 and 1');
    return false;
  }
  
  return true;
}; 