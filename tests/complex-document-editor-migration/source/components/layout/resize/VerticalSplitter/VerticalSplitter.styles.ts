/**
 * VerticalSplitter Styles
 * 
 * Styled components for vertical splitter
 * Handles splitter appearance, animations, and visual feedback
 * 
 * @module VerticalSplitter.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { SplitterStyles } from './VerticalSplitter.types';

/**
 * VerticalSplitter styled components
 * Following mobile-first responsive design principles
 */

const Container = styled.div<SplitterStyles>`
  position: absolute;
  left: 0;
  right: 0;
  height: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'row-resize'};
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  
  /* Mobile-first: larger touch target */
  height: 12px;
  
  /* Desktop: smaller precise target */
  @media (min-width: 768px) {
    height: 8px;
  }
  
  /* Position based on split ratio */
  top: ${({ $currentRatio }) => `calc(${$currentRatio * 100}% - 6px)`};
  
  @media (min-width: 768px) {
    top: ${({ $currentRatio }) => `calc(${$currentRatio * 100}% - 4px)`};
  }
  
  &:hover {
    background: ${({ $disabled }) => 
      $disabled ? 'transparent' : 'rgba(59, 130, 246, 0.1)'};
  }
  
  ${({ $isSplitting }) => 
    $isSplitting && `
      background: rgba(59, 130, 246, 0.2);
    `}
  
  ${({ $disabled }) => 
    $disabled && `
      opacity: 0.5;
      pointer-events: none;
    `}
`;

const Handle = styled.div<SplitterStyles>`
  height: 2px;
  width: ${({ $isSplitting }) => $isSplitting ? '60px' : '40px'};
  background: ${({ $disabled, $isSplitting }) => {
    if ($disabled) return '#e5e7eb';
    if ($isSplitting) return '#3b82f6';
    return '#d1d5db';
  }};
  border-radius: 1px;
  transition: all 0.2s ease;
  
  /* Mobile: slightly larger handle */
  height: 3px;
  
  /* Desktop: precise handle */
  @media (min-width: 768px) {
    height: 2px;
  }
`;

const Preview = styled.div<SplitterStyles>`
  position: fixed;
  left: 50%;
  top: ${({ $currentRatio }) => `${$currentRatio * 100}%`};
  transform: translateX(-50%) translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  z-index: 1001;
  pointer-events: none;
  white-space: nowrap;
  
  /* Mobile: larger text for readability */
  font-size: 14px;
  padding: 8px 16px;
  
  /* Desktop: compact display */
  @media (min-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  /* Add subtle shadow for depth */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* Animation */
  animation: fadeInUp 0.2s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-50%) translateY(0);
    }
  }
`;

const HitArea = styled.div<SplitterStyles>`
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  bottom: -8px;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'row-resize'};
  
  /* Mobile: larger hit area for touch */
  top: -12px;
  bottom: -12px;
  
  /* Desktop: precise hit area */
  @media (min-width: 768px) {
    top: -8px;
    bottom: -8px;
  }
  
  ${({ $disabled }) => 
    $disabled && `
      pointer-events: none;
    `}
`;

const VisualFeedback = styled.div<SplitterStyles>`
  position: fixed;
  left: 0;
  right: 0;
  top: ${({ $currentRatio }) => `${$currentRatio * 100}%`};
  height: 2px;
  background: #3b82f6;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  
  /* Only show during split */
  opacity: ${({ $isSplitting }) => $isSplitting ? 1 : 0};
  transition: opacity 0.1s ease;
  
  /* Mobile: slightly thicker line for visibility */
  height: 3px;
  
  /* Desktop: precise line */
  @media (min-width: 768px) {
    height: 2px;
  }
`;

/**
 * Export all styled components as a namespace
 */
export const VerticalSplitterStyles = {
  Container,
  Handle,
  Preview,
  HitArea,
  VisualFeedback,
}; 