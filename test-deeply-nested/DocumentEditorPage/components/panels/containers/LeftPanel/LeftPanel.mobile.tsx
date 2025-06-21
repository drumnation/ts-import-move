/**
 * LeftPanel Mobile Implementation
 * 
 * Mobile-optimized left panel as bottom sheet with touch interactions
 * Visual mapping: Slide-up bottom sheet with swipe gestures
 * 
 * @module LeftPanel.mobile
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PanelHeader } from '../atoms/PanelHeader';
import { PanelContent } from '../atoms/PanelContent';
import type { LeftPanelProps, LeftPanelLogic } from './LeftPanel.types';

interface LeftPanelMobileProps extends LeftPanelProps, LeftPanelLogic {}

const MobileOverlay = styled(motion.div)<{ visible: boolean }>`
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
  max-height: 70vh;
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

const PanelSection = styled.div<{ collapsed: boolean }>`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  flex-direction: column;
  min-height: 200px;
  border-bottom: ${props => props.collapsed ? 'none' : '1px solid #e5e7eb'};
  
  &:last-child {
    border-bottom: none;
    flex: 1;
  }
`;

const SafeAreaBottom = styled.div`
  height: env(safe-area-inset-bottom);
  background: white;
`;

/**
 * Mobile-specific LeftPanel implementation as bottom sheet
 */
export const LeftPanelMobile: React.FC<LeftPanelMobileProps> = ({
  topPanel,
  bottomPanel,
  visible,
  onResize,
  handlePanelToggle,
  handlePanelClose,
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
      onResize?.(0); // Close the panel
    }
  };

  const handleOverlayClick = () => {
    onResize?.(0); // Close the panel
  };

  if (!visible) return null;

  return (
    <>
      {/* Background overlay */}
      <MobileOverlay
        visible={visible}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Bottom sheet */}
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
        
        {/* Top Panel */}
        {topPanel && (
          <PanelSection collapsed={panelStates.topCollapsed}>
            <PanelHeader
              title={topPanel.title}
              collapsed={panelStates.topCollapsed}
              onToggle={(collapsed) => handlePanelToggle(`${topPanel.id}-top`, collapsed)}
              onClose={topPanel.closable ? () => handlePanelClose(topPanel.id) : undefined}
              platform="mobile"
            />
            
            {!panelStates.topCollapsed && (
              <PanelContent padding="16px">
                {topPanel.content}
              </PanelContent>
            )}
          </PanelSection>
        )}
        
        {/* Bottom Panel */}
        {bottomPanel && (
          <PanelSection collapsed={panelStates.bottomCollapsed}>
            <PanelHeader
              title={bottomPanel.title}
              collapsed={panelStates.bottomCollapsed}
              onToggle={(collapsed) => handlePanelToggle(`${bottomPanel.id}-bottom`, collapsed)}
              onClose={bottomPanel.closable ? () => handlePanelClose(bottomPanel.id) : undefined}
              platform="mobile"
            />
            
            {!panelStates.bottomCollapsed && (
              <PanelContent padding="16px">
                {bottomPanel.content}
              </PanelContent>
            )}
          </PanelSection>
        )}
        
        {/* Safe area spacing for devices with home indicator */}
        <SafeAreaBottom />
      </BottomSheetContainer>
    </>
  );
}; 