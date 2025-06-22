/**
 * DocumentEditorLayout Component Styles
 * 
 * Styled components for the main document editor layout orchestrator
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { 
  LayoutContainerProps, 
  DesktopLayoutProps, 
  PanelSlotContainerProps 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';

/**
 * Main layout container
 * Handles full viewport layout with safe area support
 */
export const LayoutContainer = styled(motion.div)<LayoutContainerProps>`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
  
  /* Safe area support for mobile devices */
  padding-top: ${props => props.safeAreaTop}px;
  padding-bottom: ${props => props.safeAreaBottom}px;
  padding-left: ${props => props.safeAreaLeft}px;
  padding-right: ${props => props.safeAreaRight}px;
  
  /* Ensure content doesn't get cut off */
  box-sizing: border-box;
  position: relative;
  
  /* Smooth transitions for layout changes */
  transition: padding 0.3s ease;
`;

/**
 * Desktop three-column layout
 * Manages left sidebar, center content, and right sidebar
 */
export const DesktopLayout = styled.div<DesktopLayoutProps>`
  display: flex;
  width: 100%;
  height: 100%;
  
  /**
   * Left sidebar column
   * Houses left panels with resize capabilities
   */
  .left-column {
    width: ${props => props.leftWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e7eb;
    background: #ffffff;
    
    /* Smooth resize transitions */
    transition: width 0.2s ease;
  }
  
  /**
   * Center content column
   * Primary document editing area with flexible sizing
   */
  .center-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Allow flex shrinking */
    background: #ffffff;
    
    /* Border separation from sidebars */
    border-left: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
  }
  
  /**
   * Right sidebar column
   * Houses right panels with resize capabilities
   */
  .right-column {
    width: ${props => props.rightWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #e5e7eb;
    background: #ffffff;
    
    /* Smooth resize transitions */
    transition: width 0.2s ease;
  }
`;

/**
 * Panel slot container for vertical splitting
 * Manages top/bottom panel arrangements within columns
 */
export const PanelSlotContainer = styled.div<PanelSlotContainerProps>`
  ${props => props.isTop ? `
    flex: ${props.splitRatio};
    border-bottom: 1px solid #e5e7eb;
    min-height: 120px;
  ` : `
    flex: ${1 - props.splitRatio};
    min-height: 120px;
  `}
  
  display: flex;
  flex-direction: column;
  background: #ffffff;
  
  /* Smooth split ratio transitions */
  transition: flex 0.2s ease;
  
  /* Ensure content visibility */
  overflow: hidden;
`;

/**
 * Center content area
 * Main document display and editing region
 */
export const CenterContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: relative;
  
  /* Subtle shadow for depth */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  
  /* Ensure proper content containment */
  overflow: hidden;
`;

/**
 * Mobile layout container
 * Simplified single-column layout for mobile devices
 */
export const MobileLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  
  /* Mobile-specific styling */
  border-radius: 0;
  box-shadow: none;
  
  /* Optimize for touch interactions */
  touch-action: manipulation;
`; 