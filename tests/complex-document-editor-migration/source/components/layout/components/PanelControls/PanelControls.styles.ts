/**
 * PanelControls Component Styles
 * Styled components using @emotion/styled
 */
import styled from '@emotion/styled';
import type { ControlButtonProps } from './PanelControls.types';

// Main container for panel controls
export const ControlsContainer = styled.div<{ position: 'bottom' | 'top' | 'left' | 'right' }>`
  position: fixed;
  ${props => {
    switch (props.position) {
      case 'bottom':
        return `
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'top':
        return `
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return `
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return `
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}
  
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  z-index: 1000;
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
    font-size: 14px;
  }
`;

// Control group container
export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

// Group label styling
export const GroupLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

// Control button with variants
export const ControlButton = styled.button<{ variant?: ControlButtonProps['variant'] }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          
          &:hover {
            background: #2563eb;
            border-color: #2563eb;
          }
          
          &:active {
            background: #1d4ed8;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          
          &:hover {
            background: #dc2626;
            border-color: #dc2626;
          }
          
          &:active {
            background: #b91c1c;
          }
        `;
      default:
        return `
          background: white;
          color: #374151;
          
          &:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          
          &:active {
            background: #e5e7eb;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: white;
      border-color: #d1d5db;
    }
  }
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    min-width: 70px;
  }
`; 