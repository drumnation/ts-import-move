/**
 * ResizablePanel Component
 * 
 * Handles drag-based panel resizing with touch support and rail collapse behavior.
 * Provides responsive panel management for desktop interfaces.
 * 
 * @module ResizablePanel
 */

import React from 'react';
import { usePlatformDetection } from '../../../layout/components/PlatformDetection';
import { useResizablePanel } from './ResizablePanel.hook';
import {
  PanelContainer,
  ResizeHandle,
  RailView,
  CollapseButton,
  RailButton
} from './ResizablePanel.styles';
import type { ResizablePanelProps } from './ResizablePanel.types';

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialWidth,
  minWidth = 240,
  maxWidth = 500,
  position,
  isCollapsed,
  onWidthChange,
  onToggleCollapse,
  railContent
}) => {
  const { touchTargetConfig, isMobile } = usePlatformDetection();
  
  const { currentWidth, isDragging, panelRef, handleMouseDown } = useResizablePanel({
    initialWidth,
    minWidth,
    maxWidth,
    position,
    isCollapsed,
    onWidthChange
  });

  // Mobile: Don't show resizable panels, use full-width drawers instead
  if (isMobile) {
    return null;
  }

  const renderCollapseButton = () => (
    <CollapseButton
      touchConfig={touchTargetConfig}
      onClick={onToggleCollapse}
      title="Collapse panel"
      aria-label={`Collapse ${position} panel`}
    >
      {position === 'left' ? '‹' : '›'}
    </CollapseButton>
  );

  const renderResizeHandle = () => (
    <ResizeHandle
      position={position}
      touchConfig={touchTargetConfig}
      isDragging={isDragging}
      onMouseDown={handleMouseDown}
      aria-label={`Resize ${position} panel`}
    />
  );

  const renderRailContent = () => {
    if (railContent) {
      return railContent;
    }

    return (
      <RailButton
        touchConfig={touchTargetConfig}
        onClick={onToggleCollapse}
        aria-label={`Expand ${position} panel`}
      >
        {position === 'left' ? '›' : '‹'}
      </RailButton>
    );
  };

  const renderExpandedPanel = () => (
    <>
      {renderResizeHandle()}
      {renderCollapseButton()}
      {children}
    </>
  );

  const renderCollapsedPanel = () => (
    <RailView 
      touchConfig={touchTargetConfig}
      onClick={onToggleCollapse}
      role="button"
      tabIndex={0}
      aria-label={`Expand ${position} panel`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleCollapse();
        }
      }}
    >
      {renderRailContent()}
    </RailView>
  );

  return (
    <PanelContainer
      ref={panelRef}
      position={position}
      isCollapsed={isCollapsed}
      initial={{ width: currentWidth }}
      animate={{ 
        width: isCollapsed ? 48 : currentWidth,
        opacity: 1 
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role="complementary"
      aria-label={`${position} panel`}
    >
      {isCollapsed ? renderCollapsedPanel() : renderExpandedPanel()}
    </PanelContainer>
  );
}; 