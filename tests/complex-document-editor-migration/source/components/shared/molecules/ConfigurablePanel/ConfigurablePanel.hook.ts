/**
 * ConfigurablePanel Component Hooks
 * 
 * Custom hooks and stateful logic for the ConfigurablePanel component
 * Renamed from SlotPanel for better AI agent discoverability
 * 
 * @module ConfigurablePanel.hook
 */

import { useState, useCallback, useMemo } from 'react';
import { usePlatformDetection } from '@/pages/DocumentEditorPage/DocumentEditorPage.hook';
import { 
  getCollapseIconType, 
  getResizerDirection, 
  getIconConfig,
  getAnimationConfig 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ConfigurablePanel/ConfigurablePanel.logic';
import type { ConfigurablePanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ConfigurablePanel/ConfigurablePanel.types';

/**
 * Main hook for ConfigurablePanel component state and handlers
 * Manages platform-specific behavior, panel state, and user interactions
 */
export const useConfigurablePanel = ({
  location,
  slot,
  collapsed = false,
  onToggle,
  onResize
}: Pick<ConfigurablePanelProps, 'location' | 'slot' | 'collapsed' | 'onToggle' | 'onResize'>) => {
  const { platform, touchTargetConfig } = usePlatformDetection();
  const isMobile = platform === 'mobile';
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handles panel collapse/expand toggle
   * Provides feedback to parent component about state change
   */
  const handleToggle = useCallback(() => {
    onToggle?.(!collapsed);
  }, [collapsed, onToggle]);

  /**
   * Handles panel resize operations
   * Validates and applies new panel size
   */
  const handleResize = useCallback((newSize: number) => {
    onResize?.(newSize);
  }, [onResize]);

  /**
   * Determines appropriate collapse icon based on panel state and platform
   * Uses platform and location context to show correct directional chevron
   */
  const collapseIconType = useMemo(() => 
    getCollapseIconType(isMobile, collapsed, location, slot), 
  [isMobile, collapsed, location, slot]
  );

  /**
   * Calculates resize direction based on panel location
   * Sidebar panels resize horizontally, center panels resize vertically
   */
  const resizerDirection = useMemo(() => 
    getResizerDirection(location, slot), 
  [location, slot]
  );

  /**
   * Configures icon sizes for platform-appropriate touch targets
   * Ensures minimum 44px touch targets on mobile devices
   */
  const iconConfig = useMemo(() => 
    getIconConfig(isMobile), 
  [isMobile]
  );

  /**
   * Sets up animation configuration for smooth panel transitions
   * Uses platform-optimized animation settings
   */
  const animationConfig = useMemo(() => 
    getAnimationConfig(isMobile), 
  [isMobile]
  );

  return {
    // Platform detection
    isMobile,
    touchTargetConfig,
    
    // State management
    isDragging,
    setIsDragging,
    
    // Event handlers
    handleToggle,
    handleResize,
    
    // Computed configurations
    collapseIconType,
    resizerDirection,
    iconConfig,
    animationConfig
  };
};

/**
 * Hook for managing panel dragging state
 * Provides clean interface for drag operations
 */
export const usePanelDragging = () => {
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = useCallback(() => {
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    startDragging,
    stopDragging
  };
};

// Legacy export for backward compatibility during transition
export { useConfigurablePanel as useSlotPanel }; 