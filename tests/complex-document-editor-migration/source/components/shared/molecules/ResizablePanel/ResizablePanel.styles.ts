import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { resizeTokens } from '@/tests/complex-document-editor-migration/source/components/shared/tokens/resize.tokens';
import type { PanelPosition, TouchConfig } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ResizablePanel/ResizablePanel.types';

export const PanelContainer = styled(motion.div)<{ 
  position: PanelPosition; 
  isCollapsed: boolean 
}>`
  position: relative;
  height: 100%;
  background: #ffffff;
  ${props => props.position === 'left' ? 'border-right' : 'border-left'}: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  width: ${props => props.isCollapsed ? '48px' : 'auto'};
  min-width: ${props => props.isCollapsed ? '48px' : '240px'};
`;

export const ResizeHandle = styled.div<{ 
  position: PanelPosition; 
  touchConfig: TouchConfig;
  isDragging?: boolean;
}>`
  position: absolute;
  top: 0;
  ${props => props.position === 'left' ? 'right: -4px;' : 'left: -4px;'}
  width: ${props => props.touchConfig.minSize}px;
  height: 100%;
  cursor: ew-resize;
  background: ${resizeTokens.visual.backgroundInactive};
  z-index: 10;
  transition: all ${resizeTokens.interaction.transitionDuration} ease;
  
  &:hover::after {
    content: '';
    position: absolute;
    top: 0;
    ${props => props.position === 'left' ? 'right: 2px;' : 'left: 2px;'}
    width: ${resizeTokens.sizing.handleWidth};
    height: 100%;
    background: ${resizeTokens.border.hover};
    opacity: ${resizeTokens.interaction.hoverOpacity};
    transition: all ${resizeTokens.interaction.transitionDuration} ease;
  }
  
  &:active::after {
    background: ${resizeTokens.border.active};
    opacity: 1;
    width: 3px; /* Slightly thicker during drag */
  }
  
  ${props => props.isDragging && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      ${props.position === 'left' ? 'right: 2px;' : 'left: 2px;'}
      width: 3px;
      height: 100%;
      background: ${resizeTokens.border.active};
      opacity: ${resizeTokens.interaction.dragOpacity};
    }
  `}
`;

export const RailView = styled.div<{ touchConfig: TouchConfig }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.touchConfig.spacing}px 8px;
  gap: ${props => props.touchConfig.spacing}px;
  height: 100%;
  border-right: 1px solid #e5e7eb;
`;

export const CollapseButton = styled.button<{ touchConfig: TouchConfig }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${props => props.touchConfig.minSize}px;
  height: ${props => props.touchConfig.minSize}px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  
  &:hover {
    background: #e5e7eb;
  }
`;

export const RailButton = styled.button<{ touchConfig: TouchConfig }>`
  width: ${props => props.touchConfig.minSize}px;
  height: ${props => props.touchConfig.minSize}px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #e5e7eb;
  }
`; 