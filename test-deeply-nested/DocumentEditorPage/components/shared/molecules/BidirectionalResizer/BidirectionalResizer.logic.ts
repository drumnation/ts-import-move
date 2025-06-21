import type { PanelResizeConfig } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';
import type { ResizePosition } from './BidirectionalResizer.types';

/**
 * Calculates the new size based on mouse/touch movement and current configuration
 */
export const calculateNewSize = (
  config: PanelResizeConfig,
  startPos: ResizePosition,
  clientX: number,
  clientY: number,
  resizeType?: 'column' | 'split' | 'panel'
): number => {
  const { x: startX, y: startY, size: startSize } = startPos;
  let delta: number;
  
  if (config.direction === 'horizontal') {
    delta = clientX - startX;
    // For left panels, dragging right should increase size (positive delta)
    // For right panels, dragging left should increase size (negative delta becomes positive)
    if (config.panelPosition === 'right') {
      delta = -delta;
    }
    // For left panels, delta is already correct (positive = drag right = increase size)
  } else {
    // For vertical resizing - different behavior based on resize type
    if (resizeType === 'split') {
      // For split resizers: dragging DOWN should increase split ratio (move split line down)
      delta = clientY - startY;
    } else {
      // For panel resizers: dragging UP should increase panel size (traditional behavior)
      delta = startY - clientY;
    }
  }
  
  // Check if we're dealing with split ratios (values between 0-1)
  const isSplitRatio = typeof config.maxSize === 'number' && config.maxSize <= 1;
  
  let newSize: number;
  if (isSplitRatio) {
    // For split ratios, convert pixel delta to ratio delta
    const containerSize = config.direction === 'horizontal' 
      ? (config.containerDimensions?.width || window.innerWidth)
      : (config.containerDimensions?.height || window.innerHeight);
    const ratioDelta = delta / containerSize;
    newSize = startSize + ratioDelta;
  } else {
    // For pixel values, use delta directly
    newSize = startSize + delta;
  }
  
  return applyConstraints(config, newSize);
};

/**
 * Applies size constraints based on configuration
 */
export const applyConstraints = (config: PanelResizeConfig, size: number): number => {
  // Check if we're dealing with split ratios (values between 0-1)
  const isSplitRatio = typeof config.maxSize === 'number' && config.maxSize <= 1;
  
  if (isSplitRatio) {
    // For split ratios, constraints are already in ratio format
    const minSize = Math.max(
      typeof config.minSize === 'number' && config.minSize <= 1 ? config.minSize : config.constraints.minPercent / 100,
      config.constraints.minPercent / 100
    );
    
    const maxSize = typeof config.maxSize === 'number' && config.maxSize <= 1 
      ? config.maxSize 
      : config.constraints.maxPercent / 100;
    
    return Math.max(minSize, Math.min(maxSize, size));
  } else {
    // For pixel values, use container dimensions
    const containerWidth = config.containerDimensions?.width || window.innerWidth;
    const containerHeight = config.containerDimensions?.height || window.innerHeight;
    
    const referenceSize = config.direction === 'horizontal' ? containerWidth : containerHeight;
    
    const minSize = Math.max(
      config.minSize, 
      (config.constraints.minPercent / 100) * referenceSize
    );
    
    const maxSize = typeof config.maxSize === 'string' 
      ? (parseInt(config.maxSize) / 100) * referenceSize
      : config.maxSize;
    
    return Math.max(minSize, Math.min(maxSize, size));
  }
};

/**
 * Creates initial resize position object
 */
export const createResizePosition = (
  clientX: number,
  clientY: number,
  currentSize: number
): ResizePosition => ({
  x: clientX,
  y: clientY,
  size: currentSize
});

/**
 * Gets the appropriate resize icon based on direction
 */
export const getResizeIcon = (direction: 'horizontal' | 'vertical'): string => {
  return direction === 'horizontal' ? '⋮' : '⋯';
}; 