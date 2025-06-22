/**
 * EditorCanvas Component Logic
 * @module EditorCanvas.logic
 */

import type { PanelSlot, PanelResizeConfig } from '@/tests/complex-document-editor-migration/source/components/shared/DocumentEditorPage.types';
import type { GroupedPanels } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.types';

/**
 * Groups panel slots by location and slot position
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
 */
export const calculatePanelSize = (
  location: string,
  slot: string,
  layoutState: any,
  panelState?: { size?: number }
): number => {
  if (location === 'center' && slot === 'bottom') {
    return layoutState.layout.centerBottomHeight;
  }
  
  if (location === 'left') {
    const baseWidth = (layoutState.layout.leftWidth / 100) * window.innerWidth;
    return panelState?.size || baseWidth;
  }
  
  if (location === 'right') {
    const baseWidth = (layoutState.layout.rightWidth / 100) * window.innerWidth;
    return panelState?.size || baseWidth;
  }
  
  return 300; // Default fallback
};

/**
 * Creates resize configuration for a panel
 */
export const createResizeConfig = (
  location: string,
  slot: string,
  currentSize: number
): PanelResizeConfig => {
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
    }
  };
};

/**
 * Calculates new width percentage for panel resizing
 */
export const calculateWidthPercent = (newSize: number): number => {
  const newWidthPercent = (newSize / window.innerWidth) * 100;
  return Math.max(15, Math.min(40, newWidthPercent));
};

/**
 * Determines panel ID from location and slot
 */
export const getPanelId = (location: string, slot: string): string => {
  return `${location}-${slot}`;
}; 