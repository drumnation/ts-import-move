/**
 * Slash Commands Hook for Document Editor
 * 
 * Provides functionality for detecting and processing slash commands
 * that trigger AI-assisted node operations in the document editor.
 */

import { useState, useCallback, useEffect } from 'react';
import { DocumentStore } from '../../../stores/DocumentStore';

export interface SlashCommand {
  id: string;
  trigger: string;
  label: string;
  description: string;
  category: 'content' | 'structure' | 'exhibit' | 'ai';
  icon?: string;
  handler: (context: CommandContext) => Promise<void>;
}

export interface CommandContext {
  cursorPosition: number;
  selectedText?: string;
  currentSection?: string;
  documentId: string;
  aiPrompt?: string;
}

export interface SlashCommandsState {
  isActive: boolean;
  filter: string;
  position: { x: number; y: number } | null;
  availableCommands: SlashCommand[];
  selectedIndex: number;
}

/**
 * Custom hook for slash command functionality
 */
export const useSlashCommands = () => {
  const [state, setState] = useState<SlashCommandsState>({
    isActive: false,
    filter: '',
    position: null,
    availableCommands: [],
    selectedIndex: 0
  });

  /**
   * Built-in slash commands for document operations
   */
  const builtInCommands: SlashCommand[] = [
    // Content Commands
    {
      id: 'add-paragraph',
      trigger: '/paragraph',
      label: 'Paragraph',
      description: 'Add a new paragraph',
      category: 'content',
      icon: '¶',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'paragraph',
          text: 'New paragraph content...'
        });
      }
    },
    {
      id: 'add-list',
      trigger: '/list',
      label: 'List',
      description: 'Add a bulleted list',
      category: 'content',
      icon: '•',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'list',
          items: [
            { text: 'First item' },
            { text: 'Second item' }
          ]
        });
      }
    },
    {
      id: 'add-table',
      trigger: '/table',
      label: 'Table',
      description: 'Insert a table',
      category: 'content',
      icon: '⊞',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'table',
          headers: ['Column 1', 'Column 2'],
          rows: [
            ['Row 1, Cell 1', 'Row 1, Cell 2'],
            ['Row 2, Cell 1', 'Row 2, Cell 2']
          ]
        });
      }
    },
    
    // Structure Commands
    {
      id: 'add-section',
      trigger: '/section',
      label: 'Section',
      description: 'Add a new section',
      category: 'structure',
      icon: '§',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'section',
          heading: 'New Section',
          content: []
        });
      }
    },
    {
      id: 'add-recital',
      trigger: '/recital',
      label: 'Recital',
      description: 'Add a recital (WHEREAS clause)',
      category: 'structure',
      icon: '◦',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'recital',
          text: 'WHEREAS, [recital content]...'
        });
      }
    },
    {
      id: 'add-signature',
      trigger: '/signature',
      label: 'Signature Block',
      description: 'Add signature block',
      category: 'structure',
      icon: '✍',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'signature',
          signerName: '[Name]',
          signerTitle: '[Title]',
          date: new Date().toLocaleDateString()
        });
      }
    },

    // Exhibit Commands
    {
      id: 'add-exhibit',
      trigger: '/exhibit',
      label: 'Exhibit Reference',
      description: 'Add an exhibit reference',
      category: 'exhibit',
      icon: '📎',
      handler: async (context) => {
        await DocumentStore.addNode({
          type: 'exhibit',
          id: 'A', // Auto-assigned during processing
          text: 'See Exhibit [ID] attached hereto and incorporated herein.'
        });
      }
    },
    {
      id: 'link-exhibit',
      trigger: '/link',
      label: 'Link Exhibit',
      description: 'Link exhibit to document pool',
      category: 'exhibit',
      icon: '🔗',
      handler: async (context) => {
        // This would open the exhibit linking modal
        console.log('Opening exhibit linking interface for context:', context);
      }
    },

    // AI-Assisted Commands
    {
      id: 'ai-suggest',
      trigger: '/ai',
      label: 'AI Suggest',
      description: 'Get AI suggestions for content',
      category: 'ai',
      icon: '🤖',
      handler: async (context) => {
        await triggerAISidebar(context, 'suggest');
      }
    },
    {
      id: 'ai-draft',
      trigger: '/draft',
      label: 'AI Draft',
      description: 'Have AI draft content',
      category: 'ai',
      icon: '✨',
      handler: async (context) => {
        await triggerAISidebar(context, 'draft');
      }
    },
    {
      id: 'ai-review',
      trigger: '/review',
      label: 'AI Review',
      description: 'Get AI review and suggestions',
      category: 'ai',
      icon: '🔍',
      handler: async (context) => {
        await triggerAISidebar(context, 'review');
      }
    },
    {
      id: 'ai-rewrite',
      trigger: '/rewrite',
      label: 'AI Rewrite',
      description: 'Rewrite selected text with AI',
      category: 'ai',
      icon: '🔄',
      handler: async (context) => {
        if (!context.selectedText) {
          throw new Error('Please select text to rewrite');
        }
        await triggerAISidebar(context, 'rewrite');
      }
    }
  ];

  /**
   * Trigger AI sidebar with specific context and mode
   */
  const triggerAISidebar = async (context: CommandContext, mode: string) => {
    // This would communicate with the AI sidebar component
    // For now, we'll dispatch a custom event that the AI sidebar can listen to
    const aiEvent = new CustomEvent('ai-sidebar-trigger', {
      detail: {
        mode,
        context,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(aiEvent);
  };

  /**
   * Detect slash command trigger in text input
   */
  const detectSlashCommand = useCallback((text: string, cursorPosition: number): boolean => {
    if (cursorPosition === 0) return false;
    
    const beforeCursor = text.substring(0, cursorPosition);
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    return lastWord.startsWith('/') && lastWord.length > 1;
  }, []);

  /**
   * Extract command filter from current text
   */
  const extractCommandFilter = useCallback((text: string, cursorPosition: number): string => {
    const beforeCursor = text.substring(0, cursorPosition);
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('/')) {
      return lastWord.substring(1).toLowerCase();
    }
    
    return '';
  }, []);

  /**
   * Filter commands based on current input
   */
  const getFilteredCommands = useCallback((filter: string): SlashCommand[] => {
    if (!filter) return builtInCommands;
    
    return builtInCommands.filter(command => 
      command.trigger.toLowerCase().includes('/' + filter) ||
      command.label.toLowerCase().includes(filter) ||
      command.description.toLowerCase().includes(filter)
    );
  }, [builtInCommands]);

  /**
   * Show slash command menu
   */
  const showCommands = useCallback((
    filter: string,
    position: { x: number; y: number }
  ) => {
    const filteredCommands = getFilteredCommands(filter);
    
    setState({
      isActive: true,
      filter,
      position,
      availableCommands: filteredCommands,
      selectedIndex: 0
    });
  }, [getFilteredCommands]);

  /**
   * Hide slash command menu
   */
  const hideCommands = useCallback(() => {
    setState({
      isActive: false,
      filter: '',
      position: null,
      availableCommands: [],
      selectedIndex: 0
    });
  }, []);

  /**
   * Navigate command selection
   */
  const navigateCommands = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      if (!prev.isActive || prev.availableCommands.length === 0) return prev;
      
      let newIndex = prev.selectedIndex;
      
      if (direction === 'down') {
        newIndex = (prev.selectedIndex + 1) % prev.availableCommands.length;
      } else {
        newIndex = prev.selectedIndex === 0 
          ? prev.availableCommands.length - 1 
          : prev.selectedIndex - 1;
      }
      
      return { ...prev, selectedIndex: newIndex };
    });
  }, []);

  /**
   * Execute selected command
   */
  const executeCommand = useCallback(async (
    commandId?: string,
    context?: CommandContext
  ) => {
    const command = commandId 
      ? builtInCommands.find(cmd => cmd.id === commandId)
      : state.availableCommands[state.selectedIndex];
    
    if (!command || !context) return;

    try {
      await command.handler(context);
      hideCommands();
    } catch (error) {
      console.error('Error executing slash command:', error);
      // Could show error notification here
    }
  }, [state.availableCommands, state.selectedIndex, hideCommands, builtInCommands]);

  /**
   * Handle text input changes to detect slash commands
   */
  const handleTextChange = useCallback((
    text: string,
    cursorPosition: number,
    elementPosition: { x: number; y: number }
  ) => {
    if (detectSlashCommand(text, cursorPosition)) {
      const filter = extractCommandFilter(text, cursorPosition);
      showCommands(filter, elementPosition);
    } else if (state.isActive) {
      hideCommands();
    }
  }, [detectSlashCommand, extractCommandFilter, showCommands, hideCommands, state.isActive]);

  /**
   * Handle keyboard events for command navigation
   */
  const handleKeyDown = useCallback((event: KeyboardEvent): boolean => {
    if (!state.isActive) return false;

    switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      navigateCommands('down');
      return true;
      
    case 'ArrowUp':
      event.preventDefault();
      navigateCommands('up');
      return true;
      
    case 'Enter':
      event.preventDefault();
      if (state.availableCommands[state.selectedIndex]) {
        // Command execution would need context from caller
        console.log('Execute command:', state.availableCommands[state.selectedIndex]);
      }
      return true;
      
    case 'Escape':
      event.preventDefault();
      hideCommands();
      return true;
      
    default:
      return false;
    }
  }, [state.isActive, state.availableCommands, state.selectedIndex, navigateCommands, hideCommands]);

  /**
   * Register a custom command
   */
  const registerCommand = useCallback((command: SlashCommand) => {
    // In a full implementation, this would add to a dynamic command registry
    console.log('Registering custom command:', command);
  }, []);

  /**
   * Get command suggestions for AI integration
   */
  const getCommandSuggestions = useCallback((context: CommandContext): SlashCommand[] => {
    // Return contextually relevant commands based on current document state
    if (context.selectedText) {
      return builtInCommands.filter(cmd => 
        cmd.category === 'ai' || cmd.id === 'ai-rewrite'
      );
    }
    
    return builtInCommands.filter(cmd => cmd.category !== 'ai').slice(0, 5);
  }, [builtInCommands]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      hideCommands();
    };
  }, [hideCommands]);

  return {
    // State
    isActive: state.isActive,
    availableCommands: state.availableCommands,
    selectedIndex: state.selectedIndex,
    position: state.position,
    
    // Actions
    showCommands,
    hideCommands,
    navigateCommands,
    executeCommand,
    handleTextChange,
    handleKeyDown,
    registerCommand,
    getCommandSuggestions,
    
    // Utils
    detectSlashCommand,
    extractCommandFilter,
    getFilteredCommands
  };
}; 