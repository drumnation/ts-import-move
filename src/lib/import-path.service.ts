/**
 * Import Path Service: Pure functional import path resolution
 * Handles internal vs external imports correctly
 */

import path from 'path';

export interface ImportPathContext {
  readonly sourceFile: string;
  readonly targetFile: string;
  readonly originalImportPath: string;
  readonly movedFiles: readonly string[];
  readonly moveMapping: ReadonlyMap<string, string>; // source -> destination mapping
}

export interface ImportPathResult {
  readonly newImportPath: string;
  readonly isInternal: boolean;
  readonly isRelative: boolean;
  readonly requiresUpdate: boolean;
}

/**
 * Pure function to resolve what file an import path points to
 */
export const resolveImportTarget = (
  importPath: string,
  sourceFile: string
): string | null => {
  if (!importPath.startsWith('.')) {
    // Not a relative import
    return null;
  }
  
  const sourceDir = path.dirname(sourceFile);
  let resolvedPath = path.resolve(sourceDir, importPath);
  
  // If the import path already has an extension, use it as-is
  if (/\.(ts|tsx|js|jsx)$/.test(importPath)) {
    return resolvedPath;
  }
  
  // Only add .ts extension if the resolved path doesn't already have one
  if (!/\.(ts|tsx|js|jsx)$/.test(resolvedPath)) {
    resolvedPath = resolvedPath + '.ts';
  }
  
  return resolvedPath;
};

/**
 * Pure function to determine if an import is internal to moved files
 */
export const isInternalImport = (
  importPath: string,
  sourceFile: string,
  moveMapping: ReadonlyMap<string, string>
): boolean => {
  const importTarget = resolveImportTarget(importPath, sourceFile);
  if (!importTarget) return false;
  
  // Check if the import target is in the move mapping (being moved)
  return moveMapping.has(importTarget);
};

/**
 * Pure function to calculate relative path between two files
 */
export const calculateRelativePath = (
  fromFile: string,
  toFile: string
): string => {
  const fromDir = path.dirname(fromFile);
  
  // Remove extension from target file for import calculation
  const toFileWithoutExt = toFile.replace(/\.(ts|tsx|js|jsx)$/, '');
  
  let relativePath = path.relative(fromDir, toFileWithoutExt);
  
  // Normalize path separators for cross-platform compatibility
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Ensure it starts with './' for same directory or '../' for parent
  if (!relativePath.startsWith('.')) {
    return `./${relativePath}`;
  }
  
  return relativePath;
};

/**
 * Pure function to resolve import path after file move
 * CRITICAL: Updates all imports correctly based on new file locations
 */
export const resolveImportPath = (
  context: ImportPathContext
): ImportPathResult => {
  const { sourceFile, targetFile, originalImportPath, moveMapping } = context;
  
  // Skip non-relative imports (node_modules, absolute paths)
  if (!originalImportPath.startsWith('.')) {
    return {
      newImportPath: originalImportPath,
      isInternal: false,
      isRelative: false,
      requiresUpdate: false
    };
  }
  
  // Determine what file this import points to
  const importTarget = resolveImportTarget(originalImportPath, sourceFile);
  if (!importTarget) {
    return {
      newImportPath: originalImportPath,
      isInternal: false,
      isRelative: true,
      requiresUpdate: false
    };
  }
  
  // Check if the import target is also being moved
  const isInternal = moveMapping.has(importTarget);
  let finalImportTarget = importTarget;
  
  if (isInternal) {
    // The import target is also being moved, use its new location
    finalImportTarget = moveMapping.get(importTarget)!;
  }
  
  // Calculate new relative path from the new source file location to the target
  const newImportPath = calculateRelativePath(targetFile, finalImportTarget);
  
  return {
    newImportPath,
    isInternal,
    isRelative: true,
    requiresUpdate: newImportPath !== originalImportPath
  };
};

/**
 * Pure function to batch resolve import paths for multiple files
 */
export const resolveImportPaths = (
  contexts: readonly ImportPathContext[]
): ReadonlyMap<string, ImportPathResult> => {
  const results = new Map<string, ImportPathResult>();
  
  for (const context of contexts) {
    const key = `${context.sourceFile}:${context.originalImportPath}`;
    const result = resolveImportPath(context);
    results.set(key, result);
  }
  
  return results;
};

/**
 * Pure function to create move mapping from file operations
 */
export const createMoveMapping = (
  fileOperations: readonly { type: string; source: string; destination: string }[]
): Map<string, string> => {
  const mapping = new Map<string, string>();
  
  for (const operation of fileOperations) {
    if (operation.type === 'move') {
      mapping.set(operation.source, operation.destination);
    }
  }
  
  return mapping;
};

/**
 * Pure function to normalize path separators for cross-platform compatibility
 */
export const normalizePath = (filePath: string): string => {
  return filePath.replace(/\\/g, '/');
};

/**
 * Pure function to ensure import path doesn't contain temporary suffixes
 */
export const cleanImportPath = (importPath: string): string => {
  return importPath.replace(/-temp$/, '').replace(/-temp\//, '/');
}; 