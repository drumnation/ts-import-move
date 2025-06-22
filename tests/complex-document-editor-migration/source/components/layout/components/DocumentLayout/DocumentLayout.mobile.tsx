/**
 * DocumentLayout Mobile Implementation
 * 
 * Mobile-optimized layout with drawer-based panel system
 * Visual mapping: Full-screen document with slide-out panels and bottom navigation
 * Touch-optimized interactions and mobile-first design
 * 
 * @module DocumentLayout.mobile
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import type { DocumentLayoutProps, DocumentLayoutLogic } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.types';

interface DocumentLayoutMobileProps extends DocumentLayoutProps, DocumentLayoutLogic {}

const MobileContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  overflow: hidden;
`;

const DocumentArea = styled.div`
  flex: 1;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  padding: 20px;
  text-align: center;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const NavButton = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px 12px;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s ease;
  min-width: 60px;

  &:active {
    transform: scale(0.95);
  }
`;

const NavIcon = styled.div`
  font-size: 20px;
  margin-bottom: 2px;
`;

const PanelOverlay = styled(motion.div)<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1500;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const SideDrawer = styled(motion.div)<{ side: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${props => props.side}: 0;
  width: 85%;
  max-width: 350px;
  height: 100vh;
  background: #ffffff;
  z-index: 1600;
  box-shadow: ${props => props.side === 'left' 
    ? '4px 0 20px rgba(0, 0, 0, 0.15)' 
    : '-4px 0 20px rgba(0, 0, 0, 0.15)'};
  display: flex;
  flex-direction: column;
`;

const BottomDrawer = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  z-index: 1600;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
`;

const DrawerTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:active {
    background: #f3f4f6;
  }
`;

const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const DragHandle = styled.div`
  width: 32px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 8px auto;
  flex-shrink: 0;
`;

const SafeAreaBottom = styled.div`
  height: env(safe-area-inset-bottom);
  background: #ffffff;
`;

/**
 * Mobile-specific DocumentLayout implementation
 * Drawer-based panel system with touch navigation
 */
export const DocumentLayoutMobile: React.FC<DocumentLayoutMobileProps> = ({
  config,
  leftPanelContent,
  rightPanelContent,
  documentContent,
  bottomPanelContent,
  handleMobilePanelNavigation,
  calculateDocumentArea,
}) => {
  const { activeMobilePanel } = config;
  const documentArea = calculateDocumentArea();

  const handlePanelSelect = (panel: 'left' | 'right' | 'bottom' | null) => {
    // Toggle panel if already active, otherwise activate it
    const newPanel = activeMobilePanel === panel ? null : panel;
    handleMobilePanelNavigation(newPanel);
  };

  const handleOverlayClick = () => {
    handleMobilePanelNavigation(null);
  };

  const sideDrawerVariants = {
    hidden: (side: 'left' | 'right') => ({
      x: side === 'left' ? '-100%' : '100%',
    }),
    visible: {
      x: 0,
    },
  };

  const bottomDrawerVariants = {
    hidden: {
      y: '100%',
    },
    visible: {
      y: 0,
    },
  };

  return (
    <MobileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Document Area */}
      <DocumentArea>
        {documentContent || (
          <DocumentPlaceholder>
            <div style={{ fontSize: '48px' }}>📱</div>
            <div>Mobile Document Canvas</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              Available area: {documentArea.width}px × {documentArea.height}px
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              Drawer-based panel system
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
              Use bottom navigation to access panels
            </div>
          </DocumentPlaceholder>
        )}
      </DocumentArea>

      {/* Bottom Navigation */}
      <BottomNavigation>
        <NavButton 
          active={activeMobilePanel === 'left'}
          onClick={() => handlePanelSelect('left')}
        >
          <NavIcon>📁</NavIcon>
          <span>Assets</span>
        </NavButton>
        
        <NavButton 
          active={false}
          onClick={() => {/* Document actions */}}
        >
          <NavIcon>📄</NavIcon>
          <span>Document</span>
        </NavButton>
        
        <NavButton 
          active={activeMobilePanel === 'bottom'}
          onClick={() => handlePanelSelect('bottom')}
        >
          <NavIcon>⚙️</NavIcon>
          <span>Tools</span>
        </NavButton>
        
        <NavButton 
          active={activeMobilePanel === 'right'}
          onClick={() => handlePanelSelect('right')}
        >
          <NavIcon>🔍</NavIcon>
          <span>Research</span>
        </NavButton>
      </BottomNavigation>

      {/* Panel Overlay */}
      <AnimatePresence>
        {activeMobilePanel && (
          <PanelOverlay
            visible={!!activeMobilePanel}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Left Side Drawer */}
      <AnimatePresence>
        {activeMobilePanel === 'left' && (
          <SideDrawer
            side="left"
            custom="left"
            variants={sideDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <DrawerHeader>
              <DrawerTitle>Assets</DrawerTitle>
              <CloseButton onClick={() => handleMobilePanelNavigation(null)}>
                ×
              </CloseButton>
            </DrawerHeader>
            <DrawerContent>
              {leftPanelContent}
            </DrawerContent>
          </SideDrawer>
        )}
      </AnimatePresence>

      {/* Right Side Drawer */}
      <AnimatePresence>
        {activeMobilePanel === 'right' && (
          <SideDrawer
            side="right"
            custom="right"
            variants={sideDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <DrawerHeader>
              <DrawerTitle>Research</DrawerTitle>
              <CloseButton onClick={() => handleMobilePanelNavigation(null)}>
                ×
              </CloseButton>
            </DrawerHeader>
            <DrawerContent>
              {rightPanelContent}
            </DrawerContent>
          </SideDrawer>
        )}
      </AnimatePresence>

      {/* Bottom Drawer */}
      <AnimatePresence>
        {activeMobilePanel === 'bottom' && (
          <BottomDrawer
            variants={bottomDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <DragHandle />
            <DrawerHeader>
              <DrawerTitle>Tools</DrawerTitle>
              <CloseButton onClick={() => handleMobilePanelNavigation(null)}>
                ×
              </CloseButton>
            </DrawerHeader>
            <DrawerContent>
              {bottomPanelContent}
            </DrawerContent>
            <SafeAreaBottom />
          </BottomDrawer>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
}; 