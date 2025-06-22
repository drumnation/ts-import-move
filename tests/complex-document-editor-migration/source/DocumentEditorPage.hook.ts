/**
 * DocumentEditorPage Custom Hook
 * @module DocumentEditorPage.hook
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  PanelState,
  DocumentState,
  AIAgentState,
  AIAgentAction,
  CanvasVariant,
  DocumentStats,
  EditorLayoutState,
  PanelLayout,
  SafeAreaInsets
} from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.types';
import type { LegalDocument, Node, ParagraphNode } from '@/tests/types/legal-document-ast';
import { 
  IconFileText,
  IconScale,
  IconWand,
  IconBrain,
  IconPalette,
  IconSparkles
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import type { LexicalASTNode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/LexicalEditor/LexicalEditor.types';
import { createSampleLegalDocument } from '@/tests/complex-document-editor-migration/source/DocumentEditorPage.logic';
import { DocumentStore } from '@/tests/stores/DocumentStore';
import { debounce } from 'lodash';

/**
 * Main hook for DocumentEditorPage state management
 */
export const useDocumentEditor = () => {
  // Panel state
  const [panelState, setPanelState] = useState<PanelState>({
    leftPanelExpanded: true,
    rightPanelExpanded: true,
    activeLeftTab: 'palette',
    activeRightTab: 'agent'
  });

  // Document state
  const [documentState, setDocumentState] = useState<DocumentState>({
    document: null,
    selectedNode: null,
    isGenerating: false,
    documentType: ''
  });

  // AI Agent state
  const [aiAgentState, setAIAgentState] = useState<AIAgentState>({
    agentPrompt: '',
    agentActions: [
      { 
        id: 'create-motion', 
        label: 'Create Motion to Dismiss', 
        icon: IconFileText, 
        description: 'Generate a motion to dismiss with proper legal formatting' 
      },
      { 
        id: 'draft-brief', 
        label: 'Draft Legal Brief', 
        icon: IconScale, 
        description: 'Create a comprehensive legal brief with citations' 
      },
      { 
        id: 'format-pleading', 
        label: 'Format Pleading', 
        icon: IconWand, 
        description: 'Apply proper court formatting to existing text' 
      },
      { 
        id: 'cite-check', 
        label: 'Citation Analysis', 
        icon: IconBrain, 
        description: 'Verify and format legal citations' 
      },
      { 
        id: 'exhibit-labels', 
        label: 'Generate Exhibit Labels', 
        icon: IconPalette, 
        description: 'Create properly formatted exhibit labels' 
      },
      { 
        id: 'custom-prompt', 
        label: 'Custom AI Task', 
        icon: IconSparkles, 
        description: 'Describe what you want the AI to create' 
      }
    ]
  });

  // Panel control functions
  const toggleLeftPanel = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      leftPanelExpanded: !prev.leftPanelExpanded
    }));
  }, []);

  const toggleRightPanel = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      rightPanelExpanded: !prev.rightPanelExpanded
    }));
  }, []);

  const setActiveLeftTab = useCallback((tab: PanelState['activeLeftTab']) => {
    setPanelState(prev => ({ ...prev, activeLeftTab: tab }));
  }, []);

  const setActiveRightTab = useCallback((tab: PanelState['activeRightTab']) => {
    setPanelState(prev => ({ ...prev, activeRightTab: tab }));
  }, []);

  // Document functions
  const setDocument = useCallback((document: LegalDocument | null) => {
    setDocumentState(prev => ({ ...prev, document }));
  }, []);

  const setSelectedNode = useCallback((node: Node | null) => {
    setDocumentState(prev => ({ ...prev, selectedNode: node }));
  }, []);

  const setDocumentType = useCallback((documentType: string) => {
    setDocumentState(prev => ({ ...prev, documentType }));
  }, []);

  // AI Agent functions
  const setAgentPrompt = useCallback((prompt: string) => {
    setAIAgentState(prev => ({ ...prev, agentPrompt: prompt }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setDocumentState(prev => ({ ...prev, isGenerating }));
  }, []);

  // Get canvas variant based on panel states
  const getCanvasVariant = useCallback((): CanvasVariant => {
    const { leftPanelExpanded, rightPanelExpanded } = panelState;
    
    if (leftPanelExpanded && rightPanelExpanded) return 'expanded';
    if (leftPanelExpanded && !rightPanelExpanded) return 'leftOnly';
    if (!leftPanelExpanded && rightPanelExpanded) return 'rightOnly';
    return 'minimal';
  }, [panelState]);

  return {
    // State
    panelState,
    documentState,
    aiAgentState,
    
    // Panel controls
    toggleLeftPanel,
    toggleRightPanel,
    setActiveLeftTab,
    setActiveRightTab,
    
    // Document controls
    setDocument,
    setSelectedNode,
    setDocumentType,
    
    // AI Agent controls
    setAgentPrompt,
    setIsGenerating,
    
    // Computed values
    getCanvasVariant
  };
};

/**
 * Hook for managing document statistics
 */
export const useDocumentStats = (document: LegalDocument | null): DocumentStats => {
  const stats: DocumentStats = {
    words: 156,
    pages: 1,
    characters: 892,
    lastModified: 'Today at 2:34 PM'
  };

  // TODO: Implement actual document statistics calculation
  // This would analyze the document content and calculate real stats
  
  return stats;
};

/**
 * Platform detection hook for responsive behavior
 */
export const usePlatformDetection = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const platform = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet, isDesktop]);

  const touchTargetConfig = useMemo(() => ({
    minSize: isMobile ? 44 : 32,
    spacing: isMobile ? 12 : 8,
    primaryActionHeight: isMobile ? 56 : 40
  }), [isMobile]);

  return {
    platform,
    isMobile,
    isTablet,
    isDesktop,
    touchTargetConfig
  };
};

/**
 * Safe area detection hook for mobile devices
 */
export const useSafeAreaInsets = (): SafeAreaInsets => {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateInsets = () => {
      // Use CSS env() variables for safe areas
      const computedStyle = getComputedStyle(document.documentElement);
      
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10)
      });
    };

    // Set CSS custom properties for safe areas
    if (CSS.supports('padding: env(safe-area-inset-top)')) {
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    }

    updateInsets();
    window.addEventListener('resize', updateInsets);
    window.addEventListener('orientationchange', updateInsets);

    return () => {
      window.removeEventListener('resize', updateInsets);
      window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return insets;
};

/**
 * @deprecated This hook has been replaced with Redux-based layout management.
 * Use the layout slice and selectors from stores/layout.slice.ts instead.
 * 
 * Migration complete - this hook is no longer needed as layout state
 * is now managed through Redux with proper persistence middleware.
 */

/**
 * Hook for managing document content and changes
 */
export const useDocumentContent = () => {
  const [currentDocument, setCurrentDocument] = useState<LegalDocument | null>(() => {
    // Create initial sample document
    return createSampleLegalDocument();
  });

  // Handle editor content changes
  const debouncedSave = useMemo(() => debounce((doc) => {
    if (doc) DocumentStore.saveDocument(doc);
  }, 1000), []);

  const handleContentChange = useCallback((nodes: LexicalASTNode[]) => {
    console.log('📝 Editor content changed:', nodes);
    
    // Convert Lexical nodes back to AST and update document
    setCurrentDocument(prev => {
      if (!prev) return prev;
      
      // For now, update the first section's content
      // In a full implementation, this would be more sophisticated
      const updatedDocument = {
        ...prev,
        content: {
          ...prev.content,
          sections: prev.content.sections.map((section, index) => {
            if (index === 0) {
              // Update first section with new content
              const paragraphNodes = nodes
                .filter(node => node.type === 'paragraph')
                .map(node => ({
                  type: 'paragraph' as const,
                  text: node.text
                }));
              
              return {
                ...section,
                content: paragraphNodes
              };
            }
            return section;
          })
        }
      };
      debouncedSave(updatedDocument);
      return updatedDocument;
    });
  }, [debouncedSave]);

  const updateDocument = useCallback((updater: (doc: LegalDocument | null) => LegalDocument | null) => {
    setCurrentDocument(updater);
  }, []);

  // Handle node insertion from palette
  const handleInsertNode = useCallback((nodeType: string) => {
    console.log('🎯 Inserting node:', nodeType);
    
    setCurrentDocument(prev => {
      if (!prev) return prev;
      
      // Map palette command names to AST node types
      let newNode: Node;
      switch (nodeType) {
      case 'paragraph':
        newNode = {
          type: 'paragraph',
          text: 'New paragraph text...'
        } as ParagraphNode;
        break;
      case 'heading':
        // For now, treat heading as paragraph - will be enhanced later
        newNode = {
          type: 'paragraph',
          text: 'New Heading'
        } as ParagraphNode;
        break;
      default:
        console.warn(`Unknown node type: ${nodeType}`);
        return prev;
      }
      
      // Insert into first section
      const updatedDocument = {
        ...prev,
        content: {
          ...prev.content,
          sections: prev.content.sections.map((section, index) => {
            if (index === 0) {
              return {
                ...section,
                content: [...section.content, newNode]
              };
            }
            return section;
          })
        }
      };
      
      debouncedSave(updatedDocument);
      return updatedDocument;
    });
  }, [debouncedSave]);

  return {
    currentDocument,
    handleContentChange,
    updateDocument,
    setCurrentDocument,
    handleInsertNode
  };
}; 