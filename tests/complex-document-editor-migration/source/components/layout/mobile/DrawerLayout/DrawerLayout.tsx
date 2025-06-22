/**
 * DrawerLayout Component
 * 
 * Mobile drawer layout with slide-out panels and touch interactions
 * Visual mapping: Slide-out left/right drawers + bottom sheet
 * Optimized for mobile document editing experience
 * 
 * @module DrawerLayout
 */

import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDrawerLayout } from '@/tests/complex-document-editor-migration/source/components/layout/mobile/DrawerLayout/DrawerLayout.logic';
import type { DrawerLayoutProps, DrawerPosition } from '@/tests/complex-document-editor-migration/source/components/layout/mobile/DrawerLayout/DrawerLayout.types';
import {
  LayoutContainer,
  MainContent,
  Backdrop,
  DrawerContainer,
  DrawerContent,
  DrawerHandle,
  DrawerPlaceholder,
  MainPlaceholder,
  DebugInfo,
  TouchArea,
  drawerVariants,
  backdropVariants,
} from '@/tests/complex-document-editor-migration/source/components/layout/mobile/DrawerLayout/DrawerLayout.styles';

/**
 * DrawerLayout component
 * Mobile drawer layout with touch interactions
 */
export const DrawerLayout: React.FC<DrawerLayoutProps> = (props) => {
  const {
    layoutState,
    leftContent,
    rightContent,
    bottomContent,
    mainContent,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const layoutLogic = useDrawerLayout(props);

  const {
    openDrawer,
    closeDrawer,
    toggleDrawer,
    closeAllDrawers,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd,
    getDrawerTransform,
    getBackdropOpacity,
  } = layoutLogic;

  // Set up touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      handleGestureStart(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleGestureMove(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      handleGestureEnd(e);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleGestureStart, handleGestureMove, handleGestureEnd]);

  const hasActiveDrawer = layoutState.activeDrawer !== null;

  return (
    <LayoutContainer ref={containerRef}>
      {/* Debug Info */}
      <DebugInfo>
        Mobile Drawer Layout
        <br />
        Active: {layoutState.activeDrawer || 'none'}
        <br />
        Screen: {layoutState.screenDimensions.width}×{layoutState.screenDimensions.height}
      </DebugInfo>

      {/* Touch Areas for Edge Gestures */}
      <TouchArea position="left" />
      <TouchArea position="right" />
      <TouchArea position="bottom" />

      {/* Main Content */}
      <MainContent>
        {mainContent || (
          <MainPlaceholder>
            <div style={{ fontSize: '48px' }}>📱</div>
            <div>Mobile Document Editor</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              Swipe from edges to open panels
            </div>
            <div style={{ fontSize: '12px', color: '#d1d5db' }}>
              Left: Assets | Right: Research | Bottom: Tools
            </div>
          </MainPlaceholder>
        )}
      </MainContent>

      {/* Backdrop */}
      <AnimatePresence>
        {hasActiveDrawer && (
          <Backdrop
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
            onClick={closeAllDrawers}
          />
        )}
      </AnimatePresence>

      {/* Left Drawer */}
      <AnimatePresence>
        {layoutState.leftDrawer.isOpen && (
          <DrawerContainer
            position="left"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants.left}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            <DrawerContent position="left">
              {leftContent || (
                <DrawerPlaceholder>
                  <div style={{ fontSize: '32px' }}>📁</div>
                  <div>Left Drawer</div>
                  <div style={{ fontSize: '12px' }}>Assets Panel</div>
                  <button 
                    onClick={() => closeDrawer('left')}
                    style={{ 
                      marginTop: '16px', 
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </DrawerPlaceholder>
              )}
            </DrawerContent>
          </DrawerContainer>
        )}
      </AnimatePresence>

      {/* Right Drawer */}
      <AnimatePresence>
        {layoutState.rightDrawer.isOpen && (
          <DrawerContainer
            position="right"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants.right}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            <DrawerContent position="right">
              {rightContent || (
                <DrawerPlaceholder>
                  <div style={{ fontSize: '32px' }}>🔍</div>
                  <div>Right Drawer</div>
                  <div style={{ fontSize: '12px' }}>Research Panel</div>
                  <button 
                    onClick={() => closeDrawer('right')}
                    style={{ 
                      marginTop: '16px', 
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </DrawerPlaceholder>
              )}
            </DrawerContent>
          </DrawerContainer>
        )}
      </AnimatePresence>

      {/* Bottom Drawer */}
      <AnimatePresence>
        {layoutState.bottomDrawer.isOpen && (
          <DrawerContainer
            position="bottom"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants.bottom}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            <DrawerContent position="bottom">
              <DrawerHandle position="bottom" />
              {bottomContent || (
                <DrawerPlaceholder>
                  <div style={{ fontSize: '32px' }}>⚙️</div>
                  <div>Bottom Drawer</div>
                  <div style={{ fontSize: '12px' }}>Tools Panel</div>
                  <button 
                    onClick={() => closeDrawer('bottom')}
                    style={{ 
                      marginTop: '16px', 
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </DrawerPlaceholder>
              )}
            </DrawerContent>
          </DrawerContainer>
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
}; 