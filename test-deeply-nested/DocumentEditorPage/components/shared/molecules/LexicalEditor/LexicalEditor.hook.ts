import { useState, useCallback, useEffect } from 'react';
import { 
  $getRoot, 
  $createParagraphNode, 
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_DOWN_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { 
  useLexicalComposerContext 
} from '@lexical/react/LexicalComposerContext';
import { 
  $createHeadingNode,
  $isHeadingNode
} from '@lexical/rich-text';
import {
  $createListNode,
  $createListItemNode,
  $isListNode,
  $isListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { LexicalASTNode, OnChangePluginProps, InitializerPluginProps } from './LexicalEditor.types';

/**
 * Command for inserting AI-generated content as a single undoable transaction
 */
export const INSERT_AI_GENERATED_CONTENT: LexicalCommand<LexicalASTNode[]> = 
  createCommand('INSERT_AI_GENERATED_CONTENT');

/**
 * Command for inserting bulk content with backup support
 */
export const INSERT_BULK_CONTENT: LexicalCommand<{
  nodes: LexicalASTNode[];
  position?: 'start' | 'end' | 'cursor';
  createCheckpoint?: boolean;
}> = createCommand('INSERT_BULK_CONTENT');

/**
 * Plugin to handle editor state changes and AST synchronization
 */
export function OnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const children = root.getChildren();
        
        const lexicalNodes: LexicalASTNode[] = children.map(child => {
          if ($isHeadingNode(child)) {
            return {
              type: 'heading',
              level: child.getTag() === 'h1' ? 1 : 2,
              text: child.getTextContent()
            };
          } else if ($isListNode(child)) {
            const listItems = child.getChildren()
              .filter($isListItemNode)
              .map(item => ({
                type: 'list-item' as const,
                text: item.getTextContent(),
                children: undefined // TODO: Handle nested list items
              }));
            
            return {
              type: 'list',
              listType: child.getListType() === 'number' ? 'number' : 'bullet',
              items: listItems
            };
          } else {
            return {
              type: 'paragraph',
              text: child.getTextContent()
            };
          }
        });
        
        onChange(lexicalNodes);
      });
    });
  }, [editor, onChange]);
  
  return null;
}

/**
 * Plugin to initialize editor with AST content
 */
export function InitializerPlugin({ initialNodes }: InitializerPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (!initialized && initialNodes.length > 0) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        initialNodes.forEach(node => {
          if (node.type === 'heading') {
            const headingNode = $createHeadingNode(`h${node.level}`);
            headingNode.append($createTextNode(node.text));
            root.append(headingNode);
          } else if (node.type === 'list') {
            const listNode = $createListNode(node.listType === 'number' ? 'number' : 'bullet');
            node.items.forEach(item => {
              const listItemNode = $createListItemNode();
              listItemNode.append($createTextNode(item.text));
              listNode.append(listItemNode);
            });
            root.append(listNode);
          } else {
            const paragraphNode = $createParagraphNode();
            paragraphNode.append($createTextNode(node.text));
            root.append(paragraphNode);
          }
        });
      });
      
      setInitialized(true);
    }
  }, [editor, initialNodes, initialized]);
  
  return null;
}

/**
 * Plugin to handle bulk content operations (like AI-generated content) with transaction support
 */
export function BulkContentPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    /**
     * Helper function to convert LexicalASTNode to Lexical nodes
     */
    const createLexicalNodesFromAST = (astNodes: LexicalASTNode[]) => {
      return astNodes.map(node => {
        if (node.type === 'heading') {
          const headingNode = $createHeadingNode(`h${node.level}`);
          headingNode.append($createTextNode(node.text));
          return headingNode;
        } else if (node.type === 'list') {
          const listNode = $createListNode(node.listType === 'number' ? 'number' : 'bullet');
          node.items.forEach(item => {
            const listItemNode = $createListItemNode();
            listItemNode.append($createTextNode(item.text));
            listNode.append(listItemNode);
          });
          return listNode;
        } else {
          const paragraphNode = $createParagraphNode();
          paragraphNode.append($createTextNode(node.text));
          return paragraphNode;
        }
      });
    };

    // Register AI-generated content command
    const unregisterAIContent = editor.registerCommand(
      INSERT_AI_GENERATED_CONTENT,
      (payload: LexicalASTNode[]) => {
        editor.update(() => {
          const root = $getRoot();
          const selection = $getSelection();
          
          // Create Lexical nodes from AST
          const lexicalNodes = createLexicalNodesFromAST(payload);
          
          // Insert at cursor position or end of document
          if ($isRangeSelection(selection)) {
            // Insert at cursor position
            const anchor = selection.anchor;
            const focus = selection.focus;
            
            // Find the current paragraph/node
            let targetNode = anchor.getNode();
            if (targetNode.getType() === 'text') {
              targetNode = targetNode.getParent()!;
            }
            
            // Insert nodes after current node
            lexicalNodes.forEach((node, index) => {
              if (index === 0) {
                targetNode.insertAfter(node);
              } else {
                lexicalNodes[index - 1].insertAfter(node);
              }
            });
          } else {
            // Insert at end of document
            lexicalNodes.forEach(node => {
              root.append(node);
            });
          }
          
          console.log(`🤖 Inserted ${payload.length} AI-generated nodes`);
        });
        
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // Register bulk content command
    const unregisterBulkContent = editor.registerCommand(
      INSERT_BULK_CONTENT,
      (payload: { nodes: LexicalASTNode[]; position?: 'start' | 'end' | 'cursor'; createCheckpoint?: boolean }) => {
        const { nodes, position = 'cursor', createCheckpoint = true } = payload;
        
        editor.update(() => {
          const root = $getRoot();
          const selection = $getSelection();
          
          // Create checkpoint for undo if requested
          if (createCheckpoint) {
            // This creates an implicit checkpoint in Lexical's history
            console.log('📸 Creating undo checkpoint for bulk content insertion');
          }
          
          // Create Lexical nodes from AST
          const lexicalNodes = createLexicalNodesFromAST(nodes);
          
          switch (position) {
            case 'start':
              // Insert at beginning of document
              const firstChild = root.getFirstChild();
              lexicalNodes.reverse().forEach(node => {
                if (firstChild) {
                  firstChild.insertBefore(node);
                } else {
                  root.append(node);
                }
              });
              break;
              
            case 'end':
              // Insert at end of document
              lexicalNodes.forEach(node => {
                root.append(node);
              });
              break;
              
            case 'cursor':
            default:
              // Insert at cursor position
              if ($isRangeSelection(selection)) {
                let targetNode = selection.anchor.getNode();
                if (targetNode.getType() === 'text') {
                  targetNode = targetNode.getParent()!;
                }
                
                lexicalNodes.forEach((node, index) => {
                  if (index === 0) {
                    targetNode.insertAfter(node);
                  } else {
                    lexicalNodes[index - 1].insertAfter(node);
                  }
                });
              } else {
                // Fallback to end of document
                lexicalNodes.forEach(node => {
                  root.append(node);
                });
              }
              break;
          }
          
          console.log(`📦 Inserted ${nodes.length} bulk content nodes at position: ${position}`);
        });
        
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // Return cleanup function
    return () => {
      unregisterAIContent();
      unregisterBulkContent();
    };
  }, [editor]);

  return null;
}

/**
 * Plugin to handle keyboard shortcuts, focusing on undo/redo, list, and text formatting functionality
 * Note: Clipboard operations (copy/paste) are handled automatically by RichTextPlugin
 */
export function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    // Register keyboard shortcut handler
    const unregisterKeyDown = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const { code, ctrlKey, metaKey, shiftKey } = event;
        const isModifierPressed = ctrlKey || metaKey;
        
        // Handle common shortcuts
        if (isModifierPressed) {
          switch (code) {
            case 'KeyZ':
              if (shiftKey) {
                // Redo (Ctrl/Cmd+Shift+Z)
                event.preventDefault();
                editor.dispatchCommand(REDO_COMMAND, undefined);
                console.log('↷ Redo command dispatched');
                return true;
              } else {
                // Undo (Ctrl/Cmd+Z)
                event.preventDefault();
                editor.dispatchCommand(UNDO_COMMAND, undefined);
                console.log('↶ Undo command dispatched');
                return true;
              }
            case 'KeyY':
              // Alternative Redo (Ctrl/Cmd+Y)
              event.preventDefault();
              editor.dispatchCommand(REDO_COMMAND, undefined);
              console.log('↷ Redo command dispatched (Ctrl+Y)');
              return true;
            case 'KeyC':
              // Copy (Ctrl/Cmd+C) - handled by RichTextPlugin/browser
              console.log('📋 Copy operation (handled by browser)');
              return false; // Allow default behavior
            case 'KeyX':
              // Cut (Ctrl/Cmd+X) - handled by RichTextPlugin/browser
              console.log('✂️ Cut operation (handled by browser)');
              return false; // Allow default behavior
            case 'KeyV':
              // Paste (Ctrl/Cmd+V) - handled by RichTextPlugin/browser
              console.log('📌 Paste operation (handled by browser)');
              return false; // Allow default behavior
            case 'KeyB':
              // Bold toggle (Ctrl/Cmd+B)
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              console.log('💪 Bold formatting toggled');
              return true;
            case 'KeyI':
              // Italic toggle (Ctrl/Cmd+I)
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              console.log('🔤 Italic formatting toggled');
              return true;
            case 'KeyU':
              // Underline toggle (Ctrl/Cmd+U)
              event.preventDefault();
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              console.log('📝 Underline formatting toggled');
              return true;
            case 'Digit8':
              // Bullet list (Ctrl/Cmd+8)
              event.preventDefault();
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
              console.log('🔸 Bullet list created');
              return true;
            case 'Digit7':
              // Numbered list (Ctrl/Cmd+7)
              event.preventDefault();
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
              console.log('🔢 Numbered list created');
              return true;
          }
        }
        
        // List indentation (Tab / Shift+Tab) is now handled by the dedicated ListPlugin via KEY_TAB_COMMAND.
        
        // Handle Enter key for paragraph breaks
        if (code === 'Enter' && !event.shiftKey) {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            console.log('⏎ New paragraph created');
          }
        }
        
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // Return cleanup function to unregister listeners
    return () => {
      unregisterKeyDown();
    };
  }, [editor]);
  
  return null;
}

/**
 * Plugin to handle selection changes and communicate with parent components
 */
export function SelectionPlugin({ onNodeSelect }: { onNodeSelect?: (nodeId: string | null) => void }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const selectedText = selection.getTextContent();
          const anchorNode = selection.anchor.getNode();
          
          if (selectedText.length > 0) {
            console.log('🎯 Selected text:', selectedText);
            
            // Generate a node ID based on the selected node type and content
            let nodeId: string | null = null;
            const parent = anchorNode.getParent();
            
            if ($isHeadingNode(parent)) {
              nodeId = `heading-${parent.getTextContent().substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
            } else if ($isListItemNode(parent)) {
              nodeId = `list-item-${parent.getTextContent().substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
            } else {
              nodeId = `paragraph-${parent?.getTextContent().substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
            }
            
            if (onNodeSelect) {
              onNodeSelect(nodeId);
            }
          } else {
            // No selection - clear selected node
            if (onNodeSelect) {
              onNodeSelect(null);
            }
          }
        } else {
          // No range selection - clear selected node
          if (onNodeSelect) {
            onNodeSelect(null);
          }
        }
      });
    });
  }, [editor, onNodeSelect]);
  
  return null;
}

/**
 * Custom hook for content change handling
 */
export const useContentChangeHandler = (onContentChange?: (nodes: LexicalASTNode[]) => void) => {
  return useCallback((nodes: LexicalASTNode[]) => {
    if (onContentChange) {
      onContentChange(nodes);
    }
  }, [onContentChange]);
};

/**
 * Hook to provide AI content generation commands to parent components
 */
export const useAIContentCommands = () => {
  const [editor] = useLexicalComposerContext();

  const insertAIContent = useCallback((nodes: LexicalASTNode[]) => {
    editor.dispatchCommand(INSERT_AI_GENERATED_CONTENT, nodes);
  }, [editor]);

  const insertBulkContent = useCallback((
    nodes: LexicalASTNode[], 
    options?: { 
      position?: 'start' | 'end' | 'cursor'; 
      createCheckpoint?: boolean 
    }
  ) => {
    editor.dispatchCommand(INSERT_BULK_CONTENT, {
      nodes,
      position: options?.position || 'cursor',
      createCheckpoint: options?.createCheckpoint !== false
    });
  }, [editor]);

  const createUndoCheckpoint = useCallback(() => {
    // Force a history checkpoint by making a minimal update
    editor.update(() => {
      console.log('📸 Creating manual undo checkpoint');
    });
  }, [editor]);

  const undoLastAction = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redoLastAction = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return {
    /**
     * Insert AI-generated content as a single undoable action
     */
    insertAIContent,
    
    /**
     * Insert bulk content with position and checkpoint options
     */
    insertBulkContent,
    
    /**
     * Create a manual undo checkpoint for grouping operations
     */
    createUndoCheckpoint,
    
    /**
     * Undo the last action
     */
    undoLastAction,
    
    /**
     * Redo the last undone action
     */
    redoLastAction
  };
}; 