/**
 * PreviewDebugTabbedPanel Component
 * 
 * Tabbed panel that combines Instant Preview and AST Debug functionality
 * Addresses user confusion about AST JSON Debug by integrating it contextually
 * 
 * @module PreviewDebugTabbedPanel
 */

import React, { useState, useCallback } from 'react';
import { Tabs, Group, Text, Badge, ActionIcon } from '@mantine/core';
import { IconEye, IconCode, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { InstantPreviewPanel } from '../InstantPreviewPanel/InstantPreviewPanel';
import { ASTDebugPanel } from '../ASTDebugPanel/ASTDebugPanel';
import type { PreviewDebugTabbedPanelProps } from './PreviewDebugTabbedPanel.types';

/**
 * PreviewDebugTabbedPanel Component
 * 
 * Integrates InstantPreview and AST Debug panels into a tabbed interface
 * as specified in task 3B
 */
export const PreviewDebugTabbedPanel: React.FC<PreviewDebugTabbedPanelProps> = ({
  astData = [],
  title = 'Document Preview',
  expanded = true,
  isLoading = false,
  error = null,
  height = 400,
  maxHeight = 200,
  activeTab = 'preview',
  className,
  onToggleExpanded,
  onDownloadPdf,
  viewMode = 'json',
  hasContext = true,
  onViewModeChange,
  onRefresh,
  onTabChange
}) => {
  // Local state for active tab if not controlled
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  
  // Use controlled or local state
  const currentTab = onTabChange ? activeTab : localActiveTab;
  
  const handleTabChange = useCallback((tabId: string | null) => {
    const newTab = tabId as 'preview' | 'debug';
    if (onTabChange) {
      onTabChange(newTab);
    } else {
      setLocalActiveTab(newTab);
    }
  }, [onTabChange]);

  // Handle panel collapse/expand
  const handleToggle = useCallback(() => {
    onToggleExpanded?.();
  }, [onToggleExpanded]);

  if (!expanded) {
    return (
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb' }} className={className}>
        <Group gap="xs">
          <IconEye size={16} />
          <Text size="sm" fw={500}>Preview & Debug</Text>
          <Badge size="xs" variant="light">
            {astData?.length || 0} nodes
          </Badge>
        </Group>
        <ActionIcon variant="subtle" size="sm" onClick={handleToggle}>
          <IconChevronDown size={14} />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel Header */}
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <Group gap="xs">
          <IconEye size={16} />
          <Text size="sm" fw={500}>Preview & Debug</Text>
          <Badge size="xs" variant="light">
            {astData?.length || 0} nodes
          </Badge>
        </Group>
        
        <ActionIcon variant="subtle" size="sm" onClick={handleToggle}>
          <IconChevronUp size={14} />
        </ActionIcon>
      </Group>

      {/* Tabbed Content */}
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        <Tabs.List style={{ flexShrink: 0 }}>
          <Tabs.Tab value="preview" leftSection={<IconEye size={16} />}>
            Preview
          </Tabs.Tab>
          <Tabs.Tab value="debug" leftSection={<IconCode size={16} />}>
            AST Debug
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="preview" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <InstantPreviewPanel
            astData={astData}
            title={title}
            expanded={true} // Always expanded within tab
            onToggleExpanded={undefined} // Remove toggle since tabs handle this
            onDownloadPdf={onDownloadPdf}
            isLoading={isLoading}
            error={error}
            height={height}
          />
        </Tabs.Panel>

        <Tabs.Panel value="debug" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ASTDebugPanel
            astData={astData}
            viewMode={viewMode}
            expanded={true} // Always expanded within tab
            onToggleExpanded={undefined} // Remove toggle since tabs handle this
            isLoading={isLoading}
            error={error}
            onRefresh={onRefresh}
            maxHeight={maxHeight}
            hasContext={hasContext}
            onViewModeChange={onViewModeChange}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}; 