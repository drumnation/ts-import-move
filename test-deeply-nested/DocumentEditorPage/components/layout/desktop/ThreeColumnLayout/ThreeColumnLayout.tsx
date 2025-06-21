/**
 * ThreeColumnLayout Component
 * 
 * Desktop three-column layout with resizable panels and coordination
 * Visual mapping: Left column | Center column | Right column with bottom panel
 * Provides foundation for desktop document editor layout
 * 
 * @module ThreeColumnLayout
 */

import React, { useRef, useEffect } from 'react';
import { HorizontalResizer } from '../../../shared/atoms/HorizontalResizer';
import { VerticalResizer } from '../../../shared/atoms/VerticalResizer';
import { useThreeColumnLayout } from './ThreeColumnLayout.logic';
import type { ThreeColumnLayoutProps } from './ThreeColumnLayout.types';
import {
  LayoutContainer,
  LeftColumn,
  RightColumn,
  CenterColumn,
  CenterContent,
  BottomPanel,
  ColumnPlaceholder,
  LayoutDebugInfo,
  CollapseButton,
} from './ThreeColumnLayout.styles';

/**
 * ThreeColumnLayout component
 * Desktop three-column layout with resizable panels
 */
export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = (props) => {
  const {
    columnState,
    leftContent,
    centerContent,
    rightContent,
    bottomContent,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const layoutLogic = useThreeColumnLayout(props);

  const {
    handleLeftColumnResize,
    handleRightColumnResize,
    handleBottomPanelResize,
    handleColumnToggle,
    handleColumnCollapse,
    calculateCenterWidth,
    getLayoutMetrics,
  } = layoutLogic;

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        props.onContainerResize?.({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial measurement

    return () => window.removeEventListener('resize', handleResize);
  }, [props]);

  const handleLeftResize = (delta: number) => {
    const newWidth = columnState.leftColumn.width + delta;
    handleLeftColumnResize(newWidth);
  };

  const handleRightResize = (delta: number) => {
    const newWidth = columnState.rightColumn.width - delta; // Subtract because right panel grows leftward
    handleRightColumnResize(newWidth);
  };

  const handleBottomResize = (delta: number) => {
    const containerHeight = columnState.containerDimensions.height;
    const currentBottomHeight = (columnState.centerColumn.bottomPanelHeight / 100) * containerHeight;
    const newBottomHeight = currentBottomHeight - delta; // Subtract because bottom panel grows upward
    const newHeightPercent = (newBottomHeight / containerHeight) * 100;
    handleBottomPanelResize(newHeightPercent);
  };

  const centerWidth = calculateCenterWidth();
  const layoutMetrics = getLayoutMetrics();

  return (
    <LayoutContainer
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Layout Debug Info */}
      <LayoutDebugInfo>
        ThreeColumn Layout
        <br />
        L:{layoutMetrics.leftWidth} | C:{layoutMetrics.centerWidth} | R:{layoutMetrics.rightWidth}
        <br />
        Total: {layoutMetrics.totalWidth}px
      </LayoutDebugInfo>

      {/* Left Column */}
      <LeftColumn 
        width={columnState.leftColumn.width}
        visible={columnState.leftColumn.visible}
        collapsed={columnState.leftColumn.collapsed}
      >
        {leftContent || (
          <ColumnPlaceholder>
            <div>📁</div>
            <div>Left Column</div>
            <div style={{ fontSize: '12px' }}>
              {columnState.leftColumn.width}px wide
            </div>
          </ColumnPlaceholder>
        )}
        
        {/* Left Column Collapse Button */}
        {columnState.leftColumn.collapsible && (
          <CollapseButton
            position="right"
            onClick={() => handleColumnCollapse('left', !columnState.leftColumn.collapsed)}
          >
            {columnState.leftColumn.collapsed ? '▶' : '◀'}
          </CollapseButton>
        )}
      </LeftColumn>

      {/* Left Column Resizer */}
      {columnState.leftColumn.visible && !columnState.leftColumn.collapsed && (
        <HorizontalResizer
          position="right"
          onResize={handleLeftResize}
          minSize={columnState.leftColumn.minWidth}
          maxSize={columnState.leftColumn.maxWidth}
        />
      )}

      {/* Center Column */}
      <CenterColumn hasBottomPanel={columnState.centerColumn.hasBottomPanel}>
        {/* Center Content */}
        <CenterContent 
          hasBottomPanel={columnState.centerColumn.hasBottomPanel}
          bottomHeight={columnState.centerColumn.bottomPanelHeight}
        >
          {centerContent || (
            <ColumnPlaceholder>
              <div style={{ fontSize: '32px' }}>📄</div>
              <div>Center Column</div>
              <div style={{ fontSize: '12px' }}>
                {centerWidth}px wide
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                Document canvas area
              </div>
            </ColumnPlaceholder>
          )}
        </CenterContent>

        {/* Bottom Panel Resizer */}
        {columnState.centerColumn.hasBottomPanel && (
          <VerticalResizer
            onResize={handleBottomResize}
            minSize={120}
            maxSize={columnState.containerDimensions.height * 0.6}
          />
        )}

        {/* Bottom Panel */}
        <BottomPanel 
          height={columnState.centerColumn.bottomPanelHeight} 
          visible={columnState.centerColumn.hasBottomPanel}
        >
          {bottomContent || (
            <ColumnPlaceholder>
              <div>⚙️</div>
              <div>Bottom Panel</div>
              <div style={{ fontSize: '12px' }}>
                {columnState.centerColumn.bottomPanelHeight}% height
              </div>
            </ColumnPlaceholder>
          )}
        </BottomPanel>
      </CenterColumn>

      {/* Right Column Resizer */}
      {columnState.rightColumn.visible && !columnState.rightColumn.collapsed && (
        <HorizontalResizer
          position="left"
          onResize={handleRightResize}
          minSize={columnState.rightColumn.minWidth}
          maxSize={columnState.rightColumn.maxWidth}
        />
      )}

      {/* Right Column */}
      <RightColumn 
        width={columnState.rightColumn.width}
        visible={columnState.rightColumn.visible}
        collapsed={columnState.rightColumn.collapsed}
      >
        {rightContent || (
          <ColumnPlaceholder>
            <div>🔍</div>
            <div>Right Column</div>
            <div style={{ fontSize: '12px' }}>
              {columnState.rightColumn.width}px wide
            </div>
          </ColumnPlaceholder>
        )}
        
        {/* Right Column Collapse Button */}
        {columnState.rightColumn.collapsible && (
          <CollapseButton
            position="left"
            onClick={() => handleColumnCollapse('right', !columnState.rightColumn.collapsed)}
          >
            {columnState.rightColumn.collapsed ? '◀' : '▶'}
          </CollapseButton>
        )}
      </RightColumn>
    </LayoutContainer>
  );
}; 