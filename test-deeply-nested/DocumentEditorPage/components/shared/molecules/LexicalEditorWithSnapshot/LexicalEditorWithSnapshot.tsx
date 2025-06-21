/**
 * LexicalEditor with DocumentSnapshot Integration
 * 
 * M6 Feature: Combines LexicalEditor with AST debugging and instant preview
 * Provides live debugging data and print preview capabilities
 * 
 * @module LexicalEditorWithSnapshot
 */

import React, { useMemo } from 'react';
import { Stack, Group, Paper } from '@mantine/core';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalEditor } from '../LexicalEditor';
import { DocumentSnapshot } from '@/shared-components/molecules/DocumentSnapshot';
import { useLexicalSnapshot } from '../LexicalEditor/LexicalEditor.snapshot';
import { usePlatformDetection } from '@/pages/DocumentEditorPage/components/layout/platform';
import type { LexicalEditorProps } from '../LexicalEditor/LexicalEditor.types';

/**
 * Extended props for editor with snapshot capabilities
 */
export interface LexicalEditorWithSnapshotProps extends LexicalEditorProps {
  /** Whether to show AST debug panel */
  showAstPanel?: boolean;
  /** Whether to show instant preview */
  showPreview?: boolean;
  /** Layout orientation for snapshot */
  snapshotOrientation?: 'vertical' | 'horizontal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Wrapper component that provides Lexical context to snapshot hooks
 */
const SnapshotProvider: React.FC<{
  showAstPanel: boolean;
  showPreview: boolean;
  orientation: 'vertical' | 'horizontal';
  size: 'sm' | 'md' | 'lg';
}> = ({ showAstPanel, showPreview, orientation, size }) => {
  // Extract AST data from Lexical editor
  const { astData, isLoading, error } = useLexicalSnapshot();
  
  // Don't render snapshot if no data
  if (!astData || astData.length === 0) {
    return null;
  }
  
  return (
    <DocumentSnapshot
      astData={astData}
      htmlContent="" // Will be generated from AST
      showAstPanel={showAstPanel}
      showPreview={showPreview}
      orientation={orientation}
      size={size}
      isLoading={isLoading}
      error={error}
    />
  );
};

/**
 * LexicalEditor with Snapshot Integration
 * M6 Feature: Debugging and preview capabilities
 */
export const LexicalEditorWithSnapshot: React.FC<LexicalEditorWithSnapshotProps> = ({
  document,
  onContentChange,
  readOnly = false,
  placeholder = "Begin typing your legal document...",
  showAstPanel = true,
  showPreview = true,
  snapshotOrientation = 'horizontal',
  size = 'md',
  ...editorProps
}) => {
  const { platform } = usePlatformDetection();
  const isMobile = platform === 'mobile';
  
  // Adjust orientation for mobile
  const orientation = isMobile ? 'vertical' : snapshotOrientation;
  
  // Lexical composer configuration
  const editorConfig = useMemo(() => ({
    namespace: 'LegalDocumentEditorWithSnapshot',
    nodes: [],
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
    editorState: null,
    theme: {},
    editable: !readOnly
  }), [readOnly]);
  
  return (
    <Paper shadow="sm" radius="md" p="md">
      <LexicalComposer initialConfig={editorConfig}>
        {orientation === 'vertical' ? (
          <Stack gap="lg">
            {/* Editor Section */}
            <LexicalEditor
              document={document}
              onContentChange={onContentChange}
              readOnly={readOnly}
              placeholder={placeholder}
              {...editorProps}
            />
            
            {/* Snapshot Section */}
            {(showAstPanel || showPreview) && (
              <SnapshotProvider
                showAstPanel={showAstPanel}
                showPreview={showPreview}
                orientation={orientation}
                size={size}
              />
            )}
          </Stack>
        ) : (
          <Group align="flex-start" gap="lg">
            {/* Editor Section */}
            <Stack style={{ flex: '1', minWidth: 0 }}>
              <LexicalEditor
                document={document}
                onContentChange={onContentChange}
                readOnly={readOnly}
                placeholder={placeholder}
                {...editorProps}
              />
            </Stack>
            
            {/* Snapshot Section */}
            {(showAstPanel || showPreview) && (
              <Stack style={{ flex: '0 0 400px' }}>
                <SnapshotProvider
                  showAstPanel={showAstPanel}
                  showPreview={showPreview}
                  orientation="vertical" // Force vertical in sidebar
                  size={size}
                />
              </Stack>
            )}
          </Group>
        )}
      </LexicalComposer>
    </Paper>
  );
}; 