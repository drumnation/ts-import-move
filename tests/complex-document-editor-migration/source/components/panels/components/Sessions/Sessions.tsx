import React from 'react';
import {
  Stack,
  Group,
  Button,
  Text,
  ScrollArea,
  Badge,
  Timeline,
  Avatar,
  ActionIcon,
  Menu,
  Box
} from '@mantine/core';
import {
  IconPlus,
  IconUser,
  IconBrain,
  IconDots,
  IconShare,
  IconTrash
} from '@tabler/icons-react';
import type { SessionsProps } from './Sessions.types';
import {
  SessionsContainer,
  SessionsHeader,
  SessionsContent,
  SessionsScrollArea,
  SessionsFooter,
  EmptyStateContainer
} from './Sessions.styles';
import { getActivityIcon, getStatusColor, formatDuration } from './Sessions.logic';
import { useSessions } from './Sessions.hook';

export const Sessions: React.FC<SessionsProps> = ({ className }) => {
  const {
    activities,
    currentSessionInfo,
    sessionStats,
    handlers: { handleDeleteActivity, handleNewSession, handleShareActivity }
  } = useSessions();

  const renderTimelineItem = (activity: typeof activities[0]) => {
    const ActivityIcon = getActivityIcon(activity.type);
    
    return (
      <Timeline.Item
        key={activity.id}
        bullet={<ActivityIcon size={12} />}
        title={
          <Group justify="space-between" align="center">
            <Text fw={500} size="sm">
              {activity.title}
            </Text>
            <Menu shadow="md" width={160}>
              <Menu.Target>
                <ActionIcon variant="light" color="gray" size="xs">
                  <IconDots size={12} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconShare size={14} />}
                  onClick={() => handleShareActivity(activity.id)}
                >
                  Share
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => handleDeleteActivity(activity.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        }
      >
        <Stack gap="xs" mt="xs">
          <Text size="xs" c="dimmed">
            {activity.description}
          </Text>
          
          <Group gap="xs" align="center">
            <Avatar size={16} radius="xl">
              {activity.user === 'AI Agent' ? <IconBrain size={10} /> : <IconUser size={10} />}
            </Avatar>
            <Text size="xs" c="dimmed">
              {activity.user}
            </Text>
            <Text size="xs" c="dimmed">•</Text>
            <Text size="xs" c="dimmed">
              {activity.timestamp.toLocaleTimeString()}
            </Text>
            {activity.duration && (
              <>
                <Text size="xs" c="dimmed">•</Text>
                <Text size="xs" c="dimmed">
                  {formatDuration(activity.duration)}
                </Text>
              </>
            )}
          </Group>
          
          <Badge
            size="xs"
            color={getStatusColor(activity.status)}
            variant="light"
          >
            {activity.status.replace('_', ' ')}
          </Badge>
        </Stack>
      </Timeline.Item>
    );
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <Text c="dimmed" size="sm">
        No session activities yet
      </Text>
      <Text c="dimmed" size="xs" mt="xs">
        Activities will appear here as you work
      </Text>
    </EmptyStateContainer>
  );

  return (
    <SessionsContainer className={className}>
      {/* Header */}
      <SessionsHeader>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={600} size="lg">Session History</Text>
          <Button
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={handleNewSession}
          >
            New Session
          </Button>
        </Group>

        {/* Current session info */}
        <Box>
          <Text size="sm" c="dimmed" mb={4}>Current Session</Text>
          <Badge variant="light" color="blue" size="lg">
            {currentSessionInfo.name}
          </Badge>
          <Text size="xs" c="dimmed" mt={4}>
            Started {currentSessionInfo.startDate} at {currentSessionInfo.startTime}
          </Text>
        </Box>
      </SessionsHeader>

      {/* Activities Timeline */}
      <SessionsContent>
        <SessionsScrollArea>
          <ScrollArea h="100%">
            <Timeline active={activities.length} bulletSize={24} lineWidth={2}>
              {activities.map(renderTimelineItem)}
            </Timeline>
            {activities.length === 0 && renderEmptyState()}
          </ScrollArea>
        </SessionsScrollArea>
      </SessionsContent>

      {/* Session stats */}
      <SessionsFooter>
        <Group justify="space-around" align="center">
          <Box ta="center">
            <Text fw={600} size="lg">{sessionStats.totalActivities}</Text>
            <Text size="xs" c="dimmed">Activities</Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="lg">{sessionStats.agentRuns}</Text>
            <Text size="xs" c="dimmed">Agent Runs</Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size="lg">{sessionStats.completed}</Text>
            <Text size="xs" c="dimmed">Completed</Text>
          </Box>
        </Group>
      </SessionsFooter>
    </SessionsContainer>
  );
}; 