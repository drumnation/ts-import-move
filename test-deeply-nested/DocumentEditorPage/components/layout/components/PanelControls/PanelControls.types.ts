/**
 * PanelControls Component Types
 * Type definitions for panel control system
 */

// Component Props Interface
export interface PanelControlsProps {
  /** Whether to show the controls */
  visible?: boolean;
  /** Position of the controls */
  position?: 'bottom' | 'top' | 'left' | 'right';
  /** Custom CSS class */
  className?: string;
}

// Panel Action Types
export type PanelAction = 
  | 'open'
  | 'close'
  | 'reset'
  | 'closeAll';

// Panel Position Types
export type PanelPosition = 
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

// Control Button Props
export interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

// Control Group Props
export interface ControlGroupProps {
  label: string;
  children: React.ReactNode;
}

// Panel Control Configuration
export interface PanelControlConfig {
  position: PanelPosition;
  action: PanelAction;
  label: string;
  handler: () => void;
} 