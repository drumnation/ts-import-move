import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TouchTargetConfig } from './BottomSheet.types';

export const BottomSheet = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const SheetHandle = styled.div<{ touchConfig: TouchTargetConfig }>`
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 12px auto 8px;
  cursor: pointer;
  min-height: ${props => props.touchConfig.minSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #bbb;
  }
`;

export const SheetHeader = styled.div<{ touchConfig: TouchTargetConfig }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 16px;
  border-bottom: 1px solid #eee;
  min-height: ${props => props.touchConfig.minSize}px;
`;

export const SheetTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const SheetContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`; 