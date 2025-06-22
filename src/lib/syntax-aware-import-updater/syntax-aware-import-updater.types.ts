/**
 * Type definitions for syntax-aware import updater
 */

/**
 * Represents a file move operation for tracking global movement state
 */
export interface FileMoveMapping {
  originalPath: string;
  newPath: string;
  timestamp: number;
}

/**
 * Circular dependency detection result
 */
export interface CircularDependencyResult {
  hasCircularDependency: boolean;
  cyclePath?: string[];
}

/**
 * Configuration for the syntax-aware import updater
 */
export interface SyntaxAwareImportUpdaterConfig {
  verbose?: boolean;
  debugImports?: boolean;
}

/**
 * Move tracker state interface
 */
export interface MoveTrackerState {
  moveHistory: FileMoveMapping[];
}

/**
 * Import resolution result
 */
export interface ImportResolutionResult {
  resolvedPath: string;
  exists: boolean;
}