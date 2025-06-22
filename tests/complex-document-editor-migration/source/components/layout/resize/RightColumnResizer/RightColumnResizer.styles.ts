/**
 * RightColumnResizer Styles
 * 
 * Styled components for right column resizer
 * Handles visual feedback and resize indicators
 * Uses green color scheme to distinguish from left column
 * 
 * @module RightColumnResizer.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { ResizerStyles } from '@/tests/complex-document-editor-migration/source/components/layout/resize/RightColumnResizer/RightColumnResizer.types';

/**
 * Main resizer container for right column
 */
const Container = styled.div<ResizerStyles>`
  position: absolute;
  top: 0;
  left: -4px;
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
  left: -6px;
  
  /* Desktop: smaller precise target */
  @media (min-width: 768px) {
    width: 8px;
    left: -4px;
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
 * Visual resize handle for right column
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
 * Resize preview line for right column
 */
const Preview = styled.div<ResizerStyles>`
  position: fixed;
  top: 50%;
  right: ${({ $currentWidth }) => $currentWidth}px;
  transform: translateY(-50%) translateX(50%);
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
      transform: translateY(-50%) translateX(50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(50%) translateY(0);
    }
  }
`;

/**
 * Hit area for right column
 */
const HitArea = styled.div<ResizerStyles>`
  position: absolute;
  top: 0;
  left: -8px;
  right: -8px;
  bottom: 0;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'col-resize'};
  
  /* Mobile: larger hit area for touch */
  left: -12px;
  right: -12px;
  
  /* Desktop: precise hit area */
  @media (min-width: 768px) {
    left: -8px;
    right: -8px;
  }
  
  ${({ $disabled }) => 
    $disabled && `
      pointer-events: none;
    `}
`;

/**
 * Visual feedback for right column
 */
const VisualFeedback = styled.div<ResizerStyles>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${({ $currentWidth }) => $currentWidth}px;
  width: 2px;
  background: #3b82f6;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  
  /* Only show during resize */
  opacity: ${({ $isResizing }) => $isResizing ? 1 : 0};
  transition: opacity 0.1s ease;
  
  /* Mobile: slightly thicker line for visibility */
  width: 3px;
  
  /* Desktop: precise line */
  @media (min-width: 768px) {
    width: 2px;
  }
`;

/**
 * Export all styled components as a namespace
 */
export const RightColumnResizerStyles = {
  Container,
  Handle,
  Preview,
  HitArea,
  VisualFeedback,
};

/**
 * Resize preview line for right column
 */
export const RightResizePreview = styled(motion.div)<{ 
  visible: boolean; 
  position: number 
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${props => props.position}px;
  width: 2px;
  background: #10b981;
  z-index: 1000;
  pointer-events: none;
  opacity: ${props => props.visible ? 1 : 0};
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
`;

/**
 * Width indicator tooltip for right column
 */
export const RightWidthIndicator = styled(motion.div)<{ 
  visible: boolean; 
  x: number 
}>`
  position: fixed;
  top: 50%;
  right: ${props => props.x / 2}px;
  transform: translateY(-50%) translateX(50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  z-index: 1001;
  pointer-events: none;
  opacity: ${props => props.visible ? 1 : 0};
  
  /* Responsive font sizing */
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 8px;
  }
`;

/**
 * Constraint info text for right column
 */
export const RightConstraintInfo = styled.span`
  font-size: 10px;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

/**
 * Animation variants for right column resize feedback
 */
export const rightResizeAnimationVariants = {
  idle: {
    scale: 1,
    opacity: 0.7,
  },
  active: {
    scale: 1.2,
    opacity: 1,
  },
  hover: {
    scale: 1.1,
    opacity: 0.9,
  },
};

/**
 * Preview line animation variants for right column
 */
export const rightPreviewAnimationVariants = {
  hidden: {
    opacity: 0,
    scaleY: 0.8,
  },
  visible: {
    opacity: 1,
    scaleY: 1,
  },
};

/**
 * Indicator animation variants for right column
 */
export const rightIndicatorAnimationVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
}; 