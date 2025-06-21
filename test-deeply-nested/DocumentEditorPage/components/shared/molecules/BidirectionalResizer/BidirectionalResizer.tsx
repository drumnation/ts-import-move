/**
 * BidirectionalResizer Component
 * 
 * Handles both horizontal and vertical resizing with touch support and constraints
 * 
 * @module BidirectionalResizer
 */

import React, { memo } from 'react';
import { useResizeHandlers } from './BidirectionalResizer.hook';
import { getResizeIcon } from './BidirectionalResizer.logic';
import { ResizerContainer, ResizeHandle } from './BidirectionalResizer.styles';
import type { BidirectionalResizerProps } from './BidirectionalResizer.types';

/**
 * High-performance bidirectional resizer component for column and panel resizing
 * Memoized to prevent unnecessary re-renders during resize operations
 */
const BidirectionalResizerComponent: React.FC<BidirectionalResizerProps> = ({
  config,
  onResize,
  disabled = false,
  className,
  children,
  resizeType = 'panel'
}) => {
  const {
    isResizing,
    isHovered,
    touchTargetSize,
    handleMouseDown,
    handleTouchStart,
    setIsHovered
  } = useResizeHandlers(config, onResize, disabled, resizeType);

  if (disabled) return null;

  return (
    <ResizerContainer
      direction={config.direction}
      panelPosition={config.panelPosition}
      isActive={isResizing || isHovered}
      touchSize={touchTargetSize}
      resizeType={resizeType}
      currentSize={config.currentSize}
      className={className}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children || (
        <ResizeHandle direction={config.direction}>
          {getResizeIcon(config.direction)}
        </ResizeHandle>
      )}
    </ResizerContainer>
  );
};

/**
 * Memoized BidirectionalResizer with optimized comparison
 * Prevents re-renders unless configuration or handlers actually change
 */
export const BidirectionalResizer = memo(BidirectionalResizerComponent, (prevProps, nextProps) => {
  // Deep comparison of config object
  const configChanged = 
    prevProps.config.direction !== nextProps.config.direction ||
    prevProps.config.panelPosition !== nextProps.config.panelPosition ||
    prevProps.config.minSize !== nextProps.config.minSize ||
    prevProps.config.maxSize !== nextProps.config.maxSize ||
    prevProps.config.currentSize !== nextProps.config.currentSize ||
    prevProps.config.constraints.minPercent !== nextProps.config.constraints.minPercent ||
    prevProps.config.constraints.maxPercent !== nextProps.config.constraints.maxPercent ||
    prevProps.config.containerDimensions?.width !== nextProps.config.containerDimensions?.width ||
    prevProps.config.containerDimensions?.height !== nextProps.config.containerDimensions?.height;

  // Other props comparison
  const otherPropsChanged =
    prevProps.disabled !== nextProps.disabled ||
    prevProps.className !== nextProps.className ||
    prevProps.resizeType !== nextProps.resizeType;

  // Only re-render if config or other props actually changed
  // Note: onResize function reference is expected to be stable via useCallback
  return !configChanged && !otherPropsChanged;
}); 