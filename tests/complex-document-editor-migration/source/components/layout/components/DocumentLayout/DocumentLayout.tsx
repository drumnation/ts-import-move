/**
 * DocumentLayout Component
 * 
 * Main document editor layout container with platform-specific implementations
 * Visual mapping: Coordinates three-panel layout system across platforms
 * Foundation component for the entire document editor interface
 * 
 * @module DocumentLayout
 */

import React from 'react';
import { PlatformRouter } from './PlatformDetection';
import { DocumentLayoutDesktop } from './DocumentLayout.desktop';
import { DocumentLayoutMobile } from './DocumentLayout.mobile';
import { useDocumentLayout } from './DocumentLayout.logic';
import type { DocumentLayoutProps } from './DocumentLayout.types';

/**
 * Main DocumentLayout component with platform routing
 * Uses named export following React component standards
 */
export const DocumentLayout: React.FC<DocumentLayoutProps> = (props) => {
  const documentLayoutLogic = useDocumentLayout(props);

  return (
    <PlatformRouter
      desktop={DocumentLayoutDesktop}
      mobile={DocumentLayoutMobile}
      props={{ ...props, ...documentLayoutLogic }}
    />
  );
}; 