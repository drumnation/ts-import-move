/**
 * ErrorDisplay Atom
 * 
 * Atomic component for displaying error states with consistent styling
 * Part of atomic design system - provides standardized error feedback
 * 
 * @module atoms/ErrorDisplay
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  /** Error message to display */
  message: string;
  /** Error type for styling */
  type?: 'error' | 'warning' | 'info';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Retry handler */
  onRetry?: () => void;
  /** Whether to show details toggle */
  showDetails?: boolean;
  /** Detailed error information */
  details?: string;
  /** Custom className */
  className?: string;
}

const ErrorContainer = styled(motion.div)<{ type: string; size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => 
    props.size === 'small' ? '12px' : 
      props.size === 'medium' ? '16px' : '24px'
};
  border-radius: 8px;
  background: ${props => 
    props.type === 'error' ? '#fef2f2' :
      props.type === 'warning' ? '#fffbeb' : '#eff6ff'
};
  border: 1px solid ${props => 
    props.type === 'error' ? '#fecaca' :
      props.type === 'warning' ? '#fed7aa' : '#bfdbfe'
};
  gap: ${props => props.size === 'small' ? '8px' : '12px'};
  max-width: 400px;
  text-align: center;
`;

const ErrorIcon = styled(motion.div)<{ type: string; size: string }>`
  width: ${props => 
    props.size === 'small' ? '20px' : 
      props.size === 'medium' ? '24px' : '32px'
};
  height: ${props => 
    props.size === 'small' ? '20px' : 
      props.size === 'medium' ? '24px' : '32px'
};
  border-radius: 50%;
  background: ${props => 
    props.type === 'error' ? '#ef4444' :
      props.type === 'warning' ? '#f59e0b' : '#3b82f6'
};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${props => 
    props.size === 'small' ? '12px' : 
      props.size === 'medium' ? '14px' : '18px'
};
`;

const ErrorMessage = styled(motion.p)<{ size: string }>`
  margin: 0;
  font-size: ${props => 
    props.size === 'small' ? '14px' : 
      props.size === 'medium' ? '16px' : '18px'
};
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
`;

const ErrorDetails = styled(motion.div)<{ size: string }>`
  font-size: ${props => 
    props.size === 'small' ? '12px' : '14px'
};
  color: #6b7280;
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  white-space: pre-wrap;
  max-width: 100%;
  overflow-x: auto;
`;

const ActionButton = styled(motion.button)<{ variant: string; size: string }>`
  padding: ${props => 
    props.size === 'small' ? '6px 12px' : '8px 16px'
};
  font-size: ${props => 
    props.size === 'small' ? '12px' : '14px'
};
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'retry' && `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `}
  
  ${props => props.variant === 'details' && `
    background: transparent;
    color: #6b7280;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      color: #374151;
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { delay: 0.1, duration: 0.2, type: 'spring' }
  },
};

const detailsVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.2 }
  },
};

/**
 * ErrorDisplay atomic component
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  type = 'error',
  size = 'medium',
  showRetry = false,
  onRetry,
  showDetails = false,
  details,
  className,
}) => {
  const [showDetailedInfo, setShowDetailedInfo] = React.useState(false);

  const getIconSymbol = () => {
    switch (type) {
    case 'error': return '!';
    case 'warning': return '⚠';
    case 'info': return 'i';
    default: return '!';
    }
  };

  return (
    <ErrorContainer
      type={type}
      size={size}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ErrorIcon
        type={type}
        size={size}
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        {getIconSymbol()}
      </ErrorIcon>
      
      <ErrorMessage size={size}>
        {message}
      </ErrorMessage>

      {(showRetry || showDetails) && (
        <ButtonGroup>
          {showRetry && onRetry && (
            <ActionButton
              variant="retry"
              size={size}
              onClick={onRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </ActionButton>
          )}
          
          {showDetails && details && (
            <ActionButton
              variant="details"
              size={size}
              onClick={() => setShowDetailedInfo(!showDetailedInfo)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showDetailedInfo ? 'Hide Details' : 'Show Details'}
            </ActionButton>
          )}
        </ButtonGroup>
      )}

      {showDetailedInfo && details && (
        <ErrorDetails
          size={size}
          variants={detailsVariants}
          initial="hidden"
          animate="visible"
        >
          {details}
        </ErrorDetails>
      )}
    </ErrorContainer>
  );
}; 