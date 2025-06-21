import type { QuickAction, ModelOption } from './agentControls.types';

/**
 * Quick actions configuration
 */
export const getQuickActions = (): QuickAction[] => [
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Summarize the selected section',
    icon: 'summary',
    instructionTemplate: 'Provide a concise summary of the selected section',
    requiredContext: ['selection'],
    category: 'content',
    estimatedTime: '30s'
  },
  {
    id: 'find-refs',
    label: 'Find Cross-Refs',
    description: 'Find cross-references',
    icon: 'link',
    instructionTemplate: 'Find all cross-references and citations related to the selected content',
    requiredContext: ['selection'],
    category: 'citation',
    estimatedTime: '45s'
  },
  {
    id: 'update-citations',
    label: 'Update Citations',
    description: 'Update and verify citations',
    icon: 'refresh',
    instructionTemplate: 'Update and verify all citations in the selected section',
    requiredContext: ['selection'],
    category: 'citation',
    estimatedTime: '60s'
  }
];

/**
 * Available AI models configuration
 */
export const getModelOptions = (): ModelOption[] => [
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'claude-3', label: 'Claude 3' }
];

/**
 * Validates if execution can proceed
 */
export const canExecuteInstruction = (instruction: string, isExecuting: boolean): boolean => {
  return instruction.trim().length > 0 && !isExecuting;
};

/**
 * Simulates agent execution progress
 */
export const createProgressSimulation = (
  onProgress: (progress: number) => void,
  duration: number = 2000
): { promise: Promise<void>; cleanup: () => void } => {
  let progressInterval: NodeJS.Timeout;
  let currentProgress = 0;
  
  const promise = new Promise<void>((resolve) => {
    onProgress(0);
    
    progressInterval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 10, 90);
      onProgress(currentProgress);
    }, duration / 10);

    setTimeout(() => {
      clearInterval(progressInterval);
      onProgress(100);
      resolve();
    }, duration);
  });

  const cleanup = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  };

  return { promise, cleanup };
};

/**
 * Generates simulated agent result
 */
export const generateSimulatedResult = (
  instruction: string,
  targetPath: string,
  selectedModel: string
): string => {
  return `[Agent Result]

Executed: "${instruction}"
Target: ${targetPath || 'Document'}
Model: ${selectedModel}

This is a simulated result. In a real implementation, this would contain the AI-generated content based on your instruction.`;
};

/**
 * Validates target path format
 */
export const isValidTargetPath = (path: string): boolean => {
  return path.length > 0 && path.trim() !== '';
};

/**
 * Gets display text for selected nodes count
 */
export const getSelectedNodesDisplayText = (count: number): string => {
  if (count === 0) return '';
  if (count === 1) return '1 selected';
  return `${count} selected`;
}; 