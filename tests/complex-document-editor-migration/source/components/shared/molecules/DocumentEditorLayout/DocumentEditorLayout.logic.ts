/**
 * DocumentEditorLayout Component Logic
 * 
 * Pure functions for panel grouping, size calculations, and resize configurations
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout.logic
 */

import type { PanelSlot, PanelResizeConfig } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';
import type { GroupedPanels, ContainerDimensions } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';

/**
 * Groups panel slots by location and slot position
 * 
 * Organizes panels into a structured hierarchy for layout management:
 * - left: { top, bottom }
 * - right: { top, bottom }  
 * - center: { top, bottom }
 * 
 * @param panelSlots - Array of panel slot configurations
 * @returns Organized panel groups by location and position
 */
export const groupPanelsByLocation = (panelSlots: PanelSlot[]): GroupedPanels => {
  const groups: GroupedPanels = {
    left: { top: null, bottom: null },
    right: { top: null, bottom: null },
    center: { top: null, bottom: null }
  };

  panelSlots.forEach(panel => {
    if (groups[panel.location as keyof GroupedPanels]) {
      groups[panel.location as keyof GroupedPanels][panel.slot as 'top' | 'bottom'] = panel;
    }
  });

  return groups;
};

/**
 * Calculates panel size based on location, slot, and layout state
 * 
 * Provides consistent size calculations across different panel types:
 * - Column panels: Based on Redux column sizes
 * - Split panels: Based on container height and split ratios
 * - Center panels: Calculated as remaining space
 * 
 * @param location - Panel location (left/right/center)
 * @param slot - Panel slot (top/bottom)
 * @param layoutState - Current layout state from Redux
 * @param containerDimensions - Current container dimensions
 * @param panelState - Optional panel-specific state
 * @returns Calculated panel size in pixels
 */
export const calculatePanelSize = (
  location: string,
  slot: string,
  layoutState: any,
  containerDimensions: ContainerDimensions,
  panelState?: { size?: number }
): number => {
  // Center bottom panel uses fixed height
  if (location === 'center' && slot === 'bottom') {
    return layoutState?.layout?.centerBottomHeight || 200;
  }
  
  // Left column panels
  if (location === 'left') {
    const baseWidth = layoutState?.layout?.leftWidth || 300;
    return panelState?.size || baseWidth;
  }
  
  // Right column panels
  if (location === 'right') {
    const baseWidth = layoutState?.layout?.rightWidth || 300;
    return panelState?.size || baseWidth;
  }
  
  // Center column calculated as remaining space
  if (location === 'center') {
    const leftWidth = layoutState?.layout?.leftWidth || 300;
    const rightWidth = layoutState?.layout?.rightWidth || 300;
    const usedWidth = leftWidth + rightWidth;
    return Math.max(300, containerDimensions.width - usedWidth);
  }
  
  return 300; // Default fallback
};

/**
 * Creates resize configuration for a panel
 * 
 * Generates appropriate resize constraints and behavior based on panel type:
 * - Horizontal resizing: For left/right column panels
 * - Vertical resizing: For center bottom and split panels
 * - Platform-aware constraints: Different limits for mobile vs desktop
 * - Content-aware maxSize: Uses panel-specific maximum widths when available
 * 
 * @param location - Panel location
 * @param slot - Panel slot
 * @param currentSize - Current panel size in pixels
 * @param containerDimensions - Container dimensions for calculations
 * @param panelMaxSize - Content-aware maximum size (optional)
 * @returns Complete resize configuration object
 */
export const createResizeConfig = (
  location: string,
  slot: string,
  currentSize: number,
  containerDimensions?: ContainerDimensions,
  panelMaxSize?: number
): PanelResizeConfig => {
  const direction = (location === 'center' && slot === 'bottom') ? 'vertical' : 'horizontal';
  
  // Determine constraints based on direction and container size
  const getConstraints = () => {
    if (direction === 'vertical') {
      return {
        minPercent: 10,
        maxPercent: 60,
        minSize: 120,
        maxSize: containerDimensions ? containerDimensions.height * 0.6 : 600
      };
    } else {
      // For horizontal panels, prefer content-aware maxSize over percentage
      const fallbackMaxSize = containerDimensions ? containerDimensions.width * 0.4 : 600;
      const contentAwareMaxSize = panelMaxSize && containerDimensions 
        ? Math.min(panelMaxSize, fallbackMaxSize) 
        : panelMaxSize || fallbackMaxSize;
      
      return {
        minPercent: 15,
        maxPercent: 40,
        minSize: 240,
        maxSize: contentAwareMaxSize
      };
    }
  };

  const constraints = getConstraints();
  
  return {
    direction,
    panelPosition: location as 'left' | 'right' | 'center',
    minSize: constraints.minSize,
    maxSize: constraints.maxSize,
    currentSize,
    constraints: {
      minPercent: constraints.minPercent,
      maxPercent: constraints.maxPercent
    },
    containerDimensions
  };
};

/**
 * Calculates new width percentage for panel resizing
 * 
 * Converts pixel sizes to percentage values with constraint enforcement
 * Used for column resizing operations
 * 
 * @param newSize - New size in pixels
 * @param containerWidth - Container width for percentage calculation
 * @returns Constrained width percentage (15-40%)
 */
export const calculateWidthPercent = (
  newSize: number, 
  containerWidth: number = window.innerWidth
): number => {
  const newWidthPercent = (newSize / containerWidth) * 100;
  return Math.max(15, Math.min(40, newWidthPercent));
};

/**
 * Calculates height percentage for vertical panel resizing
 * 
 * Converts pixel heights to percentage values for split ratios
 * Used for vertical panel splitting operations
 * 
 * @param newHeight - New height in pixels
 * @param containerHeight - Container height for percentage calculation
 * @returns Constrained height ratio (0.2-0.8)
 */
export const calculateHeightRatio = (
  newHeight: number,
  containerHeight: number
): number => {
  const ratio = newHeight / containerHeight;
  return Math.max(0.2, Math.min(0.8, ratio));
};

/**
 * Determines panel ID from location and slot
 * 
 * Creates unique identifiers for panels based on their position
 * Used for Redux state management and event handling
 * 
 * @param location - Panel location
 * @param slot - Panel slot
 * @returns Unique panel identifier
 */
export const getPanelId = (location: string, slot: string): string => {
  return `${location}-${slot}`;
};

/**
 * Validates panel dimensions against constraints
 * 
 * Ensures panel sizes stay within acceptable bounds
 * Prevents layout breakage from invalid resize operations
 * 
 * @param size - Proposed panel size
 * @param constraints - Size constraints object
 * @returns Valid size within constraints
 */
export const validatePanelSize = (
  size: number,
  constraints: {
    minSize: number;
    maxSize: number | string;
    containerDimension: number;
  }
): number => {
  let { minSize, maxSize, containerDimension } = constraints;
  
  // Convert percentage maxSize to pixels
  if (typeof maxSize === 'string' && maxSize.includes('%')) {
    maxSize = (parseFloat(maxSize) / 100) * containerDimension;
  }
  
  const maxSizeNumber = typeof maxSize === 'number' ? maxSize : containerDimension * 0.4;
  
  return Math.max(minSize, Math.min(maxSizeNumber, size));
};

/**
 * Calculates responsive breakpoints for panel behavior
 * 
 * Determines when panels should adapt their behavior based on container size
 * Used for mobile/tablet/desktop layout decisions
 * 
 * @param containerDimensions - Current container dimensions
 * @returns Breakpoint flags for responsive behavior
 */
export const getResponsiveBreakpoints = (containerDimensions: ContainerDimensions) => {
  const { width, height } = containerDimensions;
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isCompact: height < 600,
    isLandscape: width > height,
    shouldCollapseSidebars: width < 1200,
    shouldStackVertically: width < 600
  };
}; 