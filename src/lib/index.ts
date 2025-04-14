// Aggregated exports for the lib directory of the ts-import-move CLI tool

import { Project } from 'ts-morph';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { handleFileMove } from './fileHandler.js';
import { updateImports, refreshProjectReferences } from './pathUpdater.js';
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
  const absoluteSources = sources.map(src => path.resolve(initialCwd, src));
  const absoluteDestination = path.resolve(initialCwd, destination);
  
  if (options.verbose) {
    console.log(`Absolute sources: ${absoluteSources.join(', ')}`);
    console.log(`Absolute destination: ${absoluteDestination}`);
  }
  
  // Special handling for directory sources - find all matching files including subdirectories
  const filesToProcess: Array<{filePath: string, isDirectory: boolean, sourceDirRoot?: string}> = [];
  
  // Find all files to move
  for (const src of sources) { // Use original pattern, not resolved path
    const absSrc = path.resolve(initialCwd, src);
    if (fs.existsSync(absSrc) && fs.statSync(absSrc).isDirectory()) {
      // If it's a directory, find all files recursively
      if (options.verbose) {
        console.log(`Processing directory source: ${absSrc}`);
      }

      // Use glob pattern to find all files inside the directory, relative to cwd
      const matches = fg.sync([`${src.replace(/\\/g, '/')}/**/*`], {
        dot: true,
        absolute: false, // Get relative paths, resolve later
        onlyFiles: false,
        cwd: initialCwd // Ensure matching is relative to where command is run
      });

      if (options.verbose) {
        console.log(`Found ${matches.length} matches in directory ${src}`);
      }

      // Process the matches
      for (const match of matches) {
        const absMatch = path.resolve(initialCwd, match);
        try {
          const stats = fs.statSync(absMatch);
          if (stats.isFile()) {
            // Check if the file matches the extensions
            if (extensions.some(ext => absMatch.endsWith(ext))) {
              if (options.verbose) {
                console.log(`Adding file: ${absMatch}`);
              }
              filesToProcess.push({
                filePath: absMatch,
                isDirectory: false,
                sourceDirRoot: absSrc
              });
            }
          } else if (stats.isDirectory()) {
            filesToProcess.push({
              filePath: absMatch,
              isDirectory: true,
              sourceDirRoot: absSrc
            });
          }
        } catch (err) {
          if (options.verbose) {
            console.log(`Error processing ${absMatch}: ${err}`);
          }
        }
      }
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
      // Try glob matching for non-existing files (e.g., patterns)
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
    console.log(`Found ${files.length} unique files to move`);
  }
  
  // Exit if no files found
  if (files.length === 0) {
    console.warn(chalk.yellow('No files matched the provided patterns.'));
    return;
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
          destPath = path.join(absoluteDestination, path.basename(entry.sourceDirRoot), relPath);
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
          destDir = path.join(absoluteDestination, path.basename(entry.sourceDirRoot), relPath);
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
      
      if (entry.sourceDirRoot) {
        // When moving a file from a directory, preserve its path relative to the source root
        const relPath = path.relative(entry.sourceDirRoot, filePath);
        if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
          destPath = path.join(absoluteDestination, path.basename(entry.sourceDirRoot), relPath);
          // Ensure parent directory exists
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }
        sourceRootArg = entry.sourceDirRoot;
      } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        // Simple file to directory move
        destPath = path.join(absoluteDestination, path.basename(filePath));
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
      
      // Update imports in the moved file
      updateImports(project, filePath, newFilePath);
      
    } catch (err) {
      console.error(chalk.red(`Error moving ${filePath}:`), err);
    }
  }
  
  // Refresh project references and update imports
  refreshProjectReferences(project);
  
  // Update import paths in all source files
  for (const sourceFile of project.getSourceFiles()) {
    const importDeclarations = sourceFile.getImportDeclarations();
    
    if (options.verbose) {
      console.log(`Examining file ${sourceFile.getFilePath()} with ${importDeclarations.length} imports`);
    }
    
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      if (options.verbose) {
        console.log(`  Import: ${moduleSpecifier}`);
      }
      
      for (const [oldFilePath, newFilePath] of movedFiles.entries()) {
        const oldBasename = path.basename(oldFilePath, path.extname(oldFilePath));
        const newDirname = path.dirname(newFilePath);
        const newBasename = path.basename(newFilePath, path.extname(newFilePath));
        
        if (options.verbose) {
          console.log(`    Checking against moved file: ${oldFilePath} -> ${newFilePath}`);
          console.log(`    Old basename: ${oldBasename}, New path: ${newDirname}/${newBasename}`);
        }
        
        const sourceFilePath = sourceFile.getFilePath();
        const sourceFileDir = path.dirname(sourceFilePath);
        
        const absOldPath = path.resolve(oldFilePath);
        const resolvedImportPath = path.resolve(sourceFileDir, moduleSpecifier + (moduleSpecifier.endsWith('.ts') ? '' : '.ts'));
        
        if (options.verbose) {
          console.log(`    Resolving import: ${moduleSpecifier}`);
          console.log(`    Source file dir: ${sourceFileDir}`);
          console.log(`    Absolute old path: ${absOldPath}`);
          console.log(`    Resolved import path: ${resolvedImportPath}`);
        }
        
        if (resolvedImportPath === absOldPath || 
            resolvedImportPath.replace(/\.ts$/, '') === absOldPath.replace(/\.ts$/, '')) {
          const relativeToNew = path.relative(sourceFileDir, newDirname);
          const newImportPath = path.join(relativeToNew, newBasename).replace(/\\/g, '/');
          const formattedImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;
          
          if (options.verbose) {
            console.log(`    ✅ Updating import to: ${formattedImportPath}`);
          }
          
          importDecl.setModuleSpecifier(formattedImportPath);
        } else if (options.verbose) {
          console.log('    ❌ Import doesn\'t match moved file');
        }
      }
    }
  }
  
  await project.save();
  
  console.log(chalk.green(`Successfully moved ${movedFiles.size} files.`));
  
  // Track directories that should be forcefully removed (explicit in sources)
  const dirsToForceRemove = new Set<string>();

  // Track additional directories that may need cleanup
  const dirsToCleanup = new Set<string>();

  // Keep track of directory names with trailing slashes for special handling
  const dirNamesWithTrailingSlash = new Set<string>();

  // Process source directories
  for (const src of absoluteSources) {
    const hasTrailingSlash = src.endsWith('/') || src.endsWith('\\');
    const cleanedPath = hasTrailingSlash ? src.slice(0, -1) : src;
    
    if (hasTrailingSlash) {
      // Store the basename for special handling
      dirNamesWithTrailingSlash.add(path.basename(cleanedPath));
    }
    
    if (fs.existsSync(cleanedPath) && fs.statSync(cleanedPath).isDirectory()) {
      // This directory was explicitly requested to be moved, so we'll force remove it
      dirsToForceRemove.add(cleanedPath);
    }
  }

  // Add parent directories of moved files for possible cleanup
  for (const [oldPath] of movedFiles.entries()) {
    dirsToCleanup.add(path.dirname(oldPath));
    
    // Check if this file's directory is one that was specified with a trailing slash
    const dirName = path.basename(path.dirname(oldPath));
    if (dirNamesWithTrailingSlash.has(dirName)) {
      dirsToForceRemove.add(path.dirname(oldPath));
    }
  }

  // First force remove directories that were explicitly passed
  for (const dirPath of dirsToForceRemove) {
    try {
      if (fs.existsSync(dirPath)) {
        if (options.verbose) {
          console.log(`Force removing source directory: ${dirPath}`);
        }
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(chalk.yellow(`Could not remove source directory: ${dirPath}. Error: ${errorMsg}`));
    }
  }

  // Then clean up other directories if they're empty
  const remainingDirs = Array.from(dirsToCleanup)
    .filter(dir => !Array.from(dirsToForceRemove).some(forceDir => dir === forceDir || dir.startsWith(forceDir + path.sep)))
    .sort((a, b) => b.length - a.length); // Sort by depth (longest first)

  for (const dirPath of remainingDirs) {
    try {
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        if (files.length === 0) {
          if (options.verbose) {
            console.log(`Removing empty directory: ${dirPath}`);
          }
          fs.rmdirSync(dirPath);
        }
      }
    } catch (err) {
      // Just log and continue
      if (options.verbose) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.log(`Could not check/remove directory: ${dirPath}. Error: ${errorMsg}`);
      }
    }
  }
}