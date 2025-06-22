/**
 * RightPanel Component
 * 
 * Main right panel container with platform-specific implementations
 * Visual mapping: Right sidebar containing resizable top/bottom panels
 * Follows established LeftPanel pattern for consistency
 * 
 * @module RightPanel
 */

import React from 'react';
import { PlatformRouter } from '@/tests/complex-document-editor-migration/source/components/panels/containers/layout/PlatformDetection';
import { RightPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.desktop';
import { RightPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.mobile';
import { useRightPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.logic';
import type { RightPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/containers/RightPanel/RightPanel.types';

/**
 * Main RightPanel component with platform routing
 * Uses named export following React component standards
 */
export const RightPanel: React.FC<RightPanelProps> = (props) => {
  const rightPanelLogic = useRightPanel(props);

  return (
    <PlatformRouter
      desktop={RightPanelDesktop}
      mobile={RightPanelMobile}
      props={{ ...props, ...rightPanelLogic }}
    />
  );
}; 