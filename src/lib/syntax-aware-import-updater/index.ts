/**
 * Syntax-aware import updater module exports
 * Following functional isolated concerns principles
 */

// Main service function
export { updateImportsInMovedFiles } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.service.js';

// Global move tracker functions
export {
  recordMove,
  getMoveHistory,
  clearHistory,
  findNewLocation,
  getCurrentState
} from '@/lib/syntax-aware-import-updater/global-move-tracker.service.js';

// Import resolver utilities
export {
  pathsMatch,
  calculateRelativePath,
  resolveRelativeImport,
  getResolvedPath
} from '@/lib/syntax-aware-import-updater/import-resolver.service.js';

// Circular dependency detector
export { detectCircularDependencies } from '@/lib/syntax-aware-import-updater/circular-dependency-detector.service.js';

// Type definitions
export type {
  FileMoveMapping,
  CircularDependencyResult,
  SyntaxAwareImportUpdaterConfig,
  MoveTrackerState,
  ImportResolutionResult
} from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';

// Legacy compatibility factory function
import type { Project } from 'ts-morph';
import type { SyntaxAwareImportUpdaterConfig } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';
import { updateImportsInMovedFiles } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.service.js';

/**
 * Factory function to create a syntax-aware import updater
 * Following functional isolated concerns principles
 * 
 * @deprecated Use updateImportsInMovedFiles directly for better functional patterns
 */
export const createSyntaxAwareImportUpdater = (config: SyntaxAwareImportUpdaterConfig = {}) => {
  return {
    updateImportsInMovedFiles: (project: Project, movedFiles: Map<string, string>) => {
      updateImportsInMovedFiles(project, movedFiles, config);
    }
  };
};