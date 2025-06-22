import { useState, useRef, useCallback, useEffect } from 'react';
import type { PanelResizeConfig } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';
import type { ResizePosition } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/BidirectionalResizer/BidirectionalResizer.types';
import { calculateNewSize, createResizePosition } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/BidirectionalResizer/BidirectionalResizer.logic';

export interface UseResizeHandlers {
  isResizing: boolean;
  isHovered: boolean;
  touchTargetSize: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  setIsHovered: (hovered: boolean) => void;
}

export const useResizeHandlers = (
  config: PanelResizeConfig,
  onResize: (newSize: number) => void,
  disabled: boolean,
  resizeType?: 'column' | 'split' | 'panel'
): UseResizeHandlers => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startPosRef = useRef<ResizePosition>({ x: 0, y: 0, size: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<number>(0);
  
  // Throttle resize updates to improve performance
  const throttledOnResize = useCallback((newSize: number) => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 8) { // ~120fps for more responsive feel
      lastUpdateRef.current = now;
      onResize(newSize);
    }
  }, [onResize]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsResizing(true);
    
    startPosRef.current = createResizePosition(
      event.clientX,
      event.clientY,
      config.currentSize
    );
  }, [disabled, config.currentSize]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsResizing(true);
    
    const touch = event.touches[0];
    startPosRef.current = createResizePosition(
      touch.clientX,
      touch.clientY,
      config.currentSize
    );
  }, [disabled, config.currentSize]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isResizing) return;
    
    const newSize = calculateNewSize(
      config,
      startPosRef.current,
      event.clientX,
      event.clientY,
      resizeType
    );
    throttledOnResize(newSize);
  }, [isResizing, config, throttledOnResize, resizeType]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isResizing) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const newSize = calculateNewSize(
      config,
      startPosRef.current,
      touch.clientX,
      touch.clientY,
      resizeType
    );
    throttledOnResize(newSize);
  }, [isResizing, config, throttledOnResize, resizeType]);

  const handleEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Mouse events
  useEffect(() => {
    if (!isResizing) return;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isResizing, handleMouseMove, handleEnd]);

  // Touch events
  useEffect(() => {
    if (!isResizing) return;
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, handleTouchMove, handleEnd]);

  return {
    isResizing,
    isHovered,
    touchTargetSize: 16,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    setIsHovered
  };
}; 