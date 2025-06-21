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
import { PlatformRouter } from '../layout/PlatformDetection';
import { RightPanelDesktop } from './RightPanel.desktop';
import { RightPanelMobile } from './RightPanel.mobile';
import { useRightPanel } from './RightPanel.logic';
import type { RightPanelProps } from './RightPanel.types';

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