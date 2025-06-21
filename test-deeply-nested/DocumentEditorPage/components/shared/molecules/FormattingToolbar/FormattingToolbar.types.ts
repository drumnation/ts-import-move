/**
 * FormattingToolbar Component Types
 * 
 * TypeScript interfaces for text formatting toolbar with Lexical integration
 * Supports bold, italic, underline and heading level controls
 * 
 * @module FormattingToolbar.types
 */

/**
 * Supported text formatting types
 */
export type TextFormatType = 'bold' | 'italic' | 'underline';

/**
 * Supported heading levels  
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Current text selection state
 */
export interface SelectionFormatState {
  /** Whether bold formatting is active */
  isBold: boolean;
  /** Whether italic formatting is active */
  isItalic: boolean;
  /** Whether underline formatting is active */
  isUnderline: boolean;
  /** Current heading level (null if not a heading) */
  headingLevel: HeadingLevel | null;
  /** Whether text is selected */
  hasSelection: boolean;
}

/**
 * Format toggle action handlers
 */
export interface FormatActions {
  /** Toggle bold formatting */
  toggleBold: () => void;
  /** Toggle italic formatting */
  toggleItalic: () => void;
  /** Toggle underline formatting */
  toggleUnderline: () => void;
  /** Set heading level (null for paragraph) */
  setHeadingLevel: (level: HeadingLevel | null) => void;
}

/**
 * Props for platform-specific FormattingToolbar variants
 * These variants manage their own state via useFormattingToolbar hook
 */
export interface FormattingToolbarVariantProps {
  /** Toolbar orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant for responsive design */
  size?: 'sm' | 'md' | 'lg';
  /** Whether toolbar is disabled */
  disabled?: boolean;
}

/**
 * Props for FormattingToolbar component
 * Main component that routes to platform variants
 */
export interface FormattingToolbarProps extends FormattingToolbarVariantProps {}

/**
 * Props for individual format button
 */
export interface FormatButtonProps {
  /** Button icon */
  icon: React.ReactNode;
  /** Button label for accessibility */
  label: string;
  /** Whether button is active/pressed */
  active: boolean;
  /** Click handler */
  onClick: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Keyboard shortcut text */
  shortcut?: string;
}

/**
 * Props for heading level selector
 */
export interface HeadingLevelSelectorProps {
  /** Current heading level */
  currentLevel: HeadingLevel | null;
  /** Available heading levels */
  availableLevels?: HeadingLevel[];
  /** Change handler */
  onChange: (level: HeadingLevel | null) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether selector is disabled */
  disabled?: boolean;
}

/**
 * Button group configuration
 */
export interface FormatButtonGroupProps {
  /** Group of format buttons */
  buttons: FormatButtonProps[];
  /** Group orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Group spacing */
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
} 