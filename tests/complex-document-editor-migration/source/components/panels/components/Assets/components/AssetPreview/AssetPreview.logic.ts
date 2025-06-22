/**
 * AssetPreview Component Logic
 * @module AssetPreview.logic
 */

import React from 'react';
import {
  IconFileTypePdf,
  IconPhoto,
  IconFileText,
  IconFile
} from '@tabler/icons-react';
import type { AssetType } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/Assets.types';
import type { AssetPreviewSizeVariant, AssetPreviewSize } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview/AssetPreview.types';

/**
 * Size mapping for different preview sizes
 */
export const SIZE_MAP: Record<AssetPreviewSizeVariant, AssetPreviewSize> = {
  small: { width: 80, height: 60 },
  medium: { width: 120, height: 90 },
  large: { width: 200, height: 150 }
};

/**
 * Get icon size based on preview size
 */
export const getIconSize = (size: AssetPreviewSizeVariant): number => {
  const iconSizeMap = {
    small: 24,
    medium: 32,
    large: 48
  };
  return iconSizeMap[size];
};

/**
 * Get the appropriate icon for asset type
 */
export const getTypeIcon = (assetType: AssetType, size: AssetPreviewSizeVariant): React.ReactElement => {
  const iconSize = getIconSize(size);
  
  const iconMap = {
    pdf: {
      component: IconFileTypePdf,
      color: '#d32f2f'
    },
    image: {
      component: IconPhoto,
      color: '#1976d2'
    },
    transcript: {
      component: IconFileText,
      color: '#388e3c'
    },
    document: {
      component: IconFile,
      color: '#757575'
    }
  };

  const iconConfig = iconMap[assetType] || iconMap.document;
  const IconComponent = iconConfig.component;

  return React.createElement(IconComponent, {
    size: iconSize,
    style: { color: iconConfig.color }
  });
};

/**
 * Get dimensions for a given size variant
 */
export const getDimensions = (size: AssetPreviewSizeVariant): AssetPreviewSize => {
  return SIZE_MAP[size];
}; 