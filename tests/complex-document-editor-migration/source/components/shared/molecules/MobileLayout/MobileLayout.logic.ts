import React from 'react';
import { 
  IconFileText, 
  IconSearch, 
  IconEdit 
} from '@tabler/icons-react';
import { QuickAction, DocumentNode, RecentInstruction } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/MobileLayout/MobileLayout.types';

// Quick action definitions (icons will be added in the hook)
export const QUICK_ACTION_DEFINITIONS = [
  {
    id: 'summarize',
    label: '📝 Summarize',
    iconName: 'IconFileText',
    instruction: 'Provide a concise summary of this section, highlighting key legal points.',
    availableFor: ['section', 'exhibit'] as DocumentNode['type'][]
  },
  {
    id: 'find-refs',
    label: '🔍 Find Cross-Refs',
    iconName: 'IconSearch',
    instruction: 'Identify all cross-references and citations in this section.',
    availableFor: ['section', 'exhibit', 'header', 'footer'] as DocumentNode['type'][]
  },
  {
    id: 'update-citations',
    label: '✏️ Update Citations',
    iconName: 'IconEdit',
    instruction: 'Review and update all legal citations to current format standards.',
    availableFor: ['section', 'exhibit'] as DocumentNode['type'][]
  }
];

/**
 * Filters quick actions based on the selected node type
 */
export const getAvailableQuickActionDefinitions = (selectedNode?: DocumentNode) => {
  if (!selectedNode) return [];
  
  return QUICK_ACTION_DEFINITIONS.filter(action => 
    action.availableFor.indexOf(selectedNode.type) !== -1
  );
};

/**
 * Creates a new recent instruction entry
 */
export const createRecentInstruction = (
  instruction: string, 
  targetNode?: DocumentNode
): RecentInstruction => ({
  id: Date.now().toString(),
  instruction,
  timestamp: new Date(),
  targetNode
});

/**
 * Updates recent instructions list with a new entry (max 10 items)
 */
export const updateRecentInstructions = (
  currentInstructions: RecentInstruction[],
  newInstruction: RecentInstruction
): RecentInstruction[] => {
  return [newInstruction, ...currentInstructions.slice(0, 9)];
};

/**
 * Checks if a node has linked references that require warning
 */
export const shouldShowLinkedNodesWarning = (selectedNode?: DocumentNode): boolean => {
  return Boolean(selectedNode?.linkedNodes && selectedNode.linkedNodes.length > 0);
};

/**
 * Animation variants for sheet transitions
 */
export const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

/**
 * Animation variants for backdrop
 */
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 }
};

/**
 * Animation variants for progress overlay
 */
export const progressOverlayVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * Removes emoji prefixes from action labels for display
 */
export const cleanActionLabel = (label: string): string => {
  return label.replace(/^[📝🔍✏️]\s/, '');
};

/**
 * Progress steps for agent execution simulation
 */
export const PROGRESS_STEPS = [
  { progress: 20, message: 'Analyzing document...' },
  { progress: 50, message: 'Processing instruction...' },
  { progress: 80, message: 'Generating response...' },
  { progress: 100, message: 'Complete!' }
];

/**
 * Creates progress message with target node context
 */
export const createProgressMessage = (step: string, selectedNode?: DocumentNode): string => {
  if (step === 'Analyzing document...' && selectedNode?.title) {
    return `Analyzing ${selectedNode.title}...`;
  }
  return step;
}; 