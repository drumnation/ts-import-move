/**
 * AST Debug Panel Hook
 * 
 * Manages debug panel state and integrates with Lexical editor snapshots
 * 
 * @module ASTDebugPanel.hook
 */

import { useState, useCallback, useEffect } from 'react';
import { useLexicalSnapshot } from '../../../shared/molecules/LexicalEditor/LexicalEditor.snapshot';
import type { DebugViewMode, DebugPanelState } from './ASTDebugPanel.types';

/**
 * Hook for managing AST Debug Panel functionality
 */
export const useASTDebugPanel = () => {
  // Get live AST data from Lexical editor
  const { astData, isLoading, error, refreshSnapshot, hasContext } = useLexicalSnapshot();

  // Debug panel state
  const [state, setState] = useState<DebugPanelState>({
    viewMode: 'json',
    jsonOptions: {
      indent: 2,
      collapse: false,
      showLineNumbers: true
    },
    expanded: true,
    lastUpdated: Date.now()
  });

  /**
   * Handle view mode change
   */
  const handleViewModeChange = useCallback((mode: DebugViewMode) => {
    setState(prev => ({
      ...prev,
      viewMode: mode,
      lastUpdated: Date.now()
    }));
  }, []);

  /**
   * Toggle panel expansion
   */
  const handleToggleExpanded = useCallback((expanded: boolean) => {
    setState(prev => ({
      ...prev,
      expanded,
      lastUpdated: Date.now()
    }));
  }, []);

  /**
   * Handle manual refresh
   */
  const handleRefresh = useCallback(() => {
    if (hasContext) {
      refreshSnapshot();
    }
    setState(prev => ({
      ...prev,
      lastUpdated: Date.now()
    }));
  }, [hasContext, refreshSnapshot]);

  /**
   * Update JSON display options
   */
  const updateJSONOptions = useCallback((options: Partial<typeof state.jsonOptions>) => {
    setState(prev => ({
      ...prev,
      jsonOptions: {
        ...prev.jsonOptions,
        ...options
      },
      lastUpdated: Date.now()
    }));
  }, []);

  /**
   * Update lastUpdated when AST data changes
   */
  useEffect(() => {
    if (astData) {
      setState(prev => ({
        ...prev,
        lastUpdated: Date.now()
      }));
    }
  }, [astData]);

  return {
    // Data
    astData,
    isLoading,
    error,
    
    // State
    viewMode: state.viewMode,
    expanded: state.expanded,
    jsonOptions: state.jsonOptions,
    lastUpdated: state.lastUpdated,
    
    // Actions
    onViewModeChange: handleViewModeChange,
    onToggleExpanded: handleToggleExpanded,
    onRefresh: handleRefresh,
    updateJSONOptions,
    
    // Computed
    hasData: Boolean(astData && astData.length > 0),
    hasContext
  };
}; 