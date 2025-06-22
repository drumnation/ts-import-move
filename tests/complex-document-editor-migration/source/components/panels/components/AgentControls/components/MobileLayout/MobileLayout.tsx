/**
 * Mobile Layout Component for Agent Controls
 * @module AgentControls.MobileLayout
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
  Grid
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
  IconCheck,
  IconAlertTriangle
} from '@tabler/icons-react';
import type { QuickAction, ModelOption } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/agentControls.types';
import { getSelectedNodesDisplayText } from '@/tests/complex-document-editor-migration/source/components/panels/components/AgentControls/components/agentControls.logic';

interface MobileLayoutProps {
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

export const MobileLayout: React.FC<MobileLayoutProps> = ({
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
      {/* Mobile Header */}
      <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group gap="xs">
          <IconBrain size={20} />
          <Text fw={600} size="md">Agent Controls</Text>
          {selectedText && (
            <Badge size="sm" variant="light">
              {selectedText}
            </Badge>
          )}
        </Group>
        {onToggleExpansion && (
          <ActionIcon
            variant="light"
            size={44}
            onClick={onToggleExpansion}
          >
            {expanded ? <IconChevronDown size={16} /> : <IconChevronUp size={16} />}
          </ActionIcon>
        )}
      </Group>

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="md" p="md">
          {/* Target Context */}
          {targetPath && (
            <Card padding="sm" withBorder>
              <Group gap="xs">
                <IconTarget size={16} />
                <Text size="sm" fw={500}>Target:</Text>
                <Badge variant="light" size="sm">
                  {targetPath}
                </Badge>
              </Group>
            </Card>
          )}

          {/* Quick Actions */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Quick Actions</Text>
            <Grid>
              {quickActions.map((action) => (
                <Grid.Col span={6} key={action.id}>
                  <Button
                    variant="light"
                    size="sm"
                    fullWidth
                    leftSection={<IconSparkles size={14} />}
                    onClick={() => handleQuickAction(action)}
                    style={{ height: 'auto', padding: '12px' }}
                  >
                    <Stack gap={2} align="center">
                      <Text size="xs" fw={500}>{action.label}</Text>
                      <Text size="xs" c="dimmed">{action.estimatedTime}</Text>
                    </Stack>
                  </Button>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          {/* Instruction Input */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Instruction</Text>
            <Textarea
              placeholder="Describe what you want the agent to do..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              minRows={3}
              maxRows={6}
              size="sm"
            />
          </Box>

          {/* Advanced Options */}
          <Box>
            <Button
              variant="subtle"
              size="xs"
              leftSection={showAdvanced ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced Options
            </Button>
            
            <Collapse in={showAdvanced}>
              <Stack gap="sm" mt="sm">
                <Select
                  label="AI Model"
                  value={selectedModel}
                  onChange={(value) => setSelectedModel(value || 'claude-3.5-sonnet')}
                  data={models}
                  size="sm"
                />
              </Stack>
            </Collapse>
          </Box>

          {/* Execute Button */}
          <Button
            size="md"
            leftSection={<IconPlayerPlay size={16} />}
            onClick={handleExecute}
            disabled={!canExecute}
            loading={isExecuting}
            fullWidth
          >
            {isExecuting ? 'Running Agent...' : 'Run Agent'}
          </Button>

          {/* Progress */}
          {isExecuting && (
            <Box>
              <Text size="sm" mb="xs">Execution Progress</Text>
              <Progress value={executionProgress} animated />
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                {executionProgress}% complete
              </Text>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Alert color="red" icon={<IconAlertTriangle size={16} />}>
              <Text size="sm">{error}</Text>
            </Alert>
          )}

          {/* Result */}
          {currentResult && (
            <Card padding="sm" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Result</Text>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={clearResult}
                >
                  <IconX size={12} />
                </ActionIcon>
              </Group>
              <Box
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}
              >
                {currentResult}
              </Box>
              <Group gap="xs" mt="sm">
                <Button size="xs" variant="light" leftSection={<IconCheck size={12} />}>
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