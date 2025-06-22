/**
 * DrawerLayout Styles
 * 
 * Styled components for mobile drawer layout
 * Handles drawer positioning, animations, and touch interactions
 * 
 * @module DrawerLayout.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { DrawerPosition } from '@/tests/complex-document-editor-migration/source/components/layout/mobile/DrawerLayout/DrawerLayout.types';

export const LayoutContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f8f9fa;
  touch-action: pan-x pan-y;
`;

export const MainContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

export const Backdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  touch-action: none;
`;

export const DrawerContainer = styled(motion.div)<{ position: DrawerPosition }>`
  position: absolute;
  background: #ffffff;
  z-index: 20;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  ${props => {
    switch (props.position) {
    case 'left':
      return `
          top: 0;
          left: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          border-right: 1px solid #e5e7eb;
        `;
    case 'right':
      return `
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          border-left: 1px solid #e5e7eb;
        `;
    case 'bottom':
      return `
          left: 0;
          right: 0;
          bottom: 0;
          height: 60%;
          max-height: 400px;
          border-top: 1px solid #e5e7eb;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        `;
    default:
      return '';
    }
  }}
`;

export const DrawerContent = styled.div<{ position: DrawerPosition }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${props => props.position === 'bottom' && `
    padding-top: 8px;
  `}
`;

export const DrawerHandle = styled.div<{ position: DrawerPosition }>`
  ${props => props.position === 'bottom' && `
    width: 40px;
    height: 4px;
    background: #d1d5db;
    border-radius: 2px;
    margin: 8px auto 16px;
    flex-shrink: 0;
  `}
`;

export const DrawerPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
  gap: 12px;
  padding: 24px;
  text-align: center;
  flex: 1;
`;

export const MainPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 16px;
  gap: 16px;
  padding: 24px;
  text-align: center;
  flex: 1;
`;

export const DebugInfo = styled.div`
  position: absolute;
  top: 20px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-family: monospace;
  z-index: 100;
  line-height: 1.4;
`;

export const TouchArea = styled.div<{ position: DrawerPosition }>`
  position: absolute;
  z-index: 5;
  
  ${props => {
    switch (props.position) {
    case 'left':
      return `
          top: 0;
          left: 0;
          bottom: 0;
          width: 20px;
        `;
    case 'right':
      return `
          top: 0;
          right: 0;
          bottom: 0;
          width: 20px;
        `;
    case 'bottom':
      return `
          left: 0;
          right: 0;
          bottom: 0;
          height: 20px;
        `;
    default:
      return '';
    }
  }}
`;

/**
 * Drawer animation variants
 */
export const drawerVariants = {
  left: {
    closed: { x: '-100%' },
    open: { x: '0%' },
  },
  right: {
    closed: { x: '100%' },
    open: { x: '0%' },
  },
  bottom: {
    closed: { y: '100%' },
    open: { y: '0%' },
  },
};

export const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}; 