import styled from '@emotion/styled';
import { Box, Card, Group, Stack, ActionIcon } from '@mantine/core';
import { motion } from 'framer-motion';

/**
 * Main panel container
 */
export const AssetPanelContainer = styled(Box)<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f9fa;
  border-radius: ${({ isMobile }) => (isMobile ? '0' : '8px')};
  overflow: hidden;
`;

/**
 * Panel header with filters and actions
 */
export const AssetPanelHeader = styled(Group)<{ isMobile?: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '16px' : '12px')};
  border-bottom: 1px solid #e9ecef;
  background: #ffffff;
  flex-shrink: 0;
  
  .mantine-Group-root {
    gap: ${({ isMobile }) => (isMobile ? '12px' : '8px')};
  }
`;

/**
 * Search and filter bar
 */
export const FilterBar = styled(Stack)<{ expanded?: boolean }>`
  padding: ${({ expanded }) => (expanded ? '12px' : '0')};
  max-height: ${({ expanded }) => (expanded ? '200px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors?.gray?.[0] || '#f8f9fa'};
  border-bottom: ${({ expanded, theme }) => 
    expanded ? `1px solid ${theme.colors?.gray?.[2] || '#e9ecef'}` : 'none'};
`;

/**
 * Upload dropzone area
 */
export const UploadZone = styled(Box)<{ isDragOver?: boolean; isMobile?: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '24px 16px' : '20px 12px')};
  border: 2px dashed ${({ isDragOver, theme }) => 
    isDragOver ? theme.colors?.blue?.[5] || '#339af0' : theme.colors?.gray?.[3] || '#dee2e6'};
  border-radius: 8px;
  text-align: center;
  background: ${({ isDragOver, theme }) => 
    isDragOver ? theme.colors?.blue?.[0] || '#e7f5ff' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors?.blue?.[4] || '#4dabf7'};
    background: ${({ theme }) => theme.colors?.blue?.[0] || '#e7f5ff'};
  }
`;

/**
 * Asset grid container
 */
export const AssetGrid = styled(Box)<{ 
  viewMode: 'grid' | 'list';
  columns: number;
  isMobile?: boolean;
}>`
  display: ${({ viewMode }) => (viewMode === 'grid' ? 'grid' : 'flex')};
  flex-direction: ${({ viewMode }) => (viewMode === 'list' ? 'column' : 'unset')};
  grid-template-columns: ${({ viewMode, columns, isMobile }) => 
    viewMode === 'grid' 
      ? `repeat(${isMobile ? Math.min(columns, 2) : columns}, 1fr)` 
      : 'none'};
  gap: ${({ isMobile }) => (isMobile ? '12px' : '8px')};
  padding: ${({ isMobile }) => (isMobile ? '16px' : '12px')};
  overflow-y: auto;
  flex: 1;
`;

/**
 * Individual asset item
 */
export const AssetItem = styled(motion(Card))<{ 
  isSelected?: boolean;
  isDragged?: boolean;
  viewMode: 'grid' | 'list';
  isMobile?: boolean;
}>`
  cursor: pointer;
  position: relative;
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors?.blue?.[5] || '#339af0' : 'transparent'};
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors?.blue?.[0] || '#e7f5ff' : theme.colors?.white || '#ffffff'};
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
  transform: ${({ isSelected }) => (isSelected ? 'scale(0.98)' : 'scale(1)')};
  transition: all 0.2s ease;
  
  display: ${({ viewMode }) => (viewMode === 'list' ? 'flex' : 'block')};
  align-items: ${({ viewMode }) => (viewMode === 'list' ? 'center' : 'unset')};
  padding: ${({ viewMode, isMobile }) => {
    if (viewMode === 'list') return isMobile ? '12px' : '8px 12px';
    return isMobile ? '12px' : '8px';
  }};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors?.gray?.[3] || '#dee2e6'};
    transform: ${({ isSelected }) => (isSelected ? 'scale(0.98)' : 'scale(1.02)')};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

/**
 * Asset thumbnail container
 */
export const AssetThumbnail = styled(Box)<{ 
  size: number;
  viewMode: 'grid' | 'list';
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors?.gray?.[1] || '#f1f3f4'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ viewMode }) => (viewMode === 'list' ? '0 12px 0 0' : '0 auto 8px')};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: ${({ size }) => Math.min(size * 0.4, 24)}px;
    height: ${({ size }) => Math.min(size * 0.4, 24)}px;
    color: ${({ theme }) => theme.colors?.gray?.[5] || '#868e96'};
  }
`;

/**
 * Asset metadata container
 */
export const AssetMetadata = styled(Stack)<{ viewMode: 'grid' | 'list' }>`
  gap: ${({ viewMode }) => (viewMode === 'list' ? '4px' : '2px')};
  flex: ${({ viewMode }) => (viewMode === 'list' ? 1 : 'unset')};
  min-width: 0; // Allow text truncation
`;

/**
 * Asset name text
 */
export const AssetName = styled.div<{ isMobile?: boolean }>`
  font-size: ${({ isMobile }) => (isMobile ? '14px' : '12px')};
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.dark?.[7] || '#495057'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

/**
 * Asset details text
 */
export const AssetDetails = styled.div<{ isMobile?: boolean }>`
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '11px')};
  color: ${({ theme }) => theme.colors?.gray?.[6] || '#6c757d'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Asset actions overlay
 */
export const AssetActions = styled(Group)<{ visible?: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 4px;
  gap: 4px;
`;

/**
 * Upload progress overlay
 */
export const UploadProgress = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`;

/**
 * Selection checkbox
 */
export const SelectionCheckbox = styled.div<{ 
  isSelected?: boolean;
  isMobile?: boolean;
}>`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? '8px' : '6px')};
  left: ${({ isMobile }) => (isMobile ? '8px' : '6px')};
  width: ${({ isMobile }) => (isMobile ? '20px' : '16px')};
  height: ${({ isMobile }) => (isMobile ? '20px' : '16px')};
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors?.blue?.[5] || '#339af0' : theme.colors?.gray?.[4] || '#ced4da'};
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors?.blue?.[5] || '#339af0' : 'transparent'};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &::after {
    content: ${({ isSelected }) => (isSelected ? '"✓"' : '""')};
    color: white;
    font-size: ${({ isMobile }) => (isMobile ? '12px' : '10px')};
    font-weight: bold;
  }
`;

/**
 * Empty state container
 */
export const EmptyState = styled(Stack)`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors?.gray?.[6] || '#6c757d'};
`;

/**
 * Mobile fullscreen overlay
 */
export const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors?.white || '#ffffff'};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * Mobile header with back button
 */
export const MobileHeader = styled(Group)`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.gray?.[2] || '#e9ecef'};
  background: ${({ theme }) => theme.colors?.white || '#ffffff'};
  position: sticky;
  top: 0;
  z-index: 10;
`;

/**
 * Responsive action icon
 */
export const ResponsiveActionIcon = styled(ActionIcon)<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '44px' : '32px')};
  height: ${({ isMobile }) => (isMobile ? '44px' : '32px')};
  min-width: ${({ isMobile }) => (isMobile ? '44px' : '32px')};
  min-height: ${({ isMobile }) => (isMobile ? '44px' : '32px')};
`; 