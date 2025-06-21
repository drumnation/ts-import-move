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
import { PlatformRouter } from '../layout/PlatformDetection';
import { CenterPanelDesktop } from './CenterPanel.desktop';
import { CenterPanelMobile } from './CenterPanel.mobile';
import { useCenterPanel } from './CenterPanel.logic';
import type { CenterPanelProps } from './CenterPanel.types';

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