import { useState, useCallback } from 'react';
import { createProgressSimulation, generateSimulatedResult } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/agentControls.logic';

interface UseAgentExecutionProps {
  instruction: string;
  targetPath: string;
  selectedModel: string;
}

interface UseAgentExecutionReturn {
  isExecuting: boolean;
  executionProgress: number;
  currentResult: string | null;
  error: string | null;
  executeInstruction: () => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
}

export const useAgentExecution = ({
  instruction,
  targetPath,
  selectedModel
}: UseAgentExecutionProps): UseAgentExecutionReturn => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeInstruction = useCallback(async () => {
    if (!instruction.trim()) return;

    setIsExecuting(true);
    setExecutionProgress(0);
    setError(null);
    setCurrentResult(null);

    try {
      const { promise, cleanup } = createProgressSimulation(
        setExecutionProgress,
        2000
      );

      await promise;
      
      const result = generateSimulatedResult(instruction, targetPath, selectedModel);
      setCurrentResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, [instruction, targetPath, selectedModel]);

  const clearResult = useCallback(() => {
    setCurrentResult(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isExecuting,
    executionProgress,
    currentResult,
    error,
    executeInstruction,
    clearResult,
    clearError
  };
}; 