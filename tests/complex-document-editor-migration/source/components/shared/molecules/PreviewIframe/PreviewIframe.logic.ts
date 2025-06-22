import { DocumentAST, ContentNode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PreviewIframe/PreviewIframe.types';

/**
 * Generate complete HTML document from AST data
 */
export const generatePreviewHTML = (astData: DocumentAST): string => {
  const { ast, metadata } = astData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Preview - ${metadata?.title || 'Untitled'}</title>
  <style>
    ${getLegalDocumentCSS()}
  </style>
</head>
<body>
  ${renderAST(ast)}
</body>
</html>
  `.trim();
};

/**
 * Get CSS styles for legal document formatting
 */
const getLegalDocumentCSS = (): string => {
  return `
    /* Print CSS for legal documents */
    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: white;
      padding: 1in;
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    /* Caption styling */
    .caption {
      text-align: center;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 2em;
      border-bottom: 2px solid #000;
      padding-bottom: 1em;
    }
    
    .caption .court {
      font-size: 14pt;
      margin-bottom: 0.5em;
    }
    
    .caption .parties {
      font-size: 13pt;
      margin-bottom: 0.5em;
    }
    
    .caption .docket {
      font-size: 12pt;
      margin-bottom: 0.5em;
    }
    
    .caption .title {
      font-size: 16pt;
      font-weight: bold;
      margin-top: 1em;
    }
    
    /* Section styling */
    .section {
      margin-bottom: 2em;
    }
    
    .section-heading {
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 1em;
      text-align: center;
    }
    
    /* Content styling */
    .paragraph {
      margin-bottom: 1em;
      text-align: justify;
      text-indent: 0.5in;
    }
    
    .list {
      margin-bottom: 1em;
      padding-left: 1in;
    }
    
    .list-item {
      margin-bottom: 0.5em;
    }
    
    .recital {
      font-style: italic;
      margin-bottom: 1em;
      text-indent: 0.5in;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1em;
    }
    
    .table th,
    .table td {
      border: 1px solid #000;
      padding: 0.5em;
      text-align: left;
    }
    
    .table th {
      font-weight: bold;
      background-color: #f5f5f5;
    }
    
    .exhibit-label {
      font-weight: bold;
      text-transform: uppercase;
      margin: 1em 0;
      text-align: center;
      border: 2px solid #000;
      padding: 0.5em;
    }
    
    .signature-block {
      margin-top: 3em;
      border-top: 1px solid #000;
      padding-top: 1em;
    }
    
    .footer-block {
      position: fixed;
      bottom: 1in;
      left: 1in;
      right: 1in;
      text-align: center;
      font-size: 10pt;
      border-top: 1px solid #000;
      padding-top: 0.5em;
    }
    
    /* Print-specific styles */
    @media print {
      body {
        padding: 0.5in;
      }
      
      .footer-block {
        position: fixed;
        bottom: 0.5in;
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 8.5in) {
      body {
        padding: 0.5in;
        font-size: 11pt;
      }
    }
  `;
};

/**
 * Render AST root to HTML
 */
export const renderAST = (ast: DocumentAST['ast']): string => {
  if (!ast) return '<p>No document content available.</p>';
  
  let html = '';
  
  // Render caption
  if (ast.caption) {
    html += renderCaption(ast.caption);
  }
  
  // Render sections
  if (ast.sections && Array.isArray(ast.sections)) {
    html += ast.sections.map(renderSection).join('');
  }
  
  return html;
};

/**
 * Render document caption
 */
const renderCaption = (caption: NonNullable<DocumentAST['ast']['caption']>): string => {
  return `
    <div class="caption">
      <div class="court">${caption.court || ''}</div>
      <div class="parties">${caption.parties || ''}</div>
      <div class="docket">${caption.docket || ''}</div>
      <div class="title">${caption.title || ''}</div>
    </div>
  `;
};

/**
 * Render document section
 */
const renderSection = (section: NonNullable<DocumentAST['ast']['sections']>[0]): string => {
  return `
    <div class="section">
      <h2 class="section-heading">${section.id || ''}. ${section.heading || ''}</h2>
      ${renderContent(section.content || [])}
    </div>
  `;
};

/**
 * Render content nodes within a section
 */
export const renderContent = (content: ContentNode[]): string => {
  if (!Array.isArray(content)) return '';
  
  return content.map(renderContentNode).join('');
};

/**
 * Render individual content node
 */
const renderContentNode = (node: ContentNode): string => {
  switch (node.type) {
  case 'paragraph':
    return `<p class="paragraph">${node.text || ''}</p>`;
      
  case 'list':
    const listItems = node.items?.map((item) => 
      `<li class="list-item">${item.text || ''}</li>`
    ).join('') || '';
    return `<ol class="list">${listItems}</ol>`;
      
  case 'recital':
    return `<p class="recital">${node.text || ''}</p>`;
      
  case 'table':
    return renderTable(node);
      
  case 'exhibit':
    return `<div class="exhibit-label">Exhibit ${node.id}: ${node.text || ''}</div>`;
      
  case 'signature':
    return renderSignature(node);
      
  case 'footer':
    return `<div class="footer-block">${node.text || ''}</div>`;
      
  default:
    return `<p>Unknown node type: ${(node as any).type}</p>`;
  }
};

/**
 * Render table content node
 */
const renderTable = (node: ContentNode): string => {
  const headers = node.headers?.map((header: string) => 
    `<th>${header}</th>`
  ).join('') || '';
  
  const rows = node.rows?.map((row: string[]) => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('') || '';
  
  return `
    <table class="table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

/**
 * Render signature content node
 */
const renderSignature = (node: ContentNode): string => {
  return `
    <div class="signature-block">
      <p><strong>Signature:</strong> ${node.signerName || ''}</p>
      <p><strong>Title:</strong> ${node.signerTitle || ''}</p>
      <p><strong>Date:</strong> ${node.date || ''}</p>
    </div>
  `;
}; 