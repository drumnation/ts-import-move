/**
 * DocumentToolbar Component Styles
 * Styled components using @emotion/styled
 */
import styled from '@emotion/styled';
import type { ListButtonProps } from './DocumentToolbar.types';

// Main toolbar container
export const ToolbarContainer = styled.div<{ position: 'top' | 'floating'; visible: boolean }>`
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  ${props => props.position === 'top' && `
    position: sticky;
    top: 0;
    margin-bottom: 8px;
  `}
  
  ${props => props.position === 'floating' && `
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
  `}
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    padding: 10px 14px;
    gap: 10px;
    
    ${props => props.position === 'floating' && `
      position: fixed;
      bottom: 80px;
      top: auto;
      left: 16px;
      right: 16px;
      transform: none;
    `}
  }
`;

// Button group container
export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  
  &:not(:last-child) {
    border-right: 1px solid #e5e7eb;
    padding-right: 8px;
    margin-right: 4px;
  }
`;

// List button with variants
export const ListButton = styled.button<{ 
  active?: boolean; 
  disabled?: boolean; 
  size?: ListButtonProps['size'];
  $isMobile?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-weight: 500;
  
  /* Size variants with mobile optimization */
  ${props => {
    const sizes = props.$isMobile ? {
      sm: 'width: 36px; height: 36px; font-size: 14px;',
      md: 'width: 40px; height: 40px; font-size: 16px;',
      lg: 'width: 44px; height: 44px; font-size: 18px;'
    } : {
      sm: 'width: 28px; height: 28px; font-size: 12px;',
      md: 'width: 32px; height: 32px; font-size: 14px;',
      lg: 'width: 36px; height: 36px; font-size: 16px;'
    };
    return sizes[props.size || 'md'];
  }}
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
    border-color: ${props => props.active ? '#2563eb' : '#9ca3af'};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    background: #f9fafb;
    color: #9ca3af;
    transform: none;
  }
`;

// Indent control button
export const IndentButton = styled.button<{ 
  disabled?: boolean; 
  size?: ListButtonProps['size'];
  $isMobile?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  /* Size variants with mobile optimization */
  ${props => {
    const sizes = props.$isMobile ? {
      sm: 'width: 36px; height: 36px;',
      md: 'width: 40px; height: 40px;',
      lg: 'width: 44px; height: 44px;'
    } : {
      sm: 'width: 28px; height: 28px;',
      md: 'width: 32px; height: 32px;',
      lg: 'width: 36px; height: 36px;'
    };
    return sizes[props.size || 'md'];
  }}
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    background: #f9fafb;
    color: #9ca3af;
    transform: none;
  }
`;

// Toolbar label for accessibility
export const ToolbarLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-right: 8px;
  
  @media (max-width: 768px) {
    display: none; /* Hide labels on mobile to save space */
  }
`; 