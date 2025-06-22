// Path updating utilities for the ts-import-move CLI tool

import { Project } from 'ts-morph';
import path from 'path';

/**
 * Updates imports in the TS project after a file is moved
 * @param project ts-morph Project instance
 * @param oldPath Original file path
 * @param newPath New file path after move
 */
export function updateImports(
  project: Project,
  oldPath: string,
  newPath: string
): void {
  // Normalize paths for consistent handling
  const absoluteOldPath = path.resolve(oldPath);
  const absoluteNewPath = path.resolve(newPath);
  
  // Get the source file from the old path
  const sourceFile = project.getSourceFile(absoluteOldPath);
  if (!sourceFile) {
    throw new Error(`Could not find source file in project: ${absoluteOldPath}`);
  }
  
  // Move the file via ts-morph
  // This will automatically update all imports that reference this file
  sourceFile.move(absoluteNewPath, { overwrite: true });
  
  // Make sure the project has the new source file
  project.addSourceFileAtPathIfExists(absoluteNewPath);
}

/**
 * Refreshes the project after moves to ensure all references are synchronized
 * @param project ts-morph Project instance
 */
export function refreshProjectReferences(project: Project): void {
  project.resolveSourceFileDependencies();
}