/**
 * SlotPanel Component Hooks
 * 
 * Custom hooks and stateful logic for the SlotPanel component
 * 
 * @module SlotPanel.hook
 */

import { useState, useCallback, useMemo } from 'react';
import { usePlatformDetection } from '@/pages/DocumentEditorPage/DocumentEditorPage.hook';
import { 
  getCollapseIconType, 
  getResizerDirection, 
  getIconConfig,
  getAnimationConfig 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.logic';
import type { SlotPanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.types';

/**
 * Main hook for SlotPanel component state and handlers
 */
export const useSlotPanel = ({
  location,
  slot,
  collapsed = false,
  onToggle,
  onResize
}: Pick<SlotPanelProps, 'location' | 'slot' | 'collapsed' | 'onToggle' | 'onResize'>) => {
  const { platform, touchTargetConfig } = usePlatformDetection();
  const isMobile = platform === 'mobile';
  const [isDragging, setIsDragging] = useState(false);

  const handleToggle = useCallback(() => {
    onToggle?.(!collapsed);
  }, [collapsed, onToggle]);

  const handleResize = useCallback((newSize: number) => {
    onResize?.(newSize);
  }, [onResize]);

  const collapseIconType = useMemo(() => 
    getCollapseIconType(isMobile, collapsed, location, slot), 
  [isMobile, collapsed, location, slot]
  );

  const resizerDirection = useMemo(() => 
    getResizerDirection(location, slot), 
  [location, slot]
  );

  const iconConfig = useMemo(() => 
    getIconConfig(isMobile), 
  [isMobile]
  );

  const animationConfig = useMemo(() => 
    getAnimationConfig(isMobile), 
  [isMobile]
  );

  return {
    // Platform detection
    isMobile,
    touchTargetConfig,
    
    // State
    isDragging,
    setIsDragging,
    
    // Handlers
    handleToggle,
    handleResize,
    
    // Computed values
    collapseIconType,
    resizerDirection,
    iconConfig,
    animationConfig
  };
};

/**
 * Hook for managing panel dragging state
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