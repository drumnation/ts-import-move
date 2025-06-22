/**
 * Agent Controls Panel Module
 * @module panels/agentControls
 */

// Main components
export { AgentControls } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/AgentControls';

// Hooks
export { useAgentControls, useAgentExecution, useQuickActions } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/hooks/index';

// Type exports
export type {
  AgentInstruction,
  AgentInstructionType,
  AgentSession,
  DocumentChange,
  QuickAction,
  InstructionHistory,
  AgentControlsState,
  AgentControlsActions,
  AgentControlsProps,
  ModelOption
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/agentControls.types'; 