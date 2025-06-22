/**
 * MobileCanvasLayout Component
 * @module MobileCanvasLayout
 */

import React from 'react';
import { DocumentViewport } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport';
import { SlotPanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/SlotPanel/SlotPanel';
import { MobileLayout, CenterContent } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/MobileCanvasLayout/MobileCanvasLayout.styles';
import { useMobileCanvasLayout } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/MobileCanvasLayout/MobileCanvasLayout.hook';
import type { MobileCanvasLayoutProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/EditorCanvas/components/MobileCanvasLayout/MobileCanvasLayout.types';

export const MobileCanvasLayout: React.FC<MobileCanvasLayoutProps> = ({
  document,
  panelSlots,
  panelCalculations,
  panelHandlers,
  layoutState,
  onPanelClose,
  onPanelSplit,
  containerDimensions,
  onInsertNode
}) => {
  const {
    createPanelPropsCallback,
    handlePageChange,
    handleViewModeChange,
  } = useMobileCanvasLayout({
    panelSlots,
    layoutState,
    panelCalculations,
    panelHandlers,
    onPanelClose,
    onPanelSplit,
  });

  const renderPanel = (panel: typeof panelSlots[0]) => {
    const panelProps = createPanelPropsCallback(panel);
    return <SlotPanel {...panelProps} />;
  };

  return (
    <MobileLayout>
      {/* Main document area */}
      <CenterContent>
        {document && (
          <DocumentViewport 
            document={document} 
            onPageChange={handlePageChange}
            onViewModeChange={handleViewModeChange}
            onInsertNode={onInsertNode}
          />
        )}
      </CenterContent>
     
      {/* Mobile panels as bottom sheets */}
      {panelSlots.map(renderPanel)}
    </MobileLayout>
  );
}; 