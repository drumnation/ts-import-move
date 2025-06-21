/**
 * ColumnResizer Component Styles
 * 
 * Styled components for horizontal column resizing using @emotion/styled
 * Split from BidirectionalResizer for column-specific styling
 * 
 * @module ColumnResizer.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { 
  StyledColumnResizerProps, 
  StyledHorizontalHandleProps 
} from './ColumnResizer.types';

/**
 * Main container for the column resizer
 * Positioned on the edge of columns for horizontal resizing
 */
export const ColumnResizerContainer = styled(motion.div)<StyledColumnResizerProps>`
  position: absolute;
  background: transparent;
  z-index: 20;
  cursor: ew-resize;
  
  ${props => {
    // Position resizer based on which column it controls
    if (props.columnPosition === 'right') {
      return `
        top: 0;
        left: -6px;
        width: ${props.touchSize}px;
        height: 100%;
      `;
    } else {
      // Left column resizer positioned on right edge
      return `
        top: 0;
        right: -6px;
        width: ${props.touchSize}px;
        height: 100%;
      `;
    }
  }}
  
  /**
   * Visual resize indicator line
   * Shows blue line when resizer is active (hovered or dragging)
   */
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.isActive ? '#3b82f6' : 'transparent'};
    transition: background-color 0.2s ease;
    
    ${props => {
      if (props.columnPosition === 'right') {
        return `
          top: 0;
          right: 50%;
          transform: translateX(50%);
          width: 2px;
          height: 100%;
        `;
      } else {
        return `
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
        `;
      }
    }}
  }
  
  /**
   * Hover state for visual feedback
   * Provides immediate visual response to user interaction
   */
  &:hover::after {
    background: #3b82f6;
    opacity: 0.6;
  }
`;

/**
 * Resize handle with visual affordance
 * Provides tactile grip for resize operations
 */
export const HorizontalResizeHandle = styled.div<StyledHorizontalHandleProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 20px;
  height: 40px;
  
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  color: #6b7280;
  font-size: 12px;
  writing-mode: vertical-rl;
  
  transition: all 0.2s ease;
  
  /**
   * Hover state styling
   * Enhanced visual feedback during interaction
   */
  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translate(-50%, -50%) scale(1.05);
  }
  
  /**
   * Active state when dragging
   * Maintains visual state during resize operation
   */
  &:active {
    background: #eff6ff;
    border-color: #2563eb;
    color: #2563eb;
  }
`; 