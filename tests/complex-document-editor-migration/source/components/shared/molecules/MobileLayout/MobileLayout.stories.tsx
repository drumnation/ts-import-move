import type { Meta, StoryObj } from '@storybook/react';
import { Box, Text } from '@mantine/core';
import { MobileLayout } from './MobileLayout';
import { DocumentNode } from './MobileLayout.types';

const meta: Meta<typeof MobileLayout> = {
  title: 'Pages/DocumentEditor/MobileLayout',
  component: MobileLayout,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  argTypes: {
    onExecuteAgent: { action: 'onExecuteAgent' },
    onNodeSelect: { action: 'onNodeSelect' }
  }
};

export default meta;
type Story = StoryObj<typeof MobileLayout>;

const mockDocumentContent = (
  <Box p="md" style={{ minHeight: '200vh' }}>
    <Text size="xl" fw={700} mb="md">Legal Document Title</Text>
    <Text mb="md">
      This is a sample legal document with multiple sections and exhibits. 
      The content is displayed in the main viewport area.
    </Text>
    <Text mb="md">
      Section 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit...
    </Text>
    <Text mb="md">
      Section 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
    </Text>
  </Box>
);

const mockLeftPanelContent = (
  <Box>
    <Text fw={600} mb="sm">Document Tools</Text>
    <Text size="sm" c="dimmed">Navigation, formatting, and editing tools</Text>
  </Box>
);

const mockRightPanelContent = (
  <Box>
    <Text fw={600} mb="sm">Properties</Text>
    <Text size="sm" c="dimmed">Document metadata and settings</Text>
  </Box>
);

const mockAgentContent = (
  <Box>
    <Text fw={600} mb="sm">AI Assistant</Text>
    <Text size="sm" c="dimmed">Legal document analysis and recommendations</Text>
  </Box>
);

const mockSelectedNode: DocumentNode = {
  id: 'section-1',
  type: 'section',
  path: 'Document > Section 1',
  title: 'Introduction Section',
  linkedNodes: ['exhibit-a', 'exhibit-b'],
  hasReferences: true
};

export const Default: Story = {
  args: {
    documentContent: mockDocumentContent,
    leftPanelContent: mockLeftPanelContent,
    rightPanelContent: mockRightPanelContent,
    agentContent: mockAgentContent
  }
};

export const WithSelectedNode: Story = {
  args: {
    ...Default.args,
    selectedNode: mockSelectedNode
  }
}; 