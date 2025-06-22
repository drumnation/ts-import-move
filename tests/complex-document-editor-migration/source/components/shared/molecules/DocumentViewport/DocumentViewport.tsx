/**
 * DocumentViewport Component
 * 
 * Multi-page document viewer with infinite scroll, thumbnail navigation, and mobile-first design
 * 
 * @module DocumentViewport
 */

import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Group, Text, ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDocumentViewport } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.hook';
import { 
  ViewportContainer, 
  ViewportHeader, 
  PageContainer, 
  NavigationControls,
  ThumbnailGrid 
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.styles';
import { ViewportControls } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/components/ViewportControls';
import { DocumentPage } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/components/DocumentPage';
import { EditorNodePalette } from '@/shared-components/molecules/EditorNodePalette';
import type { DocumentViewportProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.types';
import type { DocumentPage as DocumentPageData } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';
import type { NodeCommandWithMetadata } from '@/shared-components/molecules/EditorNodePalette/EditorNodePalette.types';

export const DocumentViewport: React.FC<DocumentViewportProps> = (props) => {
  const {
    // Platform detection
    touchTargetConfig,
    isMobile,
    
    // Zoom functionality
    zoom,
    handleZoomIn,
    handleZoomOut,
    canZoomIn,
    canZoomOut,
    
    // Navigation functionality
    handlePrevPage,
    handleNextPage,
    canGoNext,
    canGoPrev,
    
    // Page interaction
    handlePageClick,
    
    // Container ref
    containerRef,
    
    // Document data
    document
  } = useDocumentViewport(props);

  const { onViewModeChange, onInsertNode } = props;

  // Node palette state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [palettePosition, setPalettePosition] = useState<{x:number;y:number}|undefined>(undefined);

  // Handle node palette toggle
  const handlePaletteToggle = useCallback(() => {
    setIsPaletteOpen(prev => {
      const next = !prev;
      if(next && addButtonRef.current){
        const rect = addButtonRef.current.getBoundingClientRect();
        setPalettePosition({x: rect.left, y: rect.bottom + 4});
      }
      return next;
    });
  }, []);

  // Handle command selection from palette
  const handleCommandSelect = useCallback(async (command: NodeCommandWithMetadata) => {
    console.log('Selected command:', command);
    
    // Insert node into document if handler provided
    if (onInsertNode) {
      onInsertNode(command.name);
    }
    
    setIsPaletteOpen(false);
  }, [onInsertNode]);

  // Keyboard shortcuts for palette
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      setIsPaletteOpen(prev => !prev);
    }
  }, []);

  const renderPage = (page: DocumentPageData, index: number) => (
    <DocumentPage
      key={page.id}
      page={page}
      index={index}
      currentPageIndex={document.currentPageIndex}
      viewMode={document.viewMode}
      isMobile={!!isMobile}
      zoom={zoom}
      onPageClick={handlePageClick}
    />
  );

  const renderPages = () => {
    switch (document.viewMode) {
    case 'single': {
      const currentPage = document.pages[document.currentPageIndex];
      return currentPage ? renderPage(currentPage, document.currentPageIndex) : null;
    }
        
    case 'infinite':
      return document.pages.map((page, index) => renderPage(page, index));
        
    case 'thumbnail':
      return (
        <ThumbnailGrid isMobile={!!isMobile}>
          {document.pages.map((page, index) => renderPage(page, index))}
        </ThumbnailGrid>
      );
        
    default:
      return null;
    }
  };

  return (
    <ViewportContainer 
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make container focusable for keyboard events
    >
      <ViewportHeader isMobile={!!isMobile}>
        <Group gap={isMobile ? 'md' : 'sm'}>
          <Text size={isMobile ? 'md' : 'sm'} fw={600}>
            Page {document.currentPageIndex + 1} of {document.totalPages}
          </Text>
        </Group>

        <NavigationControls isMobile={!!isMobile}>
          <Group gap="xs">
            {isMobile && (
              <ActionIcon
                ref={addButtonRef as any}
                variant="subtle"
                size={isMobile ? 'md' : 'sm'}
                onClick={handlePaletteToggle}
                title="Add node (Ctrl+/)"
                style={{
                  color: isPaletteOpen ? 'var(--mantine-color-blue-6)' : undefined
                }}
              >
                <IconPlus size={16} />
              </ActionIcon>
            )}

            <ViewportControls
              viewMode={document.viewMode}
              zoom={zoom}
              touchTargetConfig={touchTargetConfig}
              isMobile={!!isMobile}
              canZoomIn={canZoomIn}
              canZoomOut={canZoomOut}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              onViewModeChange={onViewModeChange}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </Group>
        </NavigationControls>
      </ViewportHeader>

      <PageContainer 
        viewMode={document.viewMode} 
        isMobile={!!isMobile}
      >
        <AnimatePresence mode="wait">
          {renderPages()}
        </AnimatePresence>
      </PageContainer>

      {/* Node insertion palette */}
      <EditorNodePalette
        isOpen={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        onCommandSelect={handleCommandSelect}
        documentId={document.id || 'current-document'}
        searchPlaceholder="Search for nodes to insert..."
        showCategories={true}
        maxHeight={400}
        position={palettePosition}
      />
    </ViewportContainer>
  );
}; 