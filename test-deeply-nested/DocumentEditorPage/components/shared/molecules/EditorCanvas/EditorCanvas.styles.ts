/**
 * EditorCanvas Component Styles
 * @module EditorCanvas.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { CanvasContainerProps, DesktopLayoutProps, PanelSlotContainerProps } from './EditorCanvas.types';

export const CanvasContainer = styled(motion.div)<CanvasContainerProps>`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
  
  /* Safe area support */
  padding-top: ${props => props.safeAreaTop}px;
  padding-bottom: ${props => props.safeAreaBottom}px;
  padding-left: ${props => props.safeAreaLeft}px;
  padding-right: ${props => props.safeAreaRight}px;
  
  /* Ensure content doesn't get cut off */
  box-sizing: border-box;
  position: relative;
`;

export const DesktopLayout = styled.div<DesktopLayoutProps>`
  display: flex;
  width: 100%;
  height: 100%;
  
  .left-column {
    width: ${props => props.leftWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e7eb;
  }
  
  .center-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Allow flex shrinking */
  }
  
  .right-column {
    width: ${props => props.rightWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #e5e7eb;
  }
`;

export const PanelSlotContainer = styled.div<PanelSlotContainerProps>`
  ${props => props.isTop ? `
    flex: ${props.splitRatio};
    border-bottom: 1px solid #e5e7eb;
  ` : `
    flex: ${1 - props.splitRatio};
  `}
  
  display: flex;
  flex-direction: column;
  min-height: 120px;
`;

export const CenterContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  margin: 0 1px;
`;

export const MobileLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`; 