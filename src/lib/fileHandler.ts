// File handling utilities for the ts-import-move CLI tool

import fs from 'fs';
import path from 'path';
import { MoveOptions } from '@/types/index.js';

/**
 * Handles the file move operation, creating directories as needed
 * @param sourcePath Source file path
 * @param destinationPath Destination path (file or directory)
 * @param options Move options
 * @param sourceRoot Optional source root path
 * @returns The path where the file was actually moved to
 */
export async function handleFileMove(
  sourcePath: string,
  destinationPath: string,
  options: MoveOptions,
  sourceRoot?: string
): Promise<string> {
  // Check if source exists
  if (options.verbose) {
    console.log(`[LOG] Checking if source exists: ${sourcePath}`);
  }
  if (!fs.existsSync(sourcePath)) {
    console.error(`[ERROR] Source file does not exist: ${sourcePath}`);
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }

  const sourceStats = fs.statSync(sourcePath);
  const isDirectory = sourceStats.isDirectory();

  // Handle directories
  if (isDirectory) {
    // If recursive option is not set, throw an error
    if (!options.recursive) {
      console.error(`[ERROR] Cannot move directory without --recursive flag: ${sourcePath}`);
      throw new Error(`Cannot move directory without --recursive flag: ${sourcePath}`);
    }

    // Get destination directory path
    let targetDirPath = destinationPath;
    // If this is the root call, set the sourceRoot
    const root = sourceRoot || sourcePath;
    // Compute the relative path from the root
    const relPath = path.relative(root, sourcePath);
    // If destination is a directory, preserve structure
    if (fs.existsSync(destinationPath) && fs.statSync(destinationPath).isDirectory()) {
      targetDirPath = path.join(destinationPath, relPath.length > 0 ? relPath : path.basename(sourcePath));
    }
    // Create the destination directory if it doesn't exist
    if (options.verbose) {
      console.log(`[LOG] Ensuring destination directory exists: ${targetDirPath}`);
    }
    if (!fs.existsSync(targetDirPath)) {
      fs.mkdirSync(targetDirPath, { recursive: true });
      if (options.verbose) {
        console.log(`[LOG] Created directory: ${targetDirPath}`);
      }
    } else if (!options.force) {
      console.error(`[ERROR] Destination directory already exists: ${targetDirPath}`);
      throw new Error(`Destination directory already exists: ${targetDirPath}`);
    }
    
    if (options.verbose) {
      console.log(`Moving directory ${sourcePath} → ${targetDirPath}`);
    }
    
    // In dry run mode, just return without moving
    if (options.dryRun) {
      return targetDirPath;
    }
    
    // Read all files from the source directory (non-recursive)
    const files = fs.readdirSync(sourcePath);
    
    // Process each file or subdirectory
    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file);
      if (options.verbose) {
        console.log(`[LOG] Recursively moving: ${sourceFilePath} → ${targetDirPath}`);
      }
      // Recursive call to handleFileMove for each file/directory, passing correct subdirectory destination
      await handleFileMove(sourceFilePath, targetDirPath, options, root);
    }
    
    // Remove the source directory if empty (all files were moved)
    if (options.verbose) {
      console.log(`[LOG] Checking if directory is empty for removal: ${sourcePath}`);
    }
    if (fs.readdirSync(sourcePath).length === 0) {
      fs.rmdirSync(sourcePath);
      if (options.verbose) {
        console.log(`[LOG] Removed empty directory: ${sourcePath}`);
      }
    }
    
    return targetDirPath;
  }

  // Determine final destination path
  const destinationStats = fs.existsSync(destinationPath) 
    ? fs.statSync(destinationPath) 
    : null;
  
  // If destination is a directory, use the source filename
  let finalDestinationPath = destinationPath;
  if (destinationStats?.isDirectory()) {
    const sourceFilename = path.basename(sourcePath);
    finalDestinationPath = path.join(destinationPath, sourceFilename);
  }

  // Check if destination already exists
  if (options.verbose) {
    console.log(`[LOG] Checking if destination exists: ${finalDestinationPath}`);
  }
  if (fs.existsSync(finalDestinationPath)) {
    if (options.force) {
      if (options.verbose) {
        console.log(`[LOG] Deleting existing destination file: ${finalDestinationPath}`);
      }
      // If force mode is enabled, delete the destination file
      fs.unlinkSync(finalDestinationPath);
    } else if (options.interactive) {
      // In a real implementation, we would prompt user here
      // For now, we'll just throw an error
      console.error(`[ERROR] Destination already exists, use --force to overwrite: ${finalDestinationPath}`);
      throw new Error(`Destination already exists, use --force to overwrite: ${finalDestinationPath}`);
    } else {
      console.error(`[ERROR] Destination already exists: ${finalDestinationPath}`);
      throw new Error(`Destination already exists: ${finalDestinationPath}`);
    }
  }

  // Create destination directory if it doesn't exist
  if (options.verbose) {
    console.log(`[LOG] Ensuring parent directory exists for: ${finalDestinationPath}`);
  }
  const destinationDir = path.dirname(finalDestinationPath);
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
    if (options.verbose) {
      console.log(`[LOG] Created parent directory: ${destinationDir}`);
    }
  }

  // In dry run mode, just return the destination path without moving
  if (options.dryRun) {
    return finalDestinationPath;
  }

  // Actually move the file
  if (options.verbose) {
    console.log(`[LOG] Moving file: ${sourcePath} → ${finalDestinationPath}`);
  }
  fs.renameSync(sourcePath, finalDestinationPath);
  
  if (options.verbose) {
    console.log(`Moved ${sourcePath} → ${finalDestinationPath}`);
  }

  return finalDestinationPath;
}