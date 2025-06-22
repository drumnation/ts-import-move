/**
 * Panel Configuration Component
 * 
 * Manages the configuration and setup of panel slots for the document editor
 * Separates panel definition logic from the main editor component
 * 
 * @module PanelConfiguration
 */

import React from 'react';
import type { PanelConfigurationProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/PanelConfiguration.types';
import { usePanelConfiguration } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/PanelConfiguration.hook';

export const PanelConfiguration = ({
  onDocumentUpdate,
  selectedNodeId
}: PanelConfigurationProps) => {
  const { panelSlots } = usePanelConfiguration({
    onDocumentUpdate,
    selectedNodeId
  });

  // This component doesn't render anything itself
  // It exists to provide a consistent API for the hook
  return null;
};

// Export the hook for direct usage when component wrapper isn't needed
export { usePanelConfiguration } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/PanelConfiguration.hook'; 