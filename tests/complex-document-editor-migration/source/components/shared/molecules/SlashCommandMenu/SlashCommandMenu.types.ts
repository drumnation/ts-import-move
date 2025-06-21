/**
 * SlashCommandMenu Component Types
 */

import { SlashCommand } from '../../hooks/useSlashCommands';

export interface SlashCommandMenuProps {
  /** Whether the menu is visible */
  isVisible: boolean;
  /** Position to render the menu */
  position: { x: number; y: number } | null;
  /** Available commands to display */
  commands: SlashCommand[];
  /** Currently selected command index */
  selectedIndex: number;
  /** Callback when a command is selected */
  onCommandSelect: (command: SlashCommand) => void;
  /** Callback to close the menu */
  onClose: () => void;
  /** Current filter text */
  filter?: string;
} 