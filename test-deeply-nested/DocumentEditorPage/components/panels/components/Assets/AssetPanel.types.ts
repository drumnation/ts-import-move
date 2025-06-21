import type { Asset } from '../../../../../stores/assets.slice';

/**
 * AssetPanel component props interface
 */
export interface AssetPanelProps {
  /** Panel size constraints */
  size?: { width: number; height: number };
  /** Whether panel is collapsed */
  collapsed?: boolean;
  /** Whether panel is visible */
  visible?: boolean;
  /** Custom styling */
  className?: string;
  /** Panel position identifier for state management */
  panelId: string;
}

/**
 * Asset grid item props
 */
export interface AssetGridItemProps {
  asset: Asset;
  isSelected: boolean;
  onToggleSelection: (assetId: string) => void;
  onPreview: (asset: Asset) => void;
  onDragStart: (asset: Asset, event: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragged?: boolean;
}

/**
 * Asset upload zone props
 */
export interface AssetUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  isUploading: boolean;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

/**
 * Asset filter bar props
 */
export interface AssetFilterBarProps {
  searchQuery: string;
  typeFilter: string;
  tagFilters: string[];
  availableTypes: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: string) => void;
  onTagFilterToggle: (tag: string) => void;
  onClearFilters: () => void;
}

/**
 * Asset preview modal props
 */
export interface AssetPreviewModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (assetId: string) => void;
  onDownload?: (asset: Asset) => void;
  onUpdateMetadata?: (assetId: string, metadata: Partial<Asset['metadata']>) => void;
}

/**
 * View mode types for asset display
 */
export type AssetViewMode = 'grid' | 'list';

/**
 * Asset panel layout configuration
 */
export interface AssetPanelLayout {
  viewMode: AssetViewMode;
  gridColumns: number;
  showThumbnails: boolean;
  compactMode: boolean;
} 