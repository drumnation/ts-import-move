import { useEffect, useRef, useState, useCallback } from 'react';
import { DocumentAST, PreviewState } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PreviewIframe/PreviewIframe.types';
import { generatePreviewHTML } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PreviewIframe/PreviewIframe.logic';

interface UsePreviewIframeOptions {
  documentId: string;
  onError?: (error: string) => void;
}

export const usePreviewIframe = ({ documentId, onError }: UsePreviewIframeOptions) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<PreviewState>({
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  /**
   * Fetch document preview data from API
   */
  const fetchPreviewData = useCallback(async (): Promise<DocumentAST> => {
    const response = await fetch('/api/doc/export-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to load preview: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to load document preview');
    }

    return result.data;
  }, [documentId]);

  /**
   * Load HTML content into iframe
   */
  const loadContentIntoIframe = useCallback((htmlContent: string): void => {
    const iframe = iframeRef.current;
    
    if (iframe?.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();
    }
  }, []);

  /**
   * Load and display document preview
   */
  const loadPreview = useCallback(async (): Promise<void> => {
    if (!documentId) {
      const errorMessage = 'No document ID provided';
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const astData = await fetchPreviewData();
      const htmlContent = generatePreviewHTML(astData);
      
      loadContentIntoIframe(htmlContent);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        lastUpdated: new Date() 
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      onError?.(errorMessage);
    }
  }, [documentId, fetchPreviewData, loadContentIntoIframe, onError]);

  /**
   * Open preview content in new window
   */
  const openInNewWindow = useCallback((): void => {
    if (iframeRef.current?.contentDocument) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(iframeRef.current.contentDocument.documentElement.outerHTML);
        newWindow.document.close();
      }
    }
  }, []);

  // Load preview when documentId changes
  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  return {
    iframeRef,
    state,
    actions: {
      loadPreview,
      openInNewWindow,
    },
  };
}; 