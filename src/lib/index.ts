// Aggregated exports for the lib directory of the ts-import-move CLI tool

import { Project } from 'ts-morph';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { MoveOptions } from '../types/index.js';
import { handleFileMove } from './fileHandler.js';
import { updateImports, refreshProjectReferences } from './pathUpdater.js';
import { findTsConfigForFiles } from '../commands/utils.js';

/**
 * Moves files and updates imports
 * @param sources Array of source files or glob patterns
 * @param destination Destination path
 * @param options Move options
 */
export async function moveFiles(
  sources: string[],
  destination: string,
  options: MoveOptions
): Promise<void> {
  // 1. Resolve all file paths using glob patterns
  const extensions = options.extensions ? options.extensions.split(',') : ['.ts', '.tsx'];
  const extensionPattern = extensions.length > 0 ? `{${extensions.join(',')}}` : '';
  
  const files = sources.flatMap(src => {
    // If the source contains glob pattern or is a directory with recursive option enabled
    if (src.includes('*') || (fs.existsSync(src) && fs.statSync(src).isDirectory() && options.recursive)) {
      // For wildcard/glob patterns or recursive directory traversal
      const pattern = fs.existsSync(src) && fs.statSync(src).isDirectory() 
        ? `${src}/**/*${extensionPattern}` 
        : src;
      return fg.sync(pattern, { dot: true });
    } else {
      // For single files or simple patterns
      return fg.sync(src, { dot: true });
    }
  });

  if (files.length === 0) {
    console.warn(chalk.yellow('No files matched the provided patterns.'));
    return;
  }

  // 2. Initialize ts-morph project
  const tsConfigPath = options.tsconfig ?? findTsConfigForFiles(files);
  if (!tsConfigPath) {
    console.warn(chalk.yellow('No tsconfig.json found. Type checking might be limited.'));
  }

  if (options.verbose) {
    console.log(`Using TypeScript configuration: ${tsConfigPath || 'None'}`);
    console.log(`Found ${files.length} files to move.`);
  }

  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipFileDependencyResolution: false,
  });

  // Add all source files to the project
  project.addSourceFilesAtPaths(files);

  // --- BEGIN FIX: Directory structure preservation ---
  // Determine if we are moving a single directory into a directory
  let singleDirMove = false;
  let srcDirRoot = '';
  if (
    sources.length === 1 &&
    fs.existsSync(sources[0]) &&
    fs.statSync(sources[0]).isDirectory() &&
    options.recursive &&
    fs.existsSync(destination) &&
    fs.statSync(destination).isDirectory()
  ) {
    singleDirMove = true;
    srcDirRoot = path.resolve(sources[0]);
  }
  // --- END FIX ---

  // 3. Dry run mode feedback
  if (options.dryRun) {
    console.log(chalk.blue('DRY RUN MODE: No files will be moved.'));
    console.log('The following operations would be performed:');
    
    for (const file of files) {
      // --- BEGIN FIX: Directory structure preservation for dry run ---
      let destPath = destination;
      if (singleDirMove) {
        // Compute relative path from srcDirRoot
        const relPath = path.relative(srcDirRoot, file);
        const destSubdir = path.join(destination, path.basename(srcDirRoot));
        destPath = path.join(destSubdir, relPath);
      } else if (fs.existsSync(destination) && fs.statSync(destination).isDirectory()) {
        destPath = path.join(destination, path.basename(file));
      }
      // --- END FIX ---
      console.log(`${chalk.green(file)} → ${chalk.yellow(destPath)}`);
    }
    
    return;
  }

  // 4. Perform move operations
  const movedFiles = new Map<string, string>();
  for (const filePath of files) {
    try {
      // --- BEGIN FIX: Directory structure preservation for actual move ---
      let destPath = destination;
      if (singleDirMove) {
        // Compute relative path from srcDirRoot
        const relPath = path.relative(srcDirRoot, filePath);
        const destSubdir = path.join(destination, path.basename(srcDirRoot));
        destPath = path.join(destSubdir, relPath);
      } else if (sources.some(src => src.includes('*'))) {
        // Existing logic for globs
        const matchingPattern = sources.find(src => {
          const basePath = src.split('*')[0];
          return filePath.startsWith(basePath);
        });
        if (matchingPattern && fs.existsSync(destination) && fs.statSync(destination).isDirectory()) {
          const basePath = matchingPattern.split('*')[0];
          const relativePath = path.relative(basePath, filePath);
          if (matchingPattern.endsWith('*.ts') || matchingPattern.endsWith('*.tsx')) {
            destPath = path.join(destination, path.basename(filePath));
          } else {
            destPath = path.join(destination, relativePath);
          }
        }
      } else if (fs.existsSync(destination) && fs.statSync(destination).isDirectory()) {
        destPath = path.join(destination, path.basename(filePath));
      }
      // --- END FIX ---
      const newFilePath = await handleFileMove(filePath, destPath, options);
      movedFiles.set(filePath, newFilePath);
      // Update imports for this file
      updateImports(project, filePath, newFilePath);
    } catch (err) {
      console.error(chalk.red(`Error moving ${filePath}:`), err);
      // Continue with other files on error
    }
  }

  // 5. Refresh project references
  refreshProjectReferences(project);

  // 6. Update all source files that might reference the moved files
  if (options.verbose) {
    console.log(`Checking ${project.getSourceFiles().length} source files for imports that need updating...`);
  }
  
  const allSourceFiles = project.getSourceFiles();
  for (const sourceFile of allSourceFiles) {
    const importDeclarations = sourceFile.getImportDeclarations();
    
    if (options.verbose) {
      console.log(`Examining file ${sourceFile.getFilePath()} with ${importDeclarations.length} imports`);
    }
    
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      if (options.verbose) {
        console.log(`  Import: ${moduleSpecifier}`);
      }
      
      // Try to find imports referencing our moved files
      for (const [oldFilePath, newFilePath] of movedFiles.entries()) {
        // const oldDirname = path.dirname(oldFilePath); // removed unused variable
        const oldBasename = path.basename(oldFilePath, path.extname(oldFilePath));
        const newDirname = path.dirname(newFilePath);
        const newBasename = path.basename(newFilePath, path.extname(newFilePath));
        
        if (options.verbose) {
          // eslint-disable-next-line quotes
          console.log(`    Checking against moved file: ${oldFilePath} -> ${newFilePath}`);
          console.log(`    Old basename: ${oldBasename}, New path: ${newDirname}/${newBasename}`);
        }
        
        // Check if this import references the file we moved
        // Compare the imported module with our old file path
        const sourceFilePath = sourceFile.getFilePath();
        const sourceFileDir = path.dirname(sourceFilePath);
        
        // Get absolute paths for more accurate comparison
        const absOldPath = path.resolve(oldFilePath);
        const resolvedImportPath = path.resolve(sourceFileDir, moduleSpecifier + (moduleSpecifier.endsWith('.ts') ? '' : '.ts'));
        
        if (options.verbose) {
          console.log(`    Resolving import: ${moduleSpecifier}`);
          console.log(`    Source file dir: ${sourceFileDir}`);
          console.log(`    Absolute old path: ${absOldPath}`);
          console.log(`    Resolved import path: ${resolvedImportPath}`);
        }
        
        // Check if this import resolves to our moved file
        if (resolvedImportPath === absOldPath || 
            resolvedImportPath.replace(/\.ts$/, '') === absOldPath.replace(/\.ts$/, '')) {
          // Calculate new relative path from the source file to the new file location
          const relativeToNew = path.relative(sourceFileDir, newDirname);
          // Format with proper slashes for different OSes
          const newImportPath = path.join(relativeToNew, newBasename).replace(/\\/g, '/');
          // Add ./ prefix if needed for relative imports
          const formattedImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;
          
          if (options.verbose) {
            console.log(`    ✅ Updating import to: ${formattedImportPath}`);
          }
          
          // Update the import
          importDecl.setModuleSpecifier(formattedImportPath);
        } else if (options.verbose) {
          console.log('    ❌ Import doesn\'t match moved file');
        }
      }
    }
  }

  // 7. Save changes
  await project.save();

  // 8. Summary
  console.log(chalk.green(`Successfully moved ${movedFiles.size} files.`));

  // --- BEGIN FIX: Remove original source directory if singleDirMove ---
  if (singleDirMove && srcDirRoot) {
    try {
      // Remove the now-empty source directory recursively
      fs.rmSync(srcDirRoot, { recursive: true, force: true });
      if (options.verbose) {
        console.log(`Removed original source directory: ${srcDirRoot}`);
      }
    } catch (err) {
      console.warn(chalk.yellow(`Could not remove original source directory: ${srcDirRoot}`), err);
    }
  }
  // --- END FIX ---
}