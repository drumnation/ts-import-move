/**
 * Lexical List Plugin
 * 
 * Simplified plugin for basic list creation and keyboard controls
 * 
 * @module ListPlugin
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getSelection, 
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_TAB_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND
} from 'lexical';
import {
  $isListNode,
  $isListItemNode,
  insertList,
  removeList
} from '@lexical/list';

export interface ListPluginProps {
  /** Callback when list state changes */
  onListStateChange?: (state: {
    isInList: boolean;
    listType?: 'bullet' | 'number';
    canIndent: boolean;
    canOutdent: boolean;
    depth: number;
  }) => void;
}

/**
 * ListPlugin component for handling list functionality
 */
export const ListPlugin: React.FC<ListPluginProps> = ({ onListStateChange }) => {
  const [editor] = useLexicalComposerContext();
  const [listState, setListState] = useState({
    isInList: false,
    listType: undefined as 'bullet' | 'number' | undefined,
    canIndent: false,
    canOutdent: false,
    depth: 0
  });

  // Handle list state changes
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      const newListState = editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return {
            isInList: false,
            listType: undefined,
            canIndent: false,
            canOutdent: false,
            depth: 0
          };
        }

        // Check if we're in a list by examining the selection
        const anchorNode = selection.anchor.getNode();
        let currentNode = anchorNode;
        
        // Walk up the tree to find list nodes
        while (currentNode) {
          if ($isListItemNode(currentNode)) {
            const listNode = currentNode.getParent();
            if ($isListNode(listNode)) {
              return {
                isInList: true,
                listType: listNode.getListType() as 'bullet' | 'number',
                canIndent: true, // Simplified - allow indent/outdent when in list
                canOutdent: true,
                depth: 1 // Simplified depth
              };
            }
          }
          currentNode = currentNode.getParent();
        }

        return {
          isInList: false,
          listType: undefined,
          canIndent: false,
          canOutdent: false,
          depth: 0
        };
      });
      
      setListState(newListState);
      onListStateChange?.(newListState);
    });
  }, [editor, onListStateChange]);

  // Handle Tab key for indentation (now dispatches Lexical commands)
  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event: KeyboardEvent) => {
        if (!listState.isInList) return false;

        event.preventDefault();
        if (event.shiftKey) {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, listState.isInList]);

  return null; // This is a behavior-only plugin
};

/**
 * Hook to provide list commands to parent components
 */
export const useListCommands = () => {
  const [editor] = useLexicalComposerContext();

  const toggleList = useCallback((listType: 'bullet' | 'number') => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Check if we're already in a list
      const anchorNode = selection.anchor.getNode();
      let currentNode = anchorNode;
      
      while (currentNode) {
        if ($isListItemNode(currentNode)) {
          const listNode = currentNode.getParent();
          if ($isListNode(listNode) && listNode.getListType() === listType) {
            // Remove list if same type
            removeList(editor);
            return;
          }
        }
        currentNode = currentNode.getParent();
      }

      // Create new list
      insertList(editor, listType);
    });
  }, [editor]);

  const indentListItem = useCallback(() => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  const outdentListItem = useCallback(() => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  return {
    toggleList,
    indentListItem,
    outdentListItem
  };
};

export default ListPlugin; 