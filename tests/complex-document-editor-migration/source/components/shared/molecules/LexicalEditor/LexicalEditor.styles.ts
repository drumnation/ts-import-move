import styled from '@emotion/styled';
import { Box, BoxProps } from '@mantine/core';
import { ReactNode } from 'react';

/**
 * Extended BoxProps that properly includes children
 */
interface StyledBoxProps extends BoxProps {
  children?: ReactNode;
}

/**
 * Styled editor container with legal document styling
 */
export const EditorContainer = styled(Box)<StyledBoxProps>`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  min-height: 400px;
  background: white;
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.6;
  
  .editor-content {
    min-height: 350px;
    outline: none;
    
    p {
      margin: 0 0 12pt 0;
      text-align: justify;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin: 24pt 0 12pt 0;
      font-weight: bold;
      text-align: center;
    }
    
    h1 { font-size: 16pt; }
    h2 { font-size: 14pt; }
    h3 { font-size: 12pt; }
    
    /* Text Formatting Styles */
    .editor-text-bold {
      font-weight: bold;
    }
    
    .editor-text-italic {
      font-style: italic;
    }
    
    .editor-text-underline {
      text-decoration: underline;
    }
    
    .editor-text-strikethrough {
      text-decoration: line-through;
    }
    
    .editor-text-code {
      font-family: 'Courier New', monospace;
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 11pt;
    }
    
    /* List Styling */
    .editor-list-ol,
    .editor-list-ul {
      margin: 12pt 0;
      padding-left: 0;
      margin-left: 40px; /* Level 1: 40px */
    }
    
    .editor-list-ol {
      list-style-type: decimal;
    }
    
    .editor-list-ul {
      list-style-type: disc;
    }
    
    .editor-list-item {
      margin: 6pt 0;
      text-align: justify;
    }
    
    /* Perfect list alignment - level × 40px */
    .editor-list-nested {
      margin: 6pt 0;
      padding-left: 0;
    }
    
    /* Level 2: 80px total (40px base + 40px) */
    .editor-list-nested .editor-list-ol,
    .editor-list-nested .editor-list-ul {
      margin-left: 80px;
      list-style-type: circle;
    }
    
    /* Level 3: 120px total (40px base + 80px) */
    .editor-list-nested .editor-list-nested .editor-list-ol,
    .editor-list-nested .editor-list-nested .editor-list-ul {
      margin-left: 120px;
      list-style-type: square;
    }
    
    /* Level 4: 160px total (40px base + 120px) */
    .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-ol,
    .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-ul {
      margin-left: 160px;
      list-style-type: decimal;
    }
    
    /* Level 5: 200px total (40px base + 160px) */
    .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-ol,
    .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-nested .editor-list-ul {
      margin-left: 200px;
      list-style-type: lower-alpha;
    }
  }
`;

/**
 * Placeholder styling
 */
export const PlaceholderContainer = styled(Box)<StyledBoxProps>`
  position: absolute;
  top: 16px;
  left: 16px;
  color: #999;
  pointer-events: none;
`; 