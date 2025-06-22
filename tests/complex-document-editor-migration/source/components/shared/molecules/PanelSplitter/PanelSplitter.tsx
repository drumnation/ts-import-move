/**
 * PanelSplitter Component
 * 
 * Specialized component for vertical panel splitting within columns.
 * Handles the division of panels in a column using ratio-based positioning.
 * 
 * Key Features:
 * - Vertical splitting only (horizontal handled by ColumnResizer)
 * - Ratio-based positioning for consistent layouts
 * - Touch and mouse interaction support
 * - Platform-aware constraints and behavior
 * - Redux state integration for persistence
 * 
 * Usage:
 * ```tsx
 * <PanelSplitter
 *   splitConfig={{
 *     column: 'left',
 *     currentRatio: 0.5,
 *     minRatio: 0.2,
 *     maxRatio: 0.8
 *   }}
 *   onSplitChange={(ratio) => console.log('New ratio:', ratio)}
 * />
 * ```
 * 
 * @component
 */

import React, { memo } from 'react';
import { usePanelSplitter } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.hook';
import { 
  StyledPanelSplitter, 
  StyledVerticalHandle, 
  StyledSplitterContent 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.styles';
import type { PanelSplitterProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelSplitter/PanelSplitter.types';

/**
 * PanelSplitter Component
 * 
 * Specialized component for vertical panel splitting within columns.
 * Handles the division of panels in a column using ratio-based positioning.
 * 
 * Key Features:
 * - Vertical splitting only (horizontal handled by ColumnResizer)
 * - Ratio-based positioning for consistent layouts
 * - Touch and mouse interaction support
 * - Platform-aware constraints and behavior
 * - Redux state integration for persistence
 * 
 * Usage:
 * ```tsx
 * <PanelSplitter
 *   splitConfig={{
 *     column: 'left',
 *     currentRatio: 0.5,
 *     minRatio: 0.2,
 *     maxRatio: 0.8
 *   }}
 *   onSplitChange={(ratio) => console.log('New ratio:', ratio)}
 * />
 * ```
 * 
 * @component
 */
export const PanelSplitter: React.FC<PanelSplitterProps> = memo(({
  splitConfig,
  onSplitChange,
  disabled = false,
  className,
  children,
  'data-testid': testId = 'panel-splitter'
}) => {
  const {
    isDragging,
    isResizing,
    currentRatio,
    constraints,
    splitterRef,
    handlers,
    actions
  } = usePanelSplitter(
    splitConfig.column,
    splitConfig.currentRatio,
    splitConfig.minRatio,
    splitConfig.maxRatio,
    onSplitChange
  );

  return (
    <StyledPanelSplitter
      ref={splitterRef}
      column={splitConfig.column}
      isActive={isDragging}
      touchSize={16}
      className={className}
      data-testid={testId}
      role="separator"
      aria-orientation="horizontal"
      aria-valuemin={constraints.min * 100}
      aria-valuemax={constraints.max * 100}
      aria-valuenow={currentRatio * 100}
      aria-valuetext={`Split ratio: ${Math.round(currentRatio * 100)}%`}
      {...(!disabled && handlers)}
    >
      <StyledVerticalHandle
        column={splitConfig.column}
        data-testid={`${testId}-handle`}
        aria-hidden="true"
      >
        {children || (
          <StyledSplitterContent>
            {/* Visual indicator dots */}
            <div />
            <div />
            <div />
          </StyledSplitterContent>
        )}
      </StyledVerticalHandle>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && isDragging && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {Math.round(currentRatio * 100)}%
        </div>
      )}
    </StyledPanelSplitter>
  );
});

PanelSplitter.displayName = 'PanelSplitter';

export default PanelSplitter; 