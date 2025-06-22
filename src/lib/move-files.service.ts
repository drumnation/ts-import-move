/**
 * Move Files Service: Pure functional orchestrator
 * Coordinates all isolated concerns without classes or imperative state
 */

import { Project, SourceFile } from 'ts-morph';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';


import { findTsConfigForFiles } from '@/commands/utils.js';
import { executeDryRun } from '@/lib/dry-run.service.js';
import { ImportPathContext } from '@/lib/import-path.service.js';
import { safeParseSourceFile, defaultParseOptions } from '@/lib/safe-parser.service.js';
import { executeFileMove } from '@/lib/file-operations.service.js';

export interface MoveFilesOptions {
  readonly extensions?: string;
  readonly force?: boolean;
  readonly dryRun?: boolean;
  readonly verbose?: boolean;
  readonly debugImports?: boolean;
  readonly tsConfigPath?: string;
  readonly recursive?: boolean;
  readonly tsconfig?: string;
  readonly absoluteImports?: boolean;
  readonly aliasPrefix?: string;
}

export interface FileEntry {
  readonly filePath: string;
  readonly isDirectory: boolean;
  readonly sourceDirRoot?: string;
  readonly relPathFromSourceRoot?: string;
}

export interface MoveFilesResult {
  readonly movedFiles: readonly string[];
  readonly updatedImports: number;
  readonly createdDirectories: readonly string[];
  readonly removedDirectories: readonly string[];
  readonly errors: readonly string[];
}

/**
 * Pure function to resolve input paths
 */
export const resolveInputPath = (input: string, cwd: string): string => {
  if (path.isAbsolute(input)) return input;
  return path.resolve(cwd, input);
};

/**
 * Pure function to collect files to process
 */
export const collectFilesToProcess = (
  sources: readonly string[],
  initialCwd: string,
  extensions: readonly string[],
  verbose: boolean
): readonly FileEntry[] => {
  const filesToProcess: FileEntry[] = [];
  
  for (const src of sources) {
    const absSrc = resolveInputPath(src, initialCwd);
    
    if (fs.existsSync(absSrc) && fs.statSync(absSrc).isDirectory()) {
      // Recursively collect files from directory
      if (verbose) {
        console.log(`Collecting files from directory: ${absSrc}`);
      }
      
      const walkDir = (dir: string, sourceDirRoot: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            walkDir(fullPath, sourceDirRoot);
          } else if (entry.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
            const relativePath = path.relative(sourceDirRoot, fullPath);
            filesToProcess.push({
              filePath: fullPath,
              isDirectory: false,
              sourceDirRoot,
              relPathFromSourceRoot: relativePath
            });
          }
        }
      };
      
      // CRITICAL FIX: Use parent directory as sourceDirRoot to preserve directory structure
      // This ensures that when moving /src/Experience/, the relative path includes "Experience/"
      const sourceDirRoot = path.dirname(absSrc);
      walkDir(absSrc, sourceDirRoot);
    } else if (fs.existsSync(absSrc) && fs.statSync(absSrc).isFile()) {
      // Single file
      if (extensions.some(ext => absSrc.endsWith(ext))) {
        if (verbose) {
          console.log(`Adding file: ${absSrc}`);
        }
        filesToProcess.push({
          filePath: absSrc,
          isDirectory: false
        });
      }
    } else {
      // Glob pattern
      if (verbose) {
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
          if (verbose) {
            console.log(`Adding file from pattern: ${absMatch}`);
          }
          filesToProcess.push({
            filePath: absMatch,
            isDirectory: false
          });
        }
      }
      
      if (verbose && matches.length === 0) {
        console.log(`No files matched pattern: ${src}`);
      }
    }
  }
  
  // Return unique entries
  return Array.from(
    new Map(filesToProcess.map(item => [item.filePath, item])).values()
  );
};

/**
 * Pure function to extract file paths for TypeScript processing
 */
export const extractFilePaths = (entries: readonly FileEntry[]): readonly string[] => {
  return entries
    .filter(entry => !entry.isDirectory)
    .map(entry => entry.filePath);
};

/**
 * Pure function to validate files exist
 */
export const validateFiles = (files: readonly string[]): void => {
  if (files.length === 0) {
    const msg = 'No files matched the provided patterns. Aborting move operation.';
    console.error(chalk.red(msg));
    throw new Error(msg);
  }
};

/**
 * Pure function to determine processing mode
 */
export const determineProcessingMode = (
  fileCount: number
): 'standard' | 'surgical' | 'chunked' | 'streaming' => {
  if (fileCount > 50) return 'streaming';
  if (fileCount > 30) return 'chunked';
  if (fileCount > 10) return 'surgical';
  return 'standard';
};

/**
 * Pure function to create TypeScript project configuration
 */
export const createProjectConfig = (
  files: readonly string[],
  tsConfigPath: string | undefined,
  verbose: boolean = false
): { tsConfigPath: string | null; useInMemoryFileSystem: boolean } => {
  let resolvedTsConfigPath: string | null = null;
  
  // Try explicit tsconfig path first
  if (tsConfigPath && fs.existsSync(tsConfigPath)) {
    resolvedTsConfigPath = tsConfigPath;
    if (verbose) {
      console.log(`Using explicit tsconfig: ${resolvedTsConfigPath}`);
    }
  } else {
    // Try to find tsconfig relative to files
    const foundTsConfig = findTsConfigForFiles([...files]);
    
    if (foundTsConfig && fs.existsSync(foundTsConfig)) {
      resolvedTsConfigPath = foundTsConfig;
      if (verbose) {
        console.log(`Found tsconfig relative to files: ${resolvedTsConfigPath}`);
      }
    } else {
      // Fallback: try to find tsconfig from current working directory
      const fallbackTsConfig = findTsConfigForFiles([]);
      
      if (fallbackTsConfig && fs.existsSync(fallbackTsConfig)) {
        resolvedTsConfigPath = fallbackTsConfig;
        if (verbose) {
          console.log(`Using fallback tsconfig from CWD: ${resolvedTsConfigPath}`);
        }
      }
    }
  }
  
  // Final validation: ensure the resolved path actually exists and is readable
  if (resolvedTsConfigPath) {
    try {
      fs.accessSync(resolvedTsConfigPath, fs.constants.R_OK);
      // Try to parse it to ensure it's valid JSON
      const content = fs.readFileSync(resolvedTsConfigPath, 'utf8');
      JSON.parse(content);
      if (verbose) {
        console.log(`Validated tsconfig: ${resolvedTsConfigPath}`);
      }
    } catch (error) {
      if (verbose) {
        console.warn(`Tsconfig validation failed for ${resolvedTsConfigPath}:`, error);
      }
      resolvedTsConfigPath = null;
    }
  }
  
  if (!resolvedTsConfigPath) {
    console.warn(chalk.yellow('No tsconfig.json found. Type checking might be limited.'));
  }
  
  return {
    tsConfigPath: resolvedTsConfigPath,
    useInMemoryFileSystem: files.length > 50 // Use in-memory for large projects
  };
};

/**
 * Pure function to collect import contexts for path resolution
 */
export const collectImportContexts = (
  sourceFiles: readonly SourceFile[],
  movedFiles: readonly string[],
  moveMapping: ReadonlyMap<string, string>
): readonly ImportPathContext[] => {
  const contexts: ImportPathContext[] = [];
  
  for (const sourceFile of sourceFiles) {
    const parseResult = safeParseSourceFile(sourceFile, defaultParseOptions);
    
    for (const importDecl of parseResult.imports) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (moduleSpecifier) {
        contexts.push({
          sourceFile: sourceFile.getFilePath(),
          targetFile: sourceFile.getFilePath(), // Will be updated after move
          originalImportPath: moduleSpecifier,
          movedFiles,
          moveMapping
        });
      }
    }
  }
  
  return contexts;
};

/**
 * Main functional orchestrator for moving files
 * PURE FUNCTION - no side effects except when explicitly executed
 */
export const moveFiles = async (
  sources: readonly string[],
  destination: string,
  options: MoveFilesOptions
): Promise<MoveFilesResult> => {
  // Capture initial state
  const initialCwd = process.cwd();
  
  if (options.verbose) {
    console.log(`Initial CWD: ${initialCwd}`);
    console.log(`moveFiles called with sources: ${sources.join(', ')}, destination: ${destination}`);
  }
  
  // Parse extensions
  const extensions = options.extensions 
    ? options.extensions.split(',').map(ext => ext.startsWith('.') ? ext : `.${ext}`)
    : ['.ts', '.tsx'];
  
  // Resolve paths
  const absoluteDestination = resolveInputPath(destination, initialCwd);
  
  if (options.verbose) {
    console.log(`Absolute destination: ${absoluteDestination}`);
  }
  
  // Collect files to process
  const uniqueFiles = collectFilesToProcess(sources, initialCwd, extensions, options.verbose ?? false);
  const files = extractFilePaths(uniqueFiles);
  
  if (options.verbose) {
    console.log(`Found ${files.length} unique files to move:`);
    files.forEach(f => console.log(`  - ${f}`));
  }
  
  // Validate files
  validateFiles(files);
  
  // Create project configuration
  const projectConfig = createProjectConfig(files, options.tsConfigPath ?? options.tsconfig, options.verbose ?? false);
  
  if (options.verbose) {
    console.log(`Using TypeScript configuration: ${projectConfig.tsConfigPath || 'None'}`);
  }
  
  // Determine processing mode
  const processingMode = determineProcessingMode(uniqueFiles.length);
  
  if (options.verbose) {
    console.log(`Using ${processingMode} processing mode for ${uniqueFiles.length} files`);
  }
  
  // Initialize TypeScript project
  let project: Project;
  let tsConfigSuccessfullyLoaded = false;
  
  try {
    // Strategy 1: Try with the resolved tsconfig path
    if (projectConfig.tsConfigPath) {
      project = new Project({
        tsConfigFilePath: projectConfig.tsConfigPath,
        useInMemoryFileSystem: projectConfig.useInMemoryFileSystem
      });
      
      tsConfigSuccessfullyLoaded = true; // Mark as successful
      
      if (options.verbose) {
        console.log(`Successfully initialized ts-morph with tsconfig: ${projectConfig.tsConfigPath}`);
      }
    } else {
      throw new Error('No tsconfig available, falling back to manual configuration');
    }
  } catch (error) {
    // Strategy 2: Fallback to manual configuration without tsconfig
    if (options.verbose) {
      console.warn(`Failed to initialize with tsconfig (${error}), using fallback configuration`);
    }
    
    project = new Project({
      useInMemoryFileSystem: projectConfig.useInMemoryFileSystem,
      compilerOptions: {
        target: 99, // Latest
        module: 99, // ESNext
        moduleResolution: 2, // Node
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: false, // Be permissive for compatibility
        jsx: 4, // Preserve
        declaration: false,
        outDir: undefined // Don't emit files
      }
    });
    
    tsConfigSuccessfullyLoaded = false; // Mark as failed
    
    if (options.verbose) {
      console.log('Using fallback ts-morph configuration without tsconfig');
    }
  }
  
  // CRITICAL: Add ALL TypeScript files in the project, not just the files being moved
  // ts-morph needs to know about all files to update imports correctly
  if (tsConfigSuccessfullyLoaded && projectConfig.tsConfigPath) {
    // If we successfully initialized with tsconfig, let ts-morph load all files from it
    try {
      project.addSourceFilesFromTsConfig(projectConfig.tsConfigPath);
      
      if (options.verbose) {
        console.log('Successfully loaded all project files from tsconfig');
      }
    } catch (error) {
      if (options.verbose) {
        console.warn('Failed to load files from tsconfig (' + error + '), falling back to manual file discovery');
      }
      // Fall back to manual file discovery
      tsConfigSuccessfullyLoaded = false;
    }
  }
  
  if (!tsConfigSuccessfullyLoaded) {
    // If no tsconfig or tsconfig failed, add all .ts/.tsx files from the directory tree
    if (options.verbose) {
      console.log('Using manual file discovery for project files');
    }
    
    const projectRoot = files.length > 0 ? path.dirname(files[0]) : initialCwd;
    const allTsFiles = fg.sync('**/*.{ts,tsx}', { 
      cwd: projectRoot,
      absolute: true,
      ignore: ['node_modules/**', '**/*.d.ts']
    });
    
    if (options.verbose) {
      console.log('Found ' + allTsFiles.length + ' TypeScript files in project');
    }
    
    for (const tsFile of allTsFiles) {
      // Only add files that exist and are not being moved (to avoid ENOENT errors)
      if (fs.existsSync(tsFile) && !files.includes(tsFile) && !project.getSourceFile(tsFile)) {
        try {
          project.addSourceFileAtPath(tsFile);
        } catch (error) {
          if (options.verbose) {
            console.warn('Failed to add file to project: ' + tsFile + ' (' + error + ')');
          }
          // Continue with other files
        }
      }
    }
  }
  
  // Ensure the files being moved are definitely in the project
  for (const file of files) {
    if (fs.existsSync(file) && !project.getSourceFile(file)) {
      try {
        project.addSourceFileAtPath(file);
      } catch (error) {
        if (options.verbose) {
          console.warn('Failed to add file to project: ' + file + ' (' + error + ')');
        }
        // Continue - this file might not be essential for import resolution
      }
    }
  }
  
  // Collect import contexts
  const importContexts = collectImportContexts(project.getSourceFiles(), files, new Map());
  
  // CRITICAL: Handle dry-run mode BEFORE any file operations
  if (options.dryRun) {
    const affectedImports = new Map<string, string[]>();
    for (const context of importContexts) {
      const existing = affectedImports.get(context.sourceFile) || [];
      affectedImports.set(context.sourceFile, [...existing, context.originalImportPath]);
    }
    
    executeDryRun(files, absoluteDestination, affectedImports);
    
    // CRITICAL: Return early - NO FILE OPERATIONS IN DRY RUN
    return {
      movedFiles: [],
      updatedImports: 0,
      createdDirectories: [],
      removedDirectories: [],
      errors: []
    };
  }
  
  // If not dry-run, proceed with actual move operations
  const sourceDirRoot = uniqueFiles.find(f => f.sourceDirRoot)?.sourceDirRoot;
  
  if (options.verbose && sourceDirRoot) {
    console.log(`Using source directory root: ${sourceDirRoot}`);
  }
  
  const result = executeFileMove(project, files, absoluteDestination, {
    force: options.force ?? false,
    sourceDirRoot
  });
  
  // Convert relative imports to absolute imports if enabled (default: true)
  const shouldConvertToAbsolute = options.absoluteImports !== false;
  
  if (shouldConvertToAbsolute && projectConfig.tsConfigPath) {
    if (options.verbose) {
      console.log('Converting relative imports to absolute imports...');
    }
    
    try {
      const { convertProjectToAbsoluteImports } = await import('./absolute-imports.service.js');
      const aliasPrefix = options.aliasPrefix || '@';
      const projectRoot = path.dirname(projectConfig.tsConfigPath);
      
      const totalConversions = convertProjectToAbsoluteImports(
        project.getSourceFiles(),
        projectConfig.tsConfigPath,
        aliasPrefix,
        projectRoot,
        options.verbose || false
      );
      
      if (options.verbose) {
        console.log(`✅ Converted ${totalConversions} imports to absolute paths`);
      }
      
      // Save the absolute import changes
      project.saveSync();
      
    } catch (error) {
      if (options.verbose) {
        console.warn(`⚠️ Failed to convert imports to absolute: ${error instanceof Error ? error.message : String(error)}`);
      }
      // Don't fail the entire operation if absolute imports conversion fails
    }
  } else if (options.verbose) {
    if (!shouldConvertToAbsolute) {
      console.log('Skipping absolute imports conversion (disabled by --no-absolute-imports)');
    } else {
      console.log('Skipping absolute imports conversion (no tsconfig found)');
    }
  }
  
  return result;
}; 