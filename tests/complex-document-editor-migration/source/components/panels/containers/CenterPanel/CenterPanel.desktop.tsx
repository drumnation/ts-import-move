/**
 * CenterPanel Desktop Implementation
 * 
 * Desktop-optimized center panel with document canvas and resizable bottom panel
 * Visual mapping: Main document area with optional bottom panel for tools/timeline
 * Follows established panel pattern with center-specific adaptations
 * 
 * @module CenterPanel.desktop
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PanelHeader } from '../atoms/PanelHeader';
import { PanelContent } from '../atoms/PanelContent';
import { VerticalResizer } from '../atoms/VerticalResizer';
import type { CenterPanelProps, CenterPanelLogic } from './CenterPanel.types';

interface CenterPanelDesktopProps extends CenterPanelProps, CenterPanelLogic {}

const CenterContainer = styled(motion.div)<{ 
  leftWidth: number; 
  rightWidth: number; 
}>`
  position: relative;
  flex: 1;
  height: 100%;
  margin-left: ${props => props.leftWidth}px;
  margin-right: ${props => props.rightWidth}px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  transition: margin 0.3s ease;
`;

const DocumentArea = styled.div<{ bottomHeight: number; bottomVisible: boolean }>`
  flex: 1;
  height: ${props => props.bottomVisible 
    ? `calc(100% - ${props.bottomHeight}%)` 
    : '100%'};
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: height 0.3s ease;
`;

const BottomPanelSection = styled.div<{ height: number; visible: boolean }>`
  height: ${props => props.visible ? `${props.height}%` : '0'};
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  min-height: ${props => props.visible ? '120px' : '0'};
  border-top: ${props => props.visible ? '1px solid #e5e7eb' : 'none'};
  background: #ffffff;
  transition: height 0.3s ease;
`;

const DocumentCanvas = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #6b7280;
  font-size: 16px;
`;

const CanvasPlaceholder = styled.div`
  width: 80%;
  height: 80%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  background: #f9fafb;
`;

/**
 * Desktop-specific CenterPanel implementation
 * Handles document canvas and resizable bottom panel
 */
export const CenterPanelDesktop: React.FC<CenterPanelDesktopProps> = ({
  documentContent,
  bottomPanel,
  bottomHeight,
  bottomVisible,
  containerDimensions,
  leftPanelWidth = 0,
  rightPanelWidth = 0,
  handleBottomResize,
  handleBottomToggle,
  calculateDocumentArea,
  panelStates,
}) => {
  const handleBottomPanelResize = (delta: number) => {
    if (!containerDimensions) return;
    
    const containerHeight = containerDimensions.height;
    const currentBottomHeight = (bottomHeight / 100) * containerHeight;
    const newBottomHeight = currentBottomHeight + delta;
    const newHeightPercent = (newBottomHeight / containerHeight) * 100;
    
    handleBottomResize(newHeightPercent);
  };

  const documentArea = calculateDocumentArea();

  return (
    <CenterContainer
      leftWidth={leftPanelWidth}
      rightWidth={rightPanelWidth}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Main Document Area */}
      <DocumentArea 
        bottomHeight={bottomHeight} 
        bottomVisible={bottomVisible}
      >
        <DocumentCanvas>
          {documentContent?.content || (
            <CanvasPlaceholder>
              <div>📄</div>
              <div>Document Canvas</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                Available area: {documentArea.width}px × {documentArea.height}px
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {documentContent?.title || 'No document loaded'}
              </div>
            </CanvasPlaceholder>
          )}
        </DocumentCanvas>
      </DocumentArea>

      {/* Bottom Panel Resizer */}
      {bottomPanel && bottomVisible && (
        <VerticalResizer
          onResize={handleBottomPanelResize}
          minSize={120}
          maxSize={containerDimensions ? containerDimensions.height * 0.6 : 400}
        />
      )}

      {/* Bottom Panel */}
      {bottomPanel && (
        <BottomPanelSection 
          height={bottomHeight} 
          visible={bottomVisible}
        >
          <PanelHeader
            title={bottomPanel.title}
            collapsed={!bottomVisible}
            onToggle={(collapsed) => handleBottomToggle(!collapsed)}
            platform="desktop"
          />
          
          {bottomVisible && (
            <PanelContent>
              {bottomPanel.content}
            </PanelContent>
          )}
        </BottomPanelSection>
      )}
    </CenterContainer>
  );
}; 