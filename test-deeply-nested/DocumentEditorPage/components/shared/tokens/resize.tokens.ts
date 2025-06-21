/**
 * Design Tokens for Resize Components
 * 
 * Refined visual states for panel and column resizing operations.
 * Replaces gaudy blue (#3b82f6) with subtle, contextual feedback.
 * 
 * @module tokens/resize
 */

export const resizeTokens = {
  border: {
    /** Default border color for panels */
    default: '#e2e2e2',
    /** Hover state - slightly darker gray */
    hover: '#d1d5db',
    /** Active/dragging state - bold but not gaudy */
    active: '#666',
    /** Focus state for accessibility */
    focus: '#333'
  },
  
  interaction: {
    /** Opacity during drag operations */
    dragOpacity: 0.8,
    /** Hover opacity for lightweight feedback */
    hoverOpacity: 0.6,
    /** Transition duration for smooth state changes */
    transitionDuration: '150ms'
  },
  
  visual: {
    /** Transparent background for inactive state */
    backgroundInactive: 'transparent',
    /** Light gray for hover feedback */
    backgroundHover: '#f3f4f6',
    /** Darker gray for active state */
    backgroundActive: '#e5e7eb',
    /** Handle background color */
    handleBackground: '#ffffff',
    /** Handle border in normal state */
    handleBorderDefault: '#e5e7eb',
    /** Handle border during interaction */
    handleBorderActive: '#666'
  },
  
  sizing: {
    /** Width of resize handles */
    handleWidth: '2px',
    /** Touch target size for mobile */
    touchTarget: '18px',
    /** Handle size for visible grip */
    gripSize: '20px'
  }
} as const;

export type ResizeTokens = typeof resizeTokens; 