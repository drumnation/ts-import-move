// Aggregated exports for the lib directory of the ts-import-move CLI tool

import { Project } from 'ts-morph';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { handleFileMove } from './fileHandler.js';
import { refreshProjectReferences } from './pathUpdater.js';
import { findTsConfigForFiles } from '../commands/utils.js';

// Define the proper options interface
interface MoveFilesOptions {
  extensions?: string;
  force?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  tsConfigPath?: string;
  recursive?: boolean;
  tsconfig?: string; // For backward compatibility
}

// Robust path resolver: absolute, as-given, or resolved
function resolveInputPath(input: string, cwd: string) {
  // If already absolute, return as-is
  if (path.isAbsolute(input)) return input;
  
  // For relative paths, always resolve to absolute
  return path.resolve(cwd, input);
}

/**
 * Moves files and updates imports
 * @param sources Array of source files or glob patterns
 * @param destination Destination path
 * @param options Move options
 */
export async function moveFiles(
  sources: string[],
  destination: string,
  options: MoveFilesOptions
): Promise<void> {
  // Capture the initial working directory
  const initialCwd = process.cwd();
  
  if (options.verbose) {
    console.log(`Initial CWD: ${initialCwd}`);
    console.log(`moveFiles called with sources: ${sources.join(', ')}, destination: ${destination}`);
  }

  // Parse extension options
  const extensions = options.extensions 
    ? options.extensions.split(',').map(ext => ext.startsWith('.') ? ext : `.${ext}`)
    : ['.ts', '.tsx'];
  
  // Resolve paths upfront
  const absoluteSources = sources.map(src => resolveInputPath(src, initialCwd));
  const absoluteDestination = resolveInputPath(destination, initialCwd);
  
  if (options.verbose) {
    console.log(`Absolute sources: ${absoluteSources.join(', ')}`);
    console.log(`Absolute destination: ${absoluteDestination}`);
  }
  
  // Special handling for directory sources - find all matching files including subdirectories
  const filesToProcess: Array<{filePath: string, isDirectory: boolean, sourceDirRoot?: string, relPathFromSourceRoot?: string}> = [];
  
  // Find all files to move
  for (const src of sources) { // Use original pattern, not resolved path
    const absSrc = resolveInputPath(src, initialCwd);
    if (fs.existsSync(absSrc) && fs.statSync(absSrc).isDirectory()) {
      // Directory source: recursively collect all files matching extensions
      if (options.verbose) {
        console.log(`Recursively collecting files from directory: ${absSrc}`);
      }
      const matches = fg.sync(['**/*'], {
        cwd: absSrc,
        dot: true,
        onlyFiles: true,
        absolute: false
      });
      for (const match of matches) {
        const absMatch = path.join(absSrc, match);
        if (extensions.some(ext => absMatch.endsWith(ext))) {
          if (options.verbose) {
            console.log(`Adding file from directory: ${absMatch} (rel: ${match})`);
          }
          filesToProcess.push({
            filePath: absMatch,
            isDirectory: false,
            sourceDirRoot: absSrc,
            relPathFromSourceRoot: match
          });
        }
      }
      // Also add the directory itself for directory creation at destination
      filesToProcess.push({
        filePath: absSrc,
        isDirectory: true,
        sourceDirRoot: absSrc
      });
    } else if (fs.existsSync(absSrc) && fs.statSync(absSrc).isFile()) {
      // It's a file - check if it matches the extensions
      if (extensions.some(ext => absSrc.endsWith(ext))) {
        if (options.verbose) {
          console.log(`Adding file: ${absSrc}`);
        }
        filesToProcess.push({
          filePath: absSrc,
          isDirectory: false
        });
      } else {
        if (options.verbose) {
          console.log(`Skipping file with non-matching extension: ${absSrc}`);
        }
      }
    } else {
      // Always try glob matching for non-existing files, directories, or patterns
      if (options.verbose) {
        console.log(`Attempting glob match for: ${src} (cwd: ${initialCwd})`);
      }
      const matches = fg.sync([src], {
        dot: true,
        absolute: false,
        onlyFiles: true,
        cwd: initialCwd
      });
      for (const match of matches) {
        const absMatch = path.resolve(initialCwd, match);
        if (extensions.some(ext => absMatch.endsWith(ext))) {
          if (options.verbose) {
            console.log(`Adding file from pattern: ${absMatch}`);
          }
          filesToProcess.push({
            filePath: absMatch,
            isDirectory: false
          });
        }
      }
      if (options.verbose && matches.length === 0) {
        console.log(`No files matched pattern: ${src}`);
      }
    }
  }
  
  // Filter for unique entries by absolute path
  const uniqueFiles = Array.from(
    new Map(filesToProcess.map(item => [item.filePath, item])).values()
  );
  
  // Extract file paths for TypeScript project
  const files = uniqueFiles
    .filter(item => !item.isDirectory)
    .map(item => item.filePath);
  
  if (options.verbose) {
    console.log(`Found ${files.length} unique files to move:`);
    files.forEach(f => console.log(`  - ${f}`));
  }
  
  // Exit if no files found (SAFETY CHECK)
  if (files.length === 0) {
    const msg = 'No files matched the provided patterns. Aborting move operation.';
    console.error(chalk.red(msg));
    throw new Error(msg);
  }
  
  // Initialize the TypeScript project
  const tsConfigPath = options.tsConfigPath ?? options.tsconfig ?? findTsConfigForFiles(files);
  if (!tsConfigPath) {
    console.warn(chalk.yellow('No tsconfig.json found. Type checking might be limited.'));
  }
  
  if (options.verbose) {
    console.log(`Using TypeScript configuration: ${tsConfigPath || 'None'}`);
  }
  
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipFileDependencyResolution: false,
  });
  
  project.addSourceFilesAtPaths(files);
  
  // Dry run mode
  if (options.dryRun) {
    console.log(chalk.blue('DRY RUN MODE: No files will be moved.'));
    console.log('The following operations would be performed:');
    
    for (const entry of uniqueFiles) {
      if (entry.isDirectory) continue; // Skip directories in dry run output
      
      let destPath = absoluteDestination;
      
      if (entry.sourceDirRoot) {
        // Calculate relative path from source root
        const relPath = path.relative(entry.sourceDirRoot, entry.filePath);
        if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
          // Preserve directory structure when moving into a directory
          const sourceBasename = path.basename(entry.sourceDirRoot);
          const destBasename = path.basename(absoluteDestination);
          
          // Check if destination already ends with the source directory name
          if (destBasename === sourceBasename) {
            destPath = path.join(absoluteDestination, relPath);
          } else {
            destPath = path.join(absoluteDestination, sourceBasename, relPath);
          }
        }
      } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        // For individual files, just use basename
        destPath = path.join(absoluteDestination, path.basename(entry.filePath));
      }
      
      console.log(`${chalk.green(entry.filePath)} → ${chalk.yellow(destPath)}`);
    }
    
    return;
  }
  
  // Ensure destination directory exists
  if (!fs.existsSync(absoluteDestination) && !path.extname(absoluteDestination)) {
    fs.mkdirSync(absoluteDestination, { recursive: true });
  }
  
  // First, create all necessary directories at destination
  for (const entry of uniqueFiles) {
    if (entry.isDirectory) {
      const relPath = entry.sourceDirRoot 
        ? path.relative(entry.sourceDirRoot, entry.filePath) 
        : path.basename(entry.filePath);
      
      let destDir: string;
      if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        if (entry.sourceDirRoot) {
          // When moving a directory into another directory, preserve the root directory name
          const sourceBasename = path.basename(entry.sourceDirRoot);
          const destBasename = path.basename(absoluteDestination);
          
          // Check if destination already ends with the source directory name
          if (destBasename === sourceBasename) {
            destDir = path.join(absoluteDestination, relPath);
          } else {
            destDir = path.join(absoluteDestination, sourceBasename, relPath);
          }
        } else {
          // Simple directory to directory move
          destDir = path.join(absoluteDestination, relPath);
        }
      } else {
        // destination is a file path or doesn't exist
        destDir = absoluteDestination;
      }
      
      if (!fs.existsSync(destDir)) {
        if (options.verbose) {
          console.log(`Creating directory: ${destDir}`);
        }
        fs.mkdirSync(destDir, { recursive: true });
      }
    }
  }
  
  // Now move the files
  const movedFiles = new Map<string, string>();
  
  for (const entry of uniqueFiles) {
    if (entry.isDirectory) continue; // Skip directories
    const filePath = entry.filePath;
    try {
      // Calculate destination path
      let destPath = absoluteDestination;
      let sourceRootArg = undefined;
      if (entry.sourceDirRoot && entry.relPathFromSourceRoot) {
        // Directory move: preserve structure by including the source directory name at the destination
        const sourceBasename = path.basename(entry.sourceDirRoot);
        const destBasename = path.basename(absoluteDestination);
        
        // Check if destination already ends with the source directory name
        if (destBasename === sourceBasename) {
          // Don't duplicate the directory name
          destPath = path.join(absoluteDestination, entry.relPathFromSourceRoot);
        } else {
          // Preserve directory structure by including the source directory name
          destPath = path.join(absoluteDestination, sourceBasename, entry.relPathFromSourceRoot);
        }
        
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        sourceRootArg = entry.sourceDirRoot;
        if (options.verbose) {
          console.log(`[DIR MOVE] ${filePath} -> ${destPath}`);
        }
      } else if (entry.sourceDirRoot) {
        // When moving a file from a directory, preserve its path relative to the source root
        const relPath = path.relative(entry.sourceDirRoot, filePath);
        if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
          const sourceBasename = path.basename(entry.sourceDirRoot);
          const destBasename = path.basename(absoluteDestination);
          
          // Check if destination already ends with the source directory name
          if (destBasename === sourceBasename) {
            destPath = path.join(absoluteDestination, relPath);
          } else {
            destPath = path.join(absoluteDestination, sourceBasename, relPath);
          }
          
          // Ensure parent directory exists
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }
        sourceRootArg = entry.sourceDirRoot;
      } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        // Simple file to directory move
        destPath = path.join(absoluteDestination, path.basename(filePath));
      }
      if (options.verbose) {
        console.log(`[MOVE] ${filePath} -> ${destPath}`);
      }
      // Check for overwrites
      if (fs.existsSync(destPath) && !options.force) {
        console.error(chalk.red(`Error: Destination file ${destPath} already exists. Use --force to overwrite.`));
        process.exit(1);
      }
      // Move the file
      const newFilePath = sourceRootArg
        ? await handleFileMove(filePath, destPath, options, sourceRootArg)
        : await handleFileMove(filePath, destPath, options);
      movedFiles.set(filePath, newFilePath);
    } catch (err) {
      console.error(chalk.red(`[ERROR MOVING] ${filePath}:`), err);
    }
  }
  
  // Refresh project references and update imports
  refreshProjectReferences(project);
  
  // Update import paths in all source files
  for (const sourceFile of project.getSourceFiles()) {
    let changed = false;
    const importDeclarations = sourceFile.getImportDeclarations();
    if (options.verbose) {
      console.log(`Examining file ${sourceFile.getFilePath()} with ${importDeclarations.length} imports`);
    }
    for (const importDecl of importDeclarations) {
      const importedSourceFile = importDecl.getModuleSpecifierSourceFile();
      if (!importedSourceFile) continue;
      const importedFilePath = importedSourceFile.getFilePath();
      for (const [oldFilePath, newFilePath] of movedFiles.entries()) {
        if (path.resolve(importedFilePath) === path.resolve(oldFilePath)) {
          // Compute new relative path from this file to the new file location
          const fromDir = path.dirname(sourceFile.getFilePath());
          let relPath = path.relative(fromDir, newFilePath);
          if (!relPath.startsWith('.')) relPath = './' + relPath;
          relPath = relPath.replace(/\\/g, '/').replace(/\.tsx?$/, '');
          if (options.verbose) {
            console.log(`  Updating import in ${sourceFile.getFilePath()}: '${importDecl.getModuleSpecifierValue()}' -> '${relPath}'`);
          }
          importDecl.setModuleSpecifier(relPath);
          changed = true;
        }
      }
    }
    if (changed) {
      sourceFile.saveSync();
    }
  }

  // Clean up empty source directories after moving all files
  const sourceDirectoriesToCleanup = new Set<string>();
  for (const entry of uniqueFiles) {
    if (entry.sourceDirRoot) {
      sourceDirectoriesToCleanup.add(entry.sourceDirRoot);
    }
  }

  // Remove empty source directories (from deepest to shallowest)
  const sortedDirectories = Array.from(sourceDirectoriesToCleanup)
    .sort((a, b) => b.length - a.length); // Sort by path length (deepest first)

  for (const sourceDir of sortedDirectories) {
    try {
      if (fs.existsSync(sourceDir)) {
        const remainingContents = fs.readdirSync(sourceDir);
        if (remainingContents.length === 0) {
          if (options.verbose) {
            console.log(`Removing empty source directory: ${sourceDir}`);
          }
          fs.rmdirSync(sourceDir);
        } else if (options.verbose) {
          console.log(`Source directory not empty, keeping: ${sourceDir} (contains: ${remainingContents.join(', ')})`);
        }
      }
    } catch (err) {
      if (options.verbose) {
        console.log(`Could not remove source directory ${sourceDir}: ${err}`);
      }
    }
  }
}