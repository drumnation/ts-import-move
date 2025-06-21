/**
 * DesktopCanvasLayout Component
 * @module DesktopCanvasLayout
 */

import React, { useCallback } from 'react';
import { DocumentViewport } from '../../../DocumentViewport/DocumentViewport';
import { SlotPanel } from '../../../SlotPanel/SlotPanel';
import { BidirectionalResizer } from '../../../BidirectionalResizer/BidirectionalResizer';
import { DesktopLayout, PanelSlotContainer, CenterContent } from './DesktopCanvasLayout.styles';
import type { DesktopCanvasLayoutProps } from './DesktopCanvasLayout.types';
import {
  calculatePanelRenderData,
  shouldRenderSplitResizer,
  createSplitResizeHandler,
  createPanelHandlers,
} from './DesktopCanvasLayout.logic';

export const DesktopCanvasLayout: React.FC<DesktopCanvasLayoutProps> = ({
  document,
  groupedPanels,
  panelCalculations,
  panelHandlers,
  layoutState,
  onPanelClose,
  onPanelSplit,
  containerDimensions
}) => {
  const renderPanel = useCallback((
    panel: any, 
    location: string, 
    slot: string
  ) => {
    const renderData = calculatePanelRenderData(
      panel,
      location,
      slot,
      layoutState,
      panelCalculations
    );
    
    if (!renderData) return null;
    
    const { panelId, panelState, size, resizeConfig } = renderData;
    const handlers = createPanelHandlers(
      location,
      slot,
      panelHandlers,
      onPanelClose,
      onPanelSplit
    );

    return (
      <SlotPanel
        key={panelId}
        {...panel}
        size={size}
        collapsed={panelState?.collapsed || false}
        resizeConfig={resizeConfig}
        onResize={handlers.onResize}
        onToggle={handlers.onToggle}
        onClose={handlers.onClose}
        onSplit={handlers.onSplit}
        resizable={false}
      />
    );
  }, [layoutState, panelCalculations, panelHandlers, onPanelClose, onPanelSplit]);

  const renderSplitResizer = useCallback((location: 'left' | 'right') => {
    if (!shouldRenderSplitResizer(location, groupedPanels)) {
      return null;
    }
    
    const resizeConfig = panelCalculations.createResizeConfig(location, 'split');
    const handleResize = createSplitResizeHandler(location, panelHandlers);
    
    return (
      <BidirectionalResizer
        config={resizeConfig}
        onResize={handleResize}
        resizeType="split"
      />
    );
  }, [groupedPanels, panelCalculations, panelHandlers]);

  const renderColumnResizer = useCallback((location: 'left' | 'right') => {
    const hasAnyPanels = groupedPanels[location].top || groupedPanels[location].bottom;
    
    if (!hasAnyPanels) {
      return null;
    }

    // Safety check for containerDimensions
    if (!containerDimensions || containerDimensions.width <= 0) {
      return null;
    }

    const currentWidth = location === 'left' ? layoutState.layout.leftWidth : layoutState.layout.rightWidth;
    const currentSize = (currentWidth / 100) * containerDimensions.width;

    // Use pixel-based configuration for consistency - much more generous constraints
    const maxWidthPixels = containerDimensions.width * 0.6; // 60% max (instead of 40%)
    const minWidthPixels = Math.max(150, containerDimensions.width * 0.1); // 10% min or 150px (instead of 15%)
    
    const resizeConfig = {
      direction: 'horizontal' as const,
      panelPosition: location,
      minSize: minWidthPixels,
      maxSize: maxWidthPixels,
      currentSize,
      constraints: {
        minPercent: 10,
        maxPercent: 60
      },
      containerDimensions
    };

    const handleColumnResize = (newSize: number) => {
      // Clamp the pixel value directly
      const clampedPixelSize = Math.max(minWidthPixels, Math.min(maxWidthPixels, newSize));
      
      if (location === 'left') {
        panelHandlers.handlePanelResize('left', 'column', clampedPixelSize);
      } else {
        panelHandlers.handlePanelResize('right', 'column', clampedPixelSize);
      }
    };
    
    return (
      <BidirectionalResizer
        config={resizeConfig}
        onResize={handleColumnResize}
        resizeType="column"
      />
    );
  }, [groupedPanels, layoutState, panelHandlers, containerDimensions]);

  const handlePageChange = useCallback(() => {
    // Handle page change logic here
  }, []);

  const handleViewModeChange = useCallback(() => {
    // Handle view mode change logic here  
  }, []);

  return (
    <DesktopLayout
      leftWidth={layoutState.layout.leftWidth}
      rightWidth={layoutState.layout.rightWidth}
    >
      {/* Left column */}
      <div className="left-column">
        <PanelSlotContainer
          splitRatio={layoutState.layout.leftSplit}
          isTop={true}
        >
          {renderPanel(groupedPanels.left.top, 'left', 'top')}
        </PanelSlotContainer>
        
        {renderSplitResizer('left')}
        
        <PanelSlotContainer
          splitRatio={layoutState.layout.leftSplit}
          isTop={false}
        >
          {renderPanel(groupedPanels.left.bottom, 'left', 'bottom')}
        </PanelSlotContainer>

        {renderColumnResizer('left')}
      </div>

      {/* Center column */}
      <div className="center-column">
        <CenterContent style={{ flex: 1 }}>
          {document && (
            <DocumentViewport 
              document={document} 
              onPageChange={handlePageChange}
              onViewModeChange={handleViewModeChange}
            />
          )}
        </CenterContent>
       
        {groupedPanels.center.bottom && (
          renderPanel(groupedPanels.center.bottom, 'center', 'bottom')
        )}
      </div>

      {/* Right column */}
      <div className="right-column">
        <PanelSlotContainer
          splitRatio={layoutState.layout.rightSplit}
          isTop={true}
        >
          {renderPanel(groupedPanels.right.top, 'right', 'top')}
        </PanelSlotContainer>
        
        {renderSplitResizer('right')}
        
        <PanelSlotContainer
          splitRatio={layoutState.layout.rightSplit}
          isTop={false}
        >
          {renderPanel(groupedPanels.right.bottom, 'right', 'bottom')}
        </PanelSlotContainer>

        {renderColumnResizer('right')}
      </div>
    </DesktopLayout>
  );
}; 