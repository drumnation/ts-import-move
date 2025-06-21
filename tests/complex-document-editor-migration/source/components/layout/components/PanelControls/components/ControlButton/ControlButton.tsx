/**
 * ControlButton Sub-component
 * Individual control button with variants
 */
import type { ControlButtonProps } from '../PanelControls.types';
import { ControlButton as StyledControlButton } from '../PanelControls.styles';

export const ControlButton = ({ 
  onClick, 
  children, 
  variant = 'secondary',
  disabled = false 
}: ControlButtonProps) => (
  <StyledControlButton 
    onClick={onClick}
    variant={variant}
    disabled={disabled}
  >
    {children}
  </StyledControlButton>
); 