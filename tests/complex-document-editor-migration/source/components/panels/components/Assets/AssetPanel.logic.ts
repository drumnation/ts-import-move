import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../hooks/store.hooks';
import {
  selectFilteredAssets,
  selectSelectedAssets,
} from '../../../../../stores/selectors/panel.selectors';
import {
  uploadAsset,
  deleteAsset,
  updateAssetMetadata,
  selectAsset,
  deselectAsset,
  toggleAssetSelection,
  clearSelection,
  setSearchQuery,
  setTypeFilter,
  addTagFilter,
  removeTagFilter,
  clearFilters,
  setViewMode,
  setPreviewAsset,
} from '../../../../../stores/assets.slice';
import type { Asset } from '../../../../../stores/assets.slice';

/**
 * Shared asset panel logic hook
 */
export const useAssetPanelLogic = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const assetsState = useAppSelector((state) => state.assets);
  const filteredAssets = useAppSelector(selectFilteredAssets);
  const selectedAssets = useAppSelector(selectSelectedAssets);
  
  // Available types and tags for filtering
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    assetsState.assets.forEach(asset => types.add(asset.type));
    return Array.from(types);
  }, [assetsState.assets]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    assetsState.assets.forEach(asset => {
      asset.metadata.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [assetsState.assets]);

  // Asset operations
  const handleFileUpload = useCallback(async (files: File[]) => {
    for (const file of files) {
      dispatch(uploadAsset(file));
    }
  }, [dispatch]);

  const handleDeleteAsset = useCallback((assetId: string) => {
    dispatch(deleteAsset(assetId));
  }, [dispatch]);

  const handleDeleteSelected = useCallback(() => {
    selectedAssets.forEach(asset => {
      dispatch(deleteAsset(asset.id));
    });
    dispatch(clearSelection());
  }, [dispatch, selectedAssets]);

  const handleUpdateAssetMetadata = useCallback((assetId: string, metadata: Partial<Asset['metadata']>) => {
    dispatch(updateAssetMetadata({ assetId, metadata }));
  }, [dispatch]);

  // Selection operations
  const handleToggleSelection = useCallback((assetId: string) => {
    dispatch(toggleAssetSelection(assetId));
  }, [dispatch]);

  const handleSelectAsset = useCallback((assetId: string) => {
    dispatch(selectAsset(assetId));
  }, [dispatch]);

  const handleDeselectAsset = useCallback((assetId: string) => {
    dispatch(deselectAsset(assetId));
  }, [dispatch]);

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const handleSelectAll = useCallback(() => {
    filteredAssets.forEach(asset => {
      if (!assetsState.selectedAssets.includes(asset.id)) {
        dispatch(selectAsset(asset.id));
      }
    });
  }, [dispatch, filteredAssets, assetsState.selectedAssets]);

  // Filter operations
  const handleSearchChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleTypeFilterChange = useCallback((type: string) => {
    dispatch(setTypeFilter(type as Asset['type'] | 'all'));
  }, [dispatch]);

  const handleTagFilterToggle = useCallback((tag: string) => {
    if (assetsState.filters.tags.includes(tag)) {
      dispatch(removeTagFilter(tag));
    } else {
      dispatch(addTagFilter(tag));
    }
  }, [dispatch, assetsState.filters.tags]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // View operations
  const handleViewModeChange = useCallback((viewMode: 'grid' | 'list') => {
    dispatch(setViewMode(viewMode));
  }, [dispatch]);

  const handlePreviewAsset = useCallback((asset: Asset | null) => {
    dispatch(setPreviewAsset(asset?.id || null));
  }, [dispatch]);

  // Drag and drop operations
  const handleDragStart = useCallback((asset: Asset, event: React.DragEvent) => {
    event.dataTransfer.setData('application/json', JSON.stringify({
      asset,
      source: 'assets-panel',
      dragType: 'asset-insert'
    }));
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDragEnd = useCallback(() => {
    // Cleanup after drag operation
  }, []);

  // Utility functions
  const isAssetSelected = useCallback((assetId: string) => {
    return assetsState.selectedAssets.includes(assetId);
  }, [assetsState.selectedAssets]);

  const getAssetIcon = useCallback((type: Asset['type']) => {
    switch (type) {
    case 'pdf': return 'IconFileTypePdf';
    case 'image': return 'IconPhoto';
    case 'document': return 'IconFileText';
    case 'video': return 'IconVideo';
    case 'audio': return 'IconMusic';
    default: return 'IconFile';
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const canUpload = useMemo(() => {
    return !assetsState.isUploading && !assetsState.isLoading;
  }, [assetsState.isUploading, assetsState.isLoading]);

  const hasSelection = useMemo(() => {
    return assetsState.selectedAssets.length > 0;
  }, [assetsState.selectedAssets.length]);

  const selectionCount = useMemo(() => {
    return assetsState.selectedAssets.length;
  }, [assetsState.selectedAssets.length]);

  return {
    // State
    assets: filteredAssets,
    selectedAssets,
    assetsState,
    availableTypes,
    availableTags,
    canUpload,
    hasSelection,
    selectionCount,
    
    // Asset operations
    handleFileUpload,
    handleDeleteAsset,
    handleDeleteSelected,
    handleUpdateAssetMetadata,
    
    // Selection operations
    handleToggleSelection,
    handleSelectAsset,
    handleDeselectAsset,
    handleClearSelection,
    handleSelectAll,
    isAssetSelected,
    
    // Filter operations
    handleSearchChange,
    handleTypeFilterChange,
    handleTagFilterToggle,
    handleClearFilters,
    
    // View operations
    handleViewModeChange,
    handlePreviewAsset,
    
    // Drag and drop
    handleDragStart,
    handleDragEnd,
    
    // Utilities
    getAssetIcon,
    formatFileSize,
  };
}; 