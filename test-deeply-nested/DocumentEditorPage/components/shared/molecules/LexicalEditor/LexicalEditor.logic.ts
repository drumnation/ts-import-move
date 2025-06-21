import { Node as ASTNode, ParagraphNode } from '../../../../types/legal-document-ast';
import { LexicalASTNode } from './LexicalEditor.types';

/**
 * AST to Lexical conversion utilities
 */
export const astToLexicalNodes = (astNodes: ASTNode[]): LexicalASTNode[] => {
  return astNodes.map(node => {
    if (node.type === 'paragraph') {
      return {
        type: 'paragraph',
        text: node.text
      };
    }
    // For now, treat other nodes as paragraphs
    return {
      type: 'paragraph', 
      text: JSON.stringify(node)
    };
  });
};

export const lexicalToAstNodes = (lexicalNodes: LexicalASTNode[]): ASTNode[] => {
  return lexicalNodes.map(node => {
    if (node.type === 'paragraph') {
      return {
        type: 'paragraph',
        text: node.text
      } as ParagraphNode;
    }
    // Future: Handle heading nodes and other types
    return {
      type: 'paragraph',
      text: node.text
    } as ParagraphNode;
  });
};

/**
 * Convert initial document to Lexical nodes
 */
export const convertDocumentToLexicalNodes = (document: any): LexicalASTNode[] => {
  if (!document?.content?.sections) return [];
  
  const allNodes: ASTNode[] = [];
  document.content.sections.forEach((section: any) => {
    // Add section heading as heading node
    allNodes.push({
      type: 'paragraph', // Will be converted to heading in Lexical
      text: section.heading
    } as ParagraphNode);
    
    // Add section content
    allNodes.push(...section.content);
  });
  
  return astToLexicalNodes(allNodes);
}; 