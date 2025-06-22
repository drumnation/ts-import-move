/**
 * CenterPanel Component
 * 
 * Main center panel container with platform-specific implementations
 * Visual mapping: Document canvas with optional bottom panel for tools
 * Completes the three-panel layout system (Left-Center-Right)
 * 
 * @module CenterPanel
 */

import React from 'react';
import { PlatformRouter } from '@/tests/complex-document-editor-migration/source/components/panels/containers/layout/PlatformDetection';
import { CenterPanelDesktop } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.desktop';
import { CenterPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.mobile';
import { useCenterPanel } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.logic';
import type { CenterPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/containers/CenterPanel/CenterPanel.types';

/**
 * Main CenterPanel component with platform routing
 * Uses named export following React component standards
 */
export const CenterPanel: React.FC<CenterPanelProps> = (props) => {
  const centerPanelLogic = useCenterPanel(props);

  return (
    <PlatformRouter
      desktop={CenterPanelDesktop}
      mobile={CenterPanelMobile}
      props={{ ...props, ...centerPanelLogic }}
    />
  );
}; 