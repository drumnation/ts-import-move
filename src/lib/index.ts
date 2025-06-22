/**
 * FUNCTIONAL ARCHITECTURE: Main exports for ts-import-move
 * Pure functional approach with isolated concerns
 */

// Export the main functional orchestrator
export { moveFiles, type MoveFilesOptions, type MoveFilesResult } from '@/lib/move-files.service.js';

// Export isolated functional services
export { executeDryRun, generateDryRunPreview, formatDryRunOutput } from '@/lib/dry-run.service.js';
export { resolveImportPath, isInternalImport, calculateRelativePath, cleanImportPath } from '@/lib/import-path.service.js';
export { safeParseSourceFile, safeFallbackParse, defaultParseOptions } from '@/lib/safe-parser.service.js';
export { executeFileMove, planFileOperations, executeFileOperations } from '@/lib/file-operations.service.js';

// Legacy compatibility - TODO: Remove in v2.0.0
export { moveFiles as default } from '@/lib/move-files.service.js'; 