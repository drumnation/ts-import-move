/**
 * LeftPanel Component
 * 
 * Main left panel container with platform-specific implementations
 * Visual mapping: Left sidebar containing resizable top/bottom panels
 * 
 * @module LeftPanel
 */

import React from 'react';
import { PlatformRouter } from '../layout/PlatformDetection';
import { LeftPanelDesktop } from './LeftPanel.desktop';
import { LeftPanelMobile } from './LeftPanel.mobile';
import { useLeftPanel } from './LeftPanel.logic';
import type { LeftPanelProps } from './LeftPanel.types';

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