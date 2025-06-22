import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AssetPanelWeb } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.web';
import { AssetPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.mobile';
import type { AssetPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.types';

/**
 * AssetPanel - Entry point with platform routing
 * Level 3 Platform Pathways: Desktop sidebar vs Mobile fullscreen
 */
export const AssetPanel: React.FC<AssetPanelProps> = (props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <AssetPanelMobile {...props} /> : <AssetPanelWeb {...props} />;
}; 