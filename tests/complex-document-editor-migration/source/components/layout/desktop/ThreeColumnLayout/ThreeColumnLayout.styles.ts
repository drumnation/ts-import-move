/**
 * ThreeColumnLayout Styles
 * 
 * Styled components for desktop three-column layout
 * Handles responsive column widths, transitions, and visual states
 * 
 * @module ThreeColumnLayout.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const LayoutContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
  overflow: hidden;
  position: relative;
`;

export const LeftColumn = styled.div<{ width: number; visible: boolean; collapsed: boolean }>`
  width: ${props => props.visible && !props.collapsed ? `${props.width}px` : '0'};
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
  position: relative;
`;

export const RightColumn = styled.div<{ width: number; visible: boolean; collapsed: boolean }>`
  width: ${props => props.visible && !props.collapsed ? `${props.width}px` : '0'};
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
  position: relative;
`;

export const CenterColumn = styled.div<{ hasBottomPanel: boolean }>`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  min-width: 400px;
  overflow: hidden;
`;

export const CenterContent = styled.div<{ hasBottomPanel: boolean; bottomHeight: number }>`
  flex: 1;
  height: ${props => props.hasBottomPanel 
    ? `calc(100% - ${props.bottomHeight}%)` 
    : '100%'};
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: height 0.3s ease;
`;

export const BottomPanel = styled.div<{ height: number; visible: boolean }>`
  height: ${props => props.visible ? `${props.height}%` : '0'};
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  background: #ffffff;
  border-top: ${props => props.visible ? '1px solid #e5e7eb' : 'none'};
  transition: height 0.3s ease;
  overflow: hidden;
`;

export const ColumnPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
  gap: 8px;
  padding: 16px;
  text-align: center;
`;

export const LayoutDebugInfo = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  z-index: 100;
  line-height: 1.3;
`;

export const CollapseButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position}: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`; 