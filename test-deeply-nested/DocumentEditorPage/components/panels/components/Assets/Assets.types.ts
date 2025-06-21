/**
 * Assets Panel Type Definitions
 * @module panels/assets/types
 */

// Core Asset Types
export type AssetType = 
  | 'image'
  | 'pdf'
  | 'document'
  | 'audio'
  | 'video'
  | 'archive'
  | 'other';

export interface AssetMetadata {
  size: number;
  mimeType: string;
  uploadedAt: Date;
  lastModified?: Date;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for audio/video files
  pageCount?: number; // for PDFs
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  metadata: AssetMetadata;
  tags?: string[];
  description?: string;
  isSelected?: boolean;
}

// Filter and Search Types
export interface AssetFilter {
  type?: AssetType | 'all';
  searchTerm?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
}

// Upload Configuration
export interface AssetUploadConfig {
  maxFileSize: number;
  allowedTypes: AssetType[];
  maxFiles?: number;
  allowDuplicates?: boolean;
  autoGenerateThumbnails?: boolean;
}

// Drag and Drop Types
export interface AssetDragData {
  assetId: string;
  assetType: AssetType;
  assetUrl: string;
  assetName: string;
}

// State Management Types
export interface AssetsIndexState {
  assets: Asset[];
  filteredAssets: Asset[];
  selectedAssets: Asset[];
  filter: AssetFilter;
  isLoading: boolean;
  error: string | null;
  uploadProgress: Record<string, number>;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface AssetsIndexActions {
  loadAssets: () => Promise<void>;
  uploadAssets: (files: File[]) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<Asset>) => Promise<void>;
  setFilter: (filter: Partial<AssetFilter>) => void;
  clearFilter: () => void;
  selectAsset: (assetId: string) => void;
  deselectAsset: (assetId: string) => void;
  selectAllAssets: () => void;
  clearSelection: () => void;
  setCurrentPage: (page: number) => void;
}

// Component Props Types
export interface AssetGridProps {
  assets: Asset[];
  selectedAssets: Asset[];
  onAssetSelect: (assetId: string) => void;
  onAssetDeselect: (assetId: string) => void;
  onAssetDoubleClick?: (asset: Asset) => void;
  onAssetDragStart?: (asset: Asset, event: React.DragEvent) => void;
  layout?: 'grid' | 'list';
  itemSize?: 'small' | 'medium' | 'large';
}

export interface AssetUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  uploadConfig: AssetUploadConfig;
  isUploading?: boolean;
  uploadProgress?: Record<string, number>;
  disabled?: boolean;
  className?: string;
}

export interface AssetFilterBarProps {
  filter: AssetFilter;
  onFilterChange: (filter: Partial<AssetFilter>) => void;
  onClearFilter: () => void;
  assetCounts?: Record<AssetType | 'all', number>;
  showAdvancedFilters?: boolean;
}
