/**
 * Assets Panel Hooks
 * @module Assets.hook
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type {
  Asset,
  AssetType,
  AssetFilter,
  AssetUploadConfig,
  AssetsIndexState,
  AssetsIndexActions,
  AssetMetadata
} from './Assets.types';

// Default upload configuration
const DEFAULT_UPLOAD_CONFIG: AssetUploadConfig = {
  acceptedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 20,
  autoExtractMetadata: true,
  generateThumbnails: true
};

// Default filter state
const DEFAULT_FILTER: AssetFilter = {
  type: 'all',
  searchQuery: '',
  tags: [],
  sortBy: 'uploadedAt',
  sortDirection: 'desc'
};

/**
 * Hook for managing assets index state and operations
 */
export function useAssetsIndex() {
  const [state, setState] = useState<AssetsIndexState>({
    assets: [],
    filter: DEFAULT_FILTER,
    selectedAssets: [],
    uploadConfig: DEFAULT_UPLOAD_CONFIG,
    isLoading: false,
    error: null
  });

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, { open: startUpload, close: finishUpload }] = useDisclosure(false);

  // Memoized filtered and sorted assets
  const filteredAssets = useMemo(() => {
    let filtered = [...state.assets];

    // Apply type filter
    if (state.filter.type && state.filter.type !== 'all') {
      filtered = filtered.filter(asset => asset.type === state.filter.type);
    }

    // Apply search filter
    if (state.filter.searchQuery) {
      const query = state.filter.searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.metadata.filename.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().indexOf(query) !== -1) ||
        asset.metadata.extractedText?.toLowerCase().includes(query)
      );
    }

    // Apply tag filter
    if (state.filter.tags && state.filter.tags.length > 0) {
      filtered = filtered.filter(asset =>
        state.filter.tags!.some(tag => asset.tags.indexOf(tag) !== -1)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { sortBy, sortDirection } = state.filter;
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'uploadedAt':
          aValue = new Date(a.metadata.uploadedAt).getTime();
          bValue = new Date(b.metadata.uploadedAt).getTime();
          break;
        case 'fileSize':
          aValue = a.metadata.fileSize;
          bValue = b.metadata.fileSize;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [state.assets, state.filter]);

  // Available types and tags for filtering
  const availableTypes = useMemo(() => {
    const types = new Set<AssetType>();
    state.assets.forEach(asset => types.add(asset.type));
    return Array.from(types);
  }, [state.assets]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    state.assets.forEach(asset => asset.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [state.assets]);

  // Extract metadata from file
  const extractMetadata = useCallback(async (file: File): Promise<AssetMetadata> => {
    const metadata: AssetMetadata = {
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString()
    };

    // Extract dimensions for images
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(file);
        metadata.dimensions = dimensions;
      } catch (error) {
        console.warn('Failed to extract image dimensions:', error);
      }
    }

    // Extract text content for supported formats
    if (file.type === 'text/plain') {
      try {
        const text = await file.text();
        metadata.extractedText = text;
      } catch (error) {
        console.warn('Failed to extract text content:', error);
      }
    }

    return metadata;
  }, []);

  // Generate thumbnail URL
  const generateThumbnail = useCallback(async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) return undefined;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => resolve(undefined);
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Actions
  const actions: AssetsIndexActions = {
    uploadAssets: useCallback(async (files: File[]) => {
      if (files.length === 0) return;

      startUpload();
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const uploadPromises = files.map(async (file) => {
          const metadata = await extractMetadata(file);
          const thumbnailUrl = await generateThumbnail(file);
          
          // Simulate upload progress
          const assetId = `temp-${Date.now()}-${Math.random()}`;
          setUploadProgress(prev => ({ ...prev, [assetId]: 0 }));
          
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadProgress(prev => ({ ...prev, [assetId]: progress }));
          }

          const asset: Asset = {
            id: assetId,
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            type: getAssetType(file.type),
            url: URL.createObjectURL(file),
            thumbnailUrl,
            metadata,
            tags: [],
            isProcessing: false
          };

          return asset;
        });

        const newAssets = await Promise.all(uploadPromises);
        
        setState(prev => ({
          ...prev,
          assets: [...prev.assets, ...newAssets],
          isLoading: false
        }));

        setUploadProgress({});
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Upload failed'
        }));
      } finally {
        finishUpload();
      }
    }, [extractMetadata, generateThumbnail, startUpload, finishUpload]),

    deleteAssets: useCallback(async (assetIds: string[]) => {
      setState(prev => ({
        ...prev,
        assets: prev.assets.filter(asset => !assetIds.includes(asset.id)),
        selectedAssets: prev.selectedAssets.filter(id => !assetIds.includes(id))
      }));
    }, []),

    updateAsset: useCallback(async (assetId: string, updates: Partial<Asset>) => {
      setState(prev => ({
        ...prev,
        assets: prev.assets.map(asset =>
          asset.id === assetId ? { ...asset, ...updates } : asset
        )
      }));
    }, []),

    applyFilter: useCallback((filterUpdates: Partial<AssetFilter>) => {
      setState(prev => ({
        ...prev,
        filter: { ...prev.filter, ...filterUpdates }
      }));
    }, []),

    toggleAssetSelection: useCallback((assetId: string, selected?: boolean) => {
      setState(prev => {
        const isSelected = prev.selectedAssets.includes(assetId);
        const shouldSelect = selected !== undefined ? selected : !isSelected;
        
        return {
          ...prev,
          selectedAssets: shouldSelect
            ? [...prev.selectedAssets, assetId]
            : prev.selectedAssets.filter(id => id !== assetId)
        };
      });
    }, []),

    clearSelection: useCallback(() => {
      setState(prev => ({
        ...prev,
        selectedAssets: []
      }));
    }, []),

    refreshAssets: useCallback(async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Refresh failed'
        }));
      }
    }, []),

    generatePreview: useCallback(async (assetId: string): Promise<string> => {
      const asset = state.assets.find(a => a.id === assetId);
      if (!asset) throw new Error('Asset not found');
      
      // Return existing thumbnail or generate new one
      return asset.thumbnailUrl || asset.url;
    }, [state.assets])
  };

  return {
    assets: filteredAssets,
    filter: state.filter,
    selectedAssets: state.selectedAssets,
    isLoading: state.isLoading,
    error: state.error,
    isUploading,
    availableTypes,
    availableTags,
    ...actions
  };
}

// Helper function to determine asset type from MIME type
function getAssetType(mimeType: string): AssetType {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'text/plain') return 'transcript';
  return 'document';
}

// Helper function to get image dimensions
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
} 