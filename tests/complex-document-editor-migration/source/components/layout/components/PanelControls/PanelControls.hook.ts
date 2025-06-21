/**
 * PanelControls Custom Hook
 * Stateful logic for panel control operations
 */
import { useCallback } from 'react';
import { useAppDispatch } from '../../../../../../stores/store';
import { openPanel, closePanel } from '../../../../../../stores/panels.slice';
import { leftPanelActions, rightPanelActions } from '../../../panels';
import type { PanelControlsProps } from './PanelControls.types';
import { createControlGroups } from './PanelControls.logic';

export const usePanelControls = (props: PanelControlsProps = {}) => {
  const { visible = true, position = 'bottom' } = props;
  const dispatch = useAppDispatch();

  // Direct Redux actions with useCallback for performance
  const handleOpenLeftTop = useCallback(() => 
    dispatch(openPanel('leftTop')), [dispatch]);
  
  const handleCloseLeftTop = useCallback(() => 
    dispatch(closePanel('leftTop')), [dispatch]);
  
  const handleOpenLeftBottom = useCallback(() => 
    dispatch(openPanel('leftBottom')), [dispatch]);
  
  const handleCloseLeftBottom = useCallback(() => 
    dispatch(closePanel('leftBottom')), [dispatch]);

  const handleOpenRightTop = useCallback(() => 
    dispatch(openPanel('rightTop')), [dispatch]);
  
  const handleCloseRightTop = useCallback(() => 
    dispatch(closePanel('rightTop')), [dispatch]);
  
  const handleOpenRightBottom = useCallback(() => 
    dispatch(openPanel('rightBottom')), [dispatch]);
  
  const handleCloseRightBottom = useCallback(() => 
    dispatch(closePanel('rightBottom')), [dispatch]);

  // Action creator functions with useCallback
  const handleResetLeft = useCallback(() => 
    dispatch(leftPanelActions.resetConfiguration()), [dispatch]);
  
  const handleCloseAllLeft = useCallback(() => 
    dispatch(leftPanelActions.closeAllPanels()), [dispatch]);
  
  const handleResetRight = useCallback(() => 
    dispatch(rightPanelActions.resetConfiguration()), [dispatch]);
  
  const handleCloseAllRight = useCallback(() => 
    dispatch(rightPanelActions.closeAllPanels()), [dispatch]);

  // Create handlers object for logic functions
  const handlers = {
    handleOpenLeftTop,
    handleCloseLeftTop,
    handleOpenLeftBottom,
    handleCloseLeftBottom,
    handleOpenRightTop,
    handleCloseRightTop,
    handleOpenRightBottom,
    handleCloseRightBottom,
    handleResetLeft,
    handleCloseAllLeft,
    handleResetRight,
    handleCloseAllRight
  };

  // Generate control groups using pure logic
  const controlGroups = createControlGroups(handlers);

  return {
    // State
    visible,
    position,
    
    // Control groups
    leftControls: controlGroups.left,
    rightControls: controlGroups.right,
    
    // Individual handlers (for direct access if needed)
    handlers,
    
    // Computed
    shouldRender: visible
  };
}; 