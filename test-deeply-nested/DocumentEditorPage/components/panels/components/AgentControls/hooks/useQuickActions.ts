import { useCallback } from 'react';
import type { QuickAction } from '../agentControls.types';
import { getQuickActions } from '../agentControls.logic';

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