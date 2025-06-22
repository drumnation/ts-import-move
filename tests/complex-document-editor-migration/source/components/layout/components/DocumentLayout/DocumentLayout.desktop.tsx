/**
 * DocumentLayout Desktop Implementation
 * 
 * Desktop-optimized three-column layout with resizable panels
 * Visual mapping: Left panel | Document canvas | Right panel with optional bottom panel
 * Coordinates panel resizing and state management
 * 
 * @module DocumentLayout.desktop
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HorizontalResizer } from '@/tests/complex-document-editor-migration/source/components/layout/components/shared/atoms/HorizontalResizer';
import { VerticalResizer } from '@/tests/complex-document-editor-migration/source/components/layout/components/shared/atoms/VerticalResizer';
import type { DocumentLayoutProps, DocumentLayoutLogic } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.types';

interface DocumentLayoutDesktopProps extends DocumentLayoutProps, DocumentLayoutLogic {}

const DesktopContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
  overflow: hidden;
  position: relative;
`;

const LeftColumn = styled.div<{ width: number; visible: boolean }>`
  width: ${props => props.visible ? `${props.width}px` : '0'};
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
`;

const RightColumn = styled.div<{ width: number; visible: boolean }>`
  width: ${props => props.visible ? `${props.width}px` : '0'};
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
`;

const CenterColumn = styled.div<{ hasBottomPanel: boolean; bottomHeight: number }>`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  min-width: 400px;
`;

const DocumentArea = styled.div<{ hasBottomPanel: boolean; bottomHeight: number }>`
  flex: 1;
  height: ${props => props.hasBottomPanel 
    ? `calc(100% - ${props.bottomHeight}%)` 
    : '100%'};
  background: #ffffff;
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

const BottomPanel = styled.div<{ height: number; visible: boolean }>`
  height: ${props => props.visible ? `${props.height}%` : '0'};
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  background: #ffffff;
  border-top: ${props => props.visible ? '1px solid #e5e7eb' : 'none'};
  transition: height 0.3s ease;
  overflow: hidden;
`;

const DocumentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 16px;
  gap: 16px;
`;

const LayoutInfo = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  z-index: 100;
`;

/**
 * Desktop-specific DocumentLayout implementation
 * Three-column layout with resizable panels
 */
export const DocumentLayoutDesktop: React.FC<DocumentLayoutDesktopProps> = ({
  config,
  leftPanelContent,
  rightPanelContent,
  documentContent,
  bottomPanelContent,
  handleLeftPanelResize,
  handleRightPanelResize,
  handleBottomPanelResize,
  calculateDocumentArea,
  getLayoutState,
}) => {
  const { panelVisibility, dimensions } = config;
  const documentArea = calculateDocumentArea();

  const handleLeftResize = (delta: number) => {
    const newWidth = dimensions.leftPanelWidth + delta;
    handleLeftPanelResize(newWidth);
  };

  const handleRightResize = (delta: number) => {
    const newWidth = dimensions.rightPanelWidth - delta; // Subtract because right panel grows leftward
    handleRightPanelResize(newWidth);
  };

  const handleBottomResize = (delta: number) => {
    const containerHeight = dimensions.height;
    const currentBottomHeight = (dimensions.bottomPanelHeight / 100) * containerHeight;
    const newBottomHeight = currentBottomHeight - delta; // Subtract because bottom panel grows upward
    const newHeightPercent = (newBottomHeight / containerHeight) * 100;
    handleBottomPanelResize(newHeightPercent);
  };

  return (
    <DesktopContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Layout Debug Info */}
      <LayoutInfo>
        Desktop Layout | {documentArea.width}×{documentArea.height}
        <br />
        L:{dimensions.leftPanelWidth} | R:{dimensions.rightPanelWidth} | B:{dimensions.bottomPanelHeight}%
      </LayoutInfo>

      {/* Left Panel */}
      <LeftColumn 
        width={dimensions.leftPanelWidth} 
        visible={panelVisibility.leftPanel}
      >
        {leftPanelContent}
      </LeftColumn>

      {/* Left Panel Resizer */}
      {panelVisibility.leftPanel && (
        <HorizontalResizer
          position="right"
          onResize={handleLeftResize}
          minSize={200}
          maxSize={500}
        />
      )}

      {/* Center Column */}
      <CenterColumn 
        hasBottomPanel={panelVisibility.bottomPanel}
        bottomHeight={dimensions.bottomPanelHeight}
      >
        {/* Document Area */}
        <DocumentArea 
          hasBottomPanel={panelVisibility.bottomPanel}
          bottomHeight={dimensions.bottomPanelHeight}
        >
          {documentContent || (
            <DocumentPlaceholder>
              <div style={{ fontSize: '48px' }}>📄</div>
              <div>Desktop Document Canvas</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                Available area: {documentArea.width}px × {documentArea.height}px
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Three-column layout with resizable panels
              </div>
            </DocumentPlaceholder>
          )}
        </DocumentArea>

        {/* Bottom Panel Resizer */}
        {panelVisibility.bottomPanel && (
          <VerticalResizer
            onResize={handleBottomResize}
            minSize={120}
            maxSize={dimensions.height * 0.6}
          />
        )}

        {/* Bottom Panel */}
        <BottomPanel 
          height={dimensions.bottomPanelHeight} 
          visible={panelVisibility.bottomPanel}
        >
          {bottomPanelContent}
        </BottomPanel>
      </CenterColumn>

      {/* Right Panel Resizer */}
      {panelVisibility.rightPanel && (
        <HorizontalResizer
          position="left"
          onResize={handleRightResize}
          minSize={200}
          maxSize={500}
        />
      )}

      {/* Right Panel */}
      <RightColumn 
        width={dimensions.rightPanelWidth} 
        visible={panelVisibility.rightPanel}
      >
        {rightPanelContent}
      </RightColumn>
    </DesktopContainer>
  );
}; 