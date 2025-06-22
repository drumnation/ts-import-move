/**
 * LoadingSpinner Atom
 * 
 * Atomic component for loading states with customizable appearance
 * Part of atomic design system - provides consistent loading indicators
 * 
 * @module atoms/LoadingSpinner
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large';
  /** Color theme */
  color?: 'primary' | 'secondary' | 'neutral';
  /** Loading message */
  message?: string;
  /** Whether to show the message */
  showMessage?: boolean;
  /** Custom className */
  className?: string;
}

const SpinnerContainer = styled(motion.div)<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.size === 'small' ? '8px' : props.size === 'medium' ? '12px' : '16px'};
`;

const Spinner = styled(motion.div)<{ size: string; color: string }>`
  width: ${props => 
    props.size === 'small' ? '16px' : 
      props.size === 'medium' ? '24px' : '32px'
};
  height: ${props => 
    props.size === 'small' ? '16px' : 
      props.size === 'medium' ? '24px' : '32px'
};
  border: ${props => props.size === 'small' ? '2px' : '3px'} solid transparent;
  border-top-color: ${props => 
    props.color === 'primary' ? '#3b82f6' :
      props.color === 'secondary' ? '#10b981' : '#6b7280'
};
  border-radius: 50%;
`;

const LoadingMessage = styled(motion.span)<{ size: string; color: string }>`
  font-size: ${props => 
    props.size === 'small' ? '12px' : 
      props.size === 'medium' ? '14px' : '16px'
};
  color: ${props => 
    props.color === 'primary' ? '#3b82f6' :
      props.color === 'secondary' ? '#10b981' : '#6b7280'
};
  font-weight: 500;
  text-align: center;
`;

const spinAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.1, duration: 0.2 }
  },
};

/**
 * LoadingSpinner atomic component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message = 'Loading...',
  showMessage = true,
  className,
}) => {
  return (
    <SpinnerContainer
      size={size}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Spinner
        size={size}
        color={color}
        animate={spinAnimation.animate}
        transition={spinAnimation.transition}
      />
      {showMessage && (
        <LoadingMessage
          size={size}
          color={color}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
        >
          {message}
        </LoadingMessage>
      )}
    </SpinnerContainer>
  );
}; 