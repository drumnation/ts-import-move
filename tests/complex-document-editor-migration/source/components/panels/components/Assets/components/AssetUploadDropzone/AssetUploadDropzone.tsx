/**
 * Asset Upload Dropzone Component
 * @module AssetUploadDropzone
 */

import React, { useCallback } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Progress,
  Alert,
  rem
} from '@mantine/core';
import {
  IconUpload,
  IconFile,
  IconX,
  IconPhoto,
  IconFileTypePdf
} from '@tabler/icons-react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';
import type { AssetUploadDropzoneProps, DropzoneContentProps } from './AssetUploadDropzone.types';
import { formatFileSize, getAcceptedFormats, handleFileReject } from './AssetUploadDropzone.logic';
import {
  UploadingContainer,
  DropzoneContent,
  IconContainer,
  FileTypeIcon,
  StyledText
} from './AssetUploadDropzone.styles';

const DropzoneIdleContent: React.FC<DropzoneContentProps> = ({
  isMobile,
  config,
  getAcceptedFormats,
  formatFileSize
}) => (
  <Stack align="center" gap="xs">
    <IconContainer>
      <FileTypeIcon color="#d32f2f">
        <IconFileTypePdf size={24} />
      </FileTypeIcon>
      <FileTypeIcon color="#1976d2">
        <IconPhoto size={24} />
      </FileTypeIcon>
      <FileTypeIcon color="#757575">
        <IconFile size={24} />
      </FileTypeIcon>
    </IconContainer>
    
    {isMobile ? (
      <Stack align="center" gap={4}>
        <Text size="sm" fw={500} ta="center">Tap to upload files</Text>
        <Text size="xs" c="dimmed" ta="center">{getAcceptedFormats()}</Text>
        <Text size="xs" c="dimmed" ta="center">Max {formatFileSize(config.maxFileSize)} per file</Text>
      </Stack>
    ) : (
      <Stack align="center" gap={4}>
        <Text size="lg" fw={500}>Drag files here or click to select</Text>
        <Text size="sm" c="dimmed">
          {getAcceptedFormats()} • Max {formatFileSize(config.maxFileSize)} per file
        </Text>
        <Text size="xs" c="dimmed">Up to {config.maxFiles} files at once</Text>
      </Stack>
    )}
  </Stack>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <Alert color="red" mb="md">
    <Group justify="space-between">
      <Text size="sm">{error}</Text>
      <Button variant="subtle" size="xs" onClick={onRetry}>
        Retry
      </Button>
    </Group>
  </Alert>
);

const UploadingState: React.FC<{ uploadProgress: number }> = ({ uploadProgress }) => (
  <UploadingContainer gap="sm">
    <Group justify="center">
      <IconUpload size={24} />
      <Text fw={500}>Uploading files...</Text>
    </Group>
    <Progress value={uploadProgress} size="sm" />
    <Text size="xs" ta="center" c="dimmed">
      {uploadProgress}% complete
    </Text>
  </UploadingContainer>
);

export const AssetUploadDropzone: React.FC<AssetUploadDropzoneProps> = ({
  config,
  onUpload,
  isUploading = false,
  uploadProgress,
  error,
  className
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleDrop = useCallback((files: FileWithPath[]) => {
    onUpload(files);
  }, [onUpload]);

  const handleRetry = useCallback(() => {
    // Handle retry logic - this would typically clear the error state
    // The parent component should handle this
  }, []);

  const formatFileSizeWithConfig = useCallback(
    (bytes: number) => formatFileSize(bytes),
    []
  );

  const getAcceptedFormatsWithConfig = useCallback(
    () => getAcceptedFormats(config.acceptedTypes),
    [config.acceptedTypes]
  );

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (isUploading && uploadProgress !== undefined) {
    return <UploadingState uploadProgress={uploadProgress} />;
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={handleFileReject}
      maxSize={config.maxFileSize}
      accept={config.acceptedTypes}
      maxFiles={config.maxFiles}
      className={className}
      disabled={isUploading}
    >
      <DropzoneContent
        justify="center"
        gap="xl"
        isMobile={isMobile}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-blue-6)'
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-red-6)'
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        
        <Dropzone.Idle>
          <DropzoneIdleContent
            isMobile={isMobile}
            config={config}
            getAcceptedFormats={getAcceptedFormatsWithConfig}
            formatFileSize={formatFileSizeWithConfig}
          />
        </Dropzone.Idle>
      </DropzoneContent>
    </Dropzone>
  );
}; 