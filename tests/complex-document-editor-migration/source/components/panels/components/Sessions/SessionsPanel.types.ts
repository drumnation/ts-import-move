/**
 * Props for SessionsPanel component
 */
export interface SessionsPanelProps {
  /**
   * Custom class name for styling
   */
  className?: string;
  
  /**
   * Maximum height for the panel content
   */
  maxHeight?: string | number;
  
  /**
   * Whether the panel is in read-only mode
   */
  readOnly?: boolean;
  
  /**
   * Callback fired when a session is selected
   */
  onSessionSelect?: (sessionId: string) => void;
  
  /**
   * Callback fired when an activity is selected
   */
  onActivitySelect?: (activityId: string) => void;
}

/**
 * Platform-specific style props
 */
export interface PlatformStyleProps {
  /**
   * Whether the component is on mobile platform
   */
  isMobile: boolean;
  
  /**
   * Maximum height for responsive sizing
   */
  maxHeight?: string | number;
} 