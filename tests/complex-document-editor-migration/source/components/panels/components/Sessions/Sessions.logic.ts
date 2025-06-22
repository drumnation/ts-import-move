import {
  IconBrain,
  IconShare,
  IconUser,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import type { SessionActivity, ActivityType, ActivityStatus } from '@/tests/complex-document-editor-migration/source/components/panels/components/Sessions/Sessions.types';

export const mockActivities: SessionActivity[] = [
  {
    id: '1',
    type: 'agent_run',
    title: 'Document Summary Generated',
    description: 'AI agent summarized 15-page contract document',
    user: 'AI Agent',
    timestamp: new Date(2024, 11, 15, 14, 30),
    status: 'completed',
    duration: 45
  },
  {
    id: '2',
    type: 'collaboration',
    title: 'Document Shared',
    description: 'Shared with John Doe for legal review',
    user: 'You',
    timestamp: new Date(2024, 11, 15, 13, 15),
    status: 'completed'
  },
  {
    id: '3',
    type: 'agent_run',
    title: 'Citation Verification',
    description: 'Verified 8 case law citations',
    user: 'AI Agent',
    timestamp: new Date(2024, 11, 15, 12, 45),
    status: 'completed',
    duration: 120
  },
  {
    id: '4',
    type: 'edit',
    title: 'Contract Terms Updated',
    description: 'Modified section 3.2 - Payment Terms',
    user: 'You',
    timestamp: new Date(2024, 11, 15, 11, 20),
    status: 'completed'
  }
];

export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
  case 'agent_run': return IconBrain;
  case 'collaboration': return IconShare;
  case 'edit': return IconUser;
  case 'review': return IconCheck;
  default: return IconClock;
  }
};

export const getStatusColor = (status: ActivityStatus) => {
  switch (status) {
  case 'completed': return 'green';
  case 'in_progress': return 'blue';
  case 'failed': return 'red';
  default: return 'gray';
  }
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

export const calculateSessionStats = (activities: SessionActivity[]) => {
  return {
    totalActivities: activities.length,
    agentRuns: activities.filter(a => a.type === 'agent_run').length,
    completed: activities.filter(a => a.status === 'completed').length
  };
}; 