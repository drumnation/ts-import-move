/**
 * DocumentEditorLayout Component Hook
 * 
 * Custom hook for managing the main document editor layout orchestrator
 * Handles Redux integration, responsive behavior, and panel coordination
 * 
 * Renamed from useEditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout.hook
 */

import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/store.hooks';
import { 
  selectLayoutState,
  selectColumnSizes,
  selectSplitRatios,
  selectPanelVisibility
} from '@/stores/selectors/layout.selectors';
import {
  resizeColumn,
  adjustSplit,
  togglePanel,
  setResizing
} from '@/stores/layout.slice';
import { usePlatformDetection, useSafeAreaInsets } from '@/pages/DocumentEditorPage/DocumentEditorPage.hook';
import { 
  groupPanelsByLocation, 
  calculatePanelSize, 
  createResizeConfig,
  calculateWidthPercent,
  getPanelId
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.logic';
import type { 
  DocumentEditorLayoutProps, 
  GroupedPanels, 
  PanelCalculations, 
  PanelHandlers,
  ContainerDimensions
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';

/**
 * Custom hook for DocumentEditorLayout component logic
 * 
 * Manages the main layout orchestrator with Redux integration:
 * - Platform detection and responsive behavior
 * - Panel grouping and coordination
 * - Resize and split operations
 * - Container dimension tracking
 * - Safe area management
 */
export const useDocumentEditorLayout = ({
  panelSlots,
  onPanelResize,
  onPanelToggle,
  onPanelClose,
  onPanelSplit
}: Pick<DocumentEditorLayoutProps, 'panelSlots' | 'onPanelResize' | 'onPanelToggle' | 'onPanelClose' | 'onPanelSplit'>) => {
  const dispatch = useAppDispatch();
  const { platform } = usePlatformDetection();
  const safeAreaInsets = useSafeAreaInsets();
  
  // Redux state selectors for layout coordination
  const layoutState = useAppSelector(selectLayoutState);
  const columnSizes = useAppSelector(selectColumnSizes);
  const splitRatios = useAppSelector(selectSplitRatios);
  const panelVisibility = useAppSelector(selectPanelVisibility);
  const isMobile = platform === 'mobile';
  
  // Track container dimensions for responsive calculations
  const [containerDimensions, setContainerDimensions] = useState<ContainerDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Update container dimensions on window resize
   * Uses ResizeObserver for accurate container tracking
   */
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        });
      } else {
        setContainerDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateDimensions);
    
    // Initial dimension update
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  /**
   * Group panels by location and slot for organized layout management
   * Memoized to prevent unnecessary recalculations
   */
  const groupedPanels: GroupedPanels = useMemo(() => {
    return groupPanelsByLocation(panelSlots);
  }, [panelSlots]);

  /**
   * Redux-integrated panel resize handler
   * Coordinates different types of resize operations through Redux
   */
  const handlePanelResize = useCallback((location: string, slot: string, newSize: number) => {
    dispatch(setResizing(true));
    
    // Handle split resizing for vertical panel divisions
    if (slot === 'split') {
      if (location === 'left') {
        dispatch(adjustSplit({ column: 'leftVertical', ratio: newSize }));
      } else if (location === 'right') {
        dispatch(adjustSplit({ column: 'rightVertical', ratio: newSize }));
      } else if (location === 'center') {
        dispatch(adjustSplit({ column: 'centerVertical', ratio: newSize }));
      }
      dispatch(setResizing(false));
      onPanelResize?.(location, slot, newSize);
      return;
    }
    
    // Handle column-level resizing that affects the entire left/right column
    if (slot === 'column') {
      if (location === 'left') {
        dispatch(resizeColumn({ column: 'left', size: newSize }));
      } else if (location === 'right') {
        dispatch(resizeColumn({ column: 'right', size: newSize }));
      }
      dispatch(setResizing(false));
      onPanelResize?.(location, slot, newSize);
      return;
    }
    
    // For individual panel resizing, maintain compatibility with existing behavior
    dispatch(setResizing(false));
    onPanelResize?.(location, slot, newSize);
  }, [dispatch, onPanelResize]);

  /**
   * Redux-integrated panel toggle handler
   * Maps panel locations to Redux visibility state
   */
  const handlePanelToggle = useCallback((location: string, slot: string, collapsed: boolean) => {
    // Map location + slot to panel visibility keys
    const getPanelKey = (loc: string, sl: string): keyof typeof panelVisibility | null => {
      if (loc === 'left' && sl === 'top') return 'leftTop';
      if (loc === 'left' && sl === 'bottom') return 'leftBottom';
      if (loc === 'right' && sl === 'top') return 'rightTop';
      if (loc === 'right' && sl === 'bottom') return 'rightBottom';
      if (loc === 'center' && sl === 'bottom') return 'centerBottom';
      return null;
    };

    const panelKey = getPanelKey(location, slot);
    if (panelKey) {
      dispatch(togglePanel({ panel: panelKey, visible: !collapsed }));
    }
    
    onPanelToggle?.(location, slot, collapsed);
  }, [dispatch, onPanelToggle, panelVisibility]);

  /**
   * Panel calculation functions with Redux state integration
   * Provides size calculations and resize configurations
   */
  const panelCalculations: PanelCalculations = useMemo(() => ({
    calculatePanelSize: (location: string, slot: string): number => {
      if (location === 'center' && slot === 'bottom') {
        // For center bottom, use a fixed height
        return 200; // TODO: This could be made configurable via Redux
      }
      
      if (location === 'left') {
        return columnSizes.left;
      }
      
      if (location === 'right') {
        return columnSizes.right;
      }
      
      // Calculate center column width as remaining space
      if (location === 'center') {
        const usedWidth = columnSizes.left + columnSizes.right;
        return Math.max(300, containerDimensions.width - usedWidth);
      }
      
      return 300; // Default fallback
    },
    
    createResizeConfig: (location: string, slot: string) => {
      // Handle split resizing for vertical panel divisions within columns
      if (slot === 'split') {
        let currentSplit = 0.6; // Default split ratio
        if (location === 'left') currentSplit = splitRatios.leftVertical;
        else if (location === 'right') currentSplit = splitRatios.rightVertical;
        else if (location === 'center') currentSplit = splitRatios.centerVertical;
        
        return {
          direction: 'vertical' as const,
          panelPosition: 'center' as const,
          minSize: 0.2, // 20% minimum split ratio
          maxSize: 0.8, // 80% maximum split ratio
          currentSize: currentSplit,
          constraints: {
            minPercent: 20,
            maxPercent: 80
          },
          containerDimensions
        };
      }
      
      // Calculate current size using Redux state
      let currentSize: number;
      if (location === 'center' && slot === 'bottom') {
        currentSize = 200; // Fixed height for center bottom
      } else if (location === 'left') {
        currentSize = columnSizes.left;
      } else if (location === 'right') {
        currentSize = columnSizes.right;
      } else {
        currentSize = 300; // Default
      }
      
      const direction = (location === 'center' && slot === 'bottom') ? 'vertical' : 'horizontal';
      
      return {
        direction,
        panelPosition: location as 'left' | 'right' | 'center',
        minSize: 240,
        maxSize: direction === 'horizontal' ? '40%' : 600,
        currentSize,
        constraints: {
          minPercent: direction === 'horizontal' ? 15 : 10,
          maxPercent: direction === 'horizontal' ? 40 : 60
        },
        containerDimensions
      };
    }
  }), [columnSizes, splitRatios, containerDimensions]);

  /**
   * Panel interaction handlers - centralized Redux-integrated callbacks
   */
  const panelHandlers: PanelHandlers = useMemo(() => ({
    handlePanelResize,
    handlePanelToggle
  }), [handlePanelResize, handlePanelToggle]);

  return {
    // Platform and responsive data
    platform,
    safeAreaInsets,
    isMobile,
    
    // Redux state
    layoutState,
    
    // Panel organization
    groupedPanels,
    
    // Calculation utilities
    panelCalculations,
    panelHandlers,
    
    // Event handlers (passed through for external coordination)
    onPanelClose,
    onPanelSplit,
    
    // Container management
    containerRef,
    containerDimensions
  };
}; 