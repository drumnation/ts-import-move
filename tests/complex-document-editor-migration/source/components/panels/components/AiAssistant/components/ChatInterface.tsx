/**
 * Chat Interface Component
 * 
 * Chatbot-style conversation interface for AI Assistant
 * 
 * @module ChatInterface
 */

import React from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  Textarea,
  ActionIcon,
  Badge,
  Loader,
  Divider
} from '@mantine/core';
import {
  IconSend,
  IconPlus,
  IconClock,
  IconBrain,
  IconUser
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariants, useSlideUp } from '@/animations';
import {
  ChatContainer,
  ChatMessagesArea,
  MessageBubble,
  ChatInputArea,
  EmptyConversationState
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.styles';
import type { ChatConversation, ChatMessage } from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.types';
import {
  formatMessageTimestamp,
  getMessageStatusColor,
  shouldShowMessageMetadata
} from '@/tests/complex-document-editor-migration/source/components/panels/components/AiAssistant/AiAssistant.logic';

interface ChatInterfaceProps {
  conversation: ChatConversation;
  prompt: string;
  isGenerating: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onNewConversation: () => void;
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const isSuccess = message.success === true;

  return (
    <MessageBubble
      key={message.id}
      isUser={isUser}
      isError={isError}
      isSuccess={isSuccess}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageVariants}
      layout
    >
      <div className="message-content">
        {message.content}
      </div>
      
      <div className="message-metadata">
        <Group gap="xs" justify={isUser ? 'flex-end' : 'flex-start'}>
          {!isUser && (
            <Group gap={4}>
              <IconBrain size={12} />
              <Text size="xs">AI Assistant</Text>
            </Group>
          )}
          
          {isUser && (
            <Group gap={4}>
              <IconUser size={12} />
              <Text size="xs">You</Text>
            </Group>
          )}
          
          <Text size="xs" c="dimmed">
            {formatMessageTimestamp(message.timestamp)}
          </Text>
          
          {shouldShowMessageMetadata(message) && (
            <>
              {message.functionUsed && (
                <Badge size="xs" variant="light" color={getMessageStatusColor(message)}>
                  {message.functionUsed}
                </Badge>
              )}
              
              {message.processingTime && (
                <Group gap={2}>
                  <IconClock size={10} />
                  <Text size="xs" c="dimmed">
                    {message.processingTime < 1000 
                      ? `${message.processingTime}ms`
                      : `${(message.processingTime / 1000).toFixed(1)}s`
                    }
                  </Text>
                </Group>
              )}
            </>
          )}
        </Group>
      </div>
    </MessageBubble>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  prompt,
  isGenerating,
  textareaRef,
  messagesEndRef,
  onPromptChange,
  onSubmit,
  onClear,
  onNewConversation
}) => {
  const slideUpVariants = useSlideUp();

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit();
    }
  }, [onSubmit]);

  const renderEmptyState = () => (
    <EmptyConversationState>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
      >
        <div className="empty-icon">🤖</div>
        <div className="empty-title">Start a conversation</div>
        <div className="empty-description">
          Ask me anything about legal documents, motions, or analysis. I'm here to help!
        </div>
      </motion.div>
    </EmptyConversationState>
  );

  const renderMessages = () => (
    <Stack gap="md" style={{ padding: '0 8px' }}>
      <AnimatePresence mode="popLayout">
        {conversation.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </AnimatePresence>
      
      {/* Show typing indicator when generating */}
      {isGenerating && (
        <MessageBubble
          isUser={false}
          initial="hidden"
          animate="visible"
          variants={messageVariants}
        >
          <div className="message-content">
            <Group gap="xs" align="center">
              <Loader size="xs" />
              <Text size="sm" c="dimmed">AI is thinking...</Text>
            </Group>
          </div>
        </MessageBubble>
      )}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </Stack>
  );

  return (
    <ChatContainer>
      {/* Header with conversation info */}
      <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              {conversation.title || 'Legal AI Assistant'}
            </Text>
            <Badge size="xs" variant="light">
              {conversation.messages.length} messages
            </Badge>
          </Group>
          
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlus size={12} />}
            onClick={onNewConversation}
          >
            New Chat
          </Button>
        </Group>
      </Box>

      {/* Messages Area */}
      <ChatMessagesArea>
        {conversation.messages.length === 0 ? renderEmptyState() : renderMessages()}
      </ChatMessagesArea>

      {/* Input Area */}
      <ChatInputArea>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUpVariants}
        >
          <Stack gap="xs">
            <Group align="flex-end" gap="xs">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(event) => onPromptChange(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                minRows={1}
                maxRows={4}
                autosize
                disabled={isGenerating}
                style={{ flex: 1 }}
                styles={{
                  input: {
                    resize: 'none',
                    fontSize: '14px',
                    borderRadius: '20px',
                    paddingLeft: '16px',
                    paddingRight: '16px'
                  }
                }}
              />
              
              <ActionIcon
                variant="gradient"
                gradient={{ from: 'blue', to: 'violet' }}
                size="lg"
                onClick={onSubmit}
                disabled={!prompt.trim() || isGenerating}
                style={{ borderRadius: '50%' }}
              >
                {isGenerating ? <Loader size={16} /> : <IconSend size={16} />}
              </ActionIcon>
              
              {prompt && (
                <ActionIcon
                  variant="light"
                  color="gray"
                  onClick={onClear}
                  disabled={isGenerating}
                >
                  <IconPlus size={16} style={{ transform: 'rotate(45deg)' }} />
                </ActionIcon>
              )}
            </Group>
            
            <Text size="xs" c="dimmed" ta="center">
              Press Cmd/Ctrl + Enter to send • {conversation.messages.length} messages in this conversation
            </Text>
          </Stack>
        </motion.div>
      </ChatInputArea>
    </ChatContainer>
  );
}; 