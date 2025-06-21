import { useState, useCallback } from 'react';
import type { QuickAction } from '../agentControls.types';
import { getModelOptions, canExecuteInstruction } from '../agentControls.logic';

interface UseAgentControlsProps {
  targetPath?: string;
  selectedModel?: string;
}

interface UseAgentControlsReturn {
  instruction: string;
  selectedModel: string;
  showAdvanced: boolean;
  modelOptions: { value: string; label: string }[];
  canExecute: boolean;
  setInstruction: (instruction: string) => void;
  setSelectedModel: (model: string) => void;
  setShowAdvanced: (show: boolean) => void;
  handleQuickActionSelect: (action: QuickAction) => void;
}

export const useAgentControls = ({
  targetPath = '',
  selectedModel: initialSelectedModel = 'claude-3.5-sonnet'
}: UseAgentControlsProps = {}): UseAgentControlsReturn => {
  const [instruction, setInstruction] = useState('');
  const [selectedModel, setSelectedModel] = useState(initialSelectedModel);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const modelOptions = getModelOptions();
  
  const canExecute = canExecuteInstruction(instruction, false);

  const handleQuickActionSelect = useCallback((action: QuickAction) => {
    setInstruction(action.instructionTemplate);
  }, []);

  return {
    instruction,
    selectedModel,
    showAdvanced,
    modelOptions,
    canExecute,
    setInstruction,
    setSelectedModel,
    setShowAdvanced,
    handleQuickActionSelect
  };
}; 