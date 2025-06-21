/**
 * LeftPanel Desktop Implementation
 * 
 * Desktop-optimized left panel with resizable splitters and mouse interactions
 * Visual mapping: Resizable left sidebar with top/bottom split panels
 * 
 * @module LeftPanel.desktop
 */

import React, { memo } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PanelHeader } from '../atoms/PanelHeader';
import { PanelContent } from '../atoms/PanelContent';
import { VerticalResizer } from '../atoms/VerticalResizer';
import { HorizontalResizer } from '../atoms/HorizontalResizer';
import type { LeftPanelProps, LeftPanelLogic } from './LeftPanel.types';

interface LeftPanelDesktopProps extends LeftPanelProps, LeftPanelLogic {}

const LeftPanelContainer = styled(motion.div)<{ width: number; visible: boolean }>`
  position: relative;
  width: ${props => props.width}%;
  height: 100%;
  background: #fafafa;
  border-right: 1px solid #e5e7eb;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  min-width: 240px;
  max-width: 40%;
`;

const TopPanelSection = styled.div<{ ratio: number; collapsed: boolean }>`
  flex: ${props => props.collapsed ? '0 0 auto' : props.ratio};
  display: flex;
  flex-direction: column;
  min-height: ${props => props.collapsed ? '40px' : '120px'};
  border-bottom: ${props => props.collapsed ? 'none' : '1px solid #e5e7eb'};
`;

const BottomPanelSection = styled.div<{ ratio: number; collapsed: boolean }>`
  flex: ${props => props.collapsed ? '0 0 auto' : 1 - props.ratio};
  display: flex;
  flex-direction: column;
  min-height: ${props => props.collapsed ? '40px' : '120px'};
`;

const SplitResizer = styled.div`
  height: 4px;
  background: transparent;
  cursor: ns-resize;
  position: relative;
  z-index: 10;
  
  &:hover {
    background: #3b82f6;
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 8px;
  }
`;

/**
 * Desktop-specific LeftPanel implementation
 */
const LeftPanelDesktopComponent: React.FC<LeftPanelDesktopProps> = ({
  topPanel,
  bottomPanel,
  width,
  splitRatio,
  visible,
  containerDimensions,
  handleWidthResize,
  handleSplitChange,
  handlePanelToggle,
  handlePanelClose,
  panelStates,
}) => {
  const handleSplitResize = (delta: number) => {
    if (!containerDimensions) return;
    
    const containerHeight = containerDimensions.height;
    const currentTopHeight = containerHeight * splitRatio;
    const newTopHeight = currentTopHeight + delta;
    const newRatio = newTopHeight / containerHeight;
    
    handleSplitChange(newRatio);
  };

  const handleWidthChange = (delta: number) => {
    if (!containerDimensions) return;
    
    const currentWidth = (width / 100) * containerDimensions.width;
    const newWidth = currentWidth + delta;
    const newWidthPercent = (newWidth / containerDimensions.width) * 100;
    
    handleWidthResize(newWidthPercent);
  };

  return (
    <LeftPanelContainer
      width={width}
      visible={visible}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* Top Panel */}
      {topPanel && (
        <TopPanelSection 
          ratio={splitRatio} 
          collapsed={panelStates.topCollapsed}
        >
          <PanelHeader
            title={topPanel.title}
            collapsed={panelStates.topCollapsed}
            onToggle={(collapsed) => handlePanelToggle(`${topPanel.id}-top`, collapsed)}
            onClose={topPanel.closable ? () => handlePanelClose(topPanel.id) : undefined}
            platform="desktop"
          />
          
          {!panelStates.topCollapsed && (
            <PanelContent>
              {topPanel.content}
            </PanelContent>
          )}
        </TopPanelSection>
      )}
      
      {/* Split Resizer */}
      {topPanel && bottomPanel && !panelStates.topCollapsed && !panelStates.bottomCollapsed && (
        <VerticalResizer
          onResize={handleSplitResize}
          minSize={120}
          maxSize={containerDimensions ? containerDimensions.height - 120 : 600}
        />
      )}
      
      {/* Bottom Panel */}
      {bottomPanel && (
        <BottomPanelSection 
          ratio={splitRatio} 
          collapsed={panelStates.bottomCollapsed}
        >
          <PanelHeader
            title={bottomPanel.title}
            collapsed={panelStates.bottomCollapsed}
            onToggle={(collapsed) => handlePanelToggle(`${bottomPanel.id}-bottom`, collapsed)}
            onClose={bottomPanel.closable ? () => handlePanelClose(bottomPanel.id) : undefined}
            platform="desktop"
          />
          
          {!panelStates.bottomCollapsed && (
            <PanelContent>
              {bottomPanel.content}
            </PanelContent>
          )}
        </BottomPanelSection>
      )}
      
      {/* Width Resizer */}
      <HorizontalResizer
        position="right"
        onResize={handleWidthChange}
        minSize={240}
        maxSize={containerDimensions ? containerDimensions.width * 0.4 : 600}
      />
    </LeftPanelContainer>
  );
};

// Memoized component for performance optimization
export const LeftPanelDesktop = memo(LeftPanelDesktopComponent, (prevProps, nextProps) => {
  // Custom comparison for expensive panel renders
  return (
    prevProps.width === nextProps.width &&
    prevProps.splitRatio === nextProps.splitRatio &&
    prevProps.visible === nextProps.visible &&
    JSON.stringify(prevProps.panelStates) === JSON.stringify(nextProps.panelStates) &&
    prevProps.topPanel?.id === nextProps.topPanel?.id &&
    prevProps.bottomPanel?.id === nextProps.bottomPanel?.id
  );
}); 