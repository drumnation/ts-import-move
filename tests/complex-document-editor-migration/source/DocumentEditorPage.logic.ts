/**
 * DocumentEditorPage Business Logic
 * @module DocumentEditorPage.logic
 */

import { 
  Doc, 
  Node, 
  ParagraphNode, 
  ListNode, 
  RecitalNode, 
  TableBlock,
  ExhibitLabel,
  SignatureBlock,
  FooterBlock,
  Section
} from '../../types/legal-document-ast';
import { NodeType } from '../../shared-components/molecules/NodePalette/NodePalette.types';
import { v4 as uuidv4 } from 'uuid';
import type { LegalDocument } from '../../types/legal-document-ast';
import type { DocumentPoolEntry, RecentDocument } from './DocumentEditorPage.types';

/**
 * Create a new empty node of the specified type
 */
export const createEmptyNode = (nodeType: NodeType): Node | ExhibitLabel | SignatureBlock | FooterBlock => {
  switch (nodeType) {
  case 'paragraph':
    return {
      type: 'paragraph',
      text: 'Enter paragraph text here...'
    } as ParagraphNode;
      
  case 'list':
    return {
      type: 'list',
      style: 'decimal',
      items: [{ text: 'List item 1', children: [] }]
    } as ListNode;
      
  case 'recital':
    return {
      type: 'recital',
      text: 'WHEREAS, enter recital text here...'
    } as RecitalNode;
      
  case 'table':
    return {
      type: 'table',
      headers: ['Column 1', 'Column 2'],
      rows: [['Row 1 Col 1', 'Row 1 Col 2']]
    } as TableBlock;
      
  case 'exhibit':
    return {
      id: `A-${Date.now()}`,
      text: 'Exhibit A'
    } as ExhibitLabel;
      
  case 'signature':
    return {
      signerName: 'Signer Name',
      signerTitle: 'Title',
      date: new Date().toISOString().split('T')[0]
    } as SignatureBlock;
      
  case 'footer':
    return {
      text: 'Page 1 of 1'
    } as FooterBlock;
      
  default:
    throw new Error(`Unknown node type: ${nodeType}`);
  }
};

/**
 * Insert a node into a document's first section or create a new section if none exist
 */
export const insertNodeIntoDocument = (doc: Doc, nodeType: NodeType): Doc => {
  const newNode = createEmptyNode(nodeType);
  
  // Handle special cases for document-level elements
  if (nodeType === 'exhibit') {
    return {
      ...doc,
      exhibits: [...(doc.exhibits || []), newNode as ExhibitLabel]
    };
  }
  
  if (nodeType === 'signature') {
    return {
      ...doc,
      signatureBlock: newNode as SignatureBlock
    };
  }
  
  if (nodeType === 'footer') {
    return {
      ...doc,
      footerBlock: newNode as FooterBlock
    };
  }
  
  // For content nodes, add to first section or create new section
  const updatedDoc = { ...doc };
  
  if (updatedDoc.sections.length === 0) {
    // Create first section if none exist
    updatedDoc.sections = [{
      id: 'I',
      heading: 'Section I',
      content: [newNode as Node]
    }];
  } else {
    // Add to first section
    const firstSection = updatedDoc.sections[0];
    updatedDoc.sections[0] = {
      ...firstSection,
      content: [...firstSection.content, newNode as Node]
    };
  }
  
  return updatedDoc;
};

/**
 * Create a sample document with basic structure
 */
export const createSampleDocumentStructure = (): Doc => {
  return {
    caption: {
      court: 'SUPERIOR COURT OF CALIFORNIA',
      parties: 'PLAINTIFF vs. DEFENDANT',
      docket: 'Case No. 2025-000001',
      title: 'SAMPLE LEGAL DOCUMENT'
    },
    sections: [
      {
        id: 'I',
        heading: 'Introduction',
        content: [
          {
            type: 'paragraph',
            text: 'This is a sample paragraph demonstrating the document structure.'
          } as ParagraphNode,
          {
            type: 'recital',
            text: 'WHEREAS, this document serves as an example of the AST structure;'
          } as RecitalNode
        ]
      }
    ],
    exhibits: [
      {
        id: 'A',
        text: 'Exhibit A - Sample Document'
      }
    ]
  };
};

/**
 * Validate that a document has the minimum required structure
 */
export const validateDocumentStructure = (doc: Doc): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!doc.caption) {
    errors.push('Document must have a caption block');
  }
  
  if (!doc.caption?.court?.trim()) {
    errors.push('Caption must include court name');
  }
  
  if (!doc.caption?.parties?.trim()) {
    errors.push('Caption must include parties');
  }
  
  if (!doc.sections || doc.sections.length === 0) {
    errors.push('Document must have at least one section');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate mock legal document based on action type
 */
export const generateMockDocument = (actionId: string): LegalDocument => {
  const baseDocument: LegalDocument = {
    metadata: {
      id: `doc-${Date.now()}`,
      title: `AI Generated ${actionId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    },
    content: {
      caption: {
        court: 'UNITED STATES DISTRICT COURT',
        parties: 'John Doe vs. ABC Corporation',
        docket: '1:23-cv-12345',
        title: getDocumentTitle(actionId)
      },
      sections: [
        {
          id: '1',
          heading: `${actionId.toUpperCase()} SECTION`,
          content: [
            {
              type: 'paragraph',
              text: getDocumentContent(actionId)
            }
          ]
        }
      ]
    }
  };

  return baseDocument;
};

/**
 * Get document title based on action type
 */
const getDocumentTitle = (actionId: string): string => {
  const titleMap: Record<string, string> = {
    'create-motion': 'Motion to Dismiss',
    'draft-brief': 'Legal Brief',
    'format-pleading': 'Pleading',
    'cite-check': 'Citation Analysis Report',
    'exhibit-labels': 'Exhibit Labels',
    'custom-prompt': 'Custom Document'
  };

  return titleMap[actionId] || 'Legal Document';
};

/**
 * Get document content based on action type
 */
const getDocumentContent = (actionId: string): string => {
  const contentMap: Record<string, string> = {
    'create-motion': 'This document was generated by AI for motion to dismiss. Professional legal formatting applied automatically with proper citations and structure.',
    'draft-brief': 'This legal brief was generated using AI with comprehensive legal analysis, proper citations, and structured arguments.',
    'format-pleading': 'This pleading has been formatted according to court requirements with proper spacing, margins, and legal formatting.',
    'cite-check': 'Citation analysis completed. All legal citations have been verified and formatted according to current legal standards.',
    'exhibit-labels': 'Exhibit labels have been generated with proper formatting and sequential labeling.',
    'custom-prompt': 'This document was generated based on your custom AI prompt with professional legal formatting.'
  };

  return contentMap[actionId] || `This document was generated by AI for ${actionId}. Professional legal formatting applied automatically.`;
};

/**
 * Calculate document statistics from content
 */
export const calculateDocumentStats = (document: LegalDocument | null) => {
  if (!document) {
    return {
      words: 0,
      pages: 0,
      characters: 0,
      lastModified: 'Never'
    };
  }

  // Extract all text content from sections
  const allText = document.content.sections
    .map(section => 
      section.content
        .filter(node => node.type === 'paragraph')
        .map(node => (node as any).text || '')
        .join(' ')
    )
    .join(' ');

  const words = allText.split(/\s+/).filter(word => word.length > 0).length;
  const characters = allText.length;
  const pages = Math.max(1, Math.ceil(words / 250)); // Estimate 250 words per page

  return {
    words,
    pages,
    characters,
    lastModified: new Date(document.metadata.updatedAt).toLocaleString()
  };
};

/**
 * Validate document type selection
 */
export const validateDocumentType = (documentType: string): boolean => {
  const validTypes = ['motion', 'brief', 'pleading', 'contract', 'agreement', 'memo'];
  return validTypes.indexOf(documentType.toLowerCase()) !== -1;
};

/**
 * Get document type options for selection
 */
export const getDocumentTypeOptions = () => [
  { value: 'motion', label: 'Motion' },
  { value: 'brief', label: 'Legal Brief' },
  { value: 'pleading', label: 'Pleading' },
  { value: 'contract', label: 'Contract' },
  { value: 'agreement', label: 'Agreement' },
  { value: 'memo', label: 'Legal Memo' }
];

/**
 * Get sample document pool entries
 */
export const getSampleDocumentPool = (): DocumentPoolEntry[] => [
  { id: '1', title: 'Motion to Dismiss', type: 'Motion', status: 'Draft' },
  { id: '2', title: 'Brief in Support', type: 'Brief', status: 'Review' },
  { id: '3', title: 'Settlement Agreement', type: 'Agreement', status: 'Final' }
];

/**
 * Get recent documents
 */
export const getRecentDocuments = (): RecentDocument[] => [
  { id: '1', title: 'Contract Amendment', accessed: '2 hours ago' },
  { id: '2', title: 'Discovery Motion', accessed: 'Yesterday' },
  { id: '3', title: 'Settlement Agreement', accessed: '3 days ago' }
];

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validate AI prompt input
 */
export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  const trimmedPrompt = prompt.trim();
  
  if (!trimmedPrompt) {
    return { isValid: false, error: 'Prompt cannot be empty' };
  }
  
  if (trimmedPrompt.length < 10) {
    return { isValid: false, error: 'Prompt must be at least 10 characters' };
  }
  
  if (trimmedPrompt.length > 1000) {
    return { isValid: false, error: 'Prompt must be less than 1000 characters' };
  }
  
  return { isValid: true };
};

/**
 * Generate document outline from content
 */
export const generateDocumentOutline = (document: LegalDocument | null) => {
  if (!document) {
    return [
      { id: '1', title: 'I. Introduction', active: true },
      { id: '2', title: 'II. Statement of Facts', active: false },
      { id: '3', title: 'III. Legal Argument', active: false },
      { id: '4', title: 'IV. Conclusion', active: false }
    ];
  }

  return document.content.sections.map((section, index) => ({
    id: section.id,
    title: section.heading,
    active: index === 0
  }));
};

/**
 * Generate sample document content text for demo purposes
 */
export const getSampleDocumentText = () => ({
  title: 'MOTION TO DISMISS',
  caseNumber: 'Case No. [Case Number]',
  content: {
    introduction: 'TO THE HONORABLE COURT:',
    paragraphs: [
      'Defendant respectfully moves this Court to dismiss the complaint filed by Plaintiff pursuant to Federal Rule of Civil Procedure 12(b)(6) for failure to state a claim upon which relief can be granted.',
      'This motion is supported by the memorandum of law filed herewith.'
    ],
    signature: {
      closing: 'Respectfully submitted,',
      attorney: '[Attorney Name]',
      barNumber: '[Bar Number]',
      firm: '[Law Firm]',
      address: '[Address]',
      phone: '[Phone]',
      email: '[Email]'
    }
  }
});

/**
 * Create sample legal document for testing
 */
export const createSampleLegalDocument = (): LegalDocument => ({
  metadata: {
    id: 'doc-1',
    title: 'Motion to Dismiss',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Legal AI Assistant',
    version: '1.0.0',
    status: 'draft'
  },
  content: {
    caption: {
      court: 'UNITED STATES DISTRICT COURT FOR THE EASTERN DISTRICT OF PENNSYLVANIA',
      parties: 'John Doe, Plaintiff v. ABC Corporation, Defendant',
      docket: 'Civil Action No. 24-12345',
      title: 'MOTION TO DISMISS'
    },
    sections: [
      {
        id: 'I',
        heading: 'INTRODUCTION',
        content: [
          {
            type: 'paragraph',
            text: 'Defendant respectfully moves this Court to dismiss the complaint filed by Plaintiff pursuant to Federal Rule of Civil Procedure 12(b)(6) for failure to state a claim upon which relief can be granted.'
          }
        ]
      }
    ]
  }
}); 