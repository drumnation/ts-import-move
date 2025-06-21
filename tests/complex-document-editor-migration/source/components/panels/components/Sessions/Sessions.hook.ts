import { useState, useCallback, useMemo } from 'react';
import type { SessionActivity } from './Sessions.types';
import { mockActivities, calculateSessionStats } from './Sessions.logic';

export const useSessions = () => {
  const [activities, setActivities] = useState<SessionActivity[]>(mockActivities);
  const [currentSession, setCurrentSession] = useState('Session-2024-001');

  const handleDeleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  const handleNewSession = useCallback(() => {
    console.log('New session');
    // TODO: Implement new session logic
  }, []);

  const handleShareActivity = useCallback((activityId: string) => {
    console.log('Share activity:', activityId);
    // TODO: Implement share activity logic
  }, []);

  const sessionStats = useMemo(() => 
    calculateSessionStats(activities), 
    [activities]
  );

  const currentSessionInfo = useMemo(() => ({
    name: currentSession,
    startDate: new Date().toLocaleDateString(),
    startTime: new Date().toLocaleTimeString()
  }), [currentSession]);

  return {
    activities,
    currentSession,
    currentSessionInfo,
    sessionStats,
    handlers: {
      handleDeleteActivity,
      handleNewSession,
      handleShareActivity
    }
  };
}; 