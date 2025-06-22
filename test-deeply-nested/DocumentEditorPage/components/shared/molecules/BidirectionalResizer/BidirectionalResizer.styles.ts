import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { resizeTokens } from '../../tokens/resize.tokens';
import type { StyledResizerProps, StyledHandleProps } from './BidirectionalResizer.types';

export const ResizerContainer = styled(motion.div)<StyledResizerProps>`
  ${props => props.resizeType === 'split' && props.direction === 'vertical' 
    ? 'position: relative;' 
    : 'position: absolute;'
}
  background: transparent;
  z-index: 20;
  
  ${props => {
    if (props.direction === 'horizontal') {
      // For horizontal resizing, position based on panel location
      if (props.panelPosition === 'left') {
        // Left column resizer goes on the RIGHT edge of the left column
        return `
          top: 0;
          right: -${Math.floor(props.touchSize / 2)}px;
          width: ${props.touchSize}px;
          height: 100%;
          cursor: ew-resize;
        `;
      } else if (props.panelPosition === 'right') {
        // Right column resizer goes on the LEFT edge of the right column
        return `
          top: 0;
          left: -${Math.floor(props.touchSize / 2)}px;
          width: ${props.touchSize}px;
          height: 100%;
          cursor: ew-resize;
        `;
      } else {
        // Default case
        return `
          top: 0;
          right: -6px;
          width: ${props.touchSize}px;
          height: 100%;
          cursor: ew-resize;
        `;
      }
    } else {
      // For vertical resizing - different positioning based on resize type
      if (props.resizeType === 'split') {
        // Split resizers flow naturally between flex containers
        return `
          position: relative;
          width: 100%;
          height: ${props.touchSize}px;
          cursor: ns-resize;
          flex-shrink: 0;
        `;
      } else {
        // Regular panel resizers at bottom edge
        return `
          bottom: -6px;
          left: 0;
          width: 100%;
          height: ${props.touchSize}px;
          cursor: ns-resize;
        `;
      }
    }
  }}
  
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.isActive ? resizeTokens.border.active : resizeTokens.visual.backgroundInactive};
    transition: background-color ${resizeTokens.interaction.transitionDuration} ease;
    opacity: ${props => props.isActive ? 1 : resizeTokens.interaction.hoverOpacity};
    
    ${props => {
    if (props.direction === 'horizontal') {
      // Always center the visual indicator in the resize handle
      return `
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
        `;
    } else {
      // For vertical resizers - different positioning based on type
      if (props.resizeType === 'split') {
        // Split resizers show full-width line at the split position
        return `
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            height: 2px;
          `;
      } else {
        // Regular panel resizers at bottom edge
        return `
            left: 0;
            bottom: 50%;
            transform: translateY(50%);
            width: 100%;
            height: 2px;
          `;
      }
    }
  }}
  }
  
  &:hover::after {
    background: ${resizeTokens.border.hover};
    opacity: ${resizeTokens.interaction.hoverOpacity};
  }
`;

export const ResizeHandle = styled.div<StyledHandleProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${resizeTokens.visual.handleBackground};
  border: 1px solid ${resizeTokens.visual.handleBorderDefault};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #6b7280;
  font-size: 12px;
  transition: all ${resizeTokens.interaction.transitionDuration} ease;
  
  ${props => props.direction === 'horizontal' ? `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 40px;
    writing-mode: vertical-rl;
  ` : `
    left: 50%;
    bottom: 50%;
    transform: translate(-50%, 50%);
    width: 40px;
    height: 20px;
  `}
  
  &:hover {
    background: ${resizeTokens.visual.backgroundHover};
    border-color: ${resizeTokens.border.hover};
    color: ${resizeTokens.border.active};
  }
  
  &:active {
    border-color: ${resizeTokens.border.active};
    opacity: ${resizeTokens.interaction.dragOpacity};
  }
`; 