import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AssetPanelWeb } from './AssetPanel.web';
import { AssetPanelMobile } from './AssetPanel.mobile';
import type { AssetPanelProps } from './AssetPanel.types';

/**
 * AssetPanel - Entry point with platform routing
 * Level 3 Platform Pathways: Desktop sidebar vs Mobile fullscreen
 */
export const AssetPanel: React.FC<AssetPanelProps> = (props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <AssetPanelMobile {...props} /> : <AssetPanelWeb {...props} />;
}; 