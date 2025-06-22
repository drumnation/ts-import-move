import { useState, useCallback, useRef, useMemo } from 'react';
import { 
  IconFileText, 
  IconSearch, 
  IconEdit 
} from '@tabler/icons-react';
import { 
  SheetType, 
  ExecutionState, 
  RecentInstruction, 
  DocumentNode,
  QuickAction
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/MobileLayout.types';
import {
  QUICK_ACTION_DEFINITIONS,
  getAvailableQuickActionDefinitions,
  createRecentInstruction,
  updateRecentInstructions,
  shouldShowLinkedNodesWarning,
  PROGRESS_STEPS,
  createProgressMessage
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/MobileLayout.logic';

interface UseMobileLayoutProps {
  selectedNode?: DocumentNode;
  onExecuteAgent?: (instruction: string, targetNode?: DocumentNode) => Promise<void>;
  onNodeSelect?: (node: DocumentNode | null) => void;
}

export const useMobileLayout = ({
  selectedNode,
  onExecuteAgent,
  onNodeSelect
}: UseMobileLayoutProps) => {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [isLightweightMode, setIsLightweightMode] = useState(false);
  const [agentInstruction, setAgentInstruction] = useState('');
  const [recentInstructions, setRecentInstructions] = useState<RecentInstruction[]>([]);
  const [executionState, setExecutionState] = useState<ExecutionState>({
    isExecuting: false,
    progress: 0,
    message: ''
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create icon mapping
  const iconMap = {
    IconFileText: <IconFileText size={16} />,
    IconSearch: <IconSearch size={16} />,
    IconEdit: <IconEdit size={16} />
  };

  // Memoized quick actions with icons
  const quickActions = useMemo((): QuickAction[] => {
    return QUICK_ACTION_DEFINITIONS.map(def => ({
      ...def,
      icon: iconMap[def.iconName as keyof typeof iconMap]
    }));
  }, []);

  // Available quick actions based on selected node
  const availableQuickActions = useMemo(() => {
    if (!selectedNode) return [];
    
    const availableDefinitions = getAvailableQuickActionDefinitions(selectedNode);
    return availableDefinitions.map(def => ({
      ...def,
      icon: iconMap[def.iconName as keyof typeof iconMap]
    }));
  }, [selectedNode, quickActions]);

  // Check for linked nodes warning
  const showLinkedNodesWarning = useMemo(() => 
    shouldShowLinkedNodesWarning(selectedNode), 
  [selectedNode]
  );

  // Sheet management
  const openSheet = useCallback((sheetType: SheetType) => {
    setActiveSheet(sheetType);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  // Quick action handling
  const handleQuickAction = useCallback((action: QuickAction) => {
    setAgentInstruction(action.instruction);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Agent execution with progress simulation
  const handleExecuteAgent = useCallback(async () => {
    if (!agentInstruction.trim() || !onExecuteAgent) return;

    // Add to recent instructions
    const newInstruction = createRecentInstruction(agentInstruction, selectedNode);
    setRecentInstructions(prev => updateRecentInstructions(prev, newInstruction));

    // Show execution progress
    setExecutionState({
      isExecuting: true,
      progress: 0,
      message: 'Initializing agent...'
    });

    try {
      // Simulate progress updates
      for (const step of PROGRESS_STEPS) {
        const message = createProgressMessage(step.message, selectedNode);
        setExecutionState(prev => ({ ...prev, progress: step.progress, message }));
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await onExecuteAgent(agentInstruction, selectedNode);
      
      // Auto-close sheet after completion
      setTimeout(() => {
        closeSheet();
        setAgentInstruction('');
      }, 1000);

    } catch (error) {
      console.error('Agent execution failed:', error);
    } finally {
      setTimeout(() => {
        setExecutionState({ isExecuting: false, progress: 0, message: '' });
      }, 1500);
    }
  }, [agentInstruction, selectedNode, onExecuteAgent, closeSheet]);

  // Focus mode toggle
  const toggleFocusMode = useCallback(() => {
    setIsLightweightMode(prev => {
      const newMode = !prev;
      if (newMode) {
        closeSheet();
      }
      return newMode;
    });
  }, [closeSheet]);

  // Node selection handler
  const handleNodeDeselect = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  return {
    // State
    activeSheet,
    isLightweightMode,
    agentInstruction,
    recentInstructions,
    executionState,
    showLinkedNodesWarning,
    availableQuickActions,
    
    // Refs
    textareaRef,
    
    // Handlers
    openSheet,
    closeSheet,
    handleQuickAction,
    handleExecuteAgent,
    toggleFocusMode,
    handleNodeDeselect,
    setAgentInstruction
  };
}; 