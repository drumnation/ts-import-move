/**
 * BidirectionalResizer Storybook Stories
 * 
 * Showcases refined resize interactions with design tokens
 * 
 * @module BidirectionalResizer.stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BidirectionalResizer } from './BidirectionalResizer';
import { resizeTokens } from '../../tokens/resize.tokens';
import type { PanelResizeConfig } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';

const meta: Meta<typeof BidirectionalResizer> = {
  title: 'DocumentEditor/Molecules/BidirectionalResizer',
  component: BidirectionalResizer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**BidirectionalResizer** - Refined panel resizing with sophisticated visual feedback

### Design Philosophy
- **Subtle Feedback**: No more gaudy blue! Uses refined gray tones that feel professional
- **Progressive Enhancement**: Visual feedback scales from hover → active → dragging
- **Touch-Optimized**: Proper touch targets with responsive sizing
- **Accessibility**: Focus states and semantic interactions

### Visual States
- **Default**: Transparent background, no visual noise
- **Hover**: Light gray feedback (${resizeTokens.border.hover})
- **Active/Dragging**: Bold border (${resizeTokens.border.active}) with subtle shadow
- **Focus**: Dark outline for keyboard navigation

### Performance Features
- Memoized for optimal render performance
- Throttled resize updates at ~120fps
- Hardware-accelerated transforms
        `
      }
    }
  },
  argTypes: {
    config: {
      description: 'Resize configuration with constraints and dimensions',
      control: false
    },
    onResize: {
      description: 'Callback fired during resize operations',
      action: 'resize'
    },
    disabled: {
      description: 'Whether the resizer is disabled',
      control: 'boolean'
    },
    resizeType: {
      description: 'Type of resize operation',
      control: 'select',
      options: ['panel', 'column', 'split']
    }
  }
};

export default meta;
type Story = StoryObj<typeof BidirectionalResizer>;

// Base configurations
const horizontalConfig: PanelResizeConfig = {
  direction: 'horizontal',
  panelPosition: 'left',
  minSize: 240,
  maxSize: 600,
  currentSize: 350,
  constraints: {
    minPercent: 15,
    maxPercent: 40
  },
  containerDimensions: {
    width: 1200,
    height: 800
  }
};

const verticalConfig: PanelResizeConfig = {
  direction: 'vertical',
  panelPosition: 'center',
  minSize: 0.2,
  maxSize: 0.8,
  currentSize: 0.5,
  constraints: {
    minPercent: 20,
    maxPercent: 80
  },
  containerDimensions: {
    width: 1200,
    height: 800
  }
};

/**
 * Horizontal Panel Resize
 * Demonstrates left/right panel width adjustment with refined visual feedback
 */
export const HorizontalPanelResize: Story = {
  args: {
    config: horizontalConfig,
    disabled: false,
    resizeType: 'panel'
  },
  render: (args) => (
    <div style={{ 
      width: 400, 
      height: 300, 
      background: '#f8fafc', 
      position: 'relative',
      border: '1px solid #e2e2e2',
      display: 'flex'
    }}>
      <div style={{ 
        width: 250, 
        background: 'white', 
        borderRight: '1px solid #e2e2e2',
        padding: '16px',
        position: 'relative'
      }}>
        <h4>Left Panel</h4>
        <p>Drag the right edge to resize →</p>
        <BidirectionalResizer {...args} />
      </div>
      <div style={{ 
        flex: 1, 
        padding: '16px',
        background: '#fafafa'
      }}>
        <h4>Center Content</h4>
        <p>Watch the refined drag feedback</p>
      </div>
    </div>
  )
};

/**
 * Vertical Split Resize
 * Demonstrates top/bottom panel height adjustment with split behavior
 */
export const VerticalSplitResize: Story = {
  args: {
    config: verticalConfig,
    disabled: false,
    resizeType: 'split'
  },
  render: (args) => (
    <div style={{ 
      width: 400, 
      height: 400, 
      background: '#f8fafc',
      border: '1px solid #e2e2e2',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        flex: 1, 
        background: 'white', 
        padding: '16px'
      }}>
        <h4>Top Panel</h4>
        <p>Drag the bottom edge to resize ↓</p>
      </div>
      <BidirectionalResizer {...args} />
      <div style={{ 
        flex: 1, 
        padding: '16px',
        background: '#fafafa'
      }}>
        <h4>Bottom Panel</h4>
        <p>Notice the subtle shadow and scale</p>
      </div>
    </div>
  )
};

/**
 * Design Tokens Showcase
 * Displays the color palette and interaction states
 */
export const DesignTokensShowcase: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h3>Resize Design Tokens</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h4>Border Colors</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: resizeTokens.border.default,
                border: '1px solid #ddd'
              }} />
              <span>Default: {resizeTokens.border.default}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: resizeTokens.border.hover 
              }} />
              <span>Hover: {resizeTokens.border.hover}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: resizeTokens.border.active 
              }} />
              <span>Active: {resizeTokens.border.active}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: resizeTokens.border.focus 
              }} />
              <span>Focus: {resizeTokens.border.focus}</span>
            </div>
          </div>
        </div>
        <div>
          <h4>Interaction Values</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>Drag Opacity: {resizeTokens.interaction.dragOpacity}</li>
            <li>Drag Scale: {resizeTokens.interaction.dragScale}</li>
            <li>Hover Opacity: {resizeTokens.interaction.hoverOpacity}</li>
            <li>Transition: {resizeTokens.interaction.transitionDuration}</li>
          </ul>
        </div>
      </div>
      <div style={{
        padding: '16px',
        background: '#f8fafc',
        border: '1px solid #e2e2e2',
        borderRadius: '8px'
      }}>
        <h4>Philosophy</h4>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Instead of jarring blue highlights, we use progressive gray tones that feel natural.
          The visual feedback scales smoothly from transparent → hover → active states,
          with subtle transforms and shadows for premium feel.
        </p>
      </div>
    </div>
  )
}; 