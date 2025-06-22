/**
 * Assets Panel Module
 * @module panels/assets
 */

// Legacy components (for backward compatibility)
export { Assets } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/Assets';
export { useAssetsIndex } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/Assets.hook';

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
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/Assets.types';

// Legacy component exports
export { AssetPreview } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview';
export type { AssetPreviewProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview';
export { AssetFilterBar } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetFilterBar/index';
export { AssetUploadDropzone } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetUploadDropzone';

// New refactored components (preferred)
export { AssetPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel';
export { AssetPanelWeb } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.web';
export { AssetPanelMobile } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.mobile';
export { useAssetPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.logic';

// New refactored types
export type { 
  AssetPanelProps,
  AssetGridItemProps,
  AssetUploadZoneProps,
  AssetFilterBarProps,
  AssetPreviewModalProps,
  AssetViewMode,
  AssetPanelLayout,
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.types'; 