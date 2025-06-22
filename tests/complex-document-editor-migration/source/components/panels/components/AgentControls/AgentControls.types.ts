/**
 * Agent Controls Panel Types
 * @module AgentControls.types
 */

import { ReactNode } from 'react';
import type { Node } from '@/tests/complex-document-editor-migration/types/legal-document-ast';

export type AgentInstructionType = 
  | 'summarize'
  | 'revise-tone'
  | 'update-citations'
  | 'find-references'
  | 'generate-content'
  | 'analyze-structure'
  | 'fact-check'
  | 'custom';

export interface AgentInstruction {
  /** Unique instruction identifier */
  id: string;
  /** Instruction type */
  type: AgentInstructionType;
  /** Human-readable label */
  label: string;
  /** Instruction prompt text */
  prompt: string;
  /** Target node path (e.g., "I.Introduction > A.Background") */
  targetPath?: string;
  /** Target node IDs */
  targetNodes?: string[];
  /** Instruction parameters */
  parameters?: Record<string, any>;
  /** Created timestamp */
  createdAt: string;
  /** Last used timestamp */
  lastUsedAt?: string;
  /** Usage count */
  usageCount: number;
  /** Whether this is a predefined instruction */
  isPredefined: boolean;
  /** Instruction tags for organization */
  tags: string[];
}

export interface AgentSession {
  /** Unique session identifier */
  id: string;
  /** Session title */
  title: string;
  /** Current instruction being executed */
  currentInstruction: AgentInstruction | null;
  /** Execution status */
  status: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
  /** Execution progress (0-100) */
  progress: number;
  /** Start timestamp */
  startedAt?: string;
  /** Completion timestamp */
  completedAt?: string;
  /** Execution time in milliseconds */
  executionTime?: number;
  /** Generated result */
  result?: {
    content: string;
    metadata: {
      tokens: number;
      cost: number;
      model: string;
      confidence: number;
    };
    changes: DocumentChange[];
  };
  /** Error information */
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  /** Context information */
  context: {
    documentId?: string;
    selectedNodes: string[];
    userPrompt: string;
    systemPrompt?: string;
  };
}

export interface DocumentChange {
  /** Change identifier */
  id: string;
  /** Change type */
  type: 'insert' | 'update' | 'delete' | 'move';
  /** Target node ID */
  nodeId: string;
  /** Node path display */
  nodePath: string;
  /** Change description */
  description: string;
  /** Previous content (for undo) */
  previousContent?: string;
  /** New content */
  newContent?: string;
  /** Change timestamp */
  timestamp: string;
  /** Whether change has been applied */
  applied: boolean;
  /** Confidence score (0-1) */
  confidence: number;
}

export interface QuickAction {
  /** Action identifier */
  id: string;
  /** Display label */
  label: string;
  /** Action description */
  description: string;
  /** Icon component name */
  icon: string;
  /** Instruction template */
  instructionTemplate: string;
  /** Required context types */
  requiredContext: ('selection' | 'document' | 'paragraph' | 'section')[];
  /** Keyboard shortcut */
  shortcut?: string;
  /** Action category */
  category: 'content' | 'analysis' | 'citation' | 'structure';
  /** Estimated execution time */
  estimatedTime?: string;
}

export interface InstructionHistory {
  /** History entry ID */
  id: string;
  /** Original instruction */
  instruction: AgentInstruction;
  /** Execution session */
  session: AgentSession;
  /** Success status */
  success: boolean;
  /** User rating (1-5) */
  rating?: number;
  /** User feedback */
  feedback?: string;
  /** Document state before execution */
  beforeState?: string;
  /** Document state after execution */
  afterState?: string;
}

export interface AgentControlsState {
  /** Current instruction being composed */
  currentInstruction: string;
  /** Selected target nodes */
  selectedNodes: Node[];
  /** Target path display */
  targetPath: string;
  /** Available quick actions */
  quickActions: QuickAction[];
  /** Recent instructions */
  recentInstructions: AgentInstruction[];
  /** Instruction history */
  history: InstructionHistory[];
  /** Current agent session */
  activeSession: AgentSession | null;
  /** Loading states */
  isLoading: boolean;
  isExecuting: boolean;
  /** Error state */
  error: string | null;
  /** UI state */
  isExpanded: boolean;
  showAdvanced: boolean;
  showHistory: boolean;
}

export interface AgentControlsActions {
  /** Update instruction text */
  updateInstruction: (instruction: string) => void;
  /** Set target nodes */
  setTargetNodes: (nodes: Node[]) => void;
  /** Execute current instruction */
  executeInstruction: () => Promise<void>;
  /** Execute quick action */
  executeQuickAction: (actionId: string) => Promise<void>;
  /** Re-run previous instruction */
  rerunInstruction: (instructionId: string) => Promise<void>;
  /** Save instruction to history */
  saveInstruction: (instruction: AgentInstruction) => void;
  /** Clear current session */
  clearSession: () => void;
  /** Toggle panel expansion */
  toggleExpansion: () => void;
  /** Toggle advanced mode */
  toggleAdvanced: () => void;
  /** Toggle history view */
  toggleHistory: () => void;
  /** Apply document changes */
  applyChanges: (changes: DocumentChange[]) => Promise<void>;
  /** Reject document changes */
  rejectChanges: () => void;
  /** Rate instruction execution */
  rateExecution: (historyId: string, rating: number, feedback?: string) => void;
}

export interface NodeSelectorProps {
  /** Available nodes */
  nodes: Node[];
  /** Selected node IDs */
  selectedNodes: string[];
  /** Selection change handler */
  onSelectionChange: (nodeIds: string[]) => void;
  /** Display mode */
  mode: 'tree' | 'breadcrumb' | 'pill';
  /** Whether multiple selection is allowed */
  multiSelect?: boolean;
  /** Custom styling */
  className?: string;
}

export interface InstructionComposerProps {
  /** Current instruction text */
  instruction: string;
  /** Instruction change handler */
  onInstructionChange: (instruction: string) => void;
  /** Execute handler */
  onExecute: () => void;
  /** Available quick actions */
  quickActions: QuickAction[];
  /** Quick action handler */
  onQuickAction: (actionId: string) => void;
  /** Recent instructions */
  recentInstructions: AgentInstruction[];
  /** Recent instruction handler */
  onRecentInstruction: (instruction: AgentInstruction) => void;
  /** Whether execution is in progress */
  isExecuting?: boolean;
  /** Target context display */
  targetContext?: string;
  /** Placeholder text */
  placeholder?: string;
}

export interface ExecutionProgressProps {
  /** Current session */
  session: AgentSession;
  /** Cancel execution handler */
  onCancel: () => void;
  /** Show detailed progress */
  showDetails?: boolean;
  /** Custom styling */
  className?: string;
}

export interface ResultsPreviewProps {
  /** Execution session with results */
  session: AgentSession;
  /** Apply changes handler */
  onApply: (changes: DocumentChange[]) => void;
  /** Reject changes handler */
  onReject: () => void;
  /** View change handler */
  onViewChange: (changeId: string) => void;
  /** Show diff view */
  showDiff?: boolean;
}

export interface HistoryBrowserProps {
  /** Instruction history */
  history: InstructionHistory[];
  /** History item click handler */
  onHistoryClick: (item: InstructionHistory) => void;
  /** Re-run instruction handler */
  onRerun: (instruction: AgentInstruction) => void;
  /** Rate execution handler */
  onRate: (historyId: string, rating: number, feedback?: string) => void;
  /** Clear history handler */
  onClearHistory: () => void;
  /** Maximum items to show */
  maxItems?: number;
  /** Filter options */
  filter?: {
    type?: AgentInstructionType;
    success?: boolean;
    dateRange?: { start: string; end: string };
  };
}

export interface ModelOption {
  value: string;
  label: string;
}

export interface AgentControlsProps {
  /** Selected document nodes for context */
  selectedNodes?: string[];
  /** Node path display */
  targetPath?: string;
  /** Whether the panel is expanded */
  expanded?: boolean;
  /** Toggle expansion handler */
  onToggleExpansion?: () => void;
}

export interface AgentControlsState {
  instruction: string;
  selectedModel: string;
  showAdvanced: boolean;
  isExecuting: boolean;
  executionProgress: number;
  currentResult: string | null;
  error: string | null;
}

export interface AgentControlsActions {
  setInstruction: (instruction: string) => void;
  setSelectedModel: (model: string) => void;
  setShowAdvanced: (show: boolean) => void;
  setIsExecuting: (executing: boolean) => void;
  setExecutionProgress: (progress: number) => void;
  setCurrentResult: (result: string | null) => void;
  setError: (error: string | null) => void;
  handleQuickAction: (action: QuickAction) => void;
  handleExecute: () => Promise<void>;
  clearResult: () => void;
} 