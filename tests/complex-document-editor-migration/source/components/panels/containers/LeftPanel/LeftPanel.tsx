/**
 * LeftPanel Component
 * 
 * Main left panel container with platform-specific implementations
 * Visual mapping: Left sidebar containing resizable top/bottom panels
 * 
 * @module LeftPanel
 */

import React from 'react';
import { PlatformRouter } from '@/tests/complex-document-editor-migration/source/components/panels/containers/layout/PlatformDetection';
import { LeftPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.desktop';
import { LeftPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.mobile';
import { useLeftPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.logic';
import type { LeftPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/containers/LeftPanel/LeftPanel.types';

/**
 * Main LeftPanel component with platform routing
 */
export const LeftPanel: React.FC<LeftPanelProps> = (props) => {
  const leftPanelLogic = useLeftPanel(props);

  return (
    <PlatformRouter
      desktop={LeftPanelDesktop}
      mobile={LeftPanelMobile}
      props={{ ...props, ...leftPanelLogic }}
    />
  );
}; 