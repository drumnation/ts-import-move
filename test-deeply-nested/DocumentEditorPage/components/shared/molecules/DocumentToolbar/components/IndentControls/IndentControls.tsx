/**
 * IndentControls Component
 * 
 * Molecular component for list indentation controls
 * 
 * @module IndentControls
 */

import React from 'react';
import { Group, Tooltip } from '@mantine/core';
import { IconIndentIncrease, IconIndentDecrease } from '@tabler/icons-react';
import type { IndentControlsProps } from '../../DocumentToolbar.types';
import { IndentButton } from '../../DocumentToolbar.styles';

/**
 * IndentControls component for managing list nesting
 */
export const IndentControls: React.FC<IndentControlsProps> = ({
  canIndent = false,
  canOutdent = false,
  onIndent,
  onOutdent,
  size = 'md'
}) => {
  // Calculate icon size based on button size
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }[size];

  return (
    <Group gap={4}>
      {/* Outdent Button */}
      <Tooltip 
        label="Decrease indent (Shift+Tab)" 
        position="bottom"
        withArrow
        disabled={!canOutdent}
      >
        <IndentButton
          type="button"
          disabled={!canOutdent}
          size={size}
          onClick={onOutdent}
          aria-label="Decrease list indent"
        >
          <IconIndentDecrease size={iconSize} />
        </IndentButton>
      </Tooltip>

      {/* Indent Button */}
      <Tooltip 
        label="Increase indent (Tab)" 
        position="bottom"
        withArrow
        disabled={!canIndent}
      >
        <IndentButton
          type="button"
          disabled={!canIndent}
          size={size}
          onClick={onIndent}
          aria-label="Increase list indent"
        >
          <IconIndentIncrease size={iconSize} />
        </IndentButton>
      </Tooltip>
    </Group>
  );
};

export default IndentControls; 