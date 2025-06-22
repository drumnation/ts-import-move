/**
 * Storybook stories for PanelContentBox component
 * 
 * This file contains story definitions for the PanelContentBox component.
 * Uncomment and update the stories below when Storybook is added to the project.
 * 
 * Example usage patterns:
 * - Default: Basic usage with title, description, and items
 * - WithManyItems: Handling multiple items gracefully
 * - Empty: Edge case with no items
 * - LongDescription: Handling longer description text
 */

import React from 'react';
import { PanelContentBox } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/components/PanelContentBox/PanelContentBox';
import type { PanelContentBoxProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelConfiguration/components/PanelContentBox/PanelContentBox.types';

// Example usage of the component for reference
export const PanelContentBoxExamples = {
  default: {
    title: 'Available Actions',
    description: 'Here are the actions you can perform on this document.',
    items: [
      'Edit document content',
      'Add annotations',
      'Export to PDF',
      'Share with team',
    ],
  } as PanelContentBoxProps,

  withManyItems: {
    title: 'Document Properties',
    description: 'Comprehensive list of document characteristics and metadata.',
    items: [
      'Document type: Legal Brief',
      'Created date: 2024-01-15',
      'Last modified: 2024-01-20',
      'Author: John Doe',
      'Status: Draft',
      'Word count: 2,450',
      'Page count: 12',
      'Language: English',
      'Jurisdiction: Federal',
      'Practice area: Constitutional Law',
    ],
  } as PanelContentBoxProps,

  empty: {
    title: 'No Items',
    description: 'This panel has no items to display.',
    items: [],
  } as PanelContentBoxProps,
};

/*
// Uncomment when Storybook is available:

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PanelContentBox> = {
  title: 'Components/PanelConfiguration/PanelContentBox',
  component: PanelContentBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: PanelContentBoxExamples.default,
};

export const WithManyItems: Story = {
  args: PanelContentBoxExamples.withManyItems,
};

export const Empty: Story = {
  args: PanelContentBoxExamples.empty,
};
*/ 