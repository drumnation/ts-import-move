/**
 * HorizontalResizer Atom
 * 
 * Atomic component for horizontal panel resizing with drag interactions
 * Part of atomic design system - handles horizontal panel width resizing
 * 
 * @module atoms/HorizontalResizer
 */

import React, { useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { resizeTokens } from '../tokens/resize.tokens';

interface HorizontalResizerProps {
  /** Position of resizer relative to panel */
  position: 'left' | 'right';
  /** Resize handler - receives delta in pixels */
  onResize: (delta: number) => void;
  /** Minimum size constraint */
  minSize: number;
  /** Maximum size constraint */
  maxSize: number;
  /** Whether resizer is disabled */
  disabled?: boolean;
}

const ResizerContainer = styled(motion.div)<{ 
  position: 'left' | 'right';
  isActive: boolean; 
  disabled: boolean;
}>`
  position: absolute;
  top: 0;
  ${props => props.position}: -6px;
  width: 6px;
  height: 100%;
  background: ${props => {
    if (props.disabled) return resizeTokens.visual.backgroundInactive;
    return props.isActive ? resizeTokens.border.active : resizeTokens.visual.backgroundInactive;
  }};
  cursor: ${props => props.disabled ? 'default' : 'ew-resize'};
  z-index: 20;
  transition: background-color ${resizeTokens.interaction.transitionDuration} ease;
  opacity: ${props => props.isActive ? resizeTokens.interaction.dragOpacity : 1};
  
  /* Larger touch target */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    ${props => props.position === 'right' ? 'left: -6px' : 'right: -6px'};
    width: ${resizeTokens.sizing.touchTarget};
    height: 100%;
  }
  
  &:hover {
    background: ${props => {
    if (props.disabled) return resizeTokens.visual.backgroundInactive;
    return resizeTokens.border.hover;
  }};
    opacity: ${props => props.disabled ? 1 : resizeTokens.interaction.hoverOpacity};
  }
  
  ${props => props.isActive && `
    width: 8px; /* Slightly thicker during drag */
  `}
`;

/**
 * HorizontalResizer atomic component
 */
export const HorizontalResizer: React.FC<HorizontalResizerProps> = ({
  position,
  onResize,
  minSize,
  maxSize,
  disabled = false,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startPosRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsResizing(true);
    startPosRef.current = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let delta = moveEvent.clientX - startPosRef.current;
      
      // Invert delta for left position
      if (position === 'left') {
        delta = -delta;
      }
      
      startPosRef.current = moveEvent.clientX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, onResize, position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsResizing(true);
    const touch = e.touches[0];
    startPosRef.current = touch.clientX;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      let delta = touch.clientX - startPosRef.current;
      
      // Invert delta for left position
      if (position === 'left') {
        delta = -delta;
      }
      
      startPosRef.current = touch.clientX;
      onResize(delta);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [disabled, onResize, position]);

  if (disabled) return null;

  return (
    <ResizerContainer
      position={position}
      isActive={isResizing || isHovered}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
}; 