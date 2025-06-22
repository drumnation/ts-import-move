/**
 * DraggableDocumentEditor Styles
 * @module DraggableDocumentEditor.styles
 */

import styled from '@emotion/styled';
import { Box } from '@mantine/core';

/**
 * Main editor container with legal document styling
 */
export const EditorContainer = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.6;
  
  /* Legal document page styling */
  min-height: 600px;
  
  /* Mobile-first responsive design */
  @media (max-width: 768px) {
    padding: 16px;
    margin: 0 8px;
    font-size: 11pt;
    box-shadow: none;
    border: 1px solid #e0e0e0;
  }
`;

/**
 * Section header container
 */
export const SectionHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 14pt;
  margin: 24pt 0 12pt 0;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 13pt;
    margin: 18pt 0 9pt 0;
  }
`;

/**
 * Node container with selection feedback
 */
export const NodeContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  margin: 8px 0;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  /* Selection styling */
  ${({ isSelected }) => isSelected && `
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px solid #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  `}
  
  /* Hover effect for non-selected nodes */
  ${({ isSelected }) => !isSelected && `
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
      cursor: pointer;
    }
  `}
  
  /* Mobile touch targets */
  @media (max-width: 768px) {
    padding: 12px;
    margin: 12px 0;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

/**
 * Paragraph node styling
 */
export const ParagraphNode = styled.div`
  margin: 12pt 0;
  text-align: justify;
  line-height: 1.6;
`;

/**
 * List node styling
 */
export const ListNode = styled.div<{ listStyle: string }>`
  margin: 12pt 0;
  padding-left: 40px;
  
  ${({ listStyle }) => {
    switch (listStyle) {
    case 'decimal':
      return 'list-style-type: decimal;';
    case 'lower-alpha':
      return 'list-style-type: lower-alpha;';
    case 'upper-roman':
      return 'list-style-type: upper-roman;';
    case 'disc':
    default:
      return 'list-style-type: disc;';
    }
  }}
  
  ul, ol {
    margin: 0;
    padding: 0;
  }
  
  li {
    margin: 6pt 0;
    text-align: justify;
    list-style-position: outside;
  }
  
  @media (max-width: 768px) {
    padding-left: 24px;
  }
`;

/**
 * Recital node styling (WHEREAS clauses)
 */
export const RecitalNode = styled.div`
  margin: 12pt 0;
  text-align: justify;
  font-style: italic;
  text-indent: 36pt;
  
  /* WHEREAS prefix styling */
  &::first-line {
    font-variant: small-caps;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    text-indent: 24pt;
  }
`;

/**
 * Table node styling
 */
export const TableNode = styled.table`
  width: 100%;
  margin: 12pt 0;
  border-collapse: collapse;
  border: 1px solid #000;
  
  th, td {
    border: 1px solid #000;
    padding: 6pt 8pt;
    text-align: left;
    vertical-align: top;
  }
  
  th {
    font-weight: bold;
    background-color: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    font-size: 10pt;
    
    th, td {
      padding: 4pt 6pt;
    }
  }
`;

/**
 * Exhibit node styling
 */
export const ExhibitNode = styled.div`
  margin: 12pt 0;
  text-align: center;
  font-weight: bold;
  font-style: italic;
  padding: 8pt;
  border: 1px dashed #666;
  background-color: #f9f9f9;
  
  @media (max-width: 768px) {
    padding: 6pt;
  }
`;

/**
 * Empty state message
 */
export const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 48px 24px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin: 24px 0;
  
  h3 {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 32px 16px;
    
    h3 {
      font-size: 16px;
    }
    
    p {
      font-size: 13px;
    }
  }
`;

/**
 * Drag feedback overlay
 */
export const DragFeedback = styled.div<{ isVisible: boolean; isValid: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ isValid }) => 
    isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 2px dashed ${({ isValid }) => 
    isValid ? '#22c55e' : '#ef4444'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 100;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '${({ isValid }) => 
    isValid ? 'Drop to reorder' : 'Invalid drop position'}';
    background-color: ${({ isValid }) => 
    isValid ? '#22c55e' : '#ef4444'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    &::after {
      font-size: 14px;
      padding: 10px 20px;
    }
  }
`; 