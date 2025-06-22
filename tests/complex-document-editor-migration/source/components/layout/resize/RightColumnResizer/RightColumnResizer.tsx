/**
 * RightColumnResizer Component
 * 
 * Specialized resizer for right column width control
 * Coordinates with left column to prevent layout conflicts
 * Provides visual feedback and constraint validation
 * 
 * @module RightColumnResizer
 */

import React from 'react';
import { RightColumnResizerStyles } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.styles';
import { useRightColumnResizerLogic } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.logic';
import type { RightColumnResizerProps } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.types';

/**
 * RightColumnResizer component for resizing the right column width
 * 
 * Provides touch and mouse support for resizing the right column
 * with Redux integration for global state management.
 * Note: Right column resizing moves in opposite direction (left movement increases width)
 */
export const RightColumnResizer: React.FC<RightColumnResizerProps> = ({
  currentWidth,
  minWidth = 200,
  maxWidth = 600,
  onResize,
  onResizeStart,
  onResizeEnd,
  disabled = false,
  className,
  testId = 'right-column-resizer',
}) => {
  const {
    resizeState,
    constraints,
    handlers,
    resizerRef,
    isResizing,
  } = useRightColumnResizerLogic(
    currentWidth,
    minWidth,
    maxWidth,
    onResize,
    onResizeStart,
    onResizeEnd
  );

  return (
    <RightColumnResizerStyles.Container
      ref={resizerRef}
      $isResizing={isResizing}
      $disabled={disabled}
      $currentWidth={resizeState.currentWidth}
      className={className}
      data-testid={testId}
      onMouseDown={disabled ? undefined : handlers.handleMouseDown}
      onTouchStart={disabled ? undefined : handlers.handleTouchStart}
    >
      <RightColumnResizerStyles.Handle
        $isResizing={isResizing}
        $disabled={disabled}
        $currentWidth={resizeState.currentWidth}
      />
      
      {isResizing && (
        <RightColumnResizerStyles.Preview
          $isResizing={isResizing}
          $disabled={disabled}
          $currentWidth={resizeState.currentWidth}
        >
          {Math.round(resizeState.currentWidth)}px
        </RightColumnResizerStyles.Preview>
      )}
      
      <RightColumnResizerStyles.HitArea
        $isResizing={isResizing}
        $disabled={disabled}
        $currentWidth={resizeState.currentWidth}
      />
    </RightColumnResizerStyles.Container>
  );
};

// Memoized version for performance optimization
export const RightColumnResizerMemo = React.memo(RightColumnResizer, (prevProps, nextProps) => {
  return (
    prevProps.currentWidth === nextProps.currentWidth &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.minWidth === nextProps.minWidth &&
    prevProps.maxWidth === nextProps.maxWidth &&
    prevProps.className === nextProps.className
  );
}); 