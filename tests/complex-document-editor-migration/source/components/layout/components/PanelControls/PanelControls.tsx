/**
 * PanelControls Component
 * 
 * Demonstration component showing Redux-connected panel controls
 * Follows functional patterns and provides UI for testing panel system
 * 
 * @module PanelControls
 */
import type { PanelControlsProps } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.types';
import { ControlsContainer } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.styles';
import { usePanelControls } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.hook';
import { ControlGroup, ControlButton } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/components';
import { getButtonVariant } from '@/tests/complex-document-editor-migration/source/components/layout/components/PanelControls/PanelControls.logic';

export const PanelControls = (props: PanelControlsProps) => {
  const {
    position,
    shouldRender,
    leftControls,
    rightControls
  } = usePanelControls(props);

  if (!shouldRender) {
    return null;
  }

  return (
    <ControlsContainer position={position} className={props.className}>
      {/* Left Panel Controls */}
      <ControlGroup label="Left Panels">
        {leftControls.map((control, index) => (
          <ControlButton
            key={`left-${index}`}
            onClick={control.handler}
            variant={getButtonVariant(control.action)}
          >
            {control.label}
          </ControlButton>
        ))}
      </ControlGroup>

      {/* Right Panel Controls */}
      <ControlGroup label="Right Panels">
        {rightControls.map((control, index) => (
          <ControlButton
            key={`right-${index}`}
            onClick={control.handler}
            variant={getButtonVariant(control.action)}
          >
            {control.label}
          </ControlButton>
        ))}
      </ControlGroup>
    </ControlsContainer>
  );
}; 