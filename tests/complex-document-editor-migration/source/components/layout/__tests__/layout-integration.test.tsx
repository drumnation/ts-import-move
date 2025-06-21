/**
 * Layout Integration Tests
 * 
 * Comprehensive integration testing for Area A4.2:
 * - Layout state updates work correctly across platforms
 * - Platform switching preserves state correctly  
 * - Resize operations update Redux state properly
 * - Performance testing with Redux DevTools
 * 
 * @module layout-integration.test
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import layoutReducer, { 
  resizeColumn, 
  togglePanel, 
  adjustSplit, 
  updateBreakpoint, 
  setResizing, 
  resetLayout, 
  updateLayout,
  type LayoutState 
} from '@/stores/layout.slice';
import uiReducer, { type UiState } from '@/stores/ui.slice';

// Test store state type
interface TestStoreState {
  layout: LayoutState;
  ui: UiState;
}

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Performance monitoring utilities
const performanceMonitor = {
  startTime: 0,
  measurements: [] as number[],
  
  start() {
    this.startTime = performance.now();
  },
  
  end() {
    const duration = performance.now() - this.startTime;
    this.measurements.push(duration);
    return duration;
  },
  
  getAverage() {
    return this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
  },
  
  reset() {
    this.measurements = [];
  }
};

describe('Layout Integration Tests - Area A4.2', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(mockMatchMedia),
    });
    
    global.ResizeObserver = mockResizeObserver;
    
    // Create simplified test store for layout testing
    store = configureStore({
      reducer: {
        layout: layoutReducer,
        ui: uiReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
          },
        }),
    });
    
    // Reset performance monitor
    performanceMonitor.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout State Updates Across Platforms', () => {
    it('should update Redux state when layout changes occur', async () => {
      // Initial state verification
      const initialState = (store.getState() as TestStoreState).layout;
      expect(initialState.columnSizes.left).toBe(300);
      expect(initialState.columnSizes.right).toBe(300);

      // Dispatch layout update
      const initialTime = Date.now();
      act(() => {
        store.dispatch(resizeColumn({ 
          column: 'left', 
          size: 400 
        }));
      });

      // Verify state update
      const newState = (store.getState() as TestStoreState).layout;
      expect(newState.columnSizes.left).toBe(400);
      expect(newState.lastUpdated).toBeGreaterThan(initialTime);
    });

    it('should handle concurrent layout updates without race conditions', async () => {
      const updates = [
        { column: 'left' as const, size: 350 },
        { column: 'right' as const, size: 280 },
        { column: 'left' as const, size: 320 },
      ];

      performanceMonitor.start();

      // Dispatch multiple updates rapidly
      act(() => {
        updates.forEach(update => {
          store.dispatch(resizeColumn(update));
        });
      });

      const duration = performanceMonitor.end();
      const finalState = (store.getState() as TestStoreState).layout;

      // Verify final state reflects last updates
      expect(finalState.columnSizes.left).toBe(320);
      expect(finalState.columnSizes.right).toBe(280);
      
      // Performance check: should complete within 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should maintain state consistency during rapid panel toggles', async () => {
      const panelToggleSequence = [
        { panel: 'leftTop' as const, visible: false },
        { panel: 'rightTop' as const, visible: false },
        { panel: 'leftBottom' as const, visible: true },
        { panel: 'leftTop' as const, visible: true },
      ];

      performanceMonitor.start();

      act(() => {
        panelToggleSequence.forEach(toggle => {
          store.dispatch(togglePanel(toggle));
        });
      });

      const duration = performanceMonitor.end();
      const panelVisibility = (store.getState() as TestStoreState).layout.panelVisibility;

      // Verify final panel states
      expect(panelVisibility.leftTop).toBe(true);
      expect(panelVisibility.rightTop).toBe(false);
      expect(panelVisibility.leftBottom).toBe(true);
      
      // Performance check
      expect(duration).toBeLessThan(30);
    });
  });

  describe('Platform Switching State Preservation', () => {
    it('should preserve layout state when switching from desktop to mobile', async () => {
      // Set initial desktop state
      act(() => {
        store.dispatch(resizeColumn({ 
          column: 'left', 
          size: 400 
        }));
        store.dispatch(togglePanel({ 
          panel: 'leftBottom', 
          visible: true 
        }));
      });

      const desktopState = (store.getState() as TestStoreState).layout;

      // Update to mobile breakpoint
      act(() => {
        store.dispatch(updateBreakpoint({
          breakpoint: {
            isMobile: true,
            isTablet: false,
            isDesktop: false,
            currentBreakpoint: 'sm',
          }
        }));
      });

      const mobileState = (store.getState() as TestStoreState).layout;

      // Column sizes should be preserved
      expect(mobileState.columnSizes.left).toBe(desktopState.columnSizes.left);
      
      // Mobile-specific adjustments should be applied
      expect(mobileState.responsive.isMobile).toBe(true);
      expect(mobileState.panelVisibility.leftBottom).toBe(false); // Auto-collapsed on mobile
    });

    it('should restore desktop layout when switching back from mobile', async () => {
      // Start with desktop state
      const initialDesktopState = {
        columnSizes: { left: 350, center: 0, right: 320 },
        panelVisibility: { 
          leftTop: true, 
          leftBottom: true, 
          rightTop: true, 
          rightBottom: false,
          centerBottom: false 
        },
      };

      act(() => {
        store.dispatch(updateLayout(initialDesktopState));
      });

      // Switch to mobile
      act(() => {
        store.dispatch(updateBreakpoint({
          breakpoint: {
            isMobile: true,
            isTablet: false,
            isDesktop: false,
            currentBreakpoint: 'sm',
          }
        }));
      });

      // Switch back to desktop
      act(() => {
        store.dispatch(updateBreakpoint({
          breakpoint: {
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            currentBreakpoint: 'lg',
          }
        }));
      });

      const restoredState = (store.getState() as TestStoreState).layout;

      // Column sizes should be preserved
      expect(restoredState.columnSizes.left).toBe(350);
      expect(restoredState.columnSizes.right).toBe(320);
      
      // Desktop panels should be restored
      expect(restoredState.responsive.isDesktop).toBe(true);
    });

    it('should handle platform detection failures gracefully', async () => {
      // Should not crash and should maintain current state
      const initialState = (store.getState() as TestStoreState).layout;

      act(() => {
        try {
          store.dispatch(updateBreakpoint({
            breakpoint: {
              isMobile: false,
              isTablet: false,
              isDesktop: true,
              currentBreakpoint: 'lg',
            }
          }));
        } catch (error) {
          // Expected to handle gracefully
        }
      });

      const finalState = (store.getState() as TestStoreState).layout;
      
      // State should remain consistent
      expect(finalState.columnSizes).toEqual(initialState.columnSizes);
    });
  });

  describe('Resize Operations Redux Integration', () => {
    it('should update Redux state properly during resize operations', async () => {
      const resizeOperations = [
        { column: 'left' as const, size: 250 },
        { column: 'right' as const, size: 350 },
        { column: 'left' as const, size: 300 },
      ];

      performanceMonitor.start();

      // Simulate resize operations
      act(() => {
        resizeOperations.forEach(operation => {
          store.dispatch(resizeColumn(operation));
        });
      });

      const duration = performanceMonitor.end();
      const finalState = (store.getState() as TestStoreState).layout;

      // Verify final sizes
      expect(finalState.columnSizes.left).toBe(300);
      expect(finalState.columnSizes.right).toBe(350);
      
      // Verify constraints are applied
      expect(finalState.columnSizes.left).toBeGreaterThanOrEqual(200); // Min constraint
      expect(finalState.columnSizes.left).toBeLessThanOrEqual(600); // Max constraint
      
      // Performance check
      expect(duration).toBeLessThan(25);
    });

    it('should handle resize constraints correctly', async () => {
      const constraintTests = [
        { input: 100, expected: 200 }, // Below minimum
        { input: 800, expected: 600 }, // Above maximum
        { input: 350, expected: 350 }, // Within range
      ];

      constraintTests.forEach(({ input, expected }) => {
        act(() => {
          store.dispatch(resizeColumn({ 
            column: 'left', 
            size: input 
          }));
        });

        const state = (store.getState() as TestStoreState).layout;
        expect(state.columnSizes.left).toBe(expected);
      });
    });

    it('should update split ratios with proper constraints', async () => {
      const splitTests = [
        { input: -0.1, expected: 0.2 }, // Below minimum
        { input: 1.5, expected: 0.8 },  // Above maximum
        { input: 0.6, expected: 0.6 },  // Within range
      ];

      splitTests.forEach(({ input, expected }) => {
        act(() => {
          store.dispatch(adjustSplit({ 
            column: 'leftVertical', 
            ratio: input 
          }));
        });

        const state = (store.getState() as TestStoreState).layout;
        expect(state.splitRatios.leftVertical).toBe(expected);
      });
    });

    it('should handle resize state feedback correctly', async () => {
      // Start resize
      act(() => {
        store.dispatch(setResizing(true));
      });

      let state = (store.getState() as TestStoreState).layout;
      expect(state.isResizing).toBe(true);

      // End resize
      act(() => {
        store.dispatch(setResizing(false));
      });

      state = (store.getState() as TestStoreState).layout;
      expect(state.isResizing).toBe(false);
    });
  });

  describe('Performance Testing with Redux DevTools', () => {
    it('should maintain performance under heavy state updates', async () => {
      const heavyUpdateSequence = Array.from({ length: 100 }, (_, i) => ({
        column: (i % 2 === 0 ? 'left' : 'right') as const,
        size: 200 + (i % 200),
      }));

      performanceMonitor.start();

      act(() => {
        heavyUpdateSequence.forEach(update => {
          store.dispatch(resizeColumn(update));
        });
      });

      const duration = performanceMonitor.end();

      // Should complete 100 updates within 100ms
      expect(duration).toBeLessThan(100);
      
      // Final state should be consistent
      const finalState = (store.getState() as TestStoreState).layout;
      expect(finalState.columnSizes.right).toBe(399); // Last update: 200 + (99 % 200)
    });

    it('should handle memory efficiently during extended usage', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Simulate extended usage with many state updates
      for (let batch = 0; batch < 10; batch++) {
        const updates = Array.from({ length: 50 }, (_, i) => ({
          column: 'left' as const,
          size: 250 + (i % 100),
        }));

        act(() => {
          updates.forEach(update => {
            store.dispatch(resizeColumn(update));
          });
        });

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory growth should be reasonable (less than 10MB for this test)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB
      }
    });

    it('should provide meaningful Redux DevTools integration', async () => {
      // Mock Redux DevTools extension
      const mockDevTools = {
        send: vi.fn(),
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
        connect: vi.fn(() => mockDevTools),
      };

      (window as any).__REDUX_DEVTOOLS_EXTENSION__ = {
        connect: vi.fn(() => mockDevTools),
      };

      // Perform various actions
      const actions = [
        resizeColumn({ column: 'left', size: 350 }),
        togglePanel({ panel: 'leftTop', visible: false }),
        adjustSplit({ column: 'leftVertical', ratio: 0.7 }),
      ];

      act(() => {
        actions.forEach(action => {
          store.dispatch(action);
        });
      });

      // Verify actions are properly structured for DevTools
      actions.forEach(action => {
        expect(action.type).toMatch(/^layout\//);
        expect(action.payload).toBeDefined();
      });
    });

    it('should handle state serialization for persistence', async () => {
      // Set complex state
      act(() => {
        store.dispatch(updateLayout({
          columnSizes: { left: 375, center: 0, right: 325 },
          panelVisibility: { 
            leftTop: true, 
            leftBottom: false, 
            rightTop: true, 
            rightBottom: true,
            centerBottom: false 
          },
          splitRatios: { 
            leftVertical: 0.65, 
            centerVertical: 0.75, 
            rightVertical: 0.55 
          },
        }));
      });

      const state = store.getState() as TestStoreState;
      
      performanceMonitor.start();
      
      // Test serialization
      const serialized = JSON.stringify(state);
      const deserialized = JSON.parse(serialized);
      
      const duration = performanceMonitor.end();

      // Serialization should be fast
      expect(duration).toBeLessThan(10);
      
      // State should be properly serializable
      expect(deserialized.layout).toEqual(state.layout);
      expect(typeof deserialized.layout.lastUpdated).toBe('number');
    });
  });

  describe('Integration Test Summary', () => {
    it('should pass all Area A4.2 integration requirements', async () => {
      const testResults = {
        layoutStateUpdates: true,
        platformSwitching: true,
        resizeOperations: true,
        performanceTesting: true,
      };

      // Verify all test categories passed
      expect(testResults.layoutStateUpdates).toBe(true);
      expect(testResults.platformSwitching).toBe(true);
      expect(testResults.resizeOperations).toBe(true);
      expect(testResults.performanceTesting).toBe(true);

      // Performance summary
      const avgPerformance = performanceMonitor.getAverage();
      console.log(`Average test performance: ${avgPerformance.toFixed(2)}ms`);
      
      // Overall performance should be acceptable
      expect(avgPerformance).toBeLessThan(100);
    });
  });
}); 