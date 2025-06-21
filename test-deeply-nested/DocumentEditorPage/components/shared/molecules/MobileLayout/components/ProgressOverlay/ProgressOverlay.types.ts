export interface ProgressOverlayProps {
  /** Execution state containing loading status, progress, and message */
  executionState: ExecutionState;
}

export interface ExecutionState {
  /** Whether an operation is currently executing */
  isExecuting: boolean;
  /** Progress value between 0 and 100 */
  progress: number;
  /** Current status message to display */
  message: string;
} 