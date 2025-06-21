/**
 * AI Assistant Panel Types
 * 
 * Type definitions for AI-powered legal document generation components.
 * 
 * @module AiAssistant.types
 */

import type { Doc, Node } from '@/types/legal-document-ast';

/**
 * Available OpenAI functions for legal document generation
 */
export type AIFunction = 
  | 'createLegalDoc'
  | 'adjustIndent' 
  | 'regenerateSection'
  | 'insertExhibit';

/**
 * Chat message types for conversation interface
 */
export type ChatMessageType = 'user' | 'assistant' | 'system' | 'error';

/**
 * Chat message interface for conversation history
 */
export interface ChatMessage {
  /** Unique message ID */
  id: string;
  /** Message type */
  type: ChatMessageType;
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: Date;
  /** Associated AI function if applicable */
  functionUsed?: AIFunction;
  /** Processing time for AI responses */
  processingTime?: number;
  /** Whether message was successful (for AI responses) */
  success?: boolean;
  /** Error details if applicable */
  error?: string;
  /** Additional metadata */
  metadata?: {
    tokensUsed?: number;
    model?: string;
    confidence?: number;
  };
}

/**
 * Chat conversation state
 */
export interface ChatConversation {
  /** Conversation ID */
  id: string;
  /** Message history */
  messages: ChatMessage[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last activity */
  lastActivity: Date;
  /** Conversation title */
  title?: string;
  /** Associated document ID */
  documentId?: string;
}

/**
 * AI request payload for document generation
 */
export interface AIRequest {
  /** User prompt describing what to generate */
  prompt: string;
  /** Optional context for the AI */
  context?: {
    /** Current document for reference */
    document?: Doc;
    /** Selected node ID for targeted operations */
    selectedNodeId?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
  };
  /** Generation options */
  options?: {
    /** Specific function to use */
    function?: AIFunction;
    /** Temperature for creativity (0-1) */
    temperature?: number;
    /** Max tokens to generate */
    maxTokens?: number;
  };
}

/**
 * AI response from document generation
 */
export interface AIResponse {
  /** Whether the generation was successful */
  success: boolean;
  /** Generated or updated document */
  document?: Doc;
  /** Error message if failed */
  error?: string;
  /** Function that was used */
  functionUsed?: string;
  /** Processing time in milliseconds */
  processingTime?: number;
  /** Additional metadata */
  metadata?: {
    tokensUsed?: number;
    model?: string;
    confidence?: number;
  };
}

/**
 * Quick prompt configuration
 */
export interface QuickPrompt {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Prompt text */
  prompt: string;
  /** Icon component */
  icon: React.ComponentType<any>;
  /** Category for grouping */
  category: 'motions' | 'analysis' | 'documents' | 'structure' | 'formatting';
  /** Keywords for search */
  keywords?: string[];
  /** Required context */
  requiresDocument?: boolean;
  /** Suggested function */
  suggestedFunction?: AIFunction;
}

/**
 * AI generation state
 */
export interface AIGenerationState {
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Current prompt */
  prompt: string;
  /** Selected function */
  selectedFunction: AIFunction;
  /** Last response */
  lastResponse: AIResponse | null;
  /** Generation history */
  history: AIResponse[];
  /** Current session ID */
  sessionId?: string;
  /** Current conversation */
  conversation?: ChatConversation;
  /** Chat interface mode */
  chatMode?: boolean;
}

/**
 * AI Assistant Panel Props - Following React Component Standards
 */
export interface AiAssistantProps {
  /** Current document for context */
  document?: Doc | null;
  /** Document update handler */
  onDocumentUpdate?: (updatedDoc: Doc) => void;
  /** Selected node for targeted operations */
  selectedNode?: Node | null;
  /** Selected node ID */
  selectedNodeId?: string | null;
  /** Panel expanded state */
  expanded?: boolean;
  /** Panel height constraint */
  maxHeight?: number;
  /** Custom class name */
  className?: string;
  /** Generation state override */
  generationState?: Partial<AIGenerationState>;
  /** State change handlers */
  onStateChange?: (state: Partial<AIGenerationState>) => void;
}

/**
 * Slash command configuration
 */
export interface SlashCommand {
  /** Command trigger (without /) */
  trigger: string;
  /** Display label */
  label: string;
  /** Description */
  description: string;
  /** Icon component */
  icon: React.ComponentType<any>;
  /** Handler function */
  handler: (args?: string[]) => Promise<void> | void;
  /** Required arguments */
  args?: {
    name: string;
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    description?: string;
  }[];
  /** Category for grouping */
  category: string;
}

/**
 * AI function parameter schemas for validation
 */
export interface AIFunctionSchema {
  /** Function name */
  name: AIFunction;
  /** Human readable description */
  description: string;
  /** Parameter schema */
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      items?: any;
    }>;
    required: string[];
  };
  /** Example usage */
  examples?: {
    prompt: string;
    expectedResult: string;
  }[];
}

/**
 * Generation session for tracking AI interactions
 */
export interface AISession {
  /** Session ID */
  id: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last activity */
  lastActivity: Date;
  /** Generation history */
  generations: AIResponse[];
  /** Session metadata */
  metadata: {
    documentId?: string;
    userId?: string;
    totalTokens?: number;
    totalTime?: number;
  };
}

/**
 * AI provider configuration
 */
export interface AIProviderConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'local';
  /** Model name */
  model: string;
  /** API endpoint */
  endpoint?: string;
  /** Default parameters */
  defaults: {
    temperature: number;
    maxTokens: number;
    topP?: number;
  };
  /** Function definitions */
  functions: AIFunctionSchema[];
}

// Legacy export for backward compatibility
export interface AISidebarPanelProps extends AiAssistantProps {} 