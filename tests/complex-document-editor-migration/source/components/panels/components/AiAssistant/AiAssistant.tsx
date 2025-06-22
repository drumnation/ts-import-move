/**
 * AI Assistant Panel Component
 * 
 * AI-powered legal document generation sidebar using OpenAI function calling.
 * Clean chatbot interface with subtle context awareness.
 * 
 * @module AiAssistant
 */

import React from 'react';
import {
  Box,
  Group,
  Text,
  Badge,
  ThemeIcon,
  Paper,
  Stack
} from '@mantine/core';
import {
  IconBrain,
  IconFileText,
  IconTarget
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { modalVariants } from '@/animations';
import type { AiAssistantProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.types';
import { useAiAssistant } from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.hook';
import { ChatInterface } from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/components';
import {
  AiAssistantContainer,
  AiAssistantHeader,
  SubtleContextDisplay
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.styles';

/**
 * AI Assistant Panel Component with named export
 * Restored to original chatbot design - chat-only interface
 */
export const AiAssistant = ({
  document,
  onDocumentUpdate,
  selectedNodeId,
  expanded = true,
  maxHeight,
  className,
  generationState,
  onStateChange
}: AiAssistantProps) => {
  const {
    prompt,
    isGenerating,
    textareaRef,
    messagesEndRef,
    conversation,
    setPrompt,
    handleSubmitPrompt,
    handleClear,
    handleNewConversation
  } = useAiAssistant({
    document,
    onDocumentUpdate,  
    selectedNodeId,
    expanded,
    generationState,
    onStateChange
  });

  // Render subtle context display (max 3 lines as specified)
  const renderSubtleContext = () => {
    if (!document && !selectedNodeId) return null;

    const contextLines = [];
    if (document) {
      contextLines.push(document.caption?.title || 'Untitled Document');
    }
    if (selectedNodeId) {
      contextLines.push(`Selected: ${selectedNodeId}`);
    }

    // Limit to max 3 lines
    const displayLines = contextLines.slice(0, 3);

    return (
      <SubtleContextDisplay>
        <Stack gap={2}>
          {displayLines.map((line, index) => (
            <Group key={index} gap={4} align="center">
              {index === 0 && document && <IconFileText size={10} />}
              {index === 1 && selectedNodeId && <IconTarget size={10} />}
              <Text size="xs" c="gray.6" truncate>
                {line}
              </Text>
            </Group>
          ))}
        </Stack>
      </SubtleContextDisplay>
    );
  };

  if (!expanded) {
    return (
      <AiAssistantContainer className={className} style={{ maxHeight }}>
        <AiAssistantHeader>
          <Group gap="sm">
            <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'violet' }} size="sm">
              <IconBrain size={14} />
            </ThemeIcon>
            <Text size="sm" fw={600}>AI Assistant</Text>
          </Group>
        </AiAssistantHeader>
      </AiAssistantContainer>
    );
  }

  return (
    <AiAssistantContainer className={className} style={{ maxHeight }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <AiAssistantHeader>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'violet' }}>
                <IconBrain size={18} />
              </ThemeIcon>
              <Text size="sm" fw={600}>AI Legal Assistant</Text>
            </Group>
            <Badge variant="light" size="sm">
              {document ? 'Connected' : 'Ready'}
            </Badge>
          </Group>
        </AiAssistantHeader>

        {/* Subtle Context Display (max 3 lines) */}
        {renderSubtleContext()}

        {/* Chat Interface - Clean chatbot design */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatInterface
            conversation={conversation}
            prompt={prompt}
            isGenerating={isGenerating}
            textareaRef={textareaRef}
            messagesEndRef={messagesEndRef}
            onPromptChange={setPrompt}
            onSubmit={handleSubmitPrompt}
            onClear={handleClear}
            onNewConversation={handleNewConversation}
          />
        </Box>
      </motion.div>
    </AiAssistantContainer>
  );
}; 