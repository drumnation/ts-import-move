/**
 * LeftColumnResizer Styles
 * 
 * Styled components for left column resizer
 * Handles visual feedback and resize indicators
 * 
 * @module LeftColumnResizer.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { ResizerStyles } from './LeftColumnResizer.types';

/**
 * Main resizer container
 */
const Container = styled.div<ResizerStyles>`
  position: absolute;
  top: 0;
  right: -4px;
  bottom: 0;
  width: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'col-resize'};
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  
  /* Mobile-first: larger touch target */
  width: 12px;
  right: -6px;
  
  /* Desktop: smaller precise target */
  @media (min-width: 768px) {
    width: 8px;
    right: -4px;
  }
  
  &:hover {
    background: ${({ $disabled }) => 
      $disabled ? 'transparent' : 'rgba(59, 130, 246, 0.1)'};
  }
  
  ${({ $isResizing }) => 
    $isResizing && `
      background: rgba(59, 130, 246, 0.2);
    `}
  
  ${({ $disabled }) => 
    $disabled && `
      opacity: 0.5;
      pointer-events: none;
    `}
`;

/**
 * Visual resize handle
 */
const Handle = styled.div<ResizerStyles>`
  width: 2px;
  height: ${({ $isResizing }) => $isResizing ? '60px' : '40px'};
  background: ${({ $disabled, $isResizing }) => {
    if ($disabled) return '#e5e7eb';
    if ($isResizing) return '#3b82f6';
    return '#d1d5db';
  }};
  border-radius: 1px;
  transition: all 0.2s ease;
  
  /* Mobile: slightly larger handle */
  width: 3px;
  
  /* Desktop: precise handle */
  @media (min-width: 768px) {
    width: 2px;
  }
`;

/**
 * Resize preview line
 */
const Preview = styled.div<ResizerStyles>`
  position: fixed;
  top: 50%;
  left: ${({ $currentWidth }) => $currentWidth}px;
  transform: translateY(-50%) translateX(-50%);
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
      transform: translateY(-50%) translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(-50%) translateY(0);
    }
  }
`;

/**
 * Width indicator tooltip
 */
const WidthIndicator = styled(motion.div)<{ 
  visible: boolean; 
  x: number 
}>`
  position: fixed;
  top: 50%;
  left: ${props => props.x}px;
  transform: translateY(-50%) translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 500;
  z-index: 1001;
  pointer-events: none;
  opacity: ${props => props.visible ? 1 : 0};
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.8);
  }
`;

/**
 * Constraint info text
 */
const ConstraintInfo = styled.span`
  font-size: 10px;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

/**
 * Constraint indicator
 */
const ConstraintIndicator = styled(motion.div)<{ 
  visible: boolean; 
  type: 'min' | 'max'; 
  position: number 
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: ${props => props.position}px;
  width: 1px;
  background: ${props => props.type === 'min' ? '#ef4444' : '#f59e0b'};
  z-index: 999;
  pointer-events: none;
  opacity: ${props => props.visible ? 0.6 : 0};
  
  &::before {
    content: '${props => props.type === 'min' ? 'MIN' : 'MAX'}';
    position: absolute;
    top: 50%;
    left: ${props => props.type === 'min' ? '4px' : '-30px'};
    transform: translateY(-50%);
    background: ${props => props.type === 'min' ? '#ef4444' : '#f59e0b'};
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
`;

/**
 * Resizer tooltip
 */
const ResizerTooltip = styled(motion.div)<{ visible: boolean }>`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: system-ui, sans-serif;
  white-space: nowrap;
  z-index: 20;
  pointer-events: none;
  opacity: ${props => props.visible ? 1 : 0};
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.8);
  }
`;

/**
 * Animation variants for styled components
 */
export const containerVariants = {
  idle: {
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  active: {
    scale: 1.1,
    transition: { duration: 0.1 }
  }
};

export const handleVariants = {
  idle: {
    scaleY: 1,
    opacity: 0.6,
    transition: { duration: 0.2 }
  },
  hover: {
    scaleY: 1.2,
    opacity: 0.8,
    transition: { duration: 0.2 }
  },
  active: {
    scaleY: 1.5,
    opacity: 1,
    transition: { duration: 0.1 }
  }
};

export const previewVariants = {
  hidden: {
    opacity: 0,
    scaleX: 0,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.2 }
  }
};

export const indicatorVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Export all styled components as a namespace
 */
export const LeftColumnResizerStyles = {
  Container,
  Handle,
  Preview,
  WidthIndicator,
  ConstraintInfo,
  ConstraintIndicator,
  ResizerTooltip,
}; 