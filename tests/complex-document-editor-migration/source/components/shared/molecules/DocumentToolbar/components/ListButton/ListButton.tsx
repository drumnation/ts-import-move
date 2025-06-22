/**
 * ListButton Component
 * 
 * Atomic button component for list creation (bullet/numbered)
 * 
 * @module ListButton
 */

import React from 'react';
import { Tooltip } from '@mantine/core';
import { IconList, IconListNumbers } from '@tabler/icons-react';
import type { ListButtonProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.types';
import { ListButton as StyledListButton } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentToolbar/DocumentToolbar.styles';

/**
 * ListButton component for creating/toggling lists
 */
export const ListButton: React.FC<ListButtonProps> = ({
  type,
  active = false,
  disabled = false,
  onClick,
  size = 'md'
}) => {
  // Get appropriate icon for list type
  const Icon = type === 'numbered' ? IconListNumbers : IconList;
  
  // Calculate icon size based on button size
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }[size];

  // Create accessibility label
  const ariaLabel = `${active ? 'Remove' : 'Create'} ${type === 'numbered' ? 'numbered' : 'bullet'} list`;

  return (
    <Tooltip 
      label={ariaLabel} 
      position="bottom"
      withArrow
      disabled={disabled}
    >
      <StyledListButton
        type="button"
        active={active}
        disabled={disabled}
        size={size}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={active}
      >
        <Icon size={iconSize} />
      </StyledListButton>
    </Tooltip>
  );
};

export default ListButton; 