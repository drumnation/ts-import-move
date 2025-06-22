/**
 * FormattingToolbar Desktop Variant
 * 
 * Desktop-optimized text formatting toolbar
 * Compact layout with keyboard shortcuts and hover interactions
 * 
 * @module FormattingToolbar.desktop
 */

import React, { useCallback } from 'react';
import { Group, Divider, Select, Container, Tooltip, ActionIcon, Button } from '@mantine/core';
import { 
  IconBold, 
  IconItalic, 
  IconUnderline,
  IconH1,
  IconH2,
  IconH3,
  IconPilcrow,
  IconFileText,
  IconPointer
} from '@tabler/icons-react';
import { FormatButtonGroup } from '@/shared-components/molecules/FormatButtonGroup';
import { useFormattingToolbar, FORMATTING_SHORTCUTS } from './FormattingToolbar.logic';
import type { FormattingToolbarVariantProps } from './FormattingToolbar.types';

/**
 * FormattingToolbar Desktop Implementation
 * Optimized for mouse interactions with compact layout
 */
export const FormattingToolbarDesktop: React.FC<FormattingToolbarVariantProps> = ({
  orientation = 'horizontal',
  size = 'md', // Smaller by default on desktop
  disabled = false
}) => {
  const { selectionState, actions } = useFormattingToolbar();

  // Text formatting buttons with full shortcuts
  const textFormatButtons = [
    {
      icon: <IconBold size={16} />,
      label: 'Bold',
      active: selectionState.isBold,
      onClick: actions.toggleBold,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.bold,
    },
    {
      icon: <IconItalic size={16} />,
      label: 'Italic', 
      active: selectionState.isItalic,
      onClick: actions.toggleItalic,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.italic,
    },
    {
      icon: <IconUnderline size={16} />,
      label: 'Underline',
      active: selectionState.isUnderline,
      onClick: actions.toggleUnderline,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.underline,
    },
  ];

  // Extended heading options for desktop
  const headingButtons = [
    {
      icon: <IconH1 size={16} />,
      label: 'Heading 1',
      active: selectionState.headingLevel === 1,
      onClick: () => actions.setHeadingLevel(selectionState.headingLevel === 1 ? null : 1),
      disabled,
      size,
    },
    {
      icon: <IconH2 size={16} />,
      label: 'Heading 2',
      active: selectionState.headingLevel === 2,
      onClick: () => actions.setHeadingLevel(selectionState.headingLevel === 2 ? null : 2),
      disabled,
      size,
    },
    {
      icon: <IconH3 size={16} />,
      label: 'Heading 3',
      active: selectionState.headingLevel === 3,
      onClick: () => actions.setHeadingLevel(selectionState.headingLevel === 3 ? null : 3),
      disabled,
      size,
    },
    {
      icon: <IconPilcrow size={16} />,
      label: 'Paragraph',
      active: selectionState.headingLevel === null,
      onClick: () => actions.setHeadingLevel(null),
      disabled,
      size,
    },
  ];

  // Alternative heading selector for desktop
  const headingSelectData = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'heading1', label: 'Heading 1' },
    { value: 'heading2', label: 'Heading 2' },
    { value: 'heading3', label: 'Heading 3' },
  ];

  const currentHeadingValue = 
    selectionState.headingLevel === 1 ? 'heading1' :
      selectionState.headingLevel === 2 ? 'heading2' :
        selectionState.headingLevel === 3 ? 'heading3' :
          'paragraph';

  const handleHeadingSelect = (value: string | null) => {
    switch (value) {
    case 'heading1':
      actions.setHeadingLevel(1);
      break;
    case 'heading2':
      actions.setHeadingLevel(2);
      break;
    case 'heading3':
      actions.setHeadingLevel(3);
      break;
    default:
      actions.setHeadingLevel(null);
    }
  };

  // Temporary handler for testing node selection
  const handleTestNodeSelect = useCallback(() => {
    const testNodeId = `test-node-${Date.now()}`;
    console.log('🎯 Testing node selection:', testNodeId);
    // Note: onNodeSelect functionality will be restored when the prop interface is updated
  }, []);

  // Demo document button
  const demoButton = {
    icon: <IconFileText size={16} />,
    label: 'Load Demo Document',
    active: false,
    onClick: actions.loadDemoDocument,
    disabled,
    size,
  };

  return (
    <Container>
      <Group>
        {/* Demo document button */}
        <FormatButtonGroup
          buttons={[demoButton]}
          orientation="horizontal"
          spacing="xs"
        />
        
        {/* Separator */}
        <Divider 
          orientation="vertical" 
          size="xs"
          style={{ height: '24px', margin: '0 4px' }}
        />
        
        {/* Text formatting buttons */}
        <FormatButtonGroup
          buttons={textFormatButtons}
          orientation="horizontal"
          spacing="xs"
        />
        
        {/* Separator */}
        <Divider 
          orientation="vertical" 
          size="xs"
          style={{ height: '24px', margin: '0 4px' }}
        />
        
        {/* Heading selector - compact select for desktop */}
        <Select
          value={currentHeadingValue}
          onChange={handleHeadingSelect}
          data={headingSelectData}
          size="sm"
          variant="subtle"
          disabled={disabled}
          style={{ width: '140px' }}
          comboboxProps={{
            withinPortal: false,
            position: 'bottom-start',
          }}
        />
        
        {/* Alternative: Individual heading buttons (commented out) */}
        {/* 
        <Divider 
          orientation="vertical" 
          size="xs"
          style={{ height: '24px', margin: '0 4px' }}
        />
        
        <FormatButtonGroup
          buttons={headingButtons}
          orientation="horizontal"
          spacing="xs"
        />
        */}

        {/* Load Demo button */}
        <Tooltip label="Load petition demo document">
          <Button
            variant="light"
            size="sm"
            onClick={() => actions.loadDemoDocument()}
            leftSection={<IconFileText size={16} />}
          >
            Load Demo
          </Button>
        </Tooltip>

        {/* Temporary test button for node selection */}
        <Tooltip label="Test node selection (temporary)">
          <Button
            variant="light"
            size="sm"
            onClick={handleTestNodeSelect}
            leftSection={<IconPointer size={16} />}
          >
            Select Node
          </Button>
        </Tooltip>
      </Group>
    </Container>
  );
};

FormattingToolbarDesktop.displayName = 'FormattingToolbarDesktop'; 