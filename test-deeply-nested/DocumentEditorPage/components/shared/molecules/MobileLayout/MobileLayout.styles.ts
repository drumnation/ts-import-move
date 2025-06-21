import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TouchTargetConfig } from './MobileLayout.types';

export const MobileContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
`;

export const TopToolbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 40;
`;

export const ToolbarButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  min-height: 56px;
  cursor: pointer;
  user-select: none;
  margin: 0 6px;
  
  .icon-container {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #f1f3f4;
    margin-bottom: 2px;
    transition: background-color 0.2s;
    
    &:hover {
      background: #e8eaed;
    }
    
    &.active {
      background: #3b82f6;
      color: white;
    }
  }
  
  .label {
    font-size: 10px;
    font-weight: 500;
    color: #6b7280;
    text-align: center;
    line-height: 1;
  }
`;

export const DocumentViewport = styled.div`
  flex: 1;
  background: #ffffff;
  overflow: auto;
  position: relative;
  margin-top: 60px;
  margin-bottom: 80px;
`;

export const BottomActionBar = styled(motion.div)<{ height: number; isHidden: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.height}px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transform: translateY(${props => props.isHidden ? '100%' : '0'});
  transition: transform 0.3s ease;
`;

export const BottomSheet = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 90vh;
  overflow: hidden;
`;

export const SheetHandle = styled.div<{ touchConfig: TouchTargetConfig }>`
  width: 60px;
  height: 8px;
  background: #d1d5db;
  border-radius: 4px;
  margin: ${props => props.touchConfig.spacing}px auto;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #9ca3af;
  }
`;

export const SheetHeader = styled.div<{ touchConfig: TouchTargetConfig }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.touchConfig.spacing}px 20px;
  border-bottom: 1px solid #e5e7eb;
  min-height: ${props => props.touchConfig.minSize}px;
`;

export const SheetContent = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
`;

export const SelectionContext = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin: 16px 0;
`;

export const ProgressOverlay = styled(motion.div)`
  position: fixed;
  top: 60px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 200;
`;

export const SwipeUpArea = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: transparent;
  z-index: 45;
  cursor: pointer;
`;

export const SwipeIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 90;
`;

export const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const TargetBox = styled.div`
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
`; 