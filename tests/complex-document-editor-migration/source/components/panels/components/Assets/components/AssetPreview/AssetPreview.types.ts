/**
 * AssetPreview Component Types
 * @module AssetPreview.types
 */

import type { Asset } from '../../Assets.types';

export interface AssetPreviewProps {
  /** Asset to preview */
  asset: Asset;
  /** Preview size */
  size?: 'small' | 'medium' | 'large';
  /** Whether preview is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (asset: Asset) => void;
  /** Whether to show metadata overlay */
  showMetadata?: boolean;
  /** Whether asset is selected */
  selected?: boolean;
  /** Whether asset is being dragged */
  isDragging?: boolean;
  /** Drag start handler */
  onDragStart?: (event: React.DragEvent) => void;
  /** Drag end handler */
  onDragEnd?: () => void;
}

export interface AssetPreviewSize {
  width: number;
  height: number;
}

export type AssetPreviewSizeVariant = 'small' | 'medium' | 'large'; 