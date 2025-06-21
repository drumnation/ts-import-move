/**
 * Agent Controls Panel Module
 * @module panels/agentControls
 */

// Main components
export { AgentControls } from './AgentControls';

// Hooks
export { useAgentControls, useAgentExecution, useQuickActions } from './hooks/index';

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
} from './agentControls.types'; 