export interface SessionActivity {
  id: string;
  type: 'agent_run' | 'collaboration' | 'edit' | 'review';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  status: 'completed' | 'in_progress' | 'failed';
  duration?: number; // seconds
}

export interface SessionsProps {
  className?: string;
}

export type ActivityType = SessionActivity['type'];
export type ActivityStatus = SessionActivity['status']; 