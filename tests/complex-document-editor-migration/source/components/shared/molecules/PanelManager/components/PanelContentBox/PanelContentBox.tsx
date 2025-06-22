import React from 'react';
import { Text, Box } from '@mantine/core';
import type { PanelContentBoxProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/components/PanelContentBox/PanelContentBox.types';

export const PanelContentBox = ({ title, description, items }: PanelContentBoxProps) => {
  return (
    <Box>
      <Text size="sm" c="gray.6" mb="md">
        {description}
      </Text>
      <Box>
        <Text size="xs" fw={500} mb="xs">
          {title}:
        </Text>
        <Box pl="sm">
          {items.map((item, index) => (
            <Text key={index} size="xs" c="gray.7">
              • {item}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 