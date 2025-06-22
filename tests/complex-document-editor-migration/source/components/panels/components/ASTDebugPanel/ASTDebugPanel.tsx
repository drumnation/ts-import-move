/**
 * AST Debug Panel Component
 * 
 * Debug panel that displays live AST JSON data with view mode toggles
 * Updates in real-time as the editor content changes
 * 
 * @module ASTDebugPanel
 */

import React, { useCallback, useMemo } from 'react';
import { IconCode, IconRefresh, IconChevronDown, IconChevronRight, IconFileText } from '@tabler/icons-react';
import type { ASTDebugPanelProps, DebugViewMode } from '@/tests/complex-document-editor-migration/source/components/panels/components/ASTDebugPanel/ASTDebugPanel.types';
import {
  DebugPanelContainer,
  DebugPanelHeader,
  HeaderTitle,
  HeaderActions,
  ViewModeToggle,
  ViewModeButton,
  ActionButton,
  DebugPanelContent,
  JSONContainer,
  JSONCode,
  LoadingContainer,
  ErrorContainer,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateSubtext,
  MetadataContainer,
  NodeCount,
  LastUpdated
} from '@/tests/complex-document-editor-migration/source/components/panels/components/ASTDebugPanel/ASTDebugPanel.styles';

/**
 * Format timestamp for display
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

/**
 * Pretty print JSON with syntax highlighting
 */
const formatJSON = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return `Error formatting JSON: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

/**
 * AST Debug Panel Component
 */
export const ASTDebugPanel: React.FC<ASTDebugPanelProps> = ({
  astData = [],
  viewMode = 'json',
  onViewModeChange,
  expanded = true,
  onToggleExpanded,
  isLoading = false,
  error = null,
  onRefresh,
  className,
  maxHeight,
  hasContext = true
}) => {
  
  const handleViewModeChange = useCallback((mode: DebugViewMode) => {
    onViewModeChange?.(mode);
  }, [onViewModeChange]);

  const handleToggleExpanded = useCallback(() => {
    onToggleExpanded?.(!expanded);
  }, [expanded, onToggleExpanded]);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  // Memoized formatted JSON
  const formattedJSON = useMemo(() => {
    if (!astData || astData.length === 0) return '';
    return formatJSON(astData);
  }, [astData]);

  // Calculate metadata
  const metadata = useMemo(() => {
    const nodeCount = astData?.length || 0;
    const lastUpdated = Date.now();
    
    return {
      nodeCount,
      lastUpdated: formatTimestamp(lastUpdated)
    };
  }, [astData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          Loading AST data...
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <strong>Error:</strong> {error}
        </ErrorContainer>
      );
    }

    if (!hasContext) {
      return (
        <EmptyStateContainer>
          <EmptyStateIcon>⏳</EmptyStateIcon>
          <EmptyStateText>Waiting for editor...</EmptyStateText>
          <EmptyStateSubtext>The debug panel will activate when the editor is ready</EmptyStateSubtext>
        </EmptyStateContainer>
      );
    }

    if (!astData || astData.length === 0) {
      return (
        <EmptyStateContainer>
          <EmptyStateIcon>📝</EmptyStateIcon>
          <EmptyStateText>No AST data available</EmptyStateText>
          <EmptyStateSubtext>Start typing in the editor to see live AST updates</EmptyStateSubtext>
        </EmptyStateContainer>
      );
    }

    return (
      <>
        <JSONContainer>
          <JSONCode>{formattedJSON}</JSONCode>
        </JSONContainer>
        <MetadataContainer>
          <NodeCount>{metadata.nodeCount} nodes</NodeCount>
          <LastUpdated>Updated: {metadata.lastUpdated}</LastUpdated>
        </MetadataContainer>
      </>
    );
  };

  return (
    <DebugPanelContainer 
      expanded={expanded} 
      maxHeight={maxHeight}
      className={className}
    >
      <DebugPanelHeader>
        <HeaderTitle>
          {/* Only show toggle button when onToggleExpanded is provided */}
          {onToggleExpanded && (
            <ActionButton onClick={handleToggleExpanded}>
              {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ActionButton>
          )}
          <IconCode size={16} />
          AST JSON Debug
        </HeaderTitle>
        
        <HeaderActions>
          <ViewModeToggle>
            <ViewModeButton
              active={viewMode === 'edit'}
              onClick={() => handleViewModeChange('edit')}
            >
              <IconFileText size={14} />
              Edit
            </ViewModeButton>
            <ViewModeButton
              active={viewMode === 'json'}
              onClick={() => handleViewModeChange('json')}
            >
              <IconCode size={14} />
              JSON
            </ViewModeButton>
            <ViewModeButton
              active={viewMode === 'split'}
              onClick={() => handleViewModeChange('split')}
            >
              Split
            </ViewModeButton>
          </ViewModeToggle>
          
          <ActionButton onClick={handleRefresh} disabled={isLoading}>
            <IconRefresh size={14} />
          </ActionButton>
        </HeaderActions>
      </DebugPanelHeader>

      <DebugPanelContent expanded={expanded}>
        {renderContent()}
      </DebugPanelContent>
    </DebugPanelContainer>
  );
}; 