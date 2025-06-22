/**
 * DocumentToolbar Custom Hooks
 * 
 * Stateful logic and side effects for toolbar components
 * 
 * @module DocumentToolbar.hook
 */

import { useCallback, useMemo } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { DocumentToolbarProps, SelectionState } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.types';
import { 
  isListActionEnabled,
  isListButtonActive,
  validateSelectionState,
  getOptimalButtonSize,
  createListActionLabel
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.logic';

/**
 * Main hook for DocumentToolbar component state and behavior
 */
export const useDocumentToolbar = ({
  onListAction,
  selectionState,
  readOnly = false
}: Pick<DocumentToolbarProps, 'onListAction' | 'selectionState' | 'readOnly'>) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Validate and normalize selection state
  const validatedSelectionState = useMemo(() => {
    return selectionState ? validateSelectionState(selectionState) : undefined;
  }, [selectionState]);

  // Handle list type toggle (bullet or numbered)
  const handleListToggle = useCallback((type: 'bullet' | 'numbered') => {
    if (readOnly || !onListAction) return;
    onListAction(type, 'toggle');
  }, [readOnly, onListAction]);

  // Handle list indentation
  const handleIndent = useCallback(() => {
    if (readOnly || !onListAction || !validatedSelectionState?.isInList) return;
    onListAction(validatedSelectionState.listType || 'bullet', 'indent');
  }, [readOnly, onListAction, validatedSelectionState]);

  // Handle list outdent
  const handleOutdent = useCallback(() => {
    if (readOnly || !onListAction || !validatedSelectionState?.isInList) return;
    onListAction(validatedSelectionState.listType || 'bullet', 'outdent');
  }, [readOnly, onListAction, validatedSelectionState]);

  // Compute button states
  const buttonStates = useMemo(() => ({
    bulletList: {
      active: isListButtonActive('bullet', validatedSelectionState),
      disabled: readOnly || !isListActionEnabled('toggle', 'bullet', validatedSelectionState),
      label: createListActionLabel(
        'bullet', 
        'toggle', 
        isListButtonActive('bullet', validatedSelectionState)
      )
    },
    numberedList: {
      active: isListButtonActive('numbered', validatedSelectionState),
      disabled: readOnly || !isListActionEnabled('toggle', 'numbered', validatedSelectionState),
      label: createListActionLabel(
        'numbered', 
        'toggle', 
        isListButtonActive('numbered', validatedSelectionState)
      )
    },
    indent: {
      disabled: readOnly || !isListActionEnabled('indent', 'bullet', validatedSelectionState),
      label: createListActionLabel('bullet', 'indent')
    },
    outdent: {
      disabled: readOnly || !isListActionEnabled('outdent', 'bullet', validatedSelectionState),
      label: createListActionLabel('bullet', 'outdent')
    }
  }), [validatedSelectionState, readOnly]);

  // Platform-specific configurations
  const platformConfig = useMemo(() => ({
    buttonSize: getOptimalButtonSize(isMobile),
    showLabels: !isMobile,
    gapSize: isMobile ? 10 : 8
  }), [isMobile]);

  return {
    // State
    isMobile,
    selectionState: validatedSelectionState,
    buttonStates,
    platformConfig,
    
    // Actions
    handleListToggle,
    handleIndent,
    handleOutdent
  };
};

/**
 * Hook for keyboard shortcuts handling
 */
export const useToolbarKeyboardShortcuts = ({
  onListAction,
  readOnly = false
}: Pick<DocumentToolbarProps, 'onListAction' | 'readOnly'>) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (readOnly || !onListAction) return;

    const { ctrlKey, metaKey, shiftKey, key } = event;
    const isModifierPressed = ctrlKey || metaKey;

    // Bullet list: Ctrl+Shift+8
    if (isModifierPressed && shiftKey && key === '8') {
      event.preventDefault();
      onListAction('bullet', 'toggle');
      return;
    }

    // Numbered list: Ctrl+Shift+7
    if (isModifierPressed && shiftKey && key === '7') {
      event.preventDefault();
      onListAction('numbered', 'toggle');
      return;
    }

    // Indent: Tab (when in list)
    if (key === 'Tab' && !shiftKey) {
      // This will be handled by the Lexical plugin
      // We just prevent default here if needed
      return;
    }

    // Outdent: Shift+Tab (when in list)
    if (key === 'Tab' && shiftKey) {
      // This will be handled by the Lexical plugin
      // We just prevent default here if needed
      return;
    }
  }, [readOnly, onListAction]);

  return {
    handleKeyDown
  };
};

/**
 * Hook for managing toolbar visibility
 */
export const useToolbarVisibility = (
  visible: boolean = true,
  position: 'top' | 'floating' = 'top'
) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Determine actual visibility based on platform and position
  const actuallyVisible = useMemo(() => {
    if (!visible) return false;
    
    // On mobile, floating toolbars might need special handling
    if (isMobile && position === 'floating') {
      return true; // Show as fixed bottom toolbar
    }
    
    return true;
  }, [visible, position, isMobile]);

  return {
    visible: actuallyVisible,
    position: isMobile && position === 'floating' ? 'floating' : position
  };
}; 