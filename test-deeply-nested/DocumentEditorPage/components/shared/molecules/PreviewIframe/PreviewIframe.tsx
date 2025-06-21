import React from 'react';
import { Button, Group, Loader, Center, Text, Box } from '@mantine/core';
import { IconRefresh, IconExternalLink } from '@tabler/icons-react';
import { PreviewIframeProps } from './PreviewIframe.types';
import { usePreviewIframe } from './PreviewIframe.hook';
import {
  PreviewContainer,
  PreviewBox,
  LoadingOverlay,
  ErrorOverlay,
  StyledIframe
} from './PreviewIframe.styles';

/**
 * PreviewIframe Component
 * 
 * Renders the document AST in an iframe using print CSS for WYSIWYG preview.
 * This component fetches the current document AST and renders it with legal document styling.
 */
export const PreviewIframe: React.FC<PreviewIframeProps> = ({
  documentId,
  width = '100%',
  height = '600px',
  showControls = true,
  onError,
  className
}) => {
  const { iframeRef, state, actions } = usePreviewIframe({
    documentId,
    onError
  });

  const { isLoading, error, lastUpdated } = state;
  const { loadPreview, openInNewWindow } = actions;

  return (
    <PreviewContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {showControls && (
        <Group justify="space-between" mb="md">
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={loadPreview}
              loading={isLoading}
              size="sm"
            >
              Refresh Preview
            </Button>
            {lastUpdated && (
              <Text size="sm" c="dimmed">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
          </Group>
          
          <Button
            leftSection={<IconExternalLink size={16} />}
            variant="subtle"
            onClick={openInNewWindow}
            size="sm"
            disabled={!iframeRef.current?.contentDocument}
          >
            Open in New Window
          </Button>
        </Group>
      )}

      <PreviewBox $width={width} $height={height}>
        {isLoading && (
          <LoadingOverlay>
            <Center style={{ height: '100%' }}>
              <Loader size="md" />
            </Center>
          </LoadingOverlay>
        )}

        {error && (
          <ErrorOverlay>
            <Center style={{ height: '100%' }}>
              <Box ta="center" p="md">
                <Text c="red" fw={500} mb="sm">Preview Error</Text>
                <Text size="sm" c="dimmed" mb="md">{error}</Text>
                <Button size="sm" onClick={loadPreview}>
                  Retry
                </Button>
              </Box>
            </Center>
          </ErrorOverlay>
        )}

        <StyledIframe
          ref={iframeRef}
          title="Document Preview"
          sandbox="allow-same-origin"
        />
      </PreviewBox>
    </PreviewContainer>
  );
}; 