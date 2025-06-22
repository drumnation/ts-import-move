import type { AssetUploadConfig } from '@/tests/complex-document-editor-migration/source/components/panels/components/Assets/components/AssetUploadDropzone/AssetUploadDropzone.types';

/**
 * Formats file size from bytes to MB with one decimal place
 */
export const formatFileSize = (bytes: number): string => {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/**
 * Converts accepted MIME types to user-friendly format names
 */
export const getAcceptedFormats = (acceptedTypes: AssetUploadConfig['acceptedTypes']): string => {
  const formats = acceptedTypes.map(type => {
    if (type === 'application/pdf') return 'PDF';
    if (type.startsWith('image/')) return 'Images';
    if (type === 'text/plain') return 'Text';
    return type.split('/')[1]?.toUpperCase() || 'Files';
  });
  return [...new Set(formats)].join(', ');
};

/**
 * Handles file rejection logging
 */
export const handleFileReject = (files: unknown[]): void => {
  console.log('rejected files', files);
}; 