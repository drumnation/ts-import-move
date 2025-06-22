import { useCallback } from 'react';
import type { QuickAction } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/agentControls.types';
import { getQuickActions } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/agentControls.logic';

interface UseQuickActionsProps {
  onActionSelect: (action: QuickAction) => void;
}

interface UseQuickActionsReturn {
  quickActions: QuickAction[];
  handleQuickAction: (action: QuickAction) => void;
}

export const useQuickActions = ({
  onActionSelect
}: UseQuickActionsProps): UseQuickActionsReturn => {
  const quickActions = getQuickActions();

  const handleQuickAction = useCallback((action: QuickAction) => {
    onActionSelect(action);
  }, [onActionSelect]);

  return {
    quickActions,
    handleQuickAction
  };
}; 