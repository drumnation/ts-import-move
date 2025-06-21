/**
 * FormattingToolbar Styled Components
 * 
 * @emotion/styled components for text formatting toolbar
 * Platform-adaptive styling with mobile-first design
 * 
 * @module FormattingToolbar.styles
 */

import styled from '@emotion/styled';
import { ActionIcon } from '@mantine/core';

interface ToolbarContainerProps {
  $orientation: 'horizontal' | 'vertical';
  $isMobile: boolean;
}

interface FormatButtonProps {
  $active: boolean;
  $size: 'sm' | 'md' | 'lg';
  $isMobile: boolean;
}

interface ButtonGroupProps {
  $orientation: 'horizontal' | 'vertical';
  $spacing: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Main toolbar container with responsive layout
 */
export const ToolbarContainer = styled.div<ToolbarContainerProps>`
  display: flex;
  flex-direction: ${props => props.$orientation === 'vertical' ? 'column' : 'row'};
  align-items: center;
  gap: ${props => props.$isMobile ? '12px' : '8px'};
  padding: ${props => props.$isMobile ? '12px' : '8px'};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #e9ecef;
  border-radius: ${props => props.$isMobile ? '12px' : '8px'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* Mobile-first responsive sizing */
  ${props => props.$isMobile ? `
    min-height: 56px;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  ` : `
    min-height: 40px;
  `}
  
  /* Desktop enhancements */
  @media (min-width: 768px) {
    ${props => !props.$isMobile && `
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `}
  }
`;

/**
 * Individual format button with active state
 */
export const FormatButton = styled(ActionIcon)<FormatButtonProps>`
  position: relative;
  transition: all 0.2s ease;
  
  /* Size variants with mobile-first approach */
  ${props => {
    const sizes = {
      sm: props.$isMobile ? '40px' : '28px',
      md: props.$isMobile ? '48px' : '32px', 
      lg: props.$isMobile ? '56px' : '36px',
    };
    return `
      width: ${sizes[props.$size]};
      height: ${sizes[props.$size]};
      min-width: ${sizes[props.$size]};
      min-height: ${sizes[props.$size]};
    `;
  }}
  
  /* Active state styling */
  ${props => props.$active && `
    background-color: #339af0 !important;
    color: white !important;
    
    &:hover {
      background-color: #228be6 !important;
    }
  `}
  
  /* Touch-optimized mobile interactions */
  ${props => props.$isMobile && `
    border-radius: 12px;
    
    &:active {
      transform: scale(0.95);
    }
  `}
  
  /* Desktop hover enhancements */
  @media (min-width: 768px) {
    ${props => !props.$isMobile && `
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    `}
  }
`;

/**
 * Button group container for organizing related buttons
 */
export const ButtonGroup = styled.div<ButtonGroupProps>`
  display: flex;
  flex-direction: ${props => props.$orientation === 'vertical' ? 'column' : 'row'};
  align-items: center;
  
  ${props => {
    const spacing = {
      xs: '4px',
      sm: '6px', 
      md: '8px',
      lg: '12px',
    };
    return `gap: ${spacing[props.$spacing]};`;
  }}
  
  /* Grouped button styling */
  ${FormatButton}:first-of-type {
    ${props => props.$orientation === 'horizontal' ? `
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    ` : `
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `}
  }
  
  ${FormatButton}:last-of-type {
    ${props => props.$orientation === 'horizontal' ? `
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    ` : `
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}
  }
  
  ${FormatButton}:not(:first-of-type):not(:last-of-type) {
    border-radius: 0;
  }
`;

/**
 * Separator between button groups
 */
export const ButtonSeparator = styled.div<{ $isMobile: boolean }>`
  width: ${props => props.$isMobile ? '2px' : '1px'};
  height: ${props => props.$isMobile ? '32px' : '24px'};
  background-color: #e9ecef;
  border-radius: 1px;
  margin: 0 ${props => props.$isMobile ? '8px' : '4px'};
`;

/**
 * Heading level selector styled as button
 */
export const HeadingSelector = styled.button<{ $active: boolean; $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${props => props.$isMobile ? '12px 16px' : '8px 12px'};
  background: ${props => props.$active ? '#339af0' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#495057'};
  border: 1px solid ${props => props.$active ? '#339af0' : '#e9ecef'};
  border-radius: ${props => props.$isMobile ? '12px' : '6px'};
  font-size: ${props => props.$isMobile ? '14px' : '12px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Minimum touch target size on mobile */
  ${props => props.$isMobile && `
    min-height: 44px;
    min-width: 44px;
  `}
  
  &:hover {
    background: ${props => props.$active ? '#228be6' : '#f8f9fa'};
    border-color: ${props => props.$active ? '#228be6' : '#dee2e6'};
  }
  
  &:active {
    transform: ${props => props.$isMobile ? 'scale(0.95)' : 'translateY(1px)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

/**
 * Tooltip-style shortcut display
 */
export const ShortcutText = styled.span<{ $isMobile: boolean }>`
  font-size: ${props => props.$isMobile ? '10px' : '9px'};
  color: #868e96;
  margin-left: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  
  /* Hide shortcuts on mobile to save space */
  ${props => props.$isMobile && `
    display: none;
  `}
`; 