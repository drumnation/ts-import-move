import type { FileMoveMapping, MoveTrackerState } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';

/**
 * Global movement tracker to handle batch operations and cross-operation dependencies
 * Implements ARC-7 Protocol Section 3.2: Batch Operation State Management
 * 
 * Pure functional implementation with state management through closures
 */

// Global state container
let globalMoveState: MoveTrackerState = {
  moveHistory: []
};

/**
 * Records a file move operation in the global state
 */
export const recordMove = (originalPath: string, newPath: string): void => {
  const moveMapping: FileMoveMapping = {
    originalPath,
    newPath,
    timestamp: Date.now()
  };
  
  globalMoveState = {
    ...globalMoveState,
    moveHistory: [...globalMoveState.moveHistory, moveMapping]
  };
};

/**
 * Gets the complete move history
 */
export const getMoveHistory = (): FileMoveMapping[] => {
  return [...globalMoveState.moveHistory];
};

/**
 * Clears the move history
 */
export const clearHistory = (): void => {
  globalMoveState = {
    moveHistory: []
  };
};

/**
 * Finds the new location of a file that was moved
 */
export const findNewLocation = (originalPath: string): string | null => {
  const moveRecord = globalMoveState.moveHistory.find(
    record => record.originalPath === originalPath
  );
  return moveRecord ? moveRecord.newPath : null;
};

/**
 * Gets the current state (for testing purposes)
 */
export const getCurrentState = (): MoveTrackerState => {
  return { ...globalMoveState };
};