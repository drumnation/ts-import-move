/**
 * TopBar Custom Hooks
 * @module TopBar.hook
 */

import { useCallback, useMemo } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { 
  getStatusConfig, 
  formatDocumentTitle, 
  shouldShowAction,
  getIconSize 
} from './TopBar.logic';
import type { TopBarProps } from './TopBar.types';

/**
 * Custom hook for TopBar responsive behavior and state management
 */
export const useTopBar = ({
  title = 'Legal Document Editor',
  status = 'ready',
  onSearch,
  onExportPreview,
  onDownload,
  onPrint,
  onShare
}: TopBarProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Memoized status configuration
  const statusConfig = useMemo(() => getStatusConfig(status), [status]);
  
  // Memoized formatted title
  const formattedTitle = useMemo(() => {
    const maxLength = isMobile ? 20 : 30;
    return formatDocumentTitle(title, maxLength);
  }, [title, isMobile]);
  
  // Memoized icon size
  const iconSize = useMemo(() => getIconSize(isMobile), [isMobile]);
  
  // Action handlers with useCallback for performance
  const handleSearch = useCallback(() => {
    onSearch?.();
  }, [onSearch]);
  
  const handleExportPreview = useCallback(() => {
    onExportPreview?.();
  }, [onExportPreview]);
  
  const handleDownload = useCallback(() => {
    onDownload?.();
  }, [onDownload]);
  
  const handlePrint = useCallback(() => {
    onPrint?.();
  }, [onPrint]);
  
  const handleShare = useCallback(() => {
    onShare?.();
  }, [onShare]);
  
  // Visible actions based on screen size
  const visibleActions = useMemo(() => {
    const actions = ['search', 'preview', 'download', 'print', 'share'];
    return actions.filter(action => shouldShowAction(action, isMobile));
  }, [isMobile]);
  
  return {
    // State
    isMobile,
    statusConfig,
    formattedTitle,
    iconSize,
    visibleActions,
    
    // Handlers
    handleSearch,
    handleExportPreview,
    handleDownload,
    handlePrint,
    handleShare,
  };
};

/**
 * Hook for managing action button state and accessibility
 */
export const useActionButton = (
  action: string,
  handler: (() => void) | undefined,
  isMobile: boolean
) => {
  const isVisible = useMemo(() => shouldShowAction(action, isMobile), [action, isMobile]);
  
  const buttonProps = useMemo(() => ({
    variant: 'light' as const,
    size: isMobile ? 'lg' : 'sm',
    onClick: handler,
    'aria-label': `${action.charAt(0).toUpperCase() + action.slice(1)} document`
  }), [action, handler, isMobile]);
  
  return {
    isVisible,
    buttonProps
  };
}; 