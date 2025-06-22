/**
 * VerticalResizer Atom
 * 
 * Atomic component for vertical panel resizing with drag interactions
 * Part of atomic design system - handles vertical split resizing
 * 
 * @module atoms/VerticalResizer
 */

import React, { useCallback, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { resizeTokens } from '@/tests/complex-document-editor-migration/source/components/shared/tokens/resize.tokens';

interface VerticalResizerProps {
  /** Resize handler - receives delta in pixels */
  onResize: (delta: number) => void;
  /** Minimum size constraint */
  minSize: number;
  /** Maximum size constraint */
  maxSize: number;
  /** Whether resizer is disabled */
  disabled?: boolean;
}

const ResizerContainer = styled(motion.div)<{ isActive: boolean; disabled: boolean }>`
  height: 4px;
  background: ${props => {
    if (props.disabled) return resizeTokens.visual.backgroundInactive;
    return props.isActive ? resizeTokens.border.active : resizeTokens.visual.backgroundInactive;
  }};
  cursor: ${props => props.disabled ? 'default' : 'ns-resize'};
  position: relative;
  z-index: 10;
  transition: background-color ${resizeTokens.interaction.transitionDuration} ease;
  opacity: ${props => props.isActive ? resizeTokens.interaction.dragOpacity : 1};
  
  /* Larger touch target */
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    right: 0;
    height: 12px;
  }
  
  &:hover {
    background: ${props => {
    if (props.disabled) return resizeTokens.visual.backgroundInactive;
    return resizeTokens.border.hover;
  }};
    opacity: ${props => props.disabled ? 1 : resizeTokens.interaction.hoverOpacity};
  }
  
  ${props => props.isActive && `
    height: 6px; /* Slightly thicker during drag */
  `}
`;

/**
 * VerticalResizer atomic component
 */
export const VerticalResizer: React.FC<VerticalResizerProps> = ({
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
    startPosRef.current = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startPosRef.current;
      startPosRef.current = moveEvent.clientY;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, onResize]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsResizing(true);
    const touch = e.touches[0];
    startPosRef.current = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      const delta = touch.clientY - startPosRef.current;
      startPosRef.current = touch.clientY;
      onResize(delta);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [disabled, onResize]);

  if (disabled) return null;

  return (
    <ResizerContainer
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