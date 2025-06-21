/**
 * LazyPanelLoader Component Styles
 * Styled components using @emotion/styled
 */
import styled from '@emotion/styled';

// Main container for the lazy panel loader
export const LazyPanelContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// Loading state container
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  gap: 1rem;
`;

// Error state container
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  gap: 1rem;
`;

// Retry button styling
export const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: #228be6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #1c7ed6;
  }

  &:active {
    background-color: #1971c2;
  }

  &:focus {
    outline: 2px solid #339af0;
    outline-offset: 2px;
  }
`;

// Loading text styling
export const LoadingText = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
  text-align: center;
`;

// Error text styling
export const ErrorText = styled.div`
  font-size: 0.875rem;
  color: #fa5252;
  text-align: center;
`; 