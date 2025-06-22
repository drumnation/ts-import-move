/**
 * SlotPanel Component
 * 
 * Slot-based panel system with location/slot API and platform-specific rendering
 * 
 * @module SlotPanel
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
import { BidirectionalResizer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/BidirectionalResizer/BidirectionalResizer';
import { useSlotPanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.hook';
import { 
  PanelContainer, 
  PanelHeader, 
  PanelContent, 
  MobileDragHandle 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.styles';
import type { SlotPanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel.types';

/**
 * Icon mapping for collapse/expand functionality
 */
const ICON_MAP = {
  'chevron-up': IconChevronUp,
  'chevron-down': IconChevronDown,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight
} as const;

export const SlotPanel: React.FC<SlotPanelProps> = ({
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
  } = useSlotPanel({
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
        {/* Mobile drag handle */}
        {isMobile && <MobileDragHandle />}
        
        {/* Panel header */}
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
              title={collapsed ? 'Expand' : 'Collapse'}
              style={{
                minWidth: iconConfig.minWidth,
                minHeight: iconConfig.minHeight
              }}
            >
              <CollapseIcon size={iconConfig.size} />
            </ActionIcon>
          </Group>
        </PanelHeader>
        
        {/* Panel content */}
        <PanelContent collapsed={collapsed} isMobile={isMobile}>
          {content}
        </PanelContent>
        
        {/* Bidirectional resizer */}
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