/**
 * ControlButton Sub-component
 * Individual control button with variants
 */
import type { ControlButtonProps } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components/PanelControls.types';
import { ControlButton as StyledControlButton } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components/PanelControls.styles';

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