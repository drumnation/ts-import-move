/**
 * MobileCanvasLayout Component
 * @module MobileCanvasLayout
 */

import React from 'react';
import { DocumentViewport } from '../../../DocumentViewport/DocumentViewport';
import { SlotPanel } from '../../../SlotPanel/SlotPanel';
import { MobileLayout, CenterContent } from './MobileCanvasLayout.styles';
import { useMobileCanvasLayout } from './MobileCanvasLayout.hook';
import type { MobileCanvasLayoutProps } from './MobileCanvasLayout.types';

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