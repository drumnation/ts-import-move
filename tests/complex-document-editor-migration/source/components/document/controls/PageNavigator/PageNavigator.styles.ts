/**
 * PageNavigator Component Styles
 * 
 * Styled components using @emotion/styled
 * Platform-adaptive styles for web and mobile variants
 * 
 * @module PageNavigator.styles
 */

import styled from '@emotion/styled';
import { Box, Button, ActionIcon } from '@mantine/core';
import type { PageNavigatorStyleProps } from '@/tests/complex-document-editor-migration/source/components/document/controls/PageNavigator/PageNavigator.types';

/**
 * Base container for PageNavigator
 */
export const PageNavigatorContainer = styled(Box)<PageNavigatorStyleProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme === 'dark' ? '#2d2d30' : '#f8f9fa'};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme === 'dark' ? '#404040' : '#e9ecef'};
  
  ${({ variant }) => variant === 'web' && `
    flex-direction: row;
    justify-content: space-between;
    min-width: 200px;
  `}
  
  ${({ variant }) => variant === 'mobile' && `
    flex-direction: row;
    justify-content: center;
    width: 100%;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#ffffff'};
    border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#404040' : '#e9ecef'};
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
  `}
  
  ${({ size }) => size === 'small' && `
    padding: 4px;
    gap: 4px;
  `}
  
  ${({ size }) => size === 'large' && `
    padding: 12px;
    gap: 12px;
  `}
`;

/**
 * Web variant sidebar container
 */
export const PageNavigatorSidebar = styled(Box)<{ children?: React.ReactNode }>`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
`;

/**
 * Mobile variant bottom bar container
 */
export const PageNavigatorBottomBar = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-top: 1px solid #e9ecef;
  padding: 12px 16px;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
`;

/**
 * Page controls container
 */
export const PageControls = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/**
 * Page input field container
 */
export const PageInputContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 80px;
`;

/**
 * Styled page input
 */
export const PageInput = styled.input`
  width: 40px;
  padding: 4px 6px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #228be6;
    box-shadow: 0 0 0 1px #228be6;
  }
  
  &:invalid {
    border-color: #fa5252;
  }
`;

/**
 * Page display text
 */
export const PageDisplay = styled.span`
  font-size: 14px;
  color: #495057;
  white-space: nowrap;
  font-weight: 500;
`;

/**
 * Thumbnail grid container for web variant
 */
export const ThumbnailGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

/**
 * Individual thumbnail container
 */
export const ThumbnailContainer = styled(Box)<{ isActive?: boolean; isLoading?: boolean }>`
  position: relative;
  border: 2px solid ${({ isActive }) => isActive ? '#228be6' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ isLoading }) => isLoading ? '#f8f9fa' : 'transparent'};
  
  &:hover {
    border-color: ${({ isActive }) => isActive ? '#228be6' : '#ced4da'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  ${({ isLoading }) => isLoading && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid #e9ecef;
      border-top: 2px solid #228be6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `}
`;

/**
 * Thumbnail image
 */
export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 2px;
`;

/**
 * Thumbnail page number overlay
 */
export const ThumbnailPageNumber = styled(Box)`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
`;

/**
 * Navigation button styling
 */
export const NavigationButton = styled(ActionIcon)<{ disabled?: boolean }>`
  ${({ disabled }) => disabled && `
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
`;

/**
 * Page indicator dots for mobile
 */
export const PageIndicators = styled(Box)`
  display: flex;
  gap: 4px;
  align-items: center;
`;

/**
 * Individual page indicator dot
 */
export const PageIndicator = styled(Box)<{ isActive?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ isActive }) => isActive ? '#228be6' : '#ced4da'};
  transition: background-color 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ isActive }) => isActive ? '#1c7ed6' : '#adb5bd'};
  }
`;

/**
 * Error state container
 */
export const ErrorContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #fa5252;
  background-color: #fff5f5;
  border: 1px solid #ffc9c9;
  border-radius: 4px;
  text-align: center;
`;

/**
 * Loading state container
 */
export const LoadingContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #6c757d;
`;

/**
 * Compact mobile controls for small screens
 */
export const CompactControls = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`; 