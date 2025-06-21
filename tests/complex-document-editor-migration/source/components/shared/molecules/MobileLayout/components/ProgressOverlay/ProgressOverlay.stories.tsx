import type { Meta, StoryObj } from '@storybook/react';
import { ProgressOverlay } from './ProgressOverlay';
import { ExecutionState } from './ProgressOverlay.types';

const meta: Meta<typeof ProgressOverlay> = {
  title: 'Mobile/ProgressOverlay',
  component: ProgressOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fixed-position overlay that displays execution progress with animated loading indicator and progress bar.'
      }
    }
  },
  argTypes: {
    executionState: {
      description: 'Execution state object containing loading status, progress, and message'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ProgressOverlay>;

const createExecutionState = (isExecuting: boolean, progress: number, message: string): ExecutionState => ({
  isExecuting,
  progress,
  message
});

export const Hidden: Story = {
  args: {
    executionState: createExecutionState(false, 0, '')
  }
};

export const Starting: Story = {
  args: {
    executionState: createExecutionState(true, 0, 'Initializing...')
  }
};

export const InProgress: Story = {
  args: {
    executionState: createExecutionState(true, 45, 'Analyzing document...')
  }
};

export const NearComplete: Story = {
  args: {
    executionState: createExecutionState(true, 85, 'Generating response...')
  }
};

export const Complete: Story = {
  args: {
    executionState: createExecutionState(true, 100, 'Complete!')
  }
};

export const LongMessage: Story = {
  args: {
    executionState: createExecutionState(true, 60, 'Processing a very long instruction that requires detailed analysis of the document structure and content...')
  }
}; 