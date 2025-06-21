/**
 * AssetPreview Component Styles
 * @module AssetPreview.styles
 */

import styled from '@emotion/styled';
import { Box, BoxProps } from '@mantine/core';
import type { AssetPreviewSizeVariant } from './AssetPreview.types';

interface PreviewContainerProps extends BoxProps {
  size: AssetPreviewSizeVariant;
  clickable: boolean;
  isDragging: boolean;
}

const getSizeDimensions = (size: AssetPreviewSizeVariant) => {
  const sizeMap = {
    small: { width: 80, height: 60 },
    medium: { width: 120, height: 90 },
    large: { width: 200, height: 150 }
  };
  return sizeMap[size];
};

export const PreviewContainer = styled(Box)<PreviewContainerProps>`
  width: ${({ size }) => getSizeDimensions(size).width}px;
  height: ${({ size }) => getSizeDimensions(size).height}px;
  position: relative;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  opacity: ${({ isDragging }) => (isDragging ? 0.7 : 1)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: ${({ clickable, isDragging }) => 
      clickable && !isDragging ? 0.9 : undefined};
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const IconContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SelectionIndicator = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const MetadataOverlay = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 8px;
  z-index: 1;
`;

export const ProcessingOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`; 