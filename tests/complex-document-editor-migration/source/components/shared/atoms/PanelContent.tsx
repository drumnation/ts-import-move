/**
 * PanelContent Atom
 * 
 * Base content container for all panels
 * Handles scrolling, padding, and platform-adaptive behavior
 * 
 * @module atoms/PanelContent
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { usePlatformDetection } from '@/tests/complex-document-editor-migration/source/components/shared/layout/platform';

const ContentContainer = styled(motion.div)<{
  platform: 'desktop' | 'mobile' | 'tablet';
  variant?: 'default' | 'compact' | 'spacious';
  hasScrollbar?: boolean;
  isCollapsed?: boolean;
}>`
  flex: 1;
  overflow: ${props => props.hasScrollbar ? 'auto' : 'hidden'};
  background: #ffffff;
  position: relative;
  
  /* Platform-specific padding */
  padding: ${props => {
    if (props.variant === 'compact') {
      return props.platform === 'mobile' ? '8px 12px' : '12px 16px';
    }
    if (props.variant === 'spacious') {
      return props.platform === 'mobile' ? '20px 16px' : '24px 20px';
    }
    return props.platform === 'mobile' ? '16px' : '20px';
  }};
  
  /* Collapsed state */
  ${props => props.isCollapsed && `
    display: none;
  `}
  
  /* Custom scrollbar styling */
  ${props => props.hasScrollbar && `
    &::-webkit-scrollbar {
      width: ${props.platform === 'mobile' ? '4px' : '6px'};
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
      
      &:hover {
        background: #94a3b8;
      }
    }
    
    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  `}
`;

const ContentWrapper = styled.div<{
  maxHeight?: string;
  minHeight?: string;
}>`
  width: 100%;
  height: 100%;
  
  ${props => props.maxHeight && `max-height: ${props.maxHeight};`}
  ${props => props.minHeight && `min-height: ${props.minHeight};`}
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
`;

const EmptyState = styled.div<{ platform: 'desktop' | 'mobile' | 'tablet' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: ${props => props.platform === 'mobile' ? '120px' : '160px'};
  text-align: center;
  color: #64748b;
  
  svg {
    width: ${props => props.platform === 'mobile' ? '32px' : '48px'};
    height: ${props => props.platform === 'mobile' ? '32px' : '48px'};
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  h4 {
    margin: 0 0 8px 0;
    font-size: ${props => props.platform === 'mobile' ? '14px' : '16px'};
    font-weight: 500;
    color: #475569;
  }
  
  p {
    margin: 0;
    font-size: ${props => props.platform === 'mobile' ? '12px' : '14px'};
    line-height: 1.4;
  }
`;

const ErrorState = styled.div<{ platform: 'desktop' | 'mobile' | 'tablet' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: ${props => props.platform === 'mobile' ? '120px' : '160px'};
  text-align: center;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 8px;
  padding: 20px;
  
  svg {
    width: ${props => props.platform === 'mobile' ? '32px' : '48px'};
    height: ${props => props.platform === 'mobile' ? '32px' : '48px'};
    margin-bottom: 12px;
  }
  
  h4 {
    margin: 0 0 8px 0;
    font-size: ${props => props.platform === 'mobile' ? '14px' : '16px'};
    font-weight: 500;
  }
  
  p {
    margin: 0 0 16px 0;
    font-size: ${props => props.platform === 'mobile' ? '12px' : '14px'};
    line-height: 1.4;
  }
  
  button {
    padding: 8px 16px;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
      background: #b91c1c;
    }
  }
`;

export interface PanelContentProps {
  /** Content to display */
  children?: React.ReactNode;
  /** Content variant */
  variant?: 'default' | 'compact' | 'spacious';
  /** Whether to show scrollbar */
  hasScrollbar?: boolean;
  /** Whether content is collapsed */
  isCollapsed?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Empty state configuration */
  emptyState?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  };
  /** Maximum height constraint */
  maxHeight?: string;
  /** Minimum height constraint */
  minHeight?: string;
  /** Additional CSS class */
  className?: string;
  /** Scroll event handler */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  /** Retry handler for error state */
  onRetry?: () => void;
}

/**
 * PanelContent component
 * Consistent content container for all panel types
 */
export const PanelContent: React.FC<PanelContentProps> = ({
  children,
  variant = 'default',
  hasScrollbar = true,
  isCollapsed = false,
  isLoading = false,
  error = null,
  emptyState,
  maxHeight,
  minHeight,
  className,
  onScroll,
  onRetry,
}) => {
  const { platform } = usePlatformDetection();

  const isEmpty = !children && !isLoading && !error;

  return (
    <ContentContainer
      platform={platform}
      variant={variant}
      hasScrollbar={hasScrollbar}
      isCollapsed={isCollapsed}
      className={className}
      onScroll={onScroll}
      initial={{ opacity: 0 }}
      animate={{ opacity: isCollapsed ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <ContentWrapper maxHeight={maxHeight} minHeight={minHeight}>
        {/* Loading State */}
        {isLoading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </LoadingOverlay>
        )}

        {/* Error State */}
        {error && (
          <ErrorState platform={platform}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h4>Something went wrong</h4>
            <p>{error}</p>
            {onRetry && (
              <button onClick={onRetry}>
                Try Again
              </button>
            )}
          </ErrorState>
        )}

        {/* Empty State */}
        {isEmpty && emptyState && (
          <EmptyState platform={platform}>
            {emptyState.icon || (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            )}
            <h4>{emptyState.title || 'No content'}</h4>
            <p>{emptyState.description || 'There is nothing to display here yet.'}</p>
          </EmptyState>
        )}

        {/* Content */}
        {!isLoading && !error && children}
      </ContentWrapper>
    </ContentContainer>
  );
}; 