/**
 * VerticalSplitter Component
 * 
 * Vertical splitter for top/bottom panel division
 * Supports independent column splitting and smooth animations
 * Provides visual feedback and constraint validation
 * 
 * @module VerticalSplitter
 */

import React from 'react';
import { VerticalSplitterStyles } from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.styles';
import { useVerticalSplitterLogic } from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.logic';
import type { VerticalSplitterProps } from '@/tests/complex-document-editor-migration/source/components/layout/resize/VerticalSplitter/VerticalSplitter.types';

/**
 * VerticalSplitter component for splitting panels vertically within columns
 * 
 * Provides touch and mouse support for adjusting vertical split ratios
 * with Redux integration for global state management.
 */
export const VerticalSplitter: React.FC<VerticalSplitterProps> = ({
  currentRatio,
  column,
  minRatio = 0.2,
  maxRatio = 0.8,
  onSplit,
  onSplitStart,
  onSplitEnd,
  disabled = false,
  className,
  testId = `vertical-splitter-${column}`,
}) => {
  const {
    splitState,
    constraints,
    handlers,
    splitterRef,
    containerRef,
    isSplitting,
  } = useVerticalSplitterLogic(
    column,
    currentRatio,
    minRatio,
    maxRatio,
    onSplit,
    onSplitStart,
    onSplitEnd
  );

  return (
    <>
      <div ref={containerRef} style={{ position: 'relative', height: '100%' }}>
        <VerticalSplitterStyles.Container
          ref={splitterRef}
          $isSplitting={isSplitting}
          $disabled={disabled}
          $currentRatio={splitState.currentRatio}
          $column={column}
          className={className}
          data-testid={testId}
          onMouseDown={disabled ? undefined : handlers.handleMouseDown}
          onTouchStart={disabled ? undefined : handlers.handleTouchStart}
        >
          <VerticalSplitterStyles.Handle
            $isSplitting={isSplitting}
            $disabled={disabled}
            $currentRatio={splitState.currentRatio}
            $column={column}
          />
          
          <VerticalSplitterStyles.HitArea
            $isSplitting={isSplitting}
            $disabled={disabled}
            $currentRatio={splitState.currentRatio}
            $column={column}
          />
        </VerticalSplitterStyles.Container>
      </div>
      
      {isSplitting && (
        <>
          <VerticalSplitterStyles.Preview
            $isSplitting={isSplitting}
            $disabled={disabled}
            $currentRatio={splitState.currentRatio}
            $column={column}
          >
            {Math.round(splitState.currentRatio * 100)}%
          </VerticalSplitterStyles.Preview>
          
          <VerticalSplitterStyles.VisualFeedback
            $isSplitting={isSplitting}
            $disabled={disabled}
            $currentRatio={splitState.currentRatio}
            $column={column}
          />
        </>
      )}
    </>
  );
};

// Memoized version for performance optimization
export const VerticalSplitterMemo = React.memo(VerticalSplitter, (prevProps, nextProps) => {
  return (
    prevProps.currentRatio === nextProps.currentRatio &&
    prevProps.column === nextProps.column &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.minRatio === nextProps.minRatio &&
    prevProps.maxRatio === nextProps.maxRatio &&
    prevProps.className === nextProps.className
  );
}); 