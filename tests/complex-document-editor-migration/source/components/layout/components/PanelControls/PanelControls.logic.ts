/**
 * PanelControls Business Logic
 * Pure functions for panel control operations
 */
import type { PanelPosition, PanelAction, PanelControlConfig } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.types';

// Panel control configuration factory
export const createPanelControlConfig = (
  position: PanelPosition,
  action: PanelAction,
  handler: () => void
): PanelControlConfig => ({
  position,
  action,
  label: formatActionLabel(action),
  handler
});

// Format action labels for display
export const formatActionLabel = (action: PanelAction): string => {
  switch (action) {
  case 'open':
    return 'Open';
  case 'close':
    return 'Close';
  case 'reset':
    return 'Reset';
  case 'closeAll':
    return 'Close All';
  default:
    return action;
  }
};

// Format position labels for display
export const formatPositionLabel = (position: PanelPosition): string => {
  switch (position) {
  case 'leftTop':
    return 'Top';
  case 'leftBottom':
    return 'Bottom';
  case 'rightTop':
    return 'Top';
  case 'rightBottom':
    return 'Bottom';
  default:
    return position;
  }
};

// Get panel side from position
export const getPanelSide = (position: PanelPosition): 'left' | 'right' => {
  return position.startsWith('left') ? 'left' : 'right';
};

// Get panel location from position
export const getPanelLocation = (position: PanelPosition): 'top' | 'bottom' => {
  return position.endsWith('Top') ? 'top' : 'bottom';
};

// Create control groups configuration
export const createControlGroups = (handlers: Record<string, () => void>) => ({
  left: [
    createPanelControlConfig('leftTop', 'open', handlers.handleOpenLeftTop),
    createPanelControlConfig('leftTop', 'close', handlers.handleCloseLeftTop),
    createPanelControlConfig('leftBottom', 'open', handlers.handleOpenLeftBottom),
    createPanelControlConfig('leftBottom', 'close', handlers.handleCloseLeftBottom),
    { position: 'leftTop' as PanelPosition, action: 'reset' as PanelAction, label: 'Reset', handler: handlers.handleResetLeft },
    { position: 'leftTop' as PanelPosition, action: 'closeAll' as PanelAction, label: 'Close All', handler: handlers.handleCloseAllLeft }
  ],
  right: [
    createPanelControlConfig('rightTop', 'open', handlers.handleOpenRightTop),
    createPanelControlConfig('rightTop', 'close', handlers.handleCloseRightTop),
    createPanelControlConfig('rightBottom', 'open', handlers.handleOpenRightBottom),
    createPanelControlConfig('rightBottom', 'close', handlers.handleCloseRightBottom),
    { position: 'rightTop' as PanelPosition, action: 'reset' as PanelAction, label: 'Reset', handler: handlers.handleResetRight },
    { position: 'rightTop' as PanelPosition, action: 'closeAll' as PanelAction, label: 'Close All', handler: handlers.handleCloseAllRight }
  ]
});

// Determine button variant based on action
export const getButtonVariant = (action: PanelAction): 'primary' | 'secondary' | 'danger' => {
  switch (action) {
  case 'open':
    return 'primary';
  case 'close':
  case 'closeAll':
    return 'danger';
  case 'reset':
    return 'secondary';
  default:
    return 'secondary';
  }
}; 