/**
 * LeftColumnResizer Component
 * 
 * Specialized resizer for left column width control
 * Integrates with Redux state and provides visual feedback
 * Prevents conflicts with other layout resizers
 * 
 * @module LeftColumnResizer
 */

import React from 'react';
import { LeftColumnResizerStyles } from './LeftColumnResizer.styles';
import { useLeftColumnResizerLogic } from './LeftColumnResizer.logic';
import type { LeftColumnResizerProps } from './LeftColumnResizer.types';

/**
 * LeftColumnResizer component for resizing the left column width
 * 
 * Provides touch and mouse support for resizing the left column
 * with Redux integration for global state management.
 */
export const LeftColumnResizer: React.FC<LeftColumnResizerProps> = ({
  currentWidth,
  minWidth = 200,
  maxWidth = 600,
  onResize,
  onResizeStart,
  onResizeEnd,
  disabled = false,
  className,
  testId = 'left-column-resizer',
}) => {
  const {
    resizeState,
    constraints,
    handlers,
    resizerRef,
    isResizing,
  } = useLeftColumnResizerLogic(
    currentWidth,
    minWidth,
    maxWidth,
    onResize,
    onResizeStart,
    onResizeEnd
  );

  return (
    <LeftColumnResizerStyles.Container
      ref={resizerRef}
      $isResizing={isResizing}
      $disabled={disabled}
      $currentWidth={resizeState.currentWidth}
      className={className}
      data-testid={testId}
      onMouseDown={disabled ? undefined : handlers.handleMouseDown}
      onTouchStart={disabled ? undefined : handlers.handleTouchStart}
    >
      <LeftColumnResizerStyles.Handle
        $isResizing={isResizing}
        $disabled={disabled}
        $currentWidth={resizeState.currentWidth}
      />
      
      {isResizing && (
        <LeftColumnResizerStyles.Preview
          $isResizing={isResizing}
          $disabled={disabled}
          $currentWidth={resizeState.currentWidth}
        >
          {Math.round(resizeState.currentWidth)}px
        </LeftColumnResizerStyles.Preview>
      )}
      
      <LeftColumnResizerStyles.HitArea
        $isResizing={isResizing}
        $disabled={disabled}
        $currentWidth={resizeState.currentWidth}
      />
    </LeftColumnResizerStyles.Container>
  );
};

// Memoized version for performance optimization
export const LeftColumnResizerMemo = React.memo(LeftColumnResizer, (prevProps, nextProps) => {
  return (
    prevProps.currentWidth === nextProps.currentWidth &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.minWidth === nextProps.minWidth &&
    prevProps.maxWidth === nextProps.maxWidth &&
    prevProps.className === nextProps.className
  );
}); 