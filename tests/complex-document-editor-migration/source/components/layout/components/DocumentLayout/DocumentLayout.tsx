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
import { PlatformRouter } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/PlatformDetection';
import { DocumentLayoutDesktop } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.desktop';
import { DocumentLayoutMobile } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.mobile';
import { useDocumentLayout } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.logic';
import type { DocumentLayoutProps } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.types';

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