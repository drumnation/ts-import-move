import React from 'react';
import { Text, Box } from '@mantine/core';
import type { DocumentInfoPanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/components/DocumentInfoPanel/DocumentInfoPanel.types';

export const DocumentInfoPanel = ({
  createdDate = 'Today',
  modifiedDate = '5 minutes ago',
  status = 'Draft',
  documentType = 'Legal Brief'
}: DocumentInfoPanelProps) => {
  return (
    <Box>
      <Text size="sm" c="gray.6" mb="md">
        Document properties and metadata
      </Text>
      <Box>
        <Text size="xs" fw={500} mb="xs">
          Document Info:
        </Text>
        <Box pl="sm">
          <Text size="xs" c="gray.7">
            • Created: {createdDate}
          </Text>
          <Text size="xs" c="gray.7">
            • Modified: {modifiedDate}
          </Text>
          <Text size="xs" c="gray.7">
            • Status: {status}
          </Text>
          <Text size="xs" c="gray.7">
            • Type: {documentType}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}; 