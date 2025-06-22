/**
 * FormattingToolbar Business Logic
 * 
 * Central logic for text formatting operations and toolbar state management
 * Platform-agnostic business logic that can be used by both mobile and desktop variants
 * 
 * @module FormattingToolbar.logic
 */

import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  $createTextNode,
  $getRoot
} from 'lexical';
import { 
  $isHeadingNode,
  $createHeadingNode,
  HeadingTagType 
} from '@lexical/rich-text';
import {
  $createListNode,
  $createListItemNode,
  ListType
} from '@lexical/list';
import { useDispatch } from 'react-redux';
import { demoPetitionReliefAST } from '@/data/demo-petition-relief.ast';
import type { Node as ASTNode } from '@/types/legal-document-ast';

/**
 * Keyboard shortcuts for formatting commands
 */
export const FORMATTING_SHORTCUTS = {
  bold: 'Ctrl+B',
  italic: 'Ctrl+I', 
  underline: 'Ctrl+U',
} as const;

/**
 * Selection state for formatting buttons
 */
export interface SelectionState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  headingLevel: 1 | 2 | 3 | null;
  isInList: boolean;
  listType: ListType | null;
}

/**
 * Formatting actions available to toolbar
 */
export interface FormattingActions {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  setHeadingLevel: (level: 1 | 2 | 3 | null) => void;
  insertList: (type: ListType) => void;
  loadDemoDocument: () => void;
}

/**
 * Convert AST nodes to Lexical nodes and insert into editor
 */
const convertASTToLexicalNodes = (astNodes: ASTNode[]) => {
  const lexicalNodes: any[] = [];

  astNodes.forEach(node => {
    switch (node.type) {
    case 'paragraph':
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(node.text);
      paragraphNode.append(textNode);
      lexicalNodes.push(paragraphNode);
      break;

    case 'list':
      const listNode = $createListNode(node.style === 'decimal' ? 'number' : 'bullet');
      node.items.forEach(item => {
        const listItemNode = $createListItemNode();
        const itemTextNode = $createTextNode(item.text);
        listItemNode.append(itemTextNode);
        listNode.append(listItemNode);
      });
      lexicalNodes.push(listNode);
      break;

    case 'recital':
      const recitalNode = $createParagraphNode();
      const recitalText = $createTextNode(node.text);
      recitalNode.append(recitalText);
      lexicalNodes.push(recitalNode);
      break;

    default:
      // Fallback for unknown node types
      const fallbackNode = $createParagraphNode();
      const fallbackText = $createTextNode(JSON.stringify(node));
      fallbackNode.append(fallbackText);
      lexicalNodes.push(fallbackNode);
    }
  });

  return lexicalNodes;
};

/**
 * Main hook for formatting toolbar logic
 */
export const useFormattingToolbar = () => {
  // Try to get editor context, but handle when it's not available
  let editor: any = null;
  let hasContext = true;
  
  try {
    [editor] = useLexicalComposerContext();
  } catch (error) {
    // No context available yet - this is okay during initialization
    hasContext = false;
  }
  
  const dispatch = useDispatch();

  // Get current selection state
  const getSelectionState = useCallback((): SelectionState => {
    if (!hasContext || !editor) {
      return {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        headingLevel: null,
        isInList: false,
        listType: null,
      };
    }

    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      
      if (!$isRangeSelection(selection)) {
        return {
          isBold: false,
          isItalic: false,
          isUnderline: false,
          headingLevel: null,
          isInList: false,
          listType: null,
        };
      }

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' 
        ? anchorNode 
        : anchorNode.getTopLevelElementOrThrow();

      let headingLevel: 1 | 2 | 3 | null = null;
      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        headingLevel = parseInt(tag.slice(1)) as 1 | 2 | 3;
      }

      return {
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        headingLevel,
        isInList: false, // TODO: Implement list detection
        listType: null,
      };
    });
  }, [hasContext, editor]);

  // Formatting actions
  const actions: FormattingActions = {
    toggleBold: useCallback(() => {
      if (hasContext && editor) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }
    }, [hasContext, editor]),

    toggleItalic: useCallback(() => {
      if (hasContext && editor) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }
    }, [hasContext, editor]),

    toggleUnderline: useCallback(() => {
      if (hasContext && editor) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }
    }, [hasContext, editor]),

    setHeadingLevel: useCallback((level: 1 | 2 | 3 | null) => {
      if (hasContext && editor) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (level === null) {
              // Convert to paragraph
              const paragraphNode = $createParagraphNode();
              selection.insertNodes([paragraphNode]);
            } else {
              // Convert to heading
              const headingNode = $createHeadingNode(`h${level}` as HeadingTagType);
              selection.insertNodes([headingNode]);
            }
          }
        });
      }
    }, [hasContext, editor]),

    insertList: useCallback((type: ListType) => {
      if (hasContext && editor) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const listNode = $createListNode(type);
            const listItemNode = $createListItemNode();
            listNode.append(listItemNode);
            selection.insertNodes([listNode]);
          }
        });
      }
    }, [hasContext, editor]),

    loadDemoDocument: useCallback(() => {
      editor.update(() => {
        const root = $getRoot();
        
        // Clear existing content
        root.clear();

        // Add document title
        const titleNode = $createHeadingNode('h1');
        const titleText = $createTextNode('PETITION FOR RELIEF FROM JUDGEMENT');
        titleNode.append(titleText);
        root.append(titleNode);

        // Add subtitle
        const subtitleNode = $createParagraphNode();
        const subtitleText = $createTextNode('(Pa.R.C.P. 1926(b))');
        subtitleNode.append(subtitleText);
        root.append(subtitleNode);

        // Add caption information
        const captionNode = $createParagraphNode();
        const captionText = $createTextNode(
          `${demoPetitionReliefAST.content.caption.court}\n` +
          `${demoPetitionReliefAST.content.caption.parties}\n` +
          `${demoPetitionReliefAST.content.caption.docket}\n` +
          `${demoPetitionReliefAST.content.caption.title}`
        );
        captionNode.append(captionText);
        root.append(captionNode);

        // Add sections
        demoPetitionReliefAST.content.sections.forEach(section => {
          // Add section heading
          if (section.heading) {
            const headingNode = $createHeadingNode('h2');
            const headingText = $createTextNode(section.heading);
            headingNode.append(headingText);
            root.append(headingNode);
          }

          // Add section content
          if (section.content) {
            const lexicalNodes = convertASTToLexicalNodes(section.content);
            lexicalNodes.forEach(node => root.append(node));
          }
        });

        // Add signature block if it exists
        if (demoPetitionReliefAST.content.signatureBlock) {
          const signatureNode = $createParagraphNode();
          const signatureText = $createTextNode(
            'Respectfully submitted,\n\n' +
            '/s/ David Mieloch\n' +
            `${demoPetitionReliefAST.content.signatureBlock.signerName}\n` +
            `${demoPetitionReliefAST.content.signatureBlock.signerTitle || ''}\n` +
            `Date: ${demoPetitionReliefAST.content.signatureBlock.date}`
          );
          signatureNode.append(signatureText);
          root.append(signatureNode);
        }
      });

      // Log success
      console.log('✅ Demo document loaded successfully');
    }, [editor])
  };

  return {
    selectionState: getSelectionState(),
    actions,
    hasContext
  };
}; 