/**
 * Agent Controls Panel Component
 * @module AgentControls
 */

import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { AgentControlsProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/agentControls.types';
import { useAgentControls, useAgentExecution, useQuickActions } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/hooks';
import { MobileLayout } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/MobileLayout';
import { DesktopLayout } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/DesktopLayout';

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