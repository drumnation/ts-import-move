/**
 * CenterPanel Mobile Implementation
 * 
 * Mobile-optimized center panel with full-screen document and bottom sheet
 * Visual mapping: Full-screen document with slide-up bottom sheet for tools
 * Follows established mobile panel pattern for consistency
 * 
 * @module CenterPanel.mobile
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PanelHeader } from '../atoms/PanelHeader';
import { PanelContent } from '../atoms/PanelContent';
import type { CenterPanelProps, CenterPanelLogic } from './CenterPanel.types';

interface CenterPanelMobileProps extends CenterPanelProps, CenterPanelLogic {}

const MobileContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
`;

const DocumentArea = styled.div<{ hasBottomPanel: boolean }>`
  flex: 1;
  width: 100%;
  height: ${props => props.hasBottomPanel ? 'calc(100% - 60px)' : '100%'};
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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
  padding: 16px;
`;

const CanvasPlaceholder = styled.div`
  width: 90%;
  height: 70%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  background: #f9fafb;
  padding: 20px;
  text-align: center;
`;

const BottomSheetOverlay = styled(motion.div)<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const BottomSheetContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 1001;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 60vh;
  display: flex;
  flex-direction: column;
`;

const DragHandle = styled.div`
  width: 32px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 8px auto;
  flex-shrink: 0;
`;

const BottomPanelToggle = styled.button<{ hasPanel: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  display: ${props => props.hasPanel ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 999;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const SafeAreaBottom = styled.div`
  height: env(safe-area-inset-bottom);
  background: white;
`;

/**
 * Mobile-specific CenterPanel implementation
 * Full-screen document with bottom sheet for tools
 */
export const CenterPanelMobile: React.FC<CenterPanelMobileProps> = ({
  documentContent,
  bottomPanel,
  bottomVisible,
  handleBottomToggle,
  calculateDocumentArea,
  panelStates,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    setIsDragging(false);
    setDragY(0);
    
    // Close if dragged down significantly
    if (info.offset.y > 150) {
      handleBottomToggle(false);
    }
  };

  const handleOverlayClick = () => {
    handleBottomToggle(false);
  };

  const handleToggleClick = () => {
    handleBottomToggle(!bottomVisible);
  };

  const documentArea = calculateDocumentArea();

  return (
    <MobileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Document Area */}
      <DocumentArea hasBottomPanel={!!bottomPanel}>
        <DocumentCanvas>
          {documentContent?.content || (
            <CanvasPlaceholder>
              <div style={{ fontSize: '32px' }}>📱</div>
              <div>Mobile Document Canvas</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                Available area: {documentArea.width}px × {documentArea.height}px
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {documentContent?.title || 'No document loaded'}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                Tap the button to access tools
              </div>
            </CanvasPlaceholder>
          )}
        </DocumentCanvas>
      </DocumentArea>

      {/* Bottom Panel Toggle Button */}
      <BottomPanelToggle 
        hasPanel={!!bottomPanel}
        onClick={handleToggleClick}
      >
        {bottomVisible ? '×' : '⚙'}
      </BottomPanelToggle>

      {/* Bottom Sheet Overlay */}
      {bottomPanel && (
        <BottomSheetOverlay
          visible={bottomVisible}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: bottomVisible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Bottom Sheet */}
      {bottomPanel && bottomVisible && (
        <BottomSheetContainer
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          initial={{ y: '100%' }}
          animate={{ y: dragY }}
          exit={{ y: '100%' }}
          transition={{ 
            type: 'spring', 
            damping: 30, 
            stiffness: 300,
            duration: isDragging ? 0 : 0.4 
          }}
        >
          {/* Drag handle */}
          <DragHandle />
          
          {/* Bottom Panel Content */}
          <PanelHeader
            title={bottomPanel.title}
            collapsed={false}
            onToggle={() => handleBottomToggle(false)}
            platform="mobile"
          />
          
          <PanelContent padding="16px">
            {bottomPanel.content}
          </PanelContent>
          
          {/* Safe area spacing for devices with home indicator */}
          <SafeAreaBottom />
        </BottomSheetContainer>
      )}
    </MobileContainer>
  );
}; 