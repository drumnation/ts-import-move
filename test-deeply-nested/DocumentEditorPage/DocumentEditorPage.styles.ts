/**
 * DocumentEditorPage Styled Components
 * @module DocumentEditorPage.styles
 */

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const EditorContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr;
  gap: 1px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const TopBar = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 280px;
  min-width: 40px;
`;

export const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 600px;
  background: #ffffff;
  position: relative;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 320px;
  min-width: 40px;
`;

export const DocumentCanvas = styled(motion.div)`
  flex: 1;
  background: #ffffff;
  padding: 60px;
  overflow: auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 59px, rgba(220, 38, 127, 0.1) 60px, transparent 61px),
      linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 60px 24px;
    pointer-events: none;
  }
`;

export const DocumentContent = styled.div`
  background: white;
  min-height: 800px;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 1in;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  position: relative;
  z-index: 1;
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.6;
`;

export const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  h1 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const QuickAction = styled.button`
  height: 32px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
  }
  
  .status-text {
    font-size: 12px;
    color: #6b7280;
  }
`;

export const PanelContentWrapper = styled.div`
  padding: 12px;
  height: 100%;
  overflow-y: auto;
`;

export const DocumentOutlineItem = styled.div<{ active?: boolean }>`
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.active ? '#dbeafe' : '#f8fafc'};
  
  &:hover {
    background: ${props => props.active ? '#dbeafe' : '#f1f5f9'};
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

export const StatItem = styled.div`
  flex: 1;
  text-align: center;
  
  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .stat-label {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#f8fafc'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f1f5f9'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`; 