/**
 * Assets Panel Component
 * @module Assets
 */

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  ActionIcon,
  TextInput,
  Select,
  Badge,
  Card,
  Image,
  ScrollArea,
  Loader,
  Alert,
  Grid,
  Progress,
  Tooltip,
  Menu
} from '@mantine/core';
import {
  IconUpload,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconTrash,
  IconFile,
  IconFileTypePdf,
  IconPhoto,
  IconFileText,
  IconDots,
  IconTag,
  IconDownload,
  IconEye
} from '@tabler/icons-react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';
import { useAssetsIndex } from './Assets.hook';
import { AssetPreview } from './components/AssetPreview';
import { AssetFilterBar } from './components/AssetFilterBar/index';
import { AssetUploadDropzone } from './components/AssetUploadDropzone';
import type { Asset, AssetType } from './Assets.types';

export interface AssetsProps {
  /** Panel size constraints */
  size: { width: number; height: number };
  /** Whether panel is collapsed */
  collapsed?: boolean;
  /** Whether panel is visible */
  visible?: boolean;
  /** Custom styling */
  className?: string;
}

export const Assets: React.FC<AssetsProps> = ({
  size,
  collapsed = false,
  visible = true,
  className
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const {
    assets,
    filter,
    selectedAssets,
    isLoading,
    error,
    isUploading,
    availableTypes,
    availableTags,
    uploadAssets,
    deleteAssets,
    updateAsset,
    applyFilter,
    toggleAssetSelection,
    clearSelection,
    refreshAssets
  } = useAssetsIndex();

  const [showFilters, setShowFilters] = useState(false);
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback((files: FileWithPath[]) => {
    uploadAssets(files);
  }, [uploadAssets]);

  // Handle asset selection
  const handleAssetClick = useCallback((asset: Asset) => {
    if (isMobile) {
      // On mobile, single-tap selects
      toggleAssetSelection(asset.id);
    } else {
      // On desktop, click could open preview
      console.log('Asset clicked:', asset);
    }
  }, [isMobile, toggleAssetSelection]);

  // Handle asset drag start
  const handleDragStart = useCallback((asset: Asset, event: React.DragEvent) => {
    setDraggedAsset(asset);
    event.dataTransfer.setData('application/json', JSON.stringify({
      asset,
      source: 'assets-panel',
      dragType: 'asset-insert'
    }));
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedAsset(null);
  }, []);

  // Handle delete selected
  const handleDeleteSelected = useCallback(() => {
    if (selectedAssets.length > 0) {
      deleteAssets(selectedAssets);
    }
  }, [selectedAssets, deleteAssets]);

  // Get asset type icon
  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'pdf': return <IconFileTypePdf size={16} />;
      case 'image': return <IconPhoto size={16} />;
      case 'transcript': return <IconFileText size={16} />;
      default: return <IconFile size={16} />;
    }
  };

  if (!visible) return null;

  const containerHeight = isMobile ? 'auto' : `${size.height}px`;
  const gridColumns = isMobile ? 2 : Math.floor(size.width / 120);

  return (
    <Box
      className={className}
      style={{
        height: containerHeight,
        width: isMobile ? '100%' : `${size.width}px`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Group 
        justify="space-between" 
        p={{ base: 'md', sm: 'sm' }}
        style={{ borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}
      >
        <Group gap="xs">
          <Text fw={600} size={isMobile ? 'md' : 'sm'}>
            Assets
          </Text>
          <Badge variant="light" size="sm">
            {assets.length}
          </Badge>
        </Group>
        
        <Group gap="xs">
          <Tooltip label="Filter assets">
            <ActionIcon
              variant={showFilters ? 'filled' : 'light'}
              size={isMobile ? 44 : 28}
              onClick={() => setShowFilters(!showFilters)}
            >
              <IconFilter size={16} />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Refresh">
            <ActionIcon
              variant="light"
              size={isMobile ? 44 : 28}
              loading={isLoading}
              onClick={refreshAssets}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>

          {selectedAssets.length > 0 && (
            <Tooltip label="Delete selected">
              <ActionIcon
                color="red"
                variant="light"
                size={isMobile ? 44 : 28}
                onClick={handleDeleteSelected}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderBottom: '1px solid #e5e7eb' }}
          >
            <AssetFilterBar
              filter={filter}
              availableTypes={availableTypes}
              availableTags={availableTags}
              onFilterChange={applyFilter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        {error && (
          <Alert color="red" m="sm">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box ta="center" p="xl">
            <Loader size="md" />
            <Text size="sm" mt="xs" c="dimmed">
              Loading assets...
            </Text>
          </Box>
        ) : assets.length === 0 ? (
          <Box ta="center" p="xl">
            <IconUpload size={48} color="#6b7280" />
            <Text size="lg" fw={500} mt="md">
              No assets uploaded yet
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              Drop files here or use the upload button
            </Text>
          </Box>
        ) : (
          <ScrollArea h="100%" scrollbarSize={6}>
            <Box p="sm">
              <Grid gutter="sm">
                {assets.map((asset) => (
                  <Grid.Col key={asset.id} span={{ base: 6, sm: 3, md: 2 }}>
                    <AssetPreview
                      asset={asset}
                      size="medium"
                      clickable
                      onClick={handleAssetClick}
                      selected={selectedAssets.includes(asset.id)}
                      isDragging={draggedAsset?.id === asset.id}
                      onDragStart={(e) => handleDragStart(asset, e)}
                      onDragEnd={handleDragEnd}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          </ScrollArea>
        )}
      </Box>

      {/* Upload Dropzone */}
      <AssetUploadDropzone
        config={{
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
        }}
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />

      {/* Selection Actions Bar */}
      <AnimatePresence>
        {selectedAssets.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              zIndex: 10
            }}
          >
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''} selected
              </Text>
              <Group gap="xs">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={clearSelection}
                >
                  Clear
                </Button>
                <Button
                  color="red"
                  size="xs"
                  onClick={handleDeleteSelected}
                  leftSection={<IconTrash size={14} />}
                >
                  Delete
                </Button>
              </Group>
            </Group>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// Utility function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
} 