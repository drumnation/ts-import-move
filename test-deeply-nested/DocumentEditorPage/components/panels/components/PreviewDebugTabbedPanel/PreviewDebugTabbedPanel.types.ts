/**
 * PreviewDebugTabbedPanel Types
 * 
 * TypeScript interfaces for the tabbed panel combining Instant Preview and AST Debug
 * 
 * @module PreviewDebugTabbedPanel.types
 */

import type { InstantPreviewPanelProps } from '../InstantPreviewPanel/InstantPreviewPanel.types';
import type { ASTDebugPanelProps } from '../ASTDebugPanel/ASTDebugPanel.types';

/**
 * Tab configuration for the tabbed panel
 */
export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Props for the PreviewDebugTabbedPanel component
 * Combines props from both InstantPreview and ASTDebug panels
 */
export interface PreviewDebugTabbedPanelProps {
  /** AST data for both preview and debug */
  astData?: any[];
  
  /** Document title for preview */
  title?: string;
  
  /** Panel expanded state */
  expanded?: boolean;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Error state */
  error?: string | null;
  
  /** Panel height */
  height?: number;
  
  /** Maximum height for debug panel */
  maxHeight?: number;
  
  /** Active tab ID */
  activeTab?: 'preview' | 'debug';
  
  /** CSS class name */
  className?: string;
  
  // InstantPreview specific props
  /** Callback for panel toggle */
  onToggleExpanded?: () => void;
  
  /** Callback for PDF download */
  onDownloadPdf?: () => void;
  
  // ASTDebug specific props  
  /** Debug view mode */
  viewMode?: 'json' | 'edit' | 'split';
  
  /** Whether debug has context */
  hasContext?: boolean;
  
  /** Callback for view mode change */
  onViewModeChange?: (mode: 'json' | 'edit' | 'split') => void;
  
  /** Callback for debug refresh */
  onRefresh?: () => void;
  
  /** Callback for tab change */
  onTabChange?: (tabId: 'preview' | 'debug') => void;
} 