import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const StyledProgressOverlay = styled(motion.div)`
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

export const ProgressContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProgressInfo = styled.div`
  flex: 1;
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

export const LoadingIcon = styled.div`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`; 