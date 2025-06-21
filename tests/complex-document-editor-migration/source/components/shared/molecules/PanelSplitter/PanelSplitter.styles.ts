/**
 * PanelSplitter Styled Components
 * 
 * Emotion-based styled components for vertical panel splitting
 * Optimized for touch interactions and visual feedback
 * 
 * @module PanelSplitter.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { resizeTokens } from '../../tokens/resize.tokens';
import type { StyledPanelSplitterProps, StyledVerticalHandleProps } from './PanelSplitter.types';

/**
 * Main splitter container
 * Handles the drag area and visual states
 */
export const StyledPanelSplitter = styled(motion.div)<StyledPanelSplitterProps>`
  position: relative;
  height: ${({ touchSize }) => touchSize}px;
  width: 100%;
  cursor: row-resize;
  background: transparent;
  z-index: 50;
  
  /* Ensure adequate touch target size */
  min-height: ${({ touchSize }) => Math.max(touchSize, 16)}px;
  
  /* Visual feedback states */
  &:hover {
    background: ${resizeTokens.visual.backgroundHover};
  }
  
  ${({ isActive }) => isActive && `
    background: ${resizeTokens.visual.backgroundActive};
    opacity: ${resizeTokens.interaction.dragOpacity};
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 3px;
      background: ${resizeTokens.border.active};
      transform: translateY(-50%);
      transition: background-color ${resizeTokens.interaction.transitionDuration} ease;
    }
  `}
  
  /* Platform-specific adjustments */
  @media (max-width: 768px) {
    height: ${({ touchSize }) => Math.max(touchSize, 20)}px;
    min-height: 20px;
  }
  
  /* Accessibility focus styles */
  &:focus-visible {
    outline: 2px solid ${resizeTokens.border.focus};
    outline-offset: 2px;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

/**
 * Vertical handle for the splitter
 * Contains the visual indicator for drag operations
 */
export const StyledVerticalHandle = styled.div<StyledVerticalHandleProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  /* Visual feedback */
  background: rgba(107, 114, 128, 0.3);
  
  &:hover {
    background: rgba(107, 114, 128, 0.5);
    transform: translate(-50%, -50%) scale(1.05);
  }
  
  /* Platform-specific adjustments */
  @media (max-width: 768px) {
    width: 60px;
    background: rgba(107, 114, 128, 0.4);
  }
`;

/**
 * Content within the splitter handle
 * Provides visual indication of drag functionality
 */
export const StyledSplitterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  
  div {
    width: 4px;
    height: 4px;
    background: #6b7280;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  
  /* Hover state for dots */
  ${StyledVerticalHandle}:hover & div {
    background: #374151;
  }
  
  /* Active state for dots */
  ${StyledPanelSplitter}[data-active="true"] & div {
    background: ${resizeTokens.border.active};
  }
`;

/**
 * Legacy styled components for backward compatibility
 */
export const PanelSplitterContainer = StyledPanelSplitter;
export const VerticalSplitHandle = StyledVerticalHandle; 