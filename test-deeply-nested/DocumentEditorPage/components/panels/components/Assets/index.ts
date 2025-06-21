/**
 * Assets Panel Module
 * @module panels/assets
 */

// Legacy components (for backward compatibility)
export { Assets } from './Assets';
export { useAssetsIndex } from './Assets.hook';

// Legacy type exports
export type {
  Asset,
  AssetType,
  AssetMetadata,
  AssetFilter,
  AssetUploadConfig,
  AssetDragData,
  AssetsIndexState,
  AssetsIndexActions,
  AssetGridProps,
  AssetUploadDropzoneProps,
} from './Assets.types';

// Legacy component exports
export { AssetPreview } from './components/AssetPreview';
export type { AssetPreviewProps } from './components/AssetPreview';
export { AssetFilterBar } from './components/AssetFilterBar/index';
export { AssetUploadDropzone } from './components/AssetUploadDropzone';

// New refactored components (preferred)
export { AssetPanel } from './AssetPanel';
export { AssetPanelWeb } from './AssetPanel.web';
export { AssetPanelMobile } from './AssetPanel.mobile';
export { useAssetPanelLogic } from './AssetPanel.logic';

// New refactored types
export type { 
  AssetPanelProps,
  AssetGridItemProps,
  AssetUploadZoneProps,
  AssetFilterBarProps,
  AssetPreviewModalProps,
  AssetViewMode,
  AssetPanelLayout,
} from './AssetPanel.types'; 