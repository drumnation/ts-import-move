/**
 * ControlGroup Sub-component
 * Groups related panel controls together
 */
import type { ControlGroupProps } from '../PanelControls.types';
import { ControlGroup as StyledControlGroup, GroupLabel } from '../PanelControls.styles';

export const ControlGroup = ({ label, children }: ControlGroupProps) => (
  <StyledControlGroup>
    <GroupLabel>{label}</GroupLabel>
    {children}
  </StyledControlGroup>
); 