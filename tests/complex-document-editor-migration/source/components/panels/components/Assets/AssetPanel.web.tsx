import React, { useState, useMemo } from 'react';
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
  Menu,
  Grid,
  Progress,
  Loader,
  Alert,
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
  IconEye,
  IconDownload,
  IconLayoutGrid,
  IconList,
} from '@tabler/icons-react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetPanelLogic } from './AssetPanel.logic';
import type { AssetPanelProps } from './AssetPanel.types';
import type { Asset } from '../../../../../stores/assets.slice';

/**
 * AssetPanel Desktop Implementation
 * Sidebar layout with grid/list view and advanced filtering
 */
export const AssetPanelWeb: React.FC<AssetPanelProps> = ({
  size = { width: 300, height: 600 },
  collapsed = false,
  visible = true,
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
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);

  // Calculate grid columns based on panel width
  const gridColumns = useMemo(() => {
    return Math.max(1, Math.floor(size.width / 120));
  }, [size.width]);

  const handleAssetDragStart = (asset: Asset, event: React.DragEvent) => {
    setDraggedAsset(asset);
    handleDragStart(asset, event);
  };

  const handleAssetDragEnd = () => {
    setDraggedAsset(null);
    handleDragEnd();
  };

  if (!visible || collapsed) return null;

  return (
    <Box
      className={className}
      style={{
        width: size.width,
        height: size.height,
        display: 'flex',
        flexDirection: 'column',
        background: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Group
        justify="space-between"
        p="sm"
        style={{
          borderBottom: '1px solid #e9ecef',
          background: '#ffffff',
          flexShrink: 0,
        }}
      >
        <Group gap="xs">
          <Text fw={600} size="sm">
            Assets
          </Text>
          <Badge variant="light" size="sm">
            {assets.length}
          </Badge>
          {hasSelection && (
            <Badge variant="filled" color="blue" size="sm">
              {selectionCount} selected
            </Badge>
          )}
        </Group>

        <Group gap="xs">
          <Tooltip label="Grid view">
            <ActionIcon
              variant={assetsState.viewMode === 'grid' ? 'filled' : 'light'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <IconLayoutGrid size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="List view">
            <ActionIcon
              variant={assetsState.viewMode === 'list' ? 'filled' : 'light'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <IconList size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Filter assets">
            <ActionIcon
              variant={showFilters ? 'filled' : 'light'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IconFilter size={16} />
            </ActionIcon>
          </Tooltip>

          {hasSelection && (
            <Tooltip label="Delete selected">
              <ActionIcon
                color="red"
                variant="light"
                size="sm"
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
            style={{ overflow: 'hidden' }}
          >
            <Stack gap="xs" p="sm" style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <TextInput
                placeholder="Search assets..."
                leftSection={<IconSearch size={16} />}
                value={assetsState.searchQuery}
                onChange={(e) => handleSearchChange(e.currentTarget.value)}
                size="xs"
              />
              
              <Group gap="xs">
                <Select
                  placeholder="Type"
                  data={[
                    { value: 'all', label: 'All Types' },
                    ...availableTypes.map(type => ({ value: type, label: type }))
                  ]}
                  value={assetsState.filters.type}
                  onChange={(value) => handleTypeFilterChange(value || 'all')}
                  size="xs"
                  style={{ minWidth: 100 }}
                />
                
                {(assetsState.searchQuery || assetsState.filters.type !== 'all' || assetsState.filters.tags.length > 0) && (
                  <Button
                    variant="light"
                    size="xs"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </Group>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      {canUpload && (
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
            borderRadius: '8px',
            margin: '8px',
            padding: '16px',
            textAlign: 'center',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Group justify="center" gap="xs">
            <IconUpload size={20} />
            <Text size="sm">Drop files or click to upload</Text>
          </Group>
        </Dropzone>
      )}

      {/* Upload Progress */}
      {assetsState.isUploading && (
        <Box p="sm">
          <Text size="xs" mb="xs">Uploading...</Text>
          <Progress value={75} size="sm" animated />
        </Box>
      )}

      {/* Asset Grid/List */}
      <ScrollArea flex={1} p="xs">
        {assetsState.isLoading ? (
          <Group justify="center" p="xl">
            <Loader size="sm" />
            <Text size="sm">Loading assets...</Text>
          </Group>
        ) : assets.length === 0 ? (
          <Stack align="center" justify="center" p="xl" style={{ height: '200px' }}>
            <IconFile size={48} style={{ opacity: 0.3 }} />
            <Text size="sm" style={{ opacity: 0.7 }}>No assets found</Text>
            <Text size="xs" style={{ opacity: 0.5 }}>Upload files to get started</Text>
          </Stack>
        ) : (
          <Box
            style={{
              display: assetsState.viewMode === 'grid' ? 'grid' : 'flex',
              flexDirection: assetsState.viewMode === 'list' ? 'column' : undefined,
              gridTemplateColumns: assetsState.viewMode === 'grid' ? `repeat(${gridColumns}, 1fr)` : undefined,
              gap: '8px',
            }}
          >
            {assets.map((asset) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                isSelected={isAssetSelected(asset.id)}
                isDragged={draggedAsset?.id === asset.id}
                viewMode={assetsState.viewMode}
                onToggleSelection={handleToggleSelection}
                onPreview={handlePreviewAsset}
                onDragStart={handleAssetDragStart}
                onDragEnd={handleAssetDragEnd}
                getAssetIcon={getAssetIcon}
                formatFileSize={formatFileSize}
              />
            ))}
          </Box>
        )}
      </ScrollArea>

      {/* Selection Actions */}
      {hasSelection && (
        <Group
          justify="space-between"
          p="sm"
          style={{
            borderTop: '1px solid #e9ecef',
            background: '#ffffff',
          }}
        >
          <Text size="xs">{selectionCount} selected</Text>
          <Group gap="xs">
            <Button variant="light" size="xs" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="light" size="xs" onClick={handleClearSelection}>
              Clear
            </Button>
          </Group>
        </Group>
      )}
    </Box>
  );
};

// Asset Item Component
interface AssetItemProps {
  asset: Asset;
  isSelected: boolean;
  isDragged: boolean;
  viewMode: 'grid' | 'list';
  onToggleSelection: (assetId: string) => void;
  onPreview: (asset: Asset) => void;
  onDragStart: (asset: Asset, event: React.DragEvent) => void;
  onDragEnd: () => void;
  getAssetIcon: (type: Asset['type']) => string;
  formatFileSize: (bytes: number) => string;
}

const AssetItem: React.FC<AssetItemProps> = ({
  asset,
  isSelected,
  isDragged,
  viewMode,
  onToggleSelection,
  onPreview,
  onDragStart,
  onDragEnd,
  getAssetIcon,
  formatFileSize,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getIcon = () => {
    const iconName = getAssetIcon(asset.type);
    switch (iconName) {
    case 'IconFileTypePdf': return <IconFileTypePdf size={16} />;
    case 'IconPhoto': return <IconPhoto size={16} />;
    case 'IconFileText': return <IconFileText size={16} />;
    default: return <IconFile size={16} />;
    }
  };

  return (
    <Card
      p="xs"
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid #339af0' : '1px solid transparent',
        background: isSelected ? '#e7f5ff' : '#ffffff',
        opacity: isDragged ? 0.5 : 1,
        display: viewMode === 'list' ? 'flex' : 'block',
        alignItems: viewMode === 'list' ? 'center' : undefined,
        position: 'relative',
      }}
      draggable
      onDragStart={(e) => onDragStart(asset, e)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onToggleSelection(asset.id)}
    >
      {/* Selection Checkbox */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '16px',
          height: '16px',
          border: `2px solid ${isSelected ? '#339af0' : '#ced4da'}`,
          background: isSelected ? '#339af0' : 'transparent',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {isSelected && '✓'}
      </div>

      {/* Thumbnail */}
      <Box
        style={{
          width: viewMode === 'list' ? '32px' : '60px',
          height: viewMode === 'list' ? '32px' : '60px',
          borderRadius: '4px',
          background: '#f1f3f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: viewMode === 'list' ? '0 12px 0 0' : '0 auto 8px',
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
              borderRadius: '4px',
            }}
          />
        ) : (
          getIcon()
        )}
      </Box>

      {/* Metadata */}
      <Stack gap="2px" style={{ flex: viewMode === 'list' ? 1 : undefined, minWidth: 0 }}>
        <Text
          size="xs"
          fw={500}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={asset.name}
        >
          {asset.name}
        </Text>
        <Text
          size="xs"
          c="dimmed"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formatFileSize(asset.size)}
        </Text>
      </Stack>

      {/* Actions */}
      {showActions && (
        <Group
          gap="xs"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <Tooltip label="Preview">
            <ActionIcon size="xs" variant="light" onClick={(e) => {
              e.stopPropagation();
              onPreview(asset);
            }}>
              <IconEye size={12} />
            </ActionIcon>
          </Tooltip>
          
          <Menu>
            <Menu.Target>
              <ActionIcon size="xs" variant="light" onClick={(e) => e.stopPropagation()}>
                <IconDots size={12} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconDownload size={16} />}>
                Download
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash size={16} />} color="red">
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
    </Card>
  );
}; 