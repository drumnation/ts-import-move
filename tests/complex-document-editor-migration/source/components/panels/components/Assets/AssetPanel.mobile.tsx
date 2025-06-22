import React, { useState } from 'react';
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
  ScrollArea,
  Tooltip,
  Modal,
  Grid,
  Progress,
  Loader,
  Drawer,
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
  IconX,
  IconEye,
  IconDownload,
  IconLayoutGrid,
  IconList,
  IconChevronLeft,
} from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.logic';
import type { AssetPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/AssetPanel.types';
import type { Asset } from '@/tests/complex-document-editor-migration/stores/assets.slice';

/**
 * AssetPanel Mobile Implementation
 * Fullscreen overlay with touch-optimized interface
 */
export const AssetPanelMobile: React.FC<AssetPanelProps> = ({
  visible = false,
  className,
  panelId,
}) => {
  const {
    assets,
    assetsState,
    availableTypes,
    availableTags,
    canUpload,
    hasSelection,
    selectionCount,
    handleFileUpload,
    handleDeleteSelected,
    handleToggleSelection,
    handleClearSelection,
    handleSelectAll,
    isAssetSelected,
    handleSearchChange,
    handleTypeFilterChange,
    handleTagFilterToggle,
    handleClearFilters,
    handleViewModeChange,
    handlePreviewAsset,
    handleDragStart,
    handleDragEnd,
    getAssetIcon,
    formatFileSize,
  } = useAssetPanelLogic();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleBack = () => {
    // This would call a panel close function from Redux
    // For now, we'll just handle the visible state
  };

  const handleAssetPreview = (asset: Asset) => {
    setSelectedAsset(asset);
    handlePreviewAsset(asset);
  };

  const closePreview = () => {
    setSelectedAsset(null);
    handlePreviewAsset(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#ffffff',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mobile Header */}
          <Group
            justify="space-between"
            p="md"
            style={{
              borderBottom: '1px solid #e9ecef',
              background: '#ffffff',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Group gap="sm">
              <ActionIcon size="lg" variant="light" onClick={handleBack}>
                <IconChevronLeft size={20} />
              </ActionIcon>
              <Text fw={600} size="lg">
                Assets
              </Text>
              <Badge variant="light" size="md">
                {assets.length}
              </Badge>
            </Group>

            <Group gap="sm">
              <ActionIcon
                size="lg"
                variant={assetsState.viewMode === 'grid' ? 'filled' : 'light'}
                onClick={() => handleViewModeChange('grid')}
              >
                <IconLayoutGrid size={20} />
              </ActionIcon>

              <ActionIcon
                size="lg"
                variant={assetsState.viewMode === 'list' ? 'filled' : 'light'}
                onClick={() => handleViewModeChange('list')}
              >
                <IconList size={20} />
              </ActionIcon>

              <ActionIcon
                size="lg"
                variant={showFilters ? 'filled' : 'light'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <IconFilter size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Selection Bar */}
          {hasSelection && (
            <Group
              justify="space-between"
              p="md"
              style={{
                background: '#e7f5ff',
                borderBottom: '1px solid #339af0',
              }}
            >
              <Text fw={500} c="blue">
                {selectionCount} selected
              </Text>
              <Group gap="sm">
                <Button variant="light" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="light" size="sm" onClick={handleClearSelection}>
                  Clear
                </Button>
                <Button color="red" size="sm" onClick={handleDeleteSelected}>
                  Delete
                </Button>
              </Group>
            </Group>
          )}

          {/* Filter Drawer */}
          <Drawer
            opened={showFilters}
            onClose={() => setShowFilters(false)}
            title="Filter Assets"
            position="bottom"
            size="auto"
          >
            <Stack gap="md" p="md">
              <TextInput
                placeholder="Search assets..."
                leftSection={<IconSearch size={20} />}
                value={assetsState.searchQuery}
                onChange={(e) => handleSearchChange(e.currentTarget.value)}
                size="md"
              />

              <Select
                label="Asset Type"
                placeholder="All Types"
                data={[
                  { value: 'all', label: 'All Types' },
                  ...availableTypes.map(type => ({ value: type, label: type }))
                ]}
                value={assetsState.filters.type}
                onChange={(value) => handleTypeFilterChange(value || 'all')}
                size="md"
              />

              <Group gap="sm">
                <Button
                  variant="light"
                  size="md"
                  onClick={handleClearFilters}
                  disabled={
                    !assetsState.searchQuery &&
                    assetsState.filters.type === 'all' &&
                    assetsState.filters.tags.length === 0
                  }
                >
                  Clear Filters
                </Button>
                <Button
                  variant="filled"
                  size="md"
                  onClick={() => setShowFilters(false)}
                  style={{ flex: 1 }}
                >
                  Apply
                </Button>
              </Group>
            </Stack>
          </Drawer>

          {/* Upload Zone */}
          {canUpload && (
            <Box p="md">
              <Dropzone
                onDrop={handleFileUpload}
                maxSize={50 * 1024 * 1024} // 50MB
                accept={{
                  'image/*': [],
                  'application/pdf': [],
                  'text/*': [],
                  'application/msword': [],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                }}
                style={{
                  border: '2px dashed #dee2e6',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Stack align="center" gap="sm">
                  <IconUpload size={32} />
                  <Text size="lg" fw={500}>Drop files or tap to upload</Text>
                  <Text size="sm" c="dimmed">Supports images, PDFs, and documents</Text>
                </Stack>
              </Dropzone>
            </Box>
          )}

          {/* Upload Progress */}
          {assetsState.isUploading && (
            <Box p="md">
              <Text size="md" mb="sm">Uploading files...</Text>
              <Progress value={75} size="lg" animated />
            </Box>
          )}

          {/* Asset Grid */}
          <ScrollArea flex={1} p="md">
            {assetsState.isLoading ? (
              <Group justify="center" p="xl">
                <Loader size="lg" />
                <Text size="lg">Loading assets...</Text>
              </Group>
            ) : assets.length === 0 ? (
              <Stack align="center" justify="center" p="xl" style={{ height: '300px' }}>
                <IconFile size={64} style={{ opacity: 0.3 }} />
                <Text size="lg" fw={500} style={{ opacity: 0.7 }}>No assets found</Text>
                <Text size="md" style={{ opacity: 0.5 }}>Upload files to get started</Text>
              </Stack>
            ) : (
              <Grid>
                {assets.map((asset) => (
                  <Grid.Col span={assetsState.viewMode === 'grid' ? 6 : 12} key={asset.id}>
                    <MobileAssetItem
                      asset={asset}
                      isSelected={isAssetSelected(asset.id)}
                      viewMode={assetsState.viewMode}
                      onToggleSelection={handleToggleSelection}
                      onPreview={handleAssetPreview}
                      getAssetIcon={getAssetIcon}
                      formatFileSize={formatFileSize}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </ScrollArea>

          {/* Asset Preview Modal */}
          <Modal
            opened={!!selectedAsset}
            onClose={closePreview}
            title={selectedAsset?.name}
            size="lg"
            fullScreen
          >
            {selectedAsset && (
              <Stack gap="md">
                {/* Preview */}
                <Box
                  style={{
                    height: '300px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedAsset.thumbnailUrl ? (
                    <img
                      src={selectedAsset.thumbnailUrl}
                      alt={selectedAsset.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <IconFile size={64} style={{ opacity: 0.3 }} />
                  )}
                </Box>

                {/* Metadata */}
                <Stack gap="xs">
                  <Text fw={600}>{selectedAsset.name}</Text>
                  <Text size="sm" c="dimmed">Size: {formatFileSize(selectedAsset.size)}</Text>
                  <Text size="sm" c="dimmed">Type: {selectedAsset.type}</Text>
                  <Text size="sm" c="dimmed">
                    Uploaded: {new Date(selectedAsset.uploadedAt).toLocaleDateString()}
                  </Text>
                </Stack>

                {/* Actions */}
                <Group gap="sm">
                  <Button
                    variant="light"
                    leftSection={<IconDownload size={16} />}
                    style={{ flex: 1 }}
                  >
                    Download
                  </Button>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={16} />}
                    style={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </Group>
              </Stack>
            )}
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mobile Asset Item Component
interface MobileAssetItemProps {
  asset: Asset;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  onToggleSelection: (assetId: string) => void;
  onPreview: (asset: Asset) => void;
  getAssetIcon: (type: Asset['type']) => string;
  formatFileSize: (bytes: number) => string;
}

const MobileAssetItem: React.FC<MobileAssetItemProps> = ({
  asset,
  isSelected,
  viewMode,
  onToggleSelection,
  onPreview,
  getAssetIcon,
  formatFileSize,
}) => {
  const getIcon = () => {
    const iconName = getAssetIcon(asset.type);
    switch (iconName) {
    case 'IconFileTypePdf': return <IconFileTypePdf size={24} />;
    case 'IconPhoto': return <IconPhoto size={24} />;
    case 'IconFileText': return <IconFileText size={24} />;
    default: return <IconFile size={24} />;
    }
  };

  return (
    <Card
      p="md"
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid #339af0' : '1px solid #e9ecef',
        background: isSelected ? '#e7f5ff' : '#ffffff',
        display: viewMode === 'list' ? 'flex' : 'block',
        alignItems: viewMode === 'list' ? 'center' : undefined,
        position: 'relative',
        minHeight: viewMode === 'grid' ? '120px' : '80px',
      }}
      onClick={() => onToggleSelection(asset.id)}
    >
      {/* Selection Checkbox */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '24px',
          height: '24px',
          border: `2px solid ${isSelected ? '#339af0' : '#ced4da'}`,
          background: isSelected ? '#339af0' : 'transparent',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {isSelected && '✓'}
      </div>

      {/* Preview Button */}
      <ActionIcon
        size="lg"
        variant="light"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPreview(asset);
        }}
      >
        <IconEye size={20} />
      </ActionIcon>

      {/* Thumbnail */}
      <Box
        style={{
          width: viewMode === 'list' ? '48px' : '80px',
          height: viewMode === 'list' ? '48px' : '80px',
          borderRadius: '8px',
          background: '#f1f3f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: viewMode === 'list' ? '0 16px 0 32px' : '32px auto 12px',
          flexShrink: 0,
        }}
      >
        {asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        ) : (
          getIcon()
        )}
      </Box>

      {/* Metadata */}
      <Stack gap="xs" style={{ flex: viewMode === 'list' ? 1 : undefined, minWidth: 0 }}>
        <Text
          size="md"
          fw={500}
          style={{
            whiteSpace: viewMode === 'list' ? 'nowrap' : 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: viewMode === 'grid' ? '1.2' : undefined,
          }}
          title={asset.name}
        >
          {asset.name}
        </Text>
        <Text
          size="sm"
          c="dimmed"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formatFileSize(asset.size)} • {asset.type}
        </Text>
      </Stack>
    </Card>
  );
}; 