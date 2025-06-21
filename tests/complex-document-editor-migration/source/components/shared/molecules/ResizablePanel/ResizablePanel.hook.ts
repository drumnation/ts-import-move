import { useState, useRef, useCallback, useEffect } from 'react';
import type { ResizeState, PanelPosition } from './ResizablePanel.types';

interface UseResizablePanelParams {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  position: PanelPosition;
  isCollapsed: boolean;
  onWidthChange: (width: number) => void;
}

interface UseResizablePanelReturn {
  currentWidth: number;
  isDragging: boolean;
  panelRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export const useResizablePanel = ({
  initialWidth,
  minWidth,
  maxWidth,
  position,
  isCollapsed,
  onWidthChange
}: UseResizablePanelParams): UseResizablePanelReturn => {
  const [currentWidth, setCurrentWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isCollapsed) return;
    
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    
    e.preventDefault();
  }, [isCollapsed, currentWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = position === 'left' 
      ? e.clientX - startXRef.current
      : startXRef.current - e.clientX;
    
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, startWidthRef.current + deltaX)
    );
    
    setCurrentWidth(newWidth);
    onWidthChange(newWidth);
  }, [isDragging, position, minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    currentWidth,
    isDragging,
    panelRef,
    handleMouseDown
  };
}; 