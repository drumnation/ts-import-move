import path from 'path';
import fs from 'fs';
import type { ImportResolutionResult } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';

/**
 * Import path resolution utilities
 * Pure functions for resolving import paths and calculating relative paths
 */

/**
 * Check if two paths refer to the same file
 */
export const pathsMatch = (path1: string, path2: string): boolean => {
  const normalized1 = path.resolve(path1);
  const normalized2 = path.resolve(path2);
  return normalized1 === normalized2;
};

/**
 * Calculate relative path from one directory to a file
 */
export const calculateRelativePath = (fromDir: string, toFile: string): string => {
  let relativePath = path.relative(fromDir, toFile);
  
  // Remove file extension for TypeScript imports
  const ext = path.extname(relativePath);
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    relativePath = relativePath.slice(0, -ext.length);
  }
  
  // Ensure relative path starts with ./
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
};

/**
 * Resolve a relative import to an absolute path
 */
export const resolveRelativeImport = (importPath: string, fromDir: string): ImportResolutionResult => {
  // Handle TypeScript file extensions
  const resolvedPath = path.resolve(fromDir, importPath);
  
  // Try common TypeScript extensions if the path doesn't have one
  if (!path.extname(resolvedPath)) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of extensions) {
      const withExt = resolvedPath + ext;
      if (fs.existsSync(withExt)) {
        return {
          resolvedPath: withExt,
          exists: true
        };
      }
    }
    
    // Check for index files
    const indexFile = path.join(resolvedPath, 'index.ts');
    if (fs.existsSync(indexFile)) {
      return {
        resolvedPath: indexFile,
        exists: true
      };
    }
  }
  
  return {
    resolvedPath,
    exists: fs.existsSync(resolvedPath)
  };
};

/**
 * Get the resolved path from import resolution result
 */
export const getResolvedPath = (result: ImportResolutionResult): string => {
  return result.resolvedPath;
};