/**
 * Button Atom
 * 
 * Atomic component for interactive buttons with consistent styling
 * Part of atomic design system - provides standardized button interactions
 * 
 * @module atoms/Button
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Icon to display before text */
  startIcon?: React.ReactNode;
  /** Icon to display after text */
  endIcon?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Custom className */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const StyledButton = styled(motion.button)<{
  variant: string;
  size: string;
  fullWidth: boolean;
  disabled: boolean;
  loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.size === 'small' ? '6px' : '8px'};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: ${props => props.disabled || props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Size variants */
  ${props => props.size === 'small' && `
    padding: 6px 12px;
    font-size: 14px;
    min-height: 32px;
  `}
  
  ${props => props.size === 'medium' && `
    padding: 8px 16px;
    font-size: 16px;
    min-height: 40px;
  `}
  
  ${props => props.size === 'large' && `
    padding: 12px 24px;
    font-size: 18px;
    min-height: 48px;
  `}
  
  /* Variant styles */
  ${props => props.variant === 'primary' && `
    background: #3b82f6;
    color: white;
    
    &:hover:not(:disabled) {
      background: #2563eb;
    }
    
    &:active:not(:disabled) {
      background: #1d4ed8;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: #6b7280;
    color: white;
    
    &:hover:not(:disabled) {
      background: #4b5563;
    }
    
    &:active:not(:disabled) {
      background: #374151;
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background: transparent;
    color: #3b82f6;
    border: 1px solid #3b82f6;
    
    &:hover:not(:disabled) {
      background: #3b82f6;
      color: white;
    }
    
    &:active:not(:disabled) {
      background: #2563eb;
    }
  `}
  
  ${props => props.variant === 'ghost' && `
    background: transparent;
    color: #6b7280;
    
    &:hover:not(:disabled) {
      background: #f3f4f6;
      color: #374151;
    }
    
    &:active:not(:disabled) {
      background: #e5e7eb;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #ef4444;
    color: white;
    
    &:hover:not(:disabled) {
      background: #dc2626;
    }
    
    &:active:not(:disabled) {
      background: #b91c1c;
    }
  `}
  
  /* Disabled state */
  ${props => (props.disabled || props.loading) && `
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const ButtonContent = styled.span<{ loading: boolean }>`
  display: flex;
  align-items: center;
  gap: inherit;
  opacity: ${props => props.loading ? 0 : 1};
  transition: opacity 0.2s ease;
`;

const LoadingSpinner = styled(motion.div)`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const spinAnimation = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

/**
 * Button atomic component
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
      type={type}
      className={className}
      aria-label={ariaLabel}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
    >
      {loading && (
        <LoadingSpinner
          animate={spinAnimation.animate}
          transition={spinAnimation.transition}
        />
      )}
      
      <ButtonContent loading={loading}>
        {startIcon && (
          <IconWrapper>
            {startIcon}
          </IconWrapper>
        )}
        
        {children}
        
        {endIcon && (
          <IconWrapper>
            {endIcon}
          </IconWrapper>
        )}
      </ButtonContent>
    </StyledButton>
  );
}; 