/**
 * Desktop Layout Component for Agent Controls
 * @module AgentControls.DesktopLayout
 */

import React from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  Textarea,
  Select,
  Badge,
  Card,
  ScrollArea,
  ActionIcon,
  Progress,
  Alert,
  Collapse,
  Divider
} from '@mantine/core';
import {
  IconBrain,
  IconPlayerPlay,
  IconSettings,
  IconChevronDown,
  IconChevronUp,
  IconTarget,
  IconSparkles,
  IconX,
  IconAlertTriangle
} from '@tabler/icons-react';
import type { QuickAction, ModelOption } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/agentControls.types';
import { getSelectedNodesDisplayText } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/agentControls.logic';

interface DesktopLayoutProps {
  selectedNodes: string[];
  targetPath: string;
  expanded: boolean;
  onToggleExpansion?: () => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  isExecuting: boolean;
  executionProgress: number;
  currentResult: string | null;
  error: string | null;
  canExecute: boolean;
  quickActions: QuickAction[];
  models: ModelOption[];
  handleQuickAction: (action: QuickAction) => void;
  handleExecute: () => Promise<void>;
  clearResult: () => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  selectedNodes,
  targetPath,
  expanded,
  onToggleExpansion,
  instruction,
  setInstruction,
  selectedModel,
  setSelectedModel,
  showAdvanced,
  setShowAdvanced,
  isExecuting,
  executionProgress,
  currentResult,
  error,
  canExecute,
  quickActions,
  models,
  handleQuickAction,
  handleExecute,
  clearResult
}) => {
  const selectedText = getSelectedNodesDisplayText(selectedNodes.length);

  return (
    <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Desktop Header */}
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group gap="xs">
          <IconBrain size={16} />
          <Text fw={600} size="sm">Agent Controls</Text>
          {selectedText && (
            <Badge size="xs" variant="light">
              {selectedText}
            </Badge>
          )}
        </Group>
        {onToggleExpansion && (
          <ActionIcon
            variant="light"
            size={28}
            onClick={onToggleExpansion}
          >
            {expanded ? <IconChevronDown size={14} /> : <IconChevronUp size={14} />}
          </ActionIcon>
        )}
      </Group>

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="sm" p="sm">
          {/* Target Context */}
          {targetPath && (
            <Card padding="xs" withBorder>
              <Group gap="xs">
                <IconTarget size={12} />
                <Text size="xs" fw={500}>Target:</Text>
                <Badge variant="light" size="xs">
                  {targetPath}
                </Badge>
              </Group>
            </Card>
          )}

          {/* Quick Actions */}
          <Box>
            <Text size="xs" fw={500} mb="xs">Quick Actions</Text>
            <Stack gap="xs">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="light"
                  size="xs"
                  leftSection={<IconSparkles size={10} />}
                  onClick={() => handleQuickAction(action)}
                  justify="space-between"
                  rightSection={
                    <Text size="xs" c="dimmed">{action.estimatedTime}</Text>
                  }
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Instruction Input */}
          <Textarea
            placeholder="Agent instruction..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            minRows={2}
            maxRows={4}
            size="xs"
          />

          {/* Advanced Options */}
          <Collapse in={showAdvanced}>
            <Select
              label="Model"
              value={selectedModel}
              onChange={(value) => setSelectedModel(value || 'claude-3.5-sonnet')}
              data={models}
              size="xs"
            />
          </Collapse>

          <Group gap="xs">
            <Button
              size="xs"
              leftSection={<IconPlayerPlay size={12} />}
              onClick={handleExecute}
              disabled={!canExecute}
              loading={isExecuting}
              style={{ flex: 1 }}
            >
              Run
            </Button>
            <ActionIcon
              variant="light"
              size="xs"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <IconSettings size={10} />
            </ActionIcon>
          </Group>

          {/* Progress */}
          {isExecuting && (
            <Progress value={executionProgress} size="xs" animated />
          )}

          {/* Error */}
          {error && (
            <Alert color="red" p="xs">
              <Text size="xs">{error}</Text>
            </Alert>
          )}

          {/* Result */}
          {currentResult && (
            <Card padding="xs" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={500}>Result</Text>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={clearResult}
                >
                  <IconX size={10} />
                </ActionIcon>
              </Group>
              <Box
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '120px',
                  overflow: 'auto'
                }}
              >
                {currentResult}
              </Box>
              <Group gap="xs" mt="xs">
                <Button size="xs" variant="light">
                  Apply
                </Button>
                <Button size="xs" variant="subtle">
                  Copy
                </Button>
              </Group>
            </Card>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}; 