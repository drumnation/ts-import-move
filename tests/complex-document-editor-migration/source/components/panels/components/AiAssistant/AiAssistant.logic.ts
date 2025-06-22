/**
 * AI Assistant Panel Logic
 * 
 * Pure business logic for AI Assistant operations.
 * 
 * @module AiAssistant.logic
 */

import type { QuickPrompt, AIFunction, ChatMessage, ChatConversation, AIResponse } from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.types';
import {
  IconScale,
  IconFileText,
  IconBrain,
  IconPlus
} from '@tabler/icons-react';

/**
 * Quick prompt configurations for legal document generation
 */
export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'motion-summary-judgment',
    label: 'Motion for Summary Judgment',
    prompt: 'Create a motion for summary judgment with proper legal structure including statement of facts, legal standard, and argument sections.',
    icon: IconScale,
    category: 'motions',
    keywords: ['motion', 'summary', 'judgment', 'litigation'],
    suggestedFunction: 'createLegalDoc'
  },
  {
    id: 'contract-review',
    label: 'Contract Analysis',
    prompt: 'Analyze the provided contract and identify key terms, potential issues, and recommendations.',
    icon: IconFileText,
    category: 'analysis',
    keywords: ['contract', 'analysis', 'review', 'terms'],
    suggestedFunction: 'createLegalDoc'
  },
  {
    id: 'legal-brief',
    label: 'Legal Brief',
    prompt: 'Draft a comprehensive legal brief with introduction, statement of facts, argument, and conclusion.',
    icon: IconBrain,
    category: 'documents',
    keywords: ['brief', 'argument', 'legal', 'writing'],
    suggestedFunction: 'createLegalDoc'
  },
  {
    id: 'exhibit-insert',
    label: 'Insert Exhibit',
    prompt: 'Insert an exhibit reference at the current location with proper formatting and numbering.',
    icon: IconPlus,
    category: 'structure',
    keywords: ['exhibit', 'reference', 'insert', 'formatting'],
    suggestedFunction: 'insertExhibit'
  }
];

/**
 * Available AI functions for the Select component
 */
export const AI_FUNCTIONS = [
  { value: 'createLegalDoc', label: 'Create Legal Document' },
  { value: 'adjustIndent', label: 'Adjust Indentation' },
  { value: 'regenerateSection', label: 'Regenerate Section' },
  { value: 'insertExhibit', label: 'Insert Exhibit' }
];

/**
 * Group quick prompts by category
 */
export const groupPromptsByCategory = (prompts: QuickPrompt[]): Record<string, QuickPrompt[]> => {
  return prompts.reduce((groups, prompt) => {
    const category = prompt.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(prompt);
    return groups;
  }, {} as Record<string, QuickPrompt[]>);
};

/**
 * Filter prompts by search term
 */
export const filterPrompts = (prompts: QuickPrompt[], searchTerm: string): QuickPrompt[] => {
  if (!searchTerm.trim()) return prompts;
  
  const term = searchTerm.toLowerCase();
  return prompts.filter(prompt => 
    prompt.label.toLowerCase().includes(term) ||
    prompt.prompt.toLowerCase().includes(term) ||
    prompt.keywords?.some(keyword => keyword.toLowerCase().includes(term))
  );
};

/**
 * Get suggested function for a prompt
 */
export const getSuggestedFunction = (promptText: string): AIFunction => {
  const text = promptText.toLowerCase();
  
  if (text.includes('exhibit') || text.includes('reference')) {
    return 'insertExhibit';
  }
  
  if (text.includes('indent') || text.includes('format')) {
    return 'adjustIndent';
  }
  
  if (text.includes('regenerate') || text.includes('rewrite')) {
    return 'regenerateSection';
  }
  
  return 'createLegalDoc';
};

/**
 * Validate prompt input
 */
export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  if (!prompt.trim()) {
    return { isValid: false, error: 'Prompt cannot be empty' };
  }
  
  if (prompt.length < 10) {
    return { isValid: false, error: 'Prompt should be at least 10 characters long' };
  }
  
  if (prompt.length > 2000) {
    return { isValid: false, error: 'Prompt should be less than 2000 characters' };
  }
  
  return { isValid: true };
};

/**
 * Generate request ID for tracking
 */
export const generateRequestId = (): string => {
  return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format processing time for display
 */
export const formatProcessingTime = (timeMs: number): string => {
  if (timeMs < 1000) {
    return `${timeMs}ms`;
  } else if (timeMs < 60000) {
    return `${(timeMs / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = ((timeMs % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
};

/**
 * Parse error message for user-friendly display
 */
export const parseErrorMessage = (error: string): string => {
  // Remove technical prefixes and make user-friendly
  return error
    .replace(/^Error:\s*/i, '')
    .replace(/^AI generation failed:\s*/i, '')
    .replace(/^OpenAI API error:\s*/i, '')
    .trim();
};

/**
 * Get status color for response states
 */
export const getStatusColor = (success: boolean, isProcessing: boolean): 'success' | 'error' | 'processing' => {
  if (isProcessing) return 'processing';
  return success ? 'success' : 'error';
};

// Chat Conversation Management Functions

/**
 * Generate a unique message ID
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique conversation ID
 */
export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new conversation
 */
export const createNewConversation = (documentId?: string): ChatConversation => {
  const now = new Date();
  return {
    id: generateConversationId(),
    messages: [],
    createdAt: now,
    lastActivity: now,
    title: 'New Conversation',
    documentId
  };
};

/**
 * Create a user message
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: generateMessageId(),
    type: 'user',
    content,
    timestamp: new Date()
  };
};

/**
 * Create an AI assistant message
 */
export const createAssistantMessage = (
  content: string,
  success: boolean = true,
  functionUsed?: AIFunction,
  processingTime?: number,
  error?: string,
  metadata?: any
): ChatMessage => {
  return {
    id: generateMessageId(),
    type: success ? 'assistant' : 'error',
    content,
    timestamp: new Date(),
    functionUsed,
    processingTime,
    success,
    error,
    metadata
  };
};

/**
 * Add a message to a conversation
 */
export const addMessageToConversation = (
  conversation: ChatConversation,
  message: ChatMessage
): ChatConversation => {
  return {
    ...conversation,
    messages: [...conversation.messages, message],
    lastActivity: new Date(),
    title: conversation.messages.length === 0 ? generateConversationTitle(message.content) : conversation.title
  };
};

/**
 * Generate a conversation title from the first user message
 */
export const generateConversationTitle = (firstMessage: string): string => {
  // Take first 50 characters and add ellipsis if longer
  const title = firstMessage.trim().substring(0, 50);
  return title.length < firstMessage.trim().length ? `${title}...` : title;
};

/**
 * Convert old AIResponse to ChatMessage format
 */
export const convertAIResponseToMessage = (response: AIResponse, userPrompt: string): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  
  // Add user message
  messages.push(createUserMessage(userPrompt));
  
  // Add AI response
  if (response.success) {
    messages.push(createAssistantMessage(
      'Document generated successfully!',
      true,
      response.functionUsed as AIFunction,
      response.processingTime,
      undefined,
      response.metadata
    ));
  } else {
    messages.push(createAssistantMessage(
      response.error || 'Generation failed',
      false,
      response.functionUsed as AIFunction,
      response.processingTime,
      response.error,
      response.metadata
    ));
  }
  
  return messages;
};

/**
 * Convert conversation to AI response history (for backward compatibility)
 */
export const convertConversationToHistory = (conversation: ChatConversation): AIResponse[] => {
  const history: AIResponse[] = [];
  
  // Group messages by pairs (user + assistant)
  for (let i = 0; i < conversation.messages.length; i += 2) {
    const userMessage = conversation.messages[i];
    const assistantMessage = conversation.messages[i + 1];
    
    if (userMessage?.type === 'user' && assistantMessage) {
      history.push({
        success: assistantMessage.success !== false,
        error: assistantMessage.error,
        functionUsed: assistantMessage.functionUsed,
        processingTime: assistantMessage.processingTime,
        metadata: assistantMessage.metadata
      });
    }
  }
  
  return history;
};

/**
 * Get formatted timestamp for message display
 */
export const formatMessageTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // More than 24 hours - show date
  return timestamp.toLocaleDateString();
};

/**
 * Get message status color for UI
 */
export const getMessageStatusColor = (message: ChatMessage): string => {
  if (message.type === 'error') return 'red';
  if (message.type === 'assistant' && message.success === true) return 'green';
  if (message.type === 'user') return 'blue';
  return 'gray';
};

/**
 * Check if message should show metadata
 */
export const shouldShowMessageMetadata = (message: ChatMessage): boolean => {
  return message.type === 'assistant' && (
    !!message.functionUsed ||
    !!message.processingTime ||
    !!message.metadata
  );
}; 