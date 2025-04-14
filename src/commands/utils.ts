// Utility functions for commands in the ts-import-move CLI tool

import path from 'path';
import fs from 'fs';

/**
 * Finds the closest tsconfig.json file, starting from the provided directory and going up
 * @param dir Starting directory to search from
 * @returns Path to the closest tsconfig.json or undefined if not found
 */
export function findTsConfig(dir = process.cwd()): string | undefined {
  const tsconfigPath = path.join(dir, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    return tsconfigPath;
  }
  
  // Also check for tsconfig.build.json, which is common in monorepos
  const tsconfigBuildPath = path.join(dir, 'tsconfig.build.json');
  if (fs.existsSync(tsconfigBuildPath)) {
    return tsconfigBuildPath;
  }
  
  const parentDir = path.dirname(dir);
  
  // If we've reached the root directory, stop searching
  if (parentDir === dir) {
    return undefined;
  }
  
  // Recursively search in the parent directory
  return findTsConfig(parentDir);
}

/**
 * Finds all tsconfig.json files in a directory and its subdirectories
 * Useful for monorepos with multiple TypeScript projects
 * @param dir Directory to search in
 * @returns Array of paths to tsconfig.json files
 */
export function findAllTsConfigs(dir = process.cwd()): string[] {
  const results: string[] = [];
  
  // Check if there's a tsconfig in the current directory
  const tsconfigPath = path.join(dir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    results.push(tsconfigPath);
  }
  
  // Check for tsconfig.build.json
  const tsconfigBuildPath = path.join(dir, 'tsconfig.build.json');
  if (fs.existsSync(tsconfigBuildPath)) {
    results.push(tsconfigBuildPath);
  }
  
  // Look for subdirectories
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        const subdirPath = path.join(dir, entry.name);
        const subdirResults = findAllTsConfigs(subdirPath);
        results.push(...subdirResults);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
  
  return results;
}

/**
 * Finds the most appropriate tsconfig.json based on the files being moved
 * @param filePaths Array of file paths to be moved
 * @returns Path to the most appropriate tsconfig.json
 */
export function findTsConfigForFiles(filePaths: string[]): string | undefined {
  if (!filePaths.length) {
    return findTsConfig();
  }
  
  // Get the directory of the first file
  const firstFileDir = path.dirname(filePaths[0]);
  
  // Start by finding the closest tsconfig to the first file
  const closestTsConfig = findTsConfig(firstFileDir);
  
  // If all files are in the same directory or subdirectories, use the closest tsconfig
  const allFilesInSameTree = filePaths.every(filePath => {
    const fileDir = path.dirname(filePath);
    return fileDir === firstFileDir || fileDir.startsWith(firstFileDir + path.sep);
  });
  
  if (allFilesInSameTree) {
    return closestTsConfig;
  }
  
  // If files are spread across different directories, find the common parent directory
  const commonParentDir = findCommonParentDir(filePaths.map(filePath => path.dirname(filePath)));
  
  // Find tsconfig in the common parent directory
  return findTsConfig(commonParentDir);
}

/**
 * Finds the common parent directory for a list of directories
 * @param dirs Array of directory paths
 * @returns Path to the common parent directory
 */
function findCommonParentDir(dirs: string[]): string {
  if (!dirs.length) {
    return process.cwd();
  }
  
  if (dirs.length === 1) {
    return dirs[0];
  }
  
  // Split paths into segments
  const pathSegments = dirs.map(dir => dir.split(path.sep));
  
  // Find the common prefix of all paths
  const commonPrefix: string[] = [];
  const firstPath = pathSegments[0];
  
  for (let i = 0; i < firstPath.length; i++) {
    const segment = firstPath[i];
    
    if (pathSegments.every(pathSegs => pathSegs[i] === segment)) {
      commonPrefix.push(segment);
    } else {
      break;
    }
  }
  
  // Join the common segments back into a path
  return commonPrefix.join(path.sep) || path.sep;
}