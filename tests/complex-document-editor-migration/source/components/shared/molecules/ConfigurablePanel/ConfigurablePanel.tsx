/**
 * ConfigurablePanel Component
 * 
 * A highly configurable panel system with collapse/expand, resize, and cross-platform support.
 * Provides a consistent interface for all editor panels with customizable behavior.
 * 
 * Previously: SlotPanel (renamed for better AI agent discoverability)
 * 
 * @module ConfigurablePanel
 */

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Group, Text, ActionIcon } from '@mantine/core';
import { 
  IconChevronUp, 
  IconChevronDown, 
  IconChevronLeft, 
  IconChevronRight
} from '@tabler/icons-react';
import { BidirectionalResizer } from '@/pages/DocumentEditorPage/components/shared/molecules/BidirectionalResizer/BidirectionalResizer';
import { useConfigurablePanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ConfigurablePanel/ConfigurablePanel.hook';
import { 
  PanelContainer, 
  PanelHeader, 
  PanelContent, 
  MobileDragHandle 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ConfigurablePanel/ConfigurablePanel.styles';
import type { ConfigurablePanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/ConfigurablePanel/ConfigurablePanel.types';

/**
 * Icon mapping for collapse/expand functionality
 */
const ICON_MAP = {
  'chevron-up': IconChevronUp,
  'chevron-down': IconChevronDown,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight
} as const;

/**
 * ConfigurablePanel - A flexible, cross-platform panel component
 * 
 * Features:
 * - Collapse/expand functionality
 * - Resize capability with constraints
 * - Mobile-responsive with touch targets
 * - Platform-specific optimizations
 */
export const ConfigurablePanel: React.FC<ConfigurablePanelProps> = ({
  location,
  slot,
  title,
  content,
  collapsed = false,
  visible = true,
  size,
  resizable = true,
  resizeConfig,
  onResize,
  onToggle,
  onClose,
  onSplit,
  className
}) => {
  const {
    isMobile,
    touchTargetConfig,
    handleToggle,
    handleResize,
    collapseIconType,
    resizerDirection,
    iconConfig,
    animationConfig
  } = useConfigurablePanel({
    location,
    slot,
    collapsed,
    onToggle,
    onResize
  });

  if (!visible) return null;

  const CollapseIcon = ICON_MAP[collapseIconType];

  return (
    <AnimatePresence>
      <PanelContainer
        location={location}
        slot={slot}
        collapsed={collapsed}
        size={size}
        isMobile={isMobile}
        className={className}
        {...animationConfig}
      >
        {/* Mobile drag handle for touch interactions */}
        {isMobile && <MobileDragHandle />}
        
        {/* Panel header with controls */}
        <PanelHeader collapsed={collapsed} isMobile={isMobile}>
          <Text 
            size={isMobile ? 'lg' : collapsed ? 'xs' : 'sm'} 
            fw={600}
            c="gray.7"
            truncate={!collapsed}
          >
            {title}
          </Text>
          
          <Group gap={touchTargetConfig.spacing / 2}>
            {/* Collapse/expand control - the only button needed */}
            <ActionIcon
              variant="subtle"
              size={isMobile ? 'lg' : 'sm'}
              onClick={handleToggle}
              title={collapsed ? 'Expand Panel' : 'Collapse Panel'}
              style={{
                minWidth: iconConfig.minWidth,
                minHeight: iconConfig.minHeight
              }}
            >
              <CollapseIcon size={iconConfig.size} />
            </ActionIcon>
          </Group>
        </PanelHeader>
        
        {/* Panel content area */}
        <PanelContent collapsed={collapsed} isMobile={isMobile}>
          {content}
        </PanelContent>
        
        {/* Resize handle (desktop only, when not collapsed) */}
        {resizable && !collapsed && !isMobile && resizeConfig && (
          <BidirectionalResizer
            config={{
              ...resizeConfig,
              direction: resizerDirection,
              currentSize: size
            }}
            onResize={handleResize}
          />
        )}
      </PanelContainer>
    </AnimatePresence>
  );
};

// Legacy export for backward compatibility during transition
export { ConfigurablePanel as SlotPanel }; 