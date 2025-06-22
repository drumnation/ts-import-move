/**
 * SlotPanel Component Styles
 * 
 * Styled components for the SlotPanel using @emotion/styled
 * 
 * @module SlotPanel.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { 
  StyledPanelContainerProps, 
  StyledPanelHeaderProps, 
  StyledPanelContentProps 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.types';

export const PanelContainer = styled(motion.div)<StyledPanelContainerProps>`
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${props => {
    if (props.isMobile) {
      return `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        border-radius: 16px 16px 0 0;
        max-height: 80vh;
        box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
      `;
    }
    
    // Desktop positioning
    if (props.location === 'center') {
      return props.slot === 'bottom' ? `
        width: 100%;
        height: ${props.collapsed ? '40px' : `${props.size}px`};
        min-height: ${props.collapsed ? '40px' : '120px'};
        border-top: 1px solid #e5e7eb;
      ` : `
        width: 100%;
        flex: 1;
      `;
    }
    
    return `
      width: ${props.collapsed ? '48px' : `${props.size}px`};
      height: 100%;
      min-width: ${props.collapsed ? '48px' : '240px'};
      ${props.location === 'left' ? 'border-right' : 'border-left'}: 1px solid #e5e7eb;
    `;
  }}
`;

export const PanelHeader = styled.div<StyledPanelHeaderProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.isMobile ? '16px 20px 12px' : '12px 16px'};
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  min-height: ${props => props.isMobile ? '60px' : '40px'};
  flex-shrink: 0;
  
  ${props => props.collapsed && !props.isMobile && `
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: 16px 8px;
  `}
`;

export const PanelContent = styled.div<StyledPanelContentProps>`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.isMobile ? '16px 20px 20px' : '16px'};
  
  ${props => props.collapsed && !props.isMobile && `
    display: none;
  `}
`;

export const MobileDragHandle = styled.div`
  width: 36px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 8px auto 0;
  flex-shrink: 0;
`; 