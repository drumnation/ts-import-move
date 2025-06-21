/**
 * DocumentToolbar Types
 * 
 * Type definitions for document formatting toolbar components
 * 
 * @module DocumentToolbar.types
 */

export interface DocumentToolbarProps {
  /** Whether the toolbar is visible */
  visible?: boolean;
  /** Position of the toolbar */
  position?: 'top' | 'floating';
  /** Custom CSS class */
  className?: string;
  /** Whether the editor is in read-only mode */
  readOnly?: boolean;
  /** Callback when list action is triggered */
  onListAction?: (type: 'bullet' | 'numbered', action: 'toggle' | 'indent' | 'outdent') => void;
  /** Current selection state */
  selectionState?: SelectionState;
}

export interface SelectionState {
  /** Whether current selection is in a list */
  isInList?: boolean;
  /** Current list type if in list */
  listType?: 'bullet' | 'numbered';
  /** Current list depth */
  listDepth?: number;
  /** Whether can indent current selection */
  canIndent?: boolean;
  /** Whether can outdent current selection */
  canOutdent?: boolean;
}

export interface ListButtonProps {
  /** Type of list */
  type: 'bullet' | 'numbered';
  /** Whether button is active */
  active?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

export interface IndentControlsProps {
  /** Whether indent is disabled */
  canIndent?: boolean;
  /** Whether outdent is disabled */
  canOutdent?: boolean;
  /** Indent handler */
  onIndent: () => void;
  /** Outdent handler */
  onOutdent: () => void;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
} 