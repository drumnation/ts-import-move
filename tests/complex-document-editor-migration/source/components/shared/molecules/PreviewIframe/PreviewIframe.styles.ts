import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PreviewContainer = styled(motion.div)`
  /* Container styling handled by motion.div props */
`;

export const PreviewBox = styled.div<{ $width: string | number; $height: string | number }>`
  position: relative;
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const ErrorOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
`; 