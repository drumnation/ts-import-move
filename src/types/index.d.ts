// Placeholder for TypeScript type declarations for the ts-import-move CLI tool

export interface MoveOptions {
  /**
   * Move directories recursively
   */
  recursive?: boolean;
  
  /**
   * Preview changes without modifying files
   */
  dryRun?: boolean;
  
  /**
   * Force overwrite without prompt
   */
  force?: boolean;
  
  /**
   * Prompt for confirmation before overwriting
   */
  interactive?: boolean;
  
  /**
   * Never overwrite existing destination files
   */
  noClobber?: boolean;
  
  /**
   * Create backups of overwritten files
   * Values: none, simple, numbered
   */
  backup?: 'none' | 'simple' | 'numbered';
  
  /**
   * Comma-separated file extensions to consider
   * @default ".ts,.tsx"
   */
  extensions?: string;
  
  /**
   * Path to tsconfig.json
   */
  tsconfig?: string;
  
  /**
   * Show detailed operation logs
   */
  verbose?: boolean;
  
  /**
   * New debug flag for import analysis
   */
  debugImports?: boolean;
  
  /**
   * Path to tsconfig.json
   */
  tsConfigPath?: string;
  
  /**
   * Follow symlinks
   */
  followSymlinks?: boolean;
}

/**
 * Mapping of original file paths to their new locations after a move operation.
 * Used to update import statements project-wide.
 * Key: absolute or project-relative old file path
 * Value: absolute or project-relative new file path
 */
export type MovedFilesMap = Record<string, string>;