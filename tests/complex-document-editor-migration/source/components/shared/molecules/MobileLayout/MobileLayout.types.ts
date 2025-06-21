import React from 'react';

export interface MobileLayoutProps {
  /** Document content */
  documentContent: React.ReactNode;
  /** Left panel content */
  leftPanelContent: React.ReactNode;
  /** Right panel content */
  rightPanelContent: React.ReactNode;
  /** AI agent content */
  agentContent: React.ReactNode;
  /** Currently selected document node */
  selectedNode?: DocumentNode;
  /** Callback when agent instruction is executed */
  onExecuteAgent?: (instruction: string, targetNode?: DocumentNode) => Promise<void>;
  /** Callback when node selection changes */
  onNodeSelect?: (node: DocumentNode | null) => void;
}

export interface DocumentNode {
  id: string;
  type: 'section' | 'exhibit' | 'signature' | 'header' | 'footer';
  path: string;
  title: string;
  linkedNodes?: string[];
  hasReferences?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  instruction: string;
  availableFor: DocumentNode['type'][];
}

export interface RecentInstruction {
  id: string;
  instruction: string;
  timestamp: Date;
  targetNode?: DocumentNode;
}

export interface ExecutionState {
  isExecuting: boolean;
  progress: number;
  message: string;
}

export type SheetType = 'tools' | 'ai' | 'settings' | null;

export interface TouchTargetConfig {
  minSize: number;
  spacing: number;
  primaryActionHeight: number;
}

export interface SheetContentData {
  title: string;
  content: React.ReactNode | null;
} 