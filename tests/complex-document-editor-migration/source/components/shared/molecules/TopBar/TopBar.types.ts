/**
 * TopBar Component Types
 * @module TopBar.types
 */

export interface TopBarProps {
  /** Document title to display */
  title?: string;
  /** Current status of the editor */
  status?: 'ready' | 'saving' | 'error';
  /** Callback for search action */
  onSearch?: () => void;
  /** Callback for export preview action */
  onExportPreview?: () => void;
  /** Callback for download action */
  onDownload?: () => void;
  /** Callback for print action */
  onPrint?: () => void;
  /** Callback for share action */
  onShare?: () => void;
}

export interface StatusIndicatorProps {
  /** Current status */
  status: 'ready' | 'saving' | 'error';
}

export interface ActionBarProps {
  /** Search action handler */
  onSearch?: () => void;
  /** Export preview action handler */
  onExportPreview?: () => void;
  /** Download action handler */
  onDownload?: () => void;
  /** Print action handler */
  onPrint?: () => void;
  /** Share action handler */
  onShare?: () => void;
} 