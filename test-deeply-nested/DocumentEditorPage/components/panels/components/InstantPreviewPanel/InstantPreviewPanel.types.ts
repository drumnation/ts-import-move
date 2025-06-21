/**
 * InstantPreviewPanel Component Types
 * 
 * TypeScript interfaces for InstantPreviewPanel component
 * 
 * @module InstantPreviewPanel.types
 */

import type { LexicalASTNode } from '@/pages/DocumentEditorPage/components/shared/molecules/LexicalEditor/LexicalEditor.types';

/**
 * Props for InstantPreviewPanel component
 */
export interface InstantPreviewPanelProps {
  /** AST data to render in preview */
  astData?: LexicalASTNode[];
  /** Title for the preview */
  title?: string;
  /** Whether the panel is expanded */
  expanded?: boolean;
  /** Callback to toggle panel expansion */
  onToggleExpanded?: () => void;
  /** Callback to download PDF */
  onDownloadPdf?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Custom CSS class */
  className?: string;
  /** Height of the preview iframe */
  height?: number;
} 