/**
 * AI Assistant Panel Hook
 * 
 * Custom hook for managing AI Assistant panel state and logic.
 * Simplified for chat-only interface.
 * 
 * @module AiAssistant.hook
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  AIRequest, 
  AIResponse, 
  AiAssistantProps,
  ChatConversation,
  ChatMessage,
  AIFunction
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.types';
import {
  createNewConversation,
  createUserMessage,
  createAssistantMessage,
  addMessageToConversation,
  convertAIResponseToMessage,
  convertConversationToHistory
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.logic';

/**
 * Custom hook for AI Assistant panel state management
 * Simplified for chat-only interface
 */
export const useAiAssistant = ({
  document,
  onDocumentUpdate,
  selectedNodeId,
  expanded = true,
  generationState,
  onStateChange
}: Pick<AiAssistantProps, 'document' | 'onDocumentUpdate' | 'selectedNodeId' | 'expanded' | 'generationState' | 'onStateChange'>) => {
  const [prompt, setPrompt] = useState(generationState?.prompt || '');
  const [isGenerating, setIsGenerating] = useState(generationState?.isGenerating || false);
  const [history, setHistory] = useState<AIResponse[]>(generationState?.history || []);
  
  // Chat state management (chat-only mode)
  const [conversation, setConversation] = useState<ChatConversation>(
    generationState?.conversation || createNewConversation(document?.caption?.title)
  );
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus textarea when expanded
  useEffect(() => {
    if (expanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [expanded]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  // Handle state changes (simplified for chat-only)
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        prompt,
        isGenerating,
        history,
        conversation,
        chatMode: true // Always chat mode
      });
    }
  }, [prompt, isGenerating, history, conversation, onStateChange]);

  // Convert existing history to chat format on mount
  useEffect(() => {
    if (conversation.messages.length === 0 && history.length > 0) {
      let updatedConversation = conversation;
      
      history.forEach((response, index) => {
        const messages = convertAIResponseToMessage(response, `Request ${index + 1}`);
        messages.forEach(message => {
          updatedConversation = addMessageToConversation(updatedConversation, message);
        });
      });
      
      setConversation(updatedConversation);
    }
  }, [conversation.messages.length, history]);

  // Mock AI API call
  const mockAiApiCall = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate different response types
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      return {
        success: true,
        document: document,
        functionUsed: 'createLegalDoc', // Simplified - no function selection
        processingTime: 1000 + Math.random() * 2000,
        metadata: {
          tokensUsed: Math.floor(100 + Math.random() * 500),
          model: 'gpt-4',
          confidence: 0.8 + Math.random() * 0.2
        }
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate content. Please try again.',
        functionUsed: 'createLegalDoc',
        processingTime: 500 + Math.random() * 1000
      };
    }
  }, [document]);

  // Submit prompt handler (chat-only)
  const handleSubmitPrompt = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    const currentPrompt = prompt.trim();
    
    // Add user message immediately
    const userMessage = createUserMessage(currentPrompt);
    setConversation(prev => addMessageToConversation(prev, userMessage));
    
    setIsGenerating(true);
    setPrompt(''); // Clear input immediately

    try {
      const request: AIRequest = {
        prompt: currentPrompt,
        context: {
          document,
          selectedNodeId,
        },
        options: {
          function: 'createLegalDoc' as AIFunction // Simplified - no function selection
        }
      };

      const response = await mockAiApiCall(request);
      
      // Add assistant message
      const assistantMessage = createAssistantMessage(
        response.success 
          ? '✅ Successfully generated content! The document has been updated.'
          : `❌ ${response.error}`,
        response.success,
        response.functionUsed as AIFunction,
        response.processingTime,
        response.error,
        response.metadata
      );
      setConversation(prev => addMessageToConversation(prev, assistantMessage));

      // Update history
      setHistory(prev => [...prev, response]);

      // Call document update handler if successful
      if (response.success && response.document && onDocumentUpdate) {
        onDocumentUpdate(response.document);
      }

    } catch (error) {
      console.error('AI generation failed:', error);
      
      const errorResponse: AIResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        functionUsed: 'createLegalDoc',
        processingTime: Date.now() % 1000
      };

      const errorMessage = createAssistantMessage(
        `❌ ${errorResponse.error}`,
        false,
        'createLegalDoc' as AIFunction,
        errorResponse.processingTime,
        errorResponse.error
      );
      setConversation(prev => addMessageToConversation(prev, errorMessage));
      setHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, document, selectedNodeId, onDocumentUpdate, mockAiApiCall]);

  // Clear current prompt
  const handleClear = useCallback(() => {
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Start new conversation
  const handleNewConversation = useCallback(() => {
    setConversation(createNewConversation(document?.caption?.title));
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [document?.caption?.title]);

  return {
    // State
    prompt,
    isGenerating,
    conversation,
    textareaRef,
    messagesEndRef,
    
    // Actions
    setPrompt,
    handleSubmitPrompt,
    handleClear,
    handleNewConversation
  };
}; 