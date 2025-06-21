/**
 * InstantPreviewPanel Component
 * 
 * Panel component that provides instant preview functionality for the document
 * Wraps the InstantPreview atom and integrates with the AST data from the editor
 * 
 * @module InstantPreviewPanel
 */

import React, { useMemo, useState } from 'react';
import { Stack, Group, Text, ActionIcon, Badge } from '@mantine/core';
import { IconEye, IconDownload, IconRefresh } from '@tabler/icons-react';
import { InstantPreview } from '@/shared-components/atoms/InstantPreview';
import { generateDocumentHtml } from '@/shared-components/molecules/DocumentSnapshot/DocumentSnapshot.logic';
import { exportAndDownloadPdf } from '@/services/documentPdfExport.service';
import type { InstantPreviewPanelProps } from './InstantPreviewPanel.types';

/**
 * InstantPreviewPanel Component
 */
export const InstantPreviewPanel: React.FC<InstantPreviewPanelProps> = ({
  astData = [],
  title = 'Document Preview',
  expanded = true,
  onToggleExpanded,
  onDownloadPdf,
  isLoading = false,
  error = null,
  className,
  height = 400
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate HTML from AST data
  const generatedHtml = useMemo(() => {
    if (!astData || astData.length === 0) {
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Preview</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: white;
      padding: 1in;
      max-width: 8.5in;
      margin: 0 auto;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
    }
    .empty-state {
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="empty-state">
    <p>Start typing in the editor to see a live preview of your document.</p>
    <p>The preview will update automatically as you make changes.</p>
  </div>
</body>
</html>
      `.trim();
    }

    return generateDocumentHtml(astData, title);
  }, [astData, title]);

  const handleRefresh = () => {
    // Force refresh of the preview
    // In a real implementation, this might trigger a re-render or fetch fresh data
    console.log('🔄 Refreshing instant preview...');
  };

  const handleDownload = async () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }

    // M6.3 Implementation - Wire "Download PDF" to Puppeteer export
    if (!astData || astData.length === 0) {
      console.warn('⚠️ No AST data available for PDF export');
      return;
    }

    setIsDownloading(true);
    
    try {
      await exportAndDownloadPdf(astData, {
        filename: `${title.replace(/[^a-zA-Z0-9\s-]/g, '').trim()}.pdf`,
        title: title,
        format: 'Letter'
      });
      
      console.log('✅ PDF download completed successfully!');
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      // In a real implementation, you might show a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  if (!expanded) {
    return (
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group gap="xs">
          <IconEye size={16} />
          <Text size="sm" fw={500}>Preview</Text>
          <Badge size="xs" variant="light">
            {astData?.length || 0} nodes
          </Badge>
        </Group>
        <ActionIcon variant="subtle" size="sm" onClick={onToggleExpanded}>
          <IconEye size={14} />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <Stack gap="xs" className={className}>
      {/* Panel Header */}
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group gap="xs">
          <IconEye size={16} />
          <Text size="sm" fw={500}>Instant Preview</Text>
          <Badge size="xs" variant="light">
            {astData?.length || 0} nodes
          </Badge>
        </Group>
        
        <Group gap="xs">
          <ActionIcon 
            variant="subtle" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh preview"
          >
            <IconRefresh size={14} />
          </ActionIcon>
          
          <ActionIcon 
            variant="subtle" 
            size="sm" 
            onClick={handleDownload}
            disabled={isLoading || isDownloading || !astData?.length}
            title={isDownloading ? "Generating PDF..." : "Download PDF"}
            loading={isDownloading}
          >
            <IconDownload size={14} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Preview Content */}
      <InstantPreview
        htmlContent={generatedHtml}
        title={title}
        width="100%"
        height={height}
        showBorder={false}
        isLoading={isLoading}
        error={error}
        optimizeForPrint={true}
        autoScale={true}
      />
    </Stack>
  );
}; 