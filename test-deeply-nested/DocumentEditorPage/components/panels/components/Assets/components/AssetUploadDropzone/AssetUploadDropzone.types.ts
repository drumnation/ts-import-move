import { FileWithPath } from '@mantine/dropzone';

export interface AssetUploadConfig {
  maxFileSize: number;
  maxFiles: number;
  acceptedTypes: string[];
}

export interface AssetUploadDropzoneProps {
  config: AssetUploadConfig;
  onUpload: (files: FileWithPath[]) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  className?: string;
}

export interface DropzoneContentProps {
  isMobile: boolean;
  config: AssetUploadConfig;
  getAcceptedFormats: () => string;
  formatFileSize: (bytes: number) => string;
} 