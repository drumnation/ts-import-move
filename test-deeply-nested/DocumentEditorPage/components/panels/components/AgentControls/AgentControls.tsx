/**
 * Agent Controls Panel Component
 * @module AgentControls
 */

import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { AgentControlsProps } from './agentControls.types';
import { useAgentControls, useAgentExecution, useQuickActions } from './hooks';
import { MobileLayout } from './components/MobileLayout';
import { DesktopLayout } from './components/DesktopLayout';

export const AgentControls: React.FC<AgentControlsProps> = ({
  selectedNodes = [],
  targetPath = '',
  expanded = false,
  onToggleExpansion
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const agentControls = useAgentControls({
    targetPath,
    selectedModel: 'claude-3.5-sonnet'
  });

  const agentExecution = useAgentExecution({
    instruction: agentControls.instruction,
    targetPath,
    selectedModel: agentControls.selectedModel
  });

  const quickActionsHook = useQuickActions({
    onActionSelect: agentControls.handleQuickActionSelect
  });

  const layoutProps = {
    selectedNodes,
    targetPath,
    expanded,
    onToggleExpansion,
    models: agentControls.modelOptions,
    handleExecute: agentExecution.executeInstruction,
    ...agentControls,
    ...agentExecution,
    ...quickActionsHook
  };

  if (isMobile) {
    return <MobileLayout {...layoutProps} />;
  }

  return <DesktopLayout {...layoutProps} />;
}; 