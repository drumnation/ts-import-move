/**
 * SlashCommandMenu Component
 * 
 * Displays available slash commands in a dropdown menu when triggered
 */

import React from 'react';
import { Paper, Group, Text, Box, Kbd } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { SlashCommand } from '../../hooks/useSlashCommands';
import { SlashCommandMenuProps } from './SlashCommandMenu.types';

/**
 * Individual command item component
 */
const CommandItem: React.FC<{
  command: SlashCommand;
  isSelected: boolean;
  onClick: () => void;
}> = ({ command, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.15 }}
  >
    <Box
      p="xs"
      style={{
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--mantine-color-blue-light)' : 'transparent',
        borderRadius: 'var(--mantine-radius-sm)',
        border: isSelected ? '1px solid var(--mantine-color-blue-6)' : '1px solid transparent'
      }}
      onClick={onClick}
      onMouseEnter={() => {
        // Could trigger hover selection here
      }}
    >
      <Group gap="sm" wrap="nowrap">
        {command.icon && (
          <Text 
            size="lg" 
            style={{ 
              minWidth: '20px',
              textAlign: 'center'
            }}
          >
            {command.icon}
          </Text>
        )}
        
        <Box style={{ flex: 1 }}>
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Text size="sm" fw={500}>
                {command.label}
              </Text>
              <Text size="xs" c="dimmed">
                {command.description}
              </Text>
            </Box>
            
            <Kbd size="xs" style={{ fontSize: '10px' }}>
              {command.trigger}
            </Kbd>
          </Group>
        </Box>
      </Group>
    </Box>
  </motion.div>
);

/**
 * Command category section
 */
const CommandCategory: React.FC<{
  category: string;
  commands: SlashCommand[];
  selectedIndex: number;
  globalStartIndex: number;
  onCommandClick: (command: SlashCommand) => void;
}> = ({ category, commands, selectedIndex, globalStartIndex, onCommandClick }) => {
  const categoryNames = {
    content: 'Content',
    structure: 'Document Structure',
    exhibit: 'Exhibits',
    ai: 'AI Assistant'
  };

  return (
    <Box mb="xs">
      <Text 
        size="xs" 
        fw={600} 
        c="dimmed" 
        tt="uppercase" 
        mb="xs"
        px="xs"
      >
        {categoryNames[category as keyof typeof categoryNames] || category}
      </Text>
      
      {commands.map((command, index) => {
        const globalIndex = globalStartIndex + index;
        return (
          <CommandItem
            key={command.id}
            command={command}
            isSelected={selectedIndex === globalIndex}
            onClick={() => onCommandClick(command)}
          />
        );
      })}
    </Box>
  );
};

/**
 * Main SlashCommandMenu component
 */
export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  isVisible,
  position,
  commands,
  selectedIndex,
  onCommandSelect,
  onClose,
  filter
}) => {
  // Group commands by category
  const commandsByCategory = commands.reduce((acc: Record<string, SlashCommand[]>, command: SlashCommand) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, SlashCommand[]>);

  const categoryOrder = ['content', 'structure', 'exhibit', 'ai'];
  const orderedCategories = categoryOrder.filter(cat => commandsByCategory[cat]?.length > 0);

  // Calculate global index for each command
  let globalIndex = 0;
  const categoryStartIndices: Record<string, number> = {};
  
  orderedCategories.forEach(category => {
    categoryStartIndices[category] = globalIndex;
    globalIndex += commandsByCategory[category].length;
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: position?.x || 0,
            top: (position?.y || 0) + 25, // Offset below cursor
            zIndex: 1000,
            maxHeight: '400px',
            minWidth: '320px',
            maxWidth: '480px'
          }}
        >
          <Paper
            shadow="lg"
            p="sm"
            radius="md"
            withBorder
            style={{
              backgroundColor: 'var(--mantine-color-body)',
              border: '1px solid var(--mantine-color-gray-3)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <Group justify="space-between" mb="sm">
              <Text size="xs" c="dimmed" fw={500}>
                Slash Commands
              </Text>
              
              {filter && (
                <Group gap="xs">
                  <Text size="xs" c="dimmed">Filter:</Text>
                  <Kbd size="xs">/{filter}</Kbd>
                </Group>
              )}
            </Group>

            {/* Commands */}
            {commands.length > 0 ? (
              <Box>
                {orderedCategories.map(category => (
                  <CommandCategory
                    key={category}
                    category={category}
                    commands={commandsByCategory[category]}
                    selectedIndex={selectedIndex}
                    globalStartIndex={categoryStartIndices[category]}
                    onCommandClick={onCommandSelect}
                  />
                ))}
              </Box>
            ) : (
              <Box ta="center" py="md">
                <Text size="sm" c="dimmed">
                  No commands found for "/{filter}"
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Try typing a different command
                </Text>
              </Box>
            )}

            {/* Footer */}
            <Box 
              pt="xs" 
              mt="sm" 
              style={{ 
                borderTop: '1px solid var(--mantine-color-gray-2)' 
              }}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  <Kbd size="xs">↑↓</Kbd>
                  <Text size="xs" c="dimmed">Navigate</Text>
                </Group>
                
                <Group gap="xs">
                  <Kbd size="xs">Enter</Kbd>
                  <Text size="xs" c="dimmed">Select</Text>
                </Group>
                
                <Group gap="xs">
                  <Kbd size="xs">Esc</Kbd>
                  <Text size="xs" c="dimmed">Close</Text>
                </Group>
              </Group>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 