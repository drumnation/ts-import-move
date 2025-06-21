/**
 * FormattingToolbar Mobile Variant
 * 
 * Mobile-optimized text formatting toolbar
 * Touch-friendly buttons with simplified layout
 * 
 * @module FormattingToolbar.mobile
 */

import React from 'react';
import { Group, Divider } from '@mantine/core';
import { 
  IconBold, 
  IconItalic, 
  IconUnderline,
  IconH1,
  IconH2,
  IconFileText,
} from '@tabler/icons-react';
import { FormatButtonGroup } from '@/shared-components/molecules/FormatButtonGroup';
import { useFormattingToolbar, FORMATTING_SHORTCUTS } from './FormattingToolbar.logic';
import type { FormattingToolbarVariantProps } from './FormattingToolbar.types';

/**
 * FormattingToolbar Mobile Implementation
 * Optimized for touch interactions with larger buttons
 */
export const FormattingToolbarMobile: React.FC<FormattingToolbarVariantProps> = ({
  orientation = 'horizontal',
  size = 'lg', // Larger by default on mobile
  disabled = false,
}) => {
  const { selectionState, actions } = useFormattingToolbar();

  // Text formatting buttons
  const textFormatButtons = [
    {
      icon: <IconBold size={20} />,
      label: 'Bold',
      active: selectionState.isBold,
      onClick: actions.toggleBold,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.bold,
    },
    {
      icon: <IconItalic size={20} />,
      label: 'Italic', 
      active: selectionState.isItalic,
      onClick: actions.toggleItalic,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.italic,
    },
    {
      icon: <IconUnderline size={20} />,
      label: 'Underline',
      active: selectionState.isUnderline,
      onClick: actions.toggleUnderline,
      disabled,
      size,
      shortcut: FORMATTING_SHORTCUTS.underline,
    },
  ];

  // Heading buttons (simplified for mobile)
  const headingButtons = [
    {
      icon: <IconH1 size={20} />,
      label: 'Heading 1',
      active: selectionState.headingLevel === 1,
      onClick: () => actions.setHeadingLevel(selectionState.headingLevel === 1 ? null : 1),
      disabled,
      size,
    },
    {
      icon: <IconH2 size={20} />,
      label: 'Heading 2',
      active: selectionState.headingLevel === 2,
      onClick: () => actions.setHeadingLevel(selectionState.headingLevel === 2 ? null : 2),
      disabled,
      size,
    },
  ];

  // Demo document button
  const demoButton = {
    icon: <IconFileText size={20} />,
    label: 'Load Demo',
    active: false,
    onClick: actions.loadDemoDocument,
    disabled,
    size,
  };

  // Mobile layout: horizontal by default for better thumb reach
  const Container = orientation === 'vertical' ? Group : Group;
  
  return (
    <Container
      gap="md"
      align="center"
      justify="center"
      wrap="nowrap"
      style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        minHeight: '72px',
        // Fixed position option for mobile
        position: orientation === 'vertical' ? 'fixed' : 'relative',
        bottom: orientation === 'vertical' ? '20px' : 'auto',
        left: orientation === 'vertical' ? '50%' : 'auto',
        transform: orientation === 'vertical' ? 'translateX(-50%)' : 'none',
        zIndex: orientation === 'vertical' ? 1000 : 'auto',
      }}
      data-testid="formatting-toolbar-mobile"
    >
      {/* Demo document button */}
      <FormatButtonGroup
        buttons={[demoButton]}
        orientation="horizontal"
        spacing="sm"
      />
      
      {/* Separator */}
      <Divider 
        orientation="vertical" 
        size="sm"
        style={{ height: '32px' }}
      />
      
      {/* Text formatting buttons */}
      <FormatButtonGroup
        buttons={textFormatButtons}
        orientation="horizontal"
        spacing="sm"
      />
      
      {/* Separator */}
      <Divider 
        orientation="vertical" 
        size="sm"
        style={{ height: '32px' }}
      />
      
      {/* Heading buttons */}
      <FormatButtonGroup
        buttons={headingButtons}
        orientation="horizontal"
        spacing="sm"
      />
    </Container>
  );
};

FormattingToolbarMobile.displayName = 'FormattingToolbarMobile'; 