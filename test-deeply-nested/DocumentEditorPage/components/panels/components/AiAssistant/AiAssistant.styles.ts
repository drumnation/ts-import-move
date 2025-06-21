/**
 * AI Assistant Panel Styles
 * 
 * Styled components using @emotion/styled for the AI Assistant panel.
 * 
 * @module AiAssistant.styles
 */

import styled from '@emotion/styled';
import { Box, Card, Stack } from '@mantine/core';
import { motion } from 'framer-motion';

export const AiAssistantContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--mantine-color-gray-0);
  border-left: 1px solid var(--mantine-color-gray-3);
  
  /* Level 1 Responsive: Mobile optimization */
  @media (max-width: 768px) {
    border-left: none;
    border-radius: 0;
    background: var(--mantine-color-white);
  }
  
  @media (min-width: 769px) {
    border-radius: var(--mantine-radius-md);
  }
`;

export const AiAssistantHeader = styled(Box)`
  padding: var(--mantine-spacing-md);
  border-bottom: 1px solid var(--mantine-color-gray-3);
  background: white;
  
  h3 {
    margin: 0;
    font-size: var(--mantine-font-size-lg);
    font-weight: 600;
    color: var(--mantine-color-gray-8);
  }
  
  /* Mobile: Larger header and sticky positioning */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-lg);
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid var(--mantine-color-gray-4);
    
    h3 {
      font-size: var(--mantine-font-size-xl);
      text-align: center;
    }
  }
  
  /* Desktop: Rounded top corners */
  @media (min-width: 769px) {
    border-top-left-radius: var(--mantine-radius-md);
    border-top-right-radius: var(--mantine-radius-md);
  }
`;

export const AiAssistantContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Mobile: Full height utilization */
  @media (max-width: 768px) {
    min-height: 0;
  }
`;

export const SubtleContextDisplay = styled(Box)`
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-md);
  background: var(--mantine-color-gray-0);
  border-bottom: 1px solid var(--mantine-color-gray-2);
  font-size: var(--mantine-font-size-xs);
  max-height: 60px; /* Limit to ~3 lines */
  overflow: hidden;
  
  /* Subtle appearance - not prominent like the old Context section */
  opacity: 0.8;
  
  /* Mobile: Slightly larger for readability */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
    max-height: 72px;
  }
`;

export const QuickPromptsContainer = styled(motion.div)`
  background: var(--mantine-color-gray-0);
  border-bottom: 1px solid var(--mantine-color-gray-3);
  padding: var(--mantine-spacing-sm);
  
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-md);
  }
`;

export const QuickPromptButton = styled(motion.button)`
  all: unset;
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-xs);
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
  border-radius: var(--mantine-radius-sm);
  background: white;
  border: 1px solid var(--mantine-color-gray-3);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--mantine-font-size-sm);
  color: var(--mantine-color-gray-7);
  
  &:hover {
    background: var(--mantine-color-blue-0);
    border-color: var(--mantine-color-blue-3);
    color: var(--mantine-color-blue-7);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  /* Mobile: Larger touch targets */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
    font-size: var(--mantine-font-size-md);
    border-radius: var(--mantine-radius-md);
  }
`;

export const ResponseContainer = styled(motion.div)`
  background: white;
  border: 1px solid var(--mantine-color-gray-3);
  border-radius: var(--mantine-radius-md);
  padding: var(--mantine-spacing-md);
  
  &.success {
    border-color: var(--mantine-color-green-5);
    background: var(--mantine-color-green-0);
  }
  
  &.error {
    border-color: var(--mantine-color-red-5);
    background: var(--mantine-color-red-0);
  }
  
  &.processing {
    border-color: var(--mantine-color-blue-5);
    background: var(--mantine-color-blue-0);
  }
  
  /* Mobile: Larger response containers */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-lg);
    border-radius: var(--mantine-radius-lg);
    font-size: var(--mantine-font-size-md);
    
    /* Enhanced visual status indicators */
    &.success, &.error, &.processing {
      border-width: 2px;
    }
  }
`;

// Chat Interface Styles
export const ChatContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--mantine-color-gray-0);
`;

export const ChatMessagesArea = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: var(--mantine-spacing-sm);
  background: var(--mantine-color-gray-0);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--mantine-color-gray-1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--mantine-color-gray-4);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--mantine-color-gray-5);
  }
`;

export const MessageBubble = styled(motion.div)<{ 
  isUser: boolean; 
  isError?: boolean;
  isSuccess?: boolean; 
}>`
  max-width: 85%;
  margin-bottom: var(--mantine-spacing-sm);
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  
  .message-content {
    padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
    border-radius: var(--mantine-radius-md);
    font-size: var(--mantine-font-size-sm);
    line-height: 1.4;
    word-wrap: break-word;
    
    ${props => props.isUser ? `
      background: var(--mantine-color-blue-6);
      color: white;
      border-bottom-right-radius: 4px;
    ` : `
      background: white;
      color: var(--mantine-color-gray-8);
      border: 1px solid var(--mantine-color-gray-3);
      border-bottom-left-radius: 4px;
    `}
    
    ${props => props.isError && `
      background: var(--mantine-color-red-0);
      border-color: var(--mantine-color-red-3);
      color: var(--mantine-color-red-8);
    `}
    
    ${props => props.isSuccess && `
      background: var(--mantine-color-green-0);
      border-color: var(--mantine-color-green-3);
      color: var(--mantine-color-green-8);
    `}
  }
  
  .message-metadata {
    font-size: var(--mantine-font-size-xs);
    color: var(--mantine-color-gray-6);
    margin-top: var(--mantine-spacing-xs);
    text-align: ${props => props.isUser ? 'right' : 'left'};
  }
  
  /* Mobile: Larger bubbles and touch-friendly sizing */
  @media (max-width: 768px) {
    max-width: 90%;
    
    .message-content {
      padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
      font-size: var(--mantine-font-size-md);
      line-height: 1.5;
    }
    
    .message-metadata {
      font-size: var(--mantine-font-size-sm);
      margin-top: var(--mantine-spacing-sm);
    }
  }
`;

export const ChatInputArea = styled(Box)`
  border-top: 1px solid var(--mantine-color-gray-3);
  background: white;
  padding: var(--mantine-spacing-sm);
  
  /* Mobile: Larger input area */
  @media (max-width: 768px) {
    padding: var(--mantine-spacing-md);
    border-top: 2px solid var(--mantine-color-gray-3);
  }
`;

export const ModeToggleContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-xs);
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
  background: var(--mantine-color-gray-1);
  border-radius: var(--mantine-radius-sm);
  margin-bottom: var(--mantine-spacing-sm);
`;

export const EmptyConversationState = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--mantine-spacing-xl);
  text-align: center;
  color: var(--mantine-color-gray-6);
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--mantine-spacing-md);
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: var(--mantine-font-size-lg);
    font-weight: 600;
    margin-bottom: var(--mantine-spacing-xs);
    color: var(--mantine-color-gray-7);
  }
  
  .empty-description {
    font-size: var(--mantine-font-size-sm);
    max-width: 250px;
    line-height: 1.4;
  }
`; 