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
import { usePlatformDetection } from '@/tests/complex-document-editor-migration/source/components/panels/layout/components/PlatformDetection';
import type { SessionsPanelProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Sessions/SessionsPanel.types';
import {
  StyledContainer,
  StyledHeader,
  StyledSessionInfo,
  StyledContent,
  StyledTimeline,
  StyledFooter,
  StyledEmptyState,
  StyledSessionStats
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Sessions/SessionsPanel.styles';
import { getActivityIcon, getStatusColor, formatDuration } from '@/tests/complex-document-editor-migration/source/components/panels/components/Sessions/Sessions.logic';
import { useSessions } from '@/tests/complex-document-editor-migration/source/components/panels/components/Sessions/Sessions.hook';

export const SessionsPanel: React.FC<SessionsPanelProps> = ({ 
  className,
  maxHeight = '100%'
}) => {
  const { isMobile } = usePlatformDetection();
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
        bullet={<ActivityIcon size={isMobile ? 16 : 12} />}
        title={
          <Group justify="space-between" align="center">
            <Text fw={500} size={isMobile ? 'md' : 'sm'}>
              {activity.title}
            </Text>
            <Menu shadow="md" width={isMobile ? 200 : 160}>
              <Menu.Target>
                <ActionIcon 
                  variant="light" 
                  color="gray" 
                  size={isMobile ? 'sm' : 'xs'}
                >
                  <IconDots size={isMobile ? 16 : 12} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconShare size={isMobile ? 18 : 14} />}
                  onClick={() => handleShareActivity(activity.id)}
                >
                  Share
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconTrash size={isMobile ? 18 : 14} />}
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
        <Stack gap={isMobile ? 'sm' : 'xs'} mt="xs">
          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
            {activity.description}
          </Text>
          
          <Group gap="xs" align="center">
            <Avatar size={isMobile ? 20 : 16} radius="xl">
              {activity.user === 'AI Agent' ? 
                <IconBrain size={isMobile ? 12 : 10} /> : 
                <IconUser size={isMobile ? 12 : 10} />
              }
            </Avatar>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
              {activity.user}
            </Text>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">•</Text>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
              {activity.timestamp.toLocaleTimeString()}
            </Text>
            {activity.duration && (
              <>
                <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">•</Text>
                <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                  {formatDuration(activity.duration)}
                </Text>
              </>
            )}
          </Group>
          
          <Badge
            size={isMobile ? 'sm' : 'xs'}
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
    <StyledEmptyState isMobile={isMobile}>
      <Text c="dimmed" size={isMobile ? 'lg' : 'sm'}>
        No session activities yet
      </Text>
      <Text c="dimmed" size={isMobile ? 'md' : 'xs'} mt="xs">
        Activities will appear here as you work
      </Text>
    </StyledEmptyState>
  );

  return (
    <StyledContainer className={className} isMobile={isMobile} maxHeight={maxHeight}>
      {/* Header */}
      <StyledHeader isMobile={isMobile}>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={600} size={isMobile ? 'xl' : 'lg'}>Session History</Text>
          <Button
            size={isMobile ? 'md' : 'sm'}
            leftSection={<IconPlus size={isMobile ? 20 : 16} />}
            onClick={handleNewSession}
          >
            New Session
          </Button>
        </Group>

        {/* Current session info */}
        <StyledSessionInfo isMobile={isMobile}>
          <Text size={isMobile ? 'md' : 'sm'} c="dimmed" mb={4}>Current Session</Text>
          <Badge variant="light" color="blue" size={isMobile ? 'xl' : 'lg'}>
            {currentSessionInfo.name}
          </Badge>
          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mt={4}>
            Started {currentSessionInfo.startDate} at {currentSessionInfo.startTime}
          </Text>
        </StyledSessionInfo>
      </StyledHeader>

      {/* Activities Timeline */}
      <StyledContent isMobile={isMobile}>
        <ScrollArea h="100%">
          <StyledTimeline isMobile={isMobile}>
            <Timeline 
              active={activities.length} 
              bulletSize={isMobile ? 32 : 24} 
              lineWidth={isMobile ? 3 : 2}
            >
              {activities.map(renderTimelineItem)}
            </Timeline>
            {activities.length === 0 && renderEmptyState()}
          </StyledTimeline>
        </ScrollArea>
      </StyledContent>

      {/* Session stats */}
      <StyledFooter isMobile={isMobile}>
        <StyledSessionStats isMobile={isMobile} justify="space-around" align="center">
          <Box ta="center">
            <Text fw={600} size={isMobile ? 'xl' : 'lg'}>{sessionStats.totalActivities}</Text>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">Activities</Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size={isMobile ? 'xl' : 'lg'}>{sessionStats.agentRuns}</Text>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">Agent Runs</Text>
          </Box>
          <Box ta="center">
            <Text fw={600} size={isMobile ? 'xl' : 'lg'}>{sessionStats.completed}</Text>
            <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">Completed</Text>
          </Box>
        </StyledSessionStats>
      </StyledFooter>
    </StyledContainer>
  );
};

export default SessionsPanel; 