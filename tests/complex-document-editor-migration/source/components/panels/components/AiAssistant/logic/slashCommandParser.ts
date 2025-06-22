/**
 * Slash Command Parser for AI Assistant
 * 
 * Parses and executes slash commands within the AI Assistant.
 * 
 * @module slashCommandParser
 */

import type { SlashCommand } from '../AiAssistant.types';
import {
  IconScale,
  IconFileText,
  IconBrain,
  IconPlus,
  IconLink,
  IconRefresh
} from '@tabler/icons-react';

/**
 * Available slash commands
 */
const SLASH_COMMANDS: SlashCommand[] = [
  {
    trigger: 'motion',
    label: 'Create Motion',
    description: 'Generate a legal motion document',
    icon: IconScale,
    handler: async (args = []) => {
      console.log('Creating motion with args:', args);
    },
    category: 'documents',
    args: [
      { name: 'type', type: 'string', required: true, description: 'Type of motion' }
    ]
  },
  {
    trigger: 'brief',
    label: 'Legal Brief',
    description: 'Generate a legal brief',
    icon: IconFileText,
    handler: async (args = []) => {
      console.log('Creating brief with args:', args);
    },
    category: 'documents'
  },
  {
    trigger: 'link',
    label: 'Link Transcript',
    description: 'Link a transcript to the document',
    icon: IconLink,
    handler: async (args = []) => {
      if (args.length >= 2) {
        const [transcriptId, motionId] = args;
        const event = new CustomEvent('transcript-link-command', {
          detail: { transcriptId, motionId }
        });
        window.dispatchEvent(event);
      }
    },
    category: 'utilities',
    args: [
      { name: 'transcriptId', type: 'string', required: true, description: 'Transcript ID' },
      { name: 'motionId', type: 'string', required: true, description: 'Motion section ID' }
    ]
  }
];

/**
 * Check if text starts with a slash command
 */
export const isSlashCommand = (text: string): boolean => {
  return text.trim().startsWith('/');
};

/**
 * Parse slash command from text
 */
export const parseSlashCommand = (text: string): {
    command: string;
    args: string[];
    isValid: boolean;
} => {
  const trimmed = text.trim();
  if (!trimmed.startsWith('/')) {
    return { command: '', args: [], isValid: false };
  }

  const parts = trimmed.slice(1).split(' ').filter(part => part.length > 0);
  const command = parts[0] || '';
  const args = parts.slice(1);

  return { command, args, isValid: command.length > 0 };
};

/**
 * Get command suggestions based on input
 */
export const getCommandSuggestions = (input: string): SlashCommand[] => {
  if (!input.startsWith('/')) return [];

  const commandPart = input.slice(1).toLowerCase();

  return SLASH_COMMANDS.filter(cmd =>
    cmd.trigger.toLowerCase().includes(commandPart) ||
        cmd.label.toLowerCase().includes(commandPart)
  );
};

/**
 * Validate command and arguments
 */
export const validateCommand = (command: string, args: string[]): {
    isValid: boolean;
    error?: string;
    slashCommand?: SlashCommand;
} => {
  const slashCommand = SLASH_COMMANDS.find(cmd => cmd.trigger === command);

  if (!slashCommand) {
    return {
      isValid: false,
      error: `Unknown command: /${command}`
    };
  }

  // Check required arguments
  const requiredArgs = slashCommand.args?.filter(arg => arg.required) || [];
  if (args.length < requiredArgs.length) {
    return {
      isValid: false,
      error: `Missing required arguments. Expected: ${requiredArgs.map(arg => arg.name).join(', ')}`
    };
  }

  return { isValid: true, slashCommand };
};

/**
 * Convert command to prompt
 */
export const commandToPrompt = (command: string, args: string[]): string => {
  const validation = validateCommand(command, args);

  if (!validation.isValid || !validation.slashCommand) {
    return '';
  }

  const cmd = validation.slashCommand;

  switch (command) {
  case 'motion':
    return `Create a ${args[0] || 'summary judgment'} motion with proper legal structure.`;
  case 'brief':
    return 'Draft a comprehensive legal brief with introduction, statement of facts, argument, and conclusion.';
  case 'link':
    return `Link transcript ${args[0]} to motion section ${args[1]}.`;
  default:
    return cmd.description;
  }
};

/**
 * Execute local command (non-AI commands)
 */
export const executeLocalCommand = async (command: string, args: string[]): Promise<boolean> => {
  const validation = validateCommand(command, args);

  if (!validation.isValid || !validation.slashCommand) {
    return false;
  }

  try {
    await validation.slashCommand.handler(args);
    return true;
  } catch (error) {
    console.error('Error executing command:', error);
    return false;
  }
};

/**
 * Get all available commands
 */
export const getAllCommands = (): SlashCommand[] => {
  return [...SLASH_COMMANDS];
}; 