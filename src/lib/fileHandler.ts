// File handling utilities for the ts-import-move CLI tool

import fs from 'fs';
import path from 'path';
import { MoveOptions } from '../types/index.js';

/**
 * Handles the file move operation, creating directories as needed
 * @param sourcePath Source file path
 * @param destinationPath Destination path (file or directory)
 * @param options Move options
 * @returns The path where the file was actually moved to
 */
export async function handleFileMove(
  sourcePath: string,
  destinationPath: string,
  options: MoveOptions
): Promise<string> {
  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }

  const sourceStats = fs.statSync(sourcePath);
  const isDirectory = sourceStats.isDirectory();

  // Handle directories
  if (isDirectory) {
    // If recursive option is not set, throw an error
    if (!options.recursive) {
      throw new Error(`Cannot move directory without --recursive flag: ${sourcePath}`);
    }

    // Get destination directory path
    const sourceBasename = path.basename(sourcePath);
    let targetDirPath = destinationPath;
    
    // If destination is a directory, create a subdirectory with the source name
    if (fs.existsSync(destinationPath) && fs.statSync(destinationPath).isDirectory()) {
      targetDirPath = path.join(destinationPath, sourceBasename);
    }
    
    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(targetDirPath)) {
      fs.mkdirSync(targetDirPath, { recursive: true });
    } else if (!options.force) {
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
      const targetFilePath = path.join(targetDirPath, file);
      
      // Recursive call to handleFileMove for each file/directory
      await handleFileMove(sourceFilePath, targetDirPath, options);
    }
    
    // Remove the source directory if empty (all files were moved)
    if (fs.readdirSync(sourcePath).length === 0) {
      fs.rmdirSync(sourcePath);
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
  if (fs.existsSync(finalDestinationPath)) {
    if (options.force) {
      // If force mode is enabled, delete the destination file
      fs.unlinkSync(finalDestinationPath);
    } else if (options.interactive) {
      // In a real implementation, we would prompt user here
      // For now, we'll just throw an error
      throw new Error(`Destination already exists, use --force to overwrite: ${finalDestinationPath}`);
    } else {
      throw new Error(`Destination already exists: ${finalDestinationPath}`);
    }
  }

  // Create destination directory if it doesn't exist
  const destinationDir = path.dirname(finalDestinationPath);
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  // In dry run mode, just return the destination path without moving
  if (options.dryRun) {
    return finalDestinationPath;
  }

  // Actually move the file
  fs.renameSync(sourcePath, finalDestinationPath);
  
  if (options.verbose) {
    console.log(`Moved ${sourcePath} → ${finalDestinationPath}`);
  }

  return finalDestinationPath;
}