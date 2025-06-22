/**
 * AssetPreview Component
 * @module AssetPreview
 */

import React, { useCallback, memo } from 'react';
import { Image, Text, Stack } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { AssetPreviewProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview/AssetPreview.types';
import {
  PreviewContainer,
  PreviewImage,
  IconContainer,
  SelectionIndicator,
  MetadataOverlay,
  ProcessingOverlay
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview/AssetPreview.styles';
import { getTypeIcon } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetPreview/AssetPreview.logic';

const AssetPreviewComponent: React.FC<AssetPreviewProps> = ({
  asset,
  size = 'medium',
  clickable = true,
  onClick,
  showMetadata = false,
  selected = false,
  isDragging = false,
  onDragStart,
  onDragEnd
}) => {
  const handleClick = useCallback(() => {
    if (clickable && onClick) {
      onClick(asset);
    }
  }, [clickable, onClick, asset]);

  const handleDragStart = useCallback((event: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(event);
    }
  }, [onDragStart]);

  const handleDragEnd = useCallback(() => {
    if (onDragEnd) {
      onDragEnd();
    }
  }, [onDragEnd]);

  const renderPreviewContent = () => {
    if (asset.type === 'image' && asset.thumbnailUrl) {
      return (
        <PreviewImage
          src={asset.thumbnailUrl}
          alt={asset.name}
        />
      );
    }

    return (
      <IconContainer>
        {getTypeIcon(asset.type, size)}
      </IconContainer>
    );
  };

  const renderSelectionIndicator = () => {
    if (!selected) return null;

    return (
      <SelectionIndicator>
        <IconCheck size={12} style={{ color: 'white' }} />
      </SelectionIndicator>
    );
  };

  const renderMetadataOverlay = () => {
    if (!showMetadata) return null;

    return (
      <MetadataOverlay>
        <Stack gap={2}>
          <Text size="xs" fw={500} lineClamp={1}>
            {asset.name}
          </Text>
          <Text size="xs" style={{ opacity: 0.8 }}>
            {asset.type.toUpperCase()}
          </Text>
        </Stack>
      </MetadataOverlay>
    );
  };

  const renderProcessingIndicator = () => {
    if (!asset.isProcessing) return null;

    return (
      <ProcessingOverlay>
        <Text size="xs" style={{ color: 'white' }}>
          Processing...
        </Text>
      </ProcessingOverlay>
    );
  };

  return (
    <PreviewContainer
      size={size}
      clickable={clickable}
      isDragging={isDragging}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={!!onDragStart}
    >
      {renderPreviewContent()}
      {renderSelectionIndicator()}
      {renderMetadataOverlay()}
      {renderProcessingIndicator()}
    </PreviewContainer>
  );
}; 

// Memoized AssetPreview with custom comparison function
export const AssetPreview = memo(AssetPreviewComponent, (prevProps, nextProps) => {
  // Custom comparison for performance optimization
  return (
    prevProps.asset.id === nextProps.asset.id &&
    prevProps.asset.name === nextProps.asset.name &&
    prevProps.asset.thumbnailUrl === nextProps.asset.thumbnailUrl &&
    prevProps.asset.type === nextProps.asset.type &&
    prevProps.size === nextProps.size &&
    prevProps.selected === nextProps.selected &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.showMetadata === nextProps.showMetadata &&
    prevProps.clickable === nextProps.clickable
  );
}); 