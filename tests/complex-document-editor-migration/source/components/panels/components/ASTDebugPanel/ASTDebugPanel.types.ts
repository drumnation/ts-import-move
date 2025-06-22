/**
 * AST Debug Panel Types
 * 
 * Type definitions for the debug panel that displays live AST JSON data
 * 
 * @module ASTDebugPanel.types
 */

import type { LexicalASTNode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';

/**
 * View modes for the debug panel
 */
export type DebugViewMode = 'edit' | 'json' | 'split';

/**
 * AST Debug Panel Props
 */
export interface ASTDebugPanelProps {
  /** AST data to display */
  astData?: LexicalASTNode[];
  /** Current view mode */
  viewMode?: DebugViewMode;
  /** View mode change handler */
  onViewModeChange?: (mode: DebugViewMode) => void;
  /** Whether the panel is expanded */
  expanded?: boolean;
  /** Panel expand/collapse handler */
  onToggleExpanded?: (expanded: boolean) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Manual refresh handler */
  onRefresh?: () => void;
  /** Custom class name */
  className?: string;
  /** Maximum height constraint */
  maxHeight?: number;
  /** Whether Lexical editor context is available */
  hasContext?: boolean;
}

/**
 * JSON display options
 */
export interface JSONDisplayOptions {
  /** Number of spaces for indentation */
  indent: number;
  /** Whether to collapse long arrays/objects */
  collapse: boolean;
  /** Maximum depth to display */
  maxDepth?: number;
  /** Show line numbers */
  showLineNumbers: boolean;
}

/**
 * Debug panel state
 */
export interface DebugPanelState {
  /** Current view mode */
  viewMode: DebugViewMode;
  /** JSON display options */
  jsonOptions: JSONDisplayOptions;
  /** Whether panel is expanded */
  expanded: boolean;
  /** Last update timestamp */
  lastUpdated: number;
} 