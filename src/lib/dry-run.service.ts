/**
 * Dry-Run Service: Pure functional preview operations
 * NO SIDE EFFECTS - PREVIEW ONLY
 */

import path from 'path';
import chalk from 'chalk';

export interface DryRunPreview {
  readonly source: string;
  readonly destination: string;
  readonly operation: 'move' | 'rename';
  readonly affectedImports: readonly string[];
}

export interface DryRunResult {
  readonly previews: readonly DryRunPreview[];
  readonly totalFiles: number;
  readonly totalImports: number;
  readonly wouldCreateDirectories: readonly string[];
  readonly wouldRemoveDirectories: readonly string[];
}

/**
 * Pure function to generate dry-run preview
 * NEVER performs any file operations
 */
export const generateDryRunPreview = (
  sourceFiles: readonly string[],
  destination: string,
  affectedImports: ReadonlyMap<string, readonly string[]>
): DryRunResult => {
  const previews: DryRunPreview[] = [];
  const wouldCreateDirectories = new Set<string>();
  const wouldRemoveDirectories = new Set<string>();
  
  for (const source of sourceFiles) {
    const sourceName = path.basename(source);
    const destPath = path.join(destination, sourceName);
    
    // Track directory operations
    const destDir = path.dirname(destPath);
    wouldCreateDirectories.add(destDir);
    
    const sourceDir = path.dirname(source);
    wouldRemoveDirectories.add(sourceDir);
    
    previews.push({
      source,
      destination: destPath,
      operation: source === destPath ? 'rename' : 'move',
      affectedImports: affectedImports.get(source) ?? []
    });
  }
  
  const totalImports = Array.from(affectedImports.values())
    .reduce((sum, imports) => sum + imports.length, 0);
  
  return {
    previews,
    totalFiles: sourceFiles.length,
    totalImports,
    wouldCreateDirectories: Array.from(wouldCreateDirectories),
    wouldRemoveDirectories: Array.from(wouldRemoveDirectories)
  };
};

/**
 * Pure function to format dry-run output
 */
export const formatDryRunOutput = (result: DryRunResult): string => {
  const lines = [
    chalk.blue('DRY RUN MODE: No files will be moved.'),
    chalk.blue('The following operations would be performed:'),
    ''
  ];
  
  for (const preview of result.previews) {
    lines.push(`${preview.source} → ${preview.destination}`);
    if (preview.affectedImports.length > 0) {
      lines.push(`  └─ Would update ${preview.affectedImports.length} import(s)`);
    }
  }
  
  lines.push('');
  lines.push('📊 Summary:');
  lines.push(`  Files to move: ${result.totalFiles}`);
  lines.push(`  Imports to update: ${result.totalImports}`);
  lines.push(`  Directories to create: ${result.wouldCreateDirectories.length}`);
  lines.push(`  Directories to clean: ${result.wouldRemoveDirectories.length}`);
  
  return lines.join('\n');
};

/**
 * Pure function to execute dry-run (preview only)
 * CRITICAL: This function NEVER performs file operations
 */
export const executeDryRun = (
  sourceFiles: readonly string[],
  destination: string,
  affectedImports: ReadonlyMap<string, readonly string[]>
): void => {
  const result = generateDryRunPreview(sourceFiles, destination, affectedImports);
  const output = formatDryRunOutput(result);
  
  console.log(output);
  
  // CRITICAL: Return early - NO FILE OPERATIONS
  return;
}; 