/**
 * RightPanel Desktop Implementation
 * 
 * Desktop-optimized right panel with resizable splitters and mouse interactions
 * Visual mapping: Resizable right sidebar with top/bottom split panels
 * Adapted from LeftPanel.desktop.tsx with right-side positioning
 * 
 * @module RightPanel.desktop
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PanelHeader } from '@/tests/complex-document-editor-migration/source/components/panels/containers/atoms/PanelHeader';
import { PanelContent } from '@/tests/complex-document-editor-migration/source/components/panels/containers/atoms/PanelContent';
import { VerticalResizer } from '@/tests/complex-document-editor-migration/source/components/panels/containers/atoms/VerticalResizer';
import { HorizontalResizer } from '@/tests/complex-document-editor-migration/source/components/panels/containers/atoms/HorizontalResizer';
import type { RightPanelProps, RightPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.types';

interface RightPanelDesktopProps extends RightPanelProps, RightPanelLogic {}

const RightPanelContainer = styled(motion.div)<{ width: number; visible: boolean }>`
  position: relative;
  width: ${props => props.width}%;
  height: 100%;
  background: #fafafa;
  border-left: 1px solid #e5e7eb;
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

/**
 * Desktop-specific RightPanel implementation
 * Mirrors LeftPanel.desktop.tsx with right-side positioning adjustments
 */
export const RightPanelDesktop: React.FC<RightPanelDesktopProps> = ({
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
    // For right panel, positive delta should increase width (expand left)
    const newWidth = currentWidth + delta;
    const newWidthPercent = (newWidth / containerDimensions.width) * 100;
    
    handleWidthResize(newWidthPercent);
  };

  return (
    <RightPanelContainer
      width={width}
      visible={visible}
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
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
      
      {/* Width Resizer - positioned on left side for right panel */}
      <HorizontalResizer
        position="left"
        onResize={handleWidthChange}
        minSize={240}
        maxSize={containerDimensions ? containerDimensions.width * 0.4 : 600}
      />
    </RightPanelContainer>
  );
}; 