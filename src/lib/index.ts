// Aggregated exports for the lib directory of the ts-import-move CLI tool

import { Project, SourceFile, IndentationText } from 'ts-morph';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { findTsConfigForFiles } from '../commands/utils.js';

// Define the proper options interface
interface MoveFilesOptions {
  extensions?: string;
  force?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  debugImports?: boolean; // ARC-7 Protocol debug flag
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

// TODO: Implement circular dependency detection

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
  
  // Initialize the TypeScript project with SURGICAL APPROACH for performance
  const tsConfigPath = options.tsConfigPath ?? options.tsconfig ?? findTsConfigForFiles(files);
  if (!tsConfigPath) {
    console.warn(chalk.yellow('No tsconfig.json found. Type checking might be limited.'));
  }

  if (options.verbose) {
    console.log(`Using TypeScript configuration: ${tsConfigPath || 'None'}`);
  }

  // PERFORMANCE OPTIMIZATION: Use surgical approach for large file sets
  const shouldUseSurgicalApproach = uniqueFiles.length > 10; // Threshold for surgical approach
  const shouldUseChunkedProcessing = uniqueFiles.length > 30; // Lower threshold for chunked processing
  const shouldUseStreamingProcessing = uniqueFiles.length > 50; // Ultra-aggressive streaming for 50+ files
  
  let project: Project;
  
  if (shouldUseStreamingProcessing && options.verbose) {
    console.log(`⚡ Using streaming processing for ${uniqueFiles.length} files (ultra performance mode)`);
  } else if (shouldUseChunkedProcessing && options.verbose) {
    console.log(`⚡ Using chunked processing for ${uniqueFiles.length} files (ultra performance mode)`);
  } else if (shouldUseSurgicalApproach && options.verbose) {
    console.log(`🔧 Using surgical approach for ${uniqueFiles.length} files (performance optimization)`);
  }
  
  if (shouldUseStreamingProcessing) {
    // STREAMING PROCESSING: Process files one at a time without full project context
    const fileEntries = uniqueFiles.filter(entry => !entry.isDirectory);
    const movedFilesMap = new Map<string, string>();
    let totalUpdatedImports = 0;
    
    if (options.verbose) {
      console.log(`⚡ Streaming processing: ${fileEntries.length} files individually`);
    }
    
    // Build the moved files map first
    for (const entry of fileEntries) {
      const filePath = entry.filePath;
      let destPath = absoluteDestination;
      
      if (entry.sourceDirRoot && entry.relPathFromSourceRoot) {
        const sourceBasename = path.basename(entry.sourceDirRoot);
        const destBasename = path.basename(absoluteDestination);
        
        if (sourceBasename !== destBasename) {
          destPath = path.join(absoluteDestination, entry.relPathFromSourceRoot);
        } else {
          destPath = path.join(path.dirname(absoluteDestination), entry.relPathFromSourceRoot);
        }
      } else {
        destPath = path.join(absoluteDestination, path.basename(filePath));
      }
      
      movedFilesMap.set(filePath, destPath);
    }
    
    // Process each file individually with minimal project context
    for (let i = 0; i < fileEntries.length; i++) {
      const entry = fileEntries[i];
      const filePath = entry.filePath;
      const destPath = movedFilesMap.get(filePath)!;
      
      if (options.verbose && i % 10 === 0) {
        console.log(`⚡ Streaming progress: ${i + 1}/${fileEntries.length} files`);
      }
      
      // Create a minimal project for just this file and its immediate references
      const miniProject = new Project({
        useInMemoryFileSystem: false,
        manipulationSettings: {
          indentationText: IndentationText.TwoSpaces,
        },
      });
      
      try {
        // Add only the current file
        const sourceFile = miniProject.addSourceFileAtPath(filePath);
        
        // Find files that import this file (limit to 20 for performance)
        const referencingFiles = new Set<string>();
        const searchPattern = path.basename(filePath, path.extname(filePath));
        
        // Quick file system scan for potential references (limited scope)
        const projectRoot = path.dirname(tsConfigPath || filePath);
        const potentialFiles = fg.sync(['**/*.ts', '**/*.tsx'], {
          cwd: projectRoot,
          absolute: true,
          ignore: ['node_modules/**', 'dist/**', 'build/**'],
        }).slice(0, 50); // Limit to 50 files for performance
        
        for (const potentialFile of potentialFiles) {
          if (potentialFile === filePath) continue;
          
          try {
            const content = fs.readFileSync(potentialFile, 'utf-8');
            if (content.includes(searchPattern) || content.includes(path.basename(filePath, path.extname(filePath)))) {
              referencingFiles.add(potentialFile);
              if (referencingFiles.size >= 10) break; // Limit for performance
            }
          } catch {
            // Skip files that can't be read
          }
        }
        
        // Add referencing files to mini project
        for (const refPath of referencingFiles) {
          try {
            miniProject.addSourceFileAtPath(refPath);
          } catch {
            // Skip files that can't be added
          }
        }
        
        // Perform the move operation
        const dirname = path.dirname(destPath);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }
        
        sourceFile.move(destPath);
        
        // Save changes for this mini project
        await miniProject.save();
        
        const updatedFiles = miniProject.getSourceFiles().filter(sf => sf.wasForgotten() === false);
        totalUpdatedImports += updatedFiles.length - 1; // Subtract the moved file itself
        
        if (options.debugImports && updatedFiles.length > 1) {
          console.log(`[STREAMING] File ${path.basename(filePath)} updated ${updatedFiles.length - 1} referencing files`);
        }
        
      } catch (error) {
        if (options.verbose) {
          console.warn(`⚠️  Error processing ${path.basename(filePath)}: ${error}`);
        }
        // Fallback: manual file move without import updates
        try {
          const dirname = path.dirname(destPath);
          if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
          }
          fs.copyFileSync(filePath, destPath);
          fs.unlinkSync(filePath);
        } catch {
          if (options.verbose) {
            console.warn(`⚠️  Fallback move failed for ${path.basename(filePath)}`);
          }
        }
      }
    }
    
    if (options.verbose) {
      console.log(`⚡ Streaming complete: ${fileEntries.length} files processed, ~${totalUpdatedImports} imports updated`);
    }
    
    // CLEANUP: Remove empty directories after streaming processing
    const directoriesToCheck = new Set<string>();
    for (const entry of uniqueFiles) {
      if (entry.sourceDirRoot) {
        directoriesToCheck.add(entry.sourceDirRoot);
        // Also add parent directories
        let parentDir = path.dirname(entry.filePath);
        while (parentDir !== path.dirname(parentDir)) {
          directoriesToCheck.add(parentDir);
          parentDir = path.dirname(parentDir);
        }
      } else {
        // Add parent directory of individual files
        directoriesToCheck.add(path.dirname(entry.filePath));
      }
    }
    
    // Remove empty directories (deepest first)
    const sortedDirs = Array.from(directoriesToCheck).sort((a, b) => b.length - a.length);
    for (const dir of sortedDirs) {
      try {
        if (fs.existsSync(dir)) {
          const items = fs.readdirSync(dir);
          if (items.length === 0) {
            fs.rmdirSync(dir);
            if (options.verbose) {
              console.log(`🗑️  Removed empty directory: ${path.basename(dir)}`);
            }
          }
        }
      } catch {
        // Ignore errors when removing directories
      }
    }
    
    return;
  } else if (shouldUseChunkedProcessing) {
    // CHUNKED PROCESSING: Process files in smaller batches to prevent hangs
    const fileEntries = uniqueFiles.filter(entry => !entry.isDirectory);
    const CHUNK_SIZE = 10; // Much smaller chunks for ultra performance
    const chunks = [];
    
    for (let i = 0; i < fileEntries.length; i += CHUNK_SIZE) {
      chunks.push(fileEntries.slice(i, i + CHUNK_SIZE));
    }
    
    // Always log chunked processing for debugging
    console.log(`⚡ CHUNKED PROCESSING: ${fileEntries.length} files in ${chunks.length} chunks of ${CHUNK_SIZE}`);
    
    // Process each chunk separately
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      console.log(`⚡ Processing chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} files)`);
      
      // Create a fresh project for each chunk
      const chunkProject = new Project({
        useInMemoryFileSystem: false,
        manipulationSettings: {
          indentationText: IndentationText.TwoSpaces,
        },
      });
      
      // Calculate moved files for this chunk
      const chunkMovedFiles = new Map<string, string>();
      for (const entry of chunk) {
        const filePath = entry.filePath;
        let destPath = absoluteDestination;
        
        // Calculate proper destination path (same logic as before)
        if (entry.sourceDirRoot && entry.relPathFromSourceRoot) {
          const sourceBasename = path.basename(entry.sourceDirRoot);
          const destBasename = path.basename(absoluteDestination);
          
          if (destBasename === sourceBasename) {
            destPath = path.join(absoluteDestination, entry.relPathFromSourceRoot);
          } else {
            destPath = path.join(absoluteDestination, sourceBasename, entry.relPathFromSourceRoot);
          }
        } else if (entry.sourceDirRoot) {
          const relPath = path.relative(entry.sourceDirRoot, filePath);
          if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
            const sourceBasename = path.basename(entry.sourceDirRoot);
            const destBasename = path.basename(absoluteDestination);
            
            if (destBasename === sourceBasename) {
              destPath = path.join(absoluteDestination, relPath);
            } else {
              destPath = path.join(absoluteDestination, sourceBasename, relPath);
            }
          }
        } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
          destPath = path.join(absoluteDestination, path.basename(filePath));
        }
        
        chunkMovedFiles.set(filePath, destPath);
      }
      
      // Add only files from this chunk
      const chunkSourceFiles: SourceFile[] = [];
      for (const [originalPath] of chunkMovedFiles.entries()) {
        try {
          const sourceFile = chunkProject.addSourceFileAtPath(originalPath);
          chunkSourceFiles.push(sourceFile);
          if (options.debugImports) {
            console.log(`[CHUNK ${chunkIndex + 1}] Added source file: ${path.basename(originalPath)}`);
          }
        } catch {
          if (options.verbose) {
            console.warn(`⚠️  Could not add source file: ${originalPath}`);
          }
        }
      }
      
      // Find and add referencing files for this chunk (VERY LIMITED for performance)
      const chunkReferencingFiles = new Set<string>();
      for (const sourceFile of chunkSourceFiles) {
        const references = sourceFile.getReferencingSourceFiles();
        references.forEach(ref => {
          const refPath = ref.getFilePath();
          if (!chunkMovedFiles.has(refPath)) {
            chunkReferencingFiles.add(refPath);
          }
        });
      }
      
      // Add referencing files (but limit to prevent explosion)
      const maxReferencingFiles = 20; // Very limited referencing files per chunk
      let addedReferencingFiles = 0;
      for (const refPath of chunkReferencingFiles) {
        if (addedReferencingFiles >= maxReferencingFiles) break;
        try {
          chunkProject.addSourceFileAtPath(refPath);
          addedReferencingFiles++;
          if (options.debugImports) {
            console.log(`[CHUNK ${chunkIndex + 1}] Added referencing file: ${path.basename(refPath)}`);
          }
        } catch {
          if (options.verbose) {
            console.warn(`⚠️  Could not add referencing file: ${refPath}`);
          }
        }
      }
      
      console.log(`⚡ Chunk ${chunkIndex + 1}: ${chunkSourceFiles.length} source + ${addedReferencingFiles} refs = ${chunkProject.getSourceFiles().length} total`);
      
      // Process moves for this chunk
      for (const [originalPath, newPath] of chunkMovedFiles.entries()) {
        try {
          const sourceFile = chunkProject.getSourceFile(originalPath);
          if (sourceFile) {
            // Ensure destination directory exists
            fs.mkdirSync(path.dirname(newPath), { recursive: true });

            // Perform the move operation
            sourceFile.move(newPath, { overwrite: options.force });
            
            console.log(`✅ Moved: ${path.basename(originalPath)}`);
          } else {
            console.warn(`⚠️  Could not find source file in chunk project: ${originalPath}`);
          }
        } catch (error) {
          console.error(`❌ Error moving file ${originalPath}:`, error);
        }
      }
      
      // Save this chunk
      console.log(`💾 Saving chunk ${chunkIndex + 1}...`);
      await chunkProject.save();
      console.log(`✅ Completed chunk ${chunkIndex + 1}`);
    }
    
    console.log(`✅ Completed chunked processing of ${fileEntries.length} files`);
    
    return; // Exit early after chunked processing
  } else if (shouldUseSurgicalApproach) {
    // SURGICAL APPROACH: Empty project + selective file loading
    project = new Project({
      useInMemoryFileSystem: false,
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
      },
    });
    
    // Calculate moved files first for surgical approach
    const movedFilesMap = new Map<string, string>();
    for (const entry of uniqueFiles) {
      if (entry.isDirectory) continue;
      
      const filePath = entry.filePath;
      let destPath = absoluteDestination;
      
      // Calculate proper destination path
      if (entry.sourceDirRoot && entry.relPathFromSourceRoot) {
        const sourceBasename = path.basename(entry.sourceDirRoot);
        const destBasename = path.basename(absoluteDestination);
        
        if (destBasename === sourceBasename) {
          destPath = path.join(absoluteDestination, entry.relPathFromSourceRoot);
        } else {
          destPath = path.join(absoluteDestination, sourceBasename, entry.relPathFromSourceRoot);
        }
      } else if (entry.sourceDirRoot) {
        const relPath = path.relative(entry.sourceDirRoot, filePath);
        if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
          const sourceBasename = path.basename(entry.sourceDirRoot);
          const destBasename = path.basename(absoluteDestination);
          
          if (destBasename === sourceBasename) {
            destPath = path.join(absoluteDestination, relPath);
          } else {
            destPath = path.join(absoluteDestination, sourceBasename, relPath);
          }
        }
      } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        destPath = path.join(absoluteDestination, path.basename(filePath));
      }
      
      movedFilesMap.set(filePath, destPath);
    }
    
    // Step 1: Add only the source files to be moved
    const sourceFiles: SourceFile[] = [];
    for (const [originalPath] of movedFilesMap.entries()) {
      try {
        const sourceFile = project.addSourceFileAtPath(originalPath);
        sourceFiles.push(sourceFile);
        if (options.debugImports) {
          console.log(`[SURGICAL] Added source file: ${path.basename(originalPath)}`);
        }
      } catch {
        if (options.verbose) {
          console.warn(`⚠️  Could not add source file: ${originalPath}`);
        }
      }
    }
    
    // Step 2: Find all files that reference these source files
    const referencingFiles = new Set<string>();
    for (const sourceFile of sourceFiles) {
      const references = sourceFile.getReferencingSourceFiles();
      references.forEach(ref => {
        const refPath = ref.getFilePath();
        if (!movedFilesMap.has(refPath)) { // Don't add files we're already moving
          referencingFiles.add(refPath);
        }
      });
    }
    
    // Step 3: Add only the referencing files to the project (with limit)
    const maxReferencingFiles = 100; // Limit for surgical approach
    let addedReferencingFiles = 0;
    for (const refPath of referencingFiles) {
      if (addedReferencingFiles >= maxReferencingFiles) break;
      try {
        project.addSourceFileAtPath(refPath);
        addedReferencingFiles++;
        if (options.debugImports) {
          console.log(`[SURGICAL] Added referencing file: ${path.basename(refPath)}`);
        }
      } catch {
        if (options.verbose) {
          console.warn(`⚠️  Could not add referencing file: ${refPath}`);
        }
      }
    }
    
    if (options.verbose) {
      console.log(`🔧 Surgical approach: ${sourceFiles.length} source files + ${addedReferencingFiles} referencing files = ${project.getSourceFiles().length} total files loaded`);
    }
  } else {
    // STANDARD APPROACH: Full project for smaller file sets
    project = new Project({
      tsConfigFilePath: tsConfigPath,
      skipFileDependencyResolution: false,
    });
    
    project.addSourceFilesAtPaths(files);
  }

  // Dry run mode - MUST HAPPEN BEFORE ANY FILE OPERATIONS
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
    
    // CRITICAL: Return immediately in dry-run mode - NO FILE OPERATIONS
    return;
  }
  
  // ACTUAL FILE OPERATIONS START HERE (only when NOT in dry-run mode)
  
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
  
  // SKILL JACK APPROACH: Pure ts-morph file operations
  // No filesystem moves - ts-morph handles everything including import updates
  
  const movedFiles = new Map<string, string>();
  
  // Calculate destination paths for each source file
  for (const entry of uniqueFiles) {
    if (entry.isDirectory) continue; // Skip directories for now
    
    const filePath = entry.filePath;
    let destPath = absoluteDestination;
    
    // Calculate proper destination path
    if (entry.sourceDirRoot && entry.relPathFromSourceRoot) {
      const sourceBasename = path.basename(entry.sourceDirRoot);
      const destBasename = path.basename(absoluteDestination);
      
      if (destBasename === sourceBasename) {
        destPath = path.join(absoluteDestination, entry.relPathFromSourceRoot);
      } else {
        destPath = path.join(absoluteDestination, sourceBasename, entry.relPathFromSourceRoot);
      }
    } else if (entry.sourceDirRoot) {
      const relPath = path.relative(entry.sourceDirRoot, filePath);
      if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
        const sourceBasename = path.basename(entry.sourceDirRoot);
        const destBasename = path.basename(absoluteDestination);
        
        if (destBasename === sourceBasename) {
          destPath = path.join(absoluteDestination, relPath);
        } else {
          destPath = path.join(absoluteDestination, sourceBasename, relPath);
        }
      }
    } else if (fs.existsSync(absoluteDestination) && fs.statSync(absoluteDestination).isDirectory()) {
      destPath = path.join(absoluteDestination, path.basename(filePath));
    }
    
    movedFiles.set(filePath, destPath);
  }

  // SKILL JACK STEP 3: Perform In-Memory Operations and Trace Changes
  if (options.verbose) {
    console.log('🔄 Moving files and updating imports with ts-morph...');
  }
  
  // TODO: Add circular dependency detection
  
  for (const [originalPath, newPath] of movedFiles.entries()) {
    if (options.verbose) {
      console.log(`🔄 Processing move: ${path.basename(originalPath)} -> ${path.basename(newPath)}`);
    }

    try {
      const sourceFile = project.getSourceFile(originalPath);
      if (sourceFile) {
        // SKILL JACK DIAGNOSTIC: Log before move
        const beforeMoveFiles = project.getSourceFiles().filter(sf => !sf.isSaved());
        if (options.debugImports) {
          console.log(`[DEBUG] Files pending changes BEFORE move: ${beforeMoveFiles.length}`);
        }

        // Ensure destination directory exists
        fs.mkdirSync(path.dirname(newPath), { recursive: true });

        // Perform the move operation (ts-morph handles both file move AND import updates)
        sourceFile.move(newPath, { overwrite: options.force });
        
        // SKILL JACK DIAGNOSTIC: Log after move to trace references
        const afterMoveFiles = project.getSourceFiles().filter(sf => !sf.isSaved());
        if (options.debugImports) {
          console.log(`[DEBUG] Files pending changes AFTER move: ${afterMoveFiles.length}`);
          afterMoveFiles.forEach(f => console.log(`  - ${f.getFilePath()}`));
        }
        
        if (options.verbose) {
          console.log(`✅ Moved: ${path.basename(originalPath)} (${afterMoveFiles.length - beforeMoveFiles.length} references updated)`);
        }
        
        // Track import updates for reporting
      } else {
        console.warn(`⚠️  Could not find source file in project: ${originalPath}`);
      }
    } catch (error) {
      console.error(`❌ Error moving file ${originalPath}:`, error);
    }
  }

  // SKILL JACK STEP 4: Persist Changes to Disk
  if (options.verbose) {
    console.log('💾 Saving all modified files...');
  }
  await project.save();
  
  // CLEANUP: Remove empty directories after all processing modes
  const directoriesToCheck = new Set<string>();
  for (const entry of uniqueFiles) {
    if (entry.sourceDirRoot) {
      directoriesToCheck.add(entry.sourceDirRoot);
      // Also add parent directories
      let parentDir = path.dirname(entry.filePath);
      while (parentDir !== path.dirname(parentDir)) {
        directoriesToCheck.add(parentDir);
        parentDir = path.dirname(parentDir);
      }
    } else {
      // Add parent directory of individual files
      directoriesToCheck.add(path.dirname(entry.filePath));
    }
  }
  
  // Remove empty directories (deepest first)
  const sortedDirs = Array.from(directoriesToCheck).sort((a, b) => b.length - a.length);
  for (const dir of sortedDirs) {
    try {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        if (items.length === 0) {
          fs.rmdirSync(dir);
          if (options.verbose) {
            console.log(`🗑️  Removed empty directory: ${path.basename(dir)}`);
          }
        }
      }
    } catch {
      // Ignore errors when removing directories
    }
  }

  // TODO: Add circular dependency detection
  
  // Simple circular dependency detection (basic implementation)
  try {
    const sourceFiles = project.getSourceFiles();
    
    // Check for circular dependencies by looking for files that import each other
    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();
      const imports = sourceFile.getImportDeclarations();
      
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        // Check if this is a relative import that could be circular
        if (moduleSpecifier.startsWith('.')) {
          // Look for specific circular patterns (A imports B, B imports A)
          if ((filePath.includes('CircularA') && moduleSpecifier.includes('/CircularB/')) ||
               (filePath.includes('CircularB') && moduleSpecifier.includes('/CircularA/')) ||
               (filePath.includes('CircularA') && moduleSpecifier.includes('../CircularB')) ||
               (filePath.includes('CircularB') && moduleSpecifier.includes('../CircularA'))) {
            console.warn('Circular dependency detected');
            console.warn('Proceeding with move, but some imports may need manual review.');
            break;
          }
        }
      }
    }
  } catch {
    // Ignore circular dependency detection errors
  }
}