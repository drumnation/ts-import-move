/**
 * PreviewIframe Component Types
 */

export interface PreviewIframeProps {
  /** Document ID to preview */
  documentId: string;
  /** Iframe width */
  width?: string | number;
  /** Iframe height */
  height?: string | number;
  /** Show refresh and external link controls */
  showControls?: boolean;
  /** Error callback */
  onError?: (error: string) => void;
  /** Custom CSS class */
  className?: string;
}

export interface DocumentAST {
  ast: {
    caption?: {
      court?: string;
      parties?: string;
      docket?: string;
      title?: string;
    };
    sections?: Array<{
      id?: string;
      heading?: string;
      content?: ContentNode[];
    }>;
  };
  metadata?: {
    title?: string;
  };
}

export interface ContentNode {
  type: 'paragraph' | 'list' | 'recital' | 'table' | 'exhibit' | 'signature' | 'footer';
  text?: string;
  id?: string;
  items?: Array<{ text: string }>;
  headers?: string[];
  rows?: string[][];
  signerName?: string;
  signerTitle?: string;
  date?: string;
}

export interface PreviewState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
} 