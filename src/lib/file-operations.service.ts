/**
 * File Operations Service: Pure functional file system operations
 * Handles actual file moves, directory creation, and cleanup
 */

import fs from 'fs';
import path from 'path';
import { Project } from 'ts-morph';
import { ImportPathContext, resolveImportPath, createMoveMapping } from './import-path.service.js';

export interface FileOperation {
  readonly type: 'move' | 'create-dir' | 'remove-dir';
  readonly source: string;
  readonly destination: string;
  readonly isDirectory: boolean;
}

export interface ImportUpdate {
  readonly sourceFile: string;
  readonly oldImportPath: string;
  readonly newImportPath: string;
}

export interface FileOperationResult {
  readonly movedFiles: readonly string[];
  readonly updatedImports: number;
  readonly createdDirectories: readonly string[];
  readonly removedDirectories: readonly string[];
  readonly errors: readonly string[];
}

/**
 * Pure function to plan file operations
 */
export const planFileOperations = (
  sourceFiles: readonly string[],
  destination: string,
  sourceDirRoot?: string
): readonly FileOperation[] => {
  const operations: FileOperation[] = [];
  
  for (const sourceFile of sourceFiles) {
    const fileName = path.basename(sourceFile);
    let destPath: string;
    
    if (sourceDirRoot && fs.statSync(sourceFile).isFile()) {
      // Preserve directory structure when moving from a directory
      const relativePath = path.relative(sourceDirRoot, sourceFile);
      destPath = path.join(destination, relativePath);
      
      // Create subdirectories as needed
      const destDir = path.dirname(destPath);
      operations.push({
        type: 'create-dir',
        source: '',
        destination: destDir,
        isDirectory: true
      });
    } else if (fs.statSync(sourceFile).isDirectory()) {
      // Moving a directory - preserve its name at destination
      const dirName = path.basename(sourceFile);
      destPath = path.join(destination, dirName);
      
      // This will be handled by the recursive file collection
      operations.push({
        type: 'create-dir',
        source: '',
        destination: destPath,
        isDirectory: true
      });
      continue; // Don't add as a move operation
    } else {
      // CRITICAL FIX: Detect if destination is a file rename or directory move
      const destExt = path.extname(destination);
      const isFileRename = destExt && ['.ts', '.tsx', '.js', '.jsx'].includes(destExt);
      
      if (isFileRename && sourceFiles.length === 1) {
        // Single file being renamed - use destination as-is
        destPath = destination;
      } else {
        // Multiple files or destination is a directory - append filename
        destPath = path.join(destination, fileName);
      }
      
      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      operations.push({
        type: 'create-dir',
        source: '',
        destination: destDir,
        isDirectory: true
      });
    }
    
    operations.push({
      type: 'move',
      source: sourceFile,
      destination: destPath,
      isDirectory: false
    });
  }
  
  return operations;
};

/**
 * Pure function to plan import updates
 */
export const planImportUpdates = (
  project: Project,
  movedFiles: readonly string[],
  fileOperations: readonly FileOperation[]
): readonly ImportUpdate[] => {
  const updates: ImportUpdate[] = [];
  const moveMapping = createMoveMapping(fileOperations);
  
  // Process all source files in project
  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();
    const newFilePath = moveMapping.get(filePath) || filePath;
    
    // Get import declarations
    const importDeclarations = sourceFile.getImportDeclarations();
    
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (!moduleSpecifier) continue;
      
      const context: ImportPathContext = {
        sourceFile: filePath,
        targetFile: newFilePath,
        originalImportPath: moduleSpecifier,
        movedFiles: [...movedFiles],
        moveMapping
      };
      
      const result = resolveImportPath(context);
      
      if (result.requiresUpdate) {
        updates.push({
          sourceFile: filePath,
          oldImportPath: moduleSpecifier,
          newImportPath: result.newImportPath
        });
      }
    }
  }
  
  return updates;
};

/**
 * Pure function to execute file operations using ts-morph as single source of truth
 * CRITICAL: No direct fs calls - let ts-morph manage both virtual and physical state
 */
export const executeFileOperations = (
  project: Project,
  operations: readonly FileOperation[],
  force: boolean = false
): FileOperationResult => {
  const movedFiles: string[] = [];
  const createdDirectories: string[] = [];
  const removedDirectories: string[] = [];
  const errors: string[] = [];
  
  try {
    // Execute operations in order using ts-morph APIs exclusively
    for (const operation of operations) {
      switch (operation.type) {
      case 'create-dir':
        // Only create directories that don't exist - ts-morph will handle this on save
        if (!fs.existsSync(operation.destination)) {
          createdDirectories.push(operation.destination);
        }
        break;
          
      case 'move': {
        // Check if destination exists
        if (fs.existsSync(operation.destination) && !force) {
          errors.push(`Destination already exists: ${operation.destination}`);
          continue;
        }
        
        // If force is enabled and destination exists, remove it from ts-morph project first
        if (force && fs.existsSync(operation.destination)) {
          const existingDestFile = project.getSourceFile(operation.destination);
          if (existingDestFile) {
            existingDestFile.delete();
          }
        }
        
        // Use ts-morph to move the file - this updates both virtual and physical state
        const sourceFile = project.getSourceFile(operation.source);
        if (!sourceFile) {
          errors.push(`Source file not found in project: ${operation.source}`);
          continue;
        }
        
        // Move using ts-morph - this handles imports automatically
        sourceFile.move(operation.destination);
        movedFiles.push(operation.destination);
        break;
      }
          
      case 'remove-dir':
        // Directory cleanup will be handled after ts-morph save
        removedDirectories.push(operation.source);
        break;
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error during file operations');
  }
  
  return {
    movedFiles,
    updatedImports: 0, // Will be updated by import service
    createdDirectories,
    removedDirectories,
    errors
  };
};

/**
 * Pure function to execute import updates
 */
export const executeImportUpdates = (
  project: Project,
  updates: readonly ImportUpdate[]
): number => {
  let updatedCount = 0;
  
  for (const update of updates) {
    const sourceFile = project.getSourceFile(update.sourceFile);
    if (!sourceFile) continue;
    
    const importDeclarations = sourceFile.getImportDeclarations();
    
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (moduleSpecifier === update.oldImportPath) {
        importDecl.setModuleSpecifier(update.newImportPath);
        updatedCount++;
      }
    }
  }
  
  return updatedCount;
};

/**
 * Pure function to clean up empty directories
 */
export const cleanupEmptyDirectories = (
  sourceDirectories: readonly string[]
): readonly string[] => {
  const removed: string[] = [];
  
  for (const dir of sourceDirectories) {
    try {
      if (fs.existsSync(dir)) {
        // Check if directory is empty or only contains empty subdirectories
        const isEmpty = isDirectoryEmpty(dir);
        if (isEmpty) {
          fs.rmSync(dir, { recursive: true, force: true });
          removed.push(dir);
        }
      }
    } catch {
      // Ignore cleanup errors
    }
  }
  
  return removed;
};

/**
 * Helper function to check if directory is empty or only contains empty subdirectories
 */
const isDirectoryEmpty = (dirPath: string): boolean => {
  try {
    const contents = fs.readdirSync(dirPath);
    if (contents.length === 0) {
      return true;
    }
    
    // Check if all contents are empty directories
    for (const item of contents) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isFile()) {
        return false; // Found a file, directory is not empty
      } else if (stat.isDirectory() && !isDirectoryEmpty(itemPath)) {
        return false; // Found a non-empty subdirectory
      }
    }
    
    return true; // All subdirectories are empty
  } catch {
    return false; // If we can't read it, assume it's not empty
  }
};

/**
 * Main functional file operations orchestrator
 * FOLLOWS TRANSACTIONAL PATTERN: All modifications in memory first, single save at end
 * ts-morph's move() handles import updates automatically
 */
export const executeFileMove = (
  project: Project,
  sourceFiles: readonly string[],
  destination: string,
  options: { force?: boolean; sourceDirRoot?: string } = {}
): FileOperationResult => {
  // Plan operations
  const fileOperations = planFileOperations(sourceFiles, destination, options.sourceDirRoot);
  
  // STEP 1: Execute all file moves using ts-morph (in-memory only)
  // ts-morph's move() automatically updates imports
  const fileResult = executeFileOperations(project, fileOperations, options.force);
  
  if (fileResult.errors.length > 0) {
    return fileResult;
  }
  
  // STEP 2: SINGLE SAVE POINT - commit all changes to disk
  project.saveSync();
  
  // STEP 3: Clean up empty directories (after save, when files are physically moved)
  let directoriesToCleanup: string[] = [];
  
  if (options.sourceDirRoot) {
    // When moving a directory, clean up the entire source directory tree
    // Find all unique source directory roots from the moved files
    const sourceRoots = sourceFiles
      .map(file => {
        // Get the directory that was actually moved (one level below sourceDirRoot)
        const relativePath = path.relative(options.sourceDirRoot!, file);
        const firstDir = relativePath.split(path.sep)[0];
        return path.join(options.sourceDirRoot!, firstDir);
      })
      .filter((dir, index, arr) => arr.indexOf(dir) === index); // unique
    
    directoriesToCleanup = sourceRoots;
  } else {
    // When moving individual files, clean up their parent directories
    directoriesToCleanup = sourceFiles
      .map(file => path.dirname(file))
      .filter((dir, index, arr) => arr.indexOf(dir) === index); // unique
  }
  
  const cleanedDirectories = cleanupEmptyDirectories(directoriesToCleanup);
  
  return {
    ...fileResult,
    updatedImports: 0, // ts-morph handles this automatically
    removedDirectories: [...fileResult.removedDirectories, ...cleanedDirectories]
  };
}; 