/**
 * DocumentToolbar Component
 * 
 * Main document formatting toolbar with platform-aware behavior
 * Provides list creation and nesting controls
 * 
 * @module DocumentToolbar
 */

import React from 'react';
import type { DocumentToolbarProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.types';
import { useDocumentToolbar, useToolbarVisibility } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.hook';
import { ListButton, IndentControls } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/components';
import {
  ToolbarContainer,
  ButtonGroup,
  ToolbarLabel
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.styles';

/**
 * DocumentToolbar component for document formatting
 * Provides platform-adaptive list creation and nesting controls
 */
export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  visible = true,
  position = 'top',
  className,
  readOnly = false,
  onListAction,
  selectionState
}) => {
  // Toolbar state and behavior
  const {
    isMobile,
    buttonStates,
    platformConfig,
    handleListToggle,
    handleIndent,
    handleOutdent
  } = useDocumentToolbar({
    onListAction,
    selectionState,
    readOnly
  });

  // Visibility and positioning
  const { visible: actuallyVisible, position: actualPosition } = useToolbarVisibility(
    visible,
    position
  );

  // Don't render if not visible
  if (!actuallyVisible) {
    return null;
  }

  return (
    <ToolbarContainer
      position={actualPosition}
      visible={actuallyVisible}
      className={className}
    >
      {/* List Creation Controls */}
      <ButtonGroup>
        {platformConfig.showLabels && (
          <ToolbarLabel>Lists:</ToolbarLabel>
        )}
        
        {/* Bullet List Button */}
        <ListButton
          type="bullet"
          active={buttonStates.bulletList.active}
          disabled={buttonStates.bulletList.disabled}
          size={platformConfig.buttonSize}
          onClick={() => handleListToggle('bullet')}
        />
        
        {/* Numbered List Button */}
        <ListButton
          type="numbered"
          active={buttonStates.numberedList.active}
          disabled={buttonStates.numberedList.disabled}
          size={platformConfig.buttonSize}
          onClick={() => handleListToggle('numbered')}
        />
      </ButtonGroup>

      {/* List Indentation Controls */}
      {(selectionState?.isInList || buttonStates.bulletList.active || buttonStates.numberedList.active) && (
        <ButtonGroup>
          {platformConfig.showLabels && (
            <ToolbarLabel>Indent:</ToolbarLabel>
          )}
          
          <IndentControls
            canIndent={!buttonStates.indent.disabled}
            canOutdent={!buttonStates.outdent.disabled}
            onIndent={handleIndent}
            onOutdent={handleOutdent}
            size={platformConfig.buttonSize}
          />
        </ButtonGroup>
      )}
    </ToolbarContainer>
  );
};

export default DocumentToolbar; 