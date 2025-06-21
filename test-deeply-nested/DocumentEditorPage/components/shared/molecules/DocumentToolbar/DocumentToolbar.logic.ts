/**
 * DocumentToolbar Business Logic
 * 
 * Pure functions for document formatting logic
 * 
 * @module DocumentToolbar.logic
 */

import type { SelectionState } from './DocumentToolbar.types';

/**
 * Determine if a list action should be enabled
 */
export const isListActionEnabled = (
  action: 'toggle' | 'indent' | 'outdent',
  listType: 'bullet' | 'numbered',
  selectionState?: SelectionState
): boolean => {
  if (!selectionState) return true; // Allow toggle when no selection state

  switch (action) {
    case 'toggle':
      return true; // Always allow toggling

    case 'indent':
      return selectionState.canIndent ?? false;

    case 'outdent':
      return selectionState.canOutdent ?? false;

    default:
      return false;
  }
};

/**
 * Determine if a list button should appear active
 */
export const isListButtonActive = (
  buttonType: 'bullet' | 'numbered',
  selectionState?: SelectionState
): boolean => {
  if (!selectionState?.isInList) return false;
  return selectionState.listType === buttonType;
};

/**
 * Get the appropriate icon name for list type
 */
export const getListIcon = (type: 'bullet' | 'numbered'): string => {
  switch (type) {
    case 'bullet':
      return 'list';
    case 'numbered':
      return 'list-numbers';
    default:
      return 'list';
  }
};

/**
 * Get the appropriate icon for indent/outdent actions
 */
export const getIndentIcon = (action: 'indent' | 'outdent'): string => {
  switch (action) {
    case 'indent':
      return 'indent-increase';
    case 'outdent':
      return 'indent-decrease';
    default:
      return 'indent-increase';
  }
};

/**
 * Format list type for accessibility labels
 */
export const formatListTypeLabel = (type: 'bullet' | 'numbered'): string => {
  switch (type) {
    case 'bullet':
      return 'Bullet List';
    case 'numbered':
      return 'Numbered List';
    default:
      return 'List';
  }
};

/**
 * Create accessible label for list actions
 */
export const createListActionLabel = (
  type: 'bullet' | 'numbered',
  action: 'toggle' | 'indent' | 'outdent',
  isActive?: boolean
): string => {
  const listLabel = formatListTypeLabel(type);
  
  switch (action) {
    case 'toggle':
      return isActive ? `Remove ${listLabel}` : `Create ${listLabel}`;
    case 'indent':
      return `Increase List Indent`;
    case 'outdent':
      return `Decrease List Indent`;
    default:
      return listLabel;
  }
};

/**
 * Validate selection state for consistency
 */
export const validateSelectionState = (state: SelectionState): SelectionState => {
  // Ensure consistent state
  if (!state.isInList) {
    return {
      ...state,
      listType: undefined,
      listDepth: 0,
      canIndent: false,
      canOutdent: false,
    };
  }

  // Ensure valid depth constraints
  const depth = Math.max(0, state.listDepth ?? 0);
  const canIndent = depth < 5; // Max 5 levels
  const canOutdent = depth > 0;

  return {
    ...state,
    listDepth: depth,
    canIndent,
    canOutdent,
  };
};

/**
 * Calculate keyboard shortcut hints
 */
export const getKeyboardShortcuts = () => ({
  bulletList: 'Ctrl+Shift+8',
  numberedList: 'Ctrl+Shift+7',
  indent: 'Tab',
  outdent: 'Shift+Tab',
});

/**
 * Determine optimal button size based on platform
 */
export const getOptimalButtonSize = (isMobile: boolean): 'sm' | 'md' | 'lg' => {
  return isMobile ? 'lg' : 'md';
}; 