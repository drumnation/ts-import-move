/**
 * EditorCanvas Component
 * 
 * Full-viewport editor canvas with safe area support and dynamic panel sizing
 * 
 * @module EditorCanvas
 */

import React from 'react';
import { CanvasContainer } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.styles';
import { useEditorCanvas } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.hook';
import { MobileCanvasLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/MobileCanvasLayout';
import { DesktopCanvasLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout';
import type { EditorCanvasProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/EditorCanvas.types';

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  document,
  panelSlots,
  onPanelResize,
  onPanelToggle,
  onPanelClose,
  onPanelSplit,
  onInsertNode
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
  } = useEditorCanvas({
    panelSlots,
    onPanelResize,
    onPanelToggle,
    onPanelClose,
    onPanelSplit
  });

  const canvasProps = {
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

  const layoutProps = {
    document,
    panelCalculations,
    panelHandlers,
    layoutState,
    onPanelClose: handlePanelClose,
    onPanelSplit: handlePanelSplit,
    containerDimensions,
    onInsertNode
  };

  return (
    <CanvasContainer {...canvasProps}>
      {isMobile ? (
        <MobileCanvasLayout
          {...layoutProps}
          panelSlots={panelSlots}
        />
      ) : (
        <DesktopCanvasLayout
          {...layoutProps}
          groupedPanels={groupedPanels}
        />
      )}
    </CanvasContainer>
  );
}; 