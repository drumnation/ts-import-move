/**
 * ControlGroup Sub-component
 * Groups related panel controls together
 */
import type { ControlGroupProps } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components/PanelControls.types';
import { ControlGroup as StyledControlGroup, GroupLabel } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components/PanelControls.styles';

export const ControlGroup = ({ label, children }: ControlGroupProps) => (
  <StyledControlGroup>
    <GroupLabel>{label}</GroupLabel>
    {children}
  </StyledControlGroup>
); 