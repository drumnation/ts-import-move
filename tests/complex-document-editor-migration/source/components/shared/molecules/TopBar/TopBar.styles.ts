/**
 * TopBar Styled Components
 * @module TopBar.styles
 */

import styled from '@emotion/styled';

export const TopBarContainer = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px; /* Increased for mobile touch targets */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 16px;

  /* Desktop styles */
  @media (min-width: 768px) {
    padding: 8px 16px;
    min-height: 48px;
  }
`;

export const TitleBarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  overflow: hidden;
  
  h1 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0; /* Allow text to shrink */
  }

  /* Desktop styles */
  @media (min-width: 768px) {
    gap: 16px;
    justify-content: flex-start;
    
    h1 {
      font-size: 18px;
    }
  }
`;

export const ActionBarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  /* Ensure touch targets are at least 44px on mobile */
  .mantine-ActionIcon-root {
    min-width: 44px;
    min-height: 44px;
  }

  /* Desktop styles */
  @media (min-width: 768px) {
    .mantine-ActionIcon-root {
      min-width: auto;
      min-height: auto;
    }
  }
`;

export const StatusIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  /* Hidden on mobile to save space */
  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 8px;
  }
`;

export const StatusDot = styled.div<{ status: 'ready' | 'saving' | 'error' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${props => {
    switch (props.status) {
      case 'ready': return '#10b981';
      case 'saving': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

export const StatusText = styled.span`
  font-size: 11px;
  color: #6b7280;
  text-transform: capitalize;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

export const MobileActionsMenu = styled.div`
  /* Reserved for future mobile dropdown menu implementation */
  display: none;
`; 