/**
 * DocumentEditorLayout Component
 * 
 * Main layout orchestrator for the document editor interface
 * Handles platform-specific layouts, panel coordination, and safe area management
 * 
 * Renamed from EditorCanvas for better AI agent discoverability
 * 
 * @module DocumentEditorLayout
 */

import React from 'react';
import { LayoutContainer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.styles';
import { useDocumentEditorLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook';
import { MobileCanvasLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/components/MobileCanvasLayout';
import { DesktopCanvasLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/components/DesktopCanvasLayout';
import type { DocumentEditorLayoutProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.types';

/**
 * DocumentEditorLayout Component
 * 
 * The primary layout orchestrator for the document editor interface.
 * Responsibilities:
 * - Platform detection and layout switching (mobile/desktop)
 * - Panel coordination across left, right, and center areas
 * - Safe area management for mobile devices
 * - Document viewport management
 * - Resize and split operation coordination
 */
export const DocumentEditorLayout: React.FC<DocumentEditorLayoutProps> = ({
  document,
  panelSlots,
  onPanelResize,
  onPanelToggle,
  onPanelClose,
  onPanelSplit
}) => {
  const {
    safeAreaInsets,
    layoutState,
    isMobile,
    groupedPanels,
    panelCalculations,
    panelHandlers,
    onPanelClose: handlePanelClose,
    onPanelSplit: handlePanelSplit,
    containerRef,
    containerDimensions
  } = useDocumentEditorLayout({
    panelSlots,
    onPanelResize,
    onPanelToggle,
    onPanelClose,
    onPanelSplit
  });

  const layoutContainerProps = {
    ref: containerRef,
    safeAreaTop: safeAreaInsets.top,
    safeAreaBottom: safeAreaInsets.bottom,
    safeAreaLeft: safeAreaInsets.left,
    safeAreaRight: safeAreaInsets.right,
    isMobile,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  };

  const platformLayoutProps = {
    document,
    panelCalculations,
    panelHandlers,
    layoutState,
    onPanelClose: handlePanelClose,
    onPanelSplit: handlePanelSplit,
    containerDimensions
  };

  return (
    <LayoutContainer {...layoutContainerProps}>
      {isMobile ? (
        <MobileCanvasLayout
          {...platformLayoutProps}
          panelSlots={panelSlots}
        />
      ) : (
        <DesktopCanvasLayout
          {...platformLayoutProps}
          groupedPanels={groupedPanels}
        />
      )}
    </LayoutContainer>
  );
}; 