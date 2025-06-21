/**
 * ColumnResizer Component
 * 
 * Specialized component for resizing sidebar columns (left/right panels)
 * Handles horizontal resize operations with touch support and column-specific constraints
 * 
 * Split from BidirectionalResizer for better AI agent discoverability
 * 
 * @module ColumnResizer
 */

import React from 'react';
import { usePlatformDetection } from '@/pages/DocumentEditorPage/DocumentEditorPage.hook';
import { useColumnResizeHandlers } from './ColumnResizer.hook';
import { getHorizontalResizeIcon } from './ColumnResizer.logic';
import { 
  ColumnResizerContainer, 
  HorizontalResizeHandle 
} from './ColumnResizer.styles';
import type { ColumnResizerProps } from './ColumnResizer.types';

/**
 * ColumnResizer Component
 * 
 * Provides horizontal resize functionality for sidebar columns
 * - Left sidebar: Drag right to expand
 * - Right sidebar: Drag left to expand
 * - Touch-optimized for mobile devices
 * - Enforces column width constraints
 */
export const ColumnResizer: React.FC<ColumnResizerProps> = ({
  columnConfig,
  onColumnResize,
  disabled = false,
  className,
  children
}) => {
  const { touchTargetConfig } = usePlatformDetection();
  
  const {
    isResizing,
    isHovered,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    setIsHovered
  } = useColumnResizeHandlers(columnConfig, onColumnResize, disabled);

  if (disabled) return null;

  return (
    <ColumnResizerContainer
      ref={containerRef}
      columnPosition={columnConfig.columnPosition}
      isActive={isResizing || isHovered}
      touchSize={touchTargetConfig.minSize}
      className={className}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children || (
        <HorizontalResizeHandle columnPosition={columnConfig.columnPosition}>
          {getHorizontalResizeIcon()}
        </HorizontalResizeHandle>
      )}
    </ColumnResizerContainer>
  );
}; 