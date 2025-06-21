/**
 * Storybook Stories for AssetUploadDropzone Component
 * Note: Storybook dependencies not available in this project
 * This file serves as documentation for component usage examples
 */

import React from 'react';
import { AssetUploadDropzone } from './AssetUploadDropzone';
import type { AssetUploadDropzoneProps } from './AssetUploadDropzone.types';

// Story configurations for documentation purposes

const defaultConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
};

// Example usage configurations for documentation

export const DefaultExample: AssetUploadDropzoneProps = {
  config: defaultConfig,
  onUpload: (files) => console.log('Files uploaded:', files),
  isUploading: false,
  uploadProgress: undefined,
  error: null
};

export const UploadingExample: AssetUploadDropzoneProps = {
  config: defaultConfig,
  onUpload: (files) => console.log('Files uploaded:', files),
  isUploading: true,
  uploadProgress: 45,
  error: null
};

export const WithErrorExample: AssetUploadDropzoneProps = {
  config: defaultConfig,
  onUpload: (files) => console.log('Files uploaded:', files),
  isUploading: false,
  uploadProgress: undefined,
  error: 'File size exceeds maximum limit of 10MB'
};

export const RestrictedFileTypesExample: AssetUploadDropzoneProps = {
  config: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    acceptedTypes: ['application/pdf']
  },
  onUpload: (files) => console.log('Files uploaded:', files),
  isUploading: false,
  uploadProgress: undefined,
  error: null
};

export const LargeFileLimitExample: AssetUploadDropzoneProps = {
  config: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10,
    acceptedTypes: ['application/pdf', 'image/*', 'text/*']
  },
  onUpload: (files) => console.log('Files uploaded:', files),
  isUploading: false,
  uploadProgress: undefined,
  error: null
}; 