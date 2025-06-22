/**
 * Streaming Processor Service: Memory-efficient batch processing for large file operations
 * Implements true streaming mode to handle 100+ files without memory exhaustion
 */

import { Project, SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { MoveFilesResult, FileEntry } from '@/lib/move-files.service.js';
import { executeFileMove } from '@/lib/file-operations.service.js';
import { safeParseSourceFile, defaultParseOptions } from '@/lib/safe-parser.service.js';

export interface StreamingOptions {
  readonly batchSize?: number;
  readonly verbose?: boolean;
  readonly force?: boolean;
  readonly tsConfigPath?: string;
  readonly sourceDirRoot?: string;
}

export interface BatchProcessingResult {
  readonly movedFiles: readonly string[];
  readonly updatedImports: number;
  readonly createdDirectories: readonly string[];
  readonly removedDirectories: readonly string[];
  readonly errors: readonly string[];
}

/**
 * Process files in memory-efficient batches for streaming mode
 */
export const processFilesInBatches = async (
  files: readonly string[],
  destination: string,
  options: StreamingOptions
): Promise<MoveFilesResult> => {
  const batchSize = options.batchSize ?? 10;
  const verbose = options.verbose ?? false;
  
  if (verbose) {
    console.log(chalk.blue(`🔄 Starting streaming processing mode for ${files.length} files`));
    console.log(chalk.blue(`📦 Using batch size: ${batchSize}`));
  }
  
  // Accumulator for results across all batches
  const allResults: BatchProcessingResult = {
    movedFiles: [],
    updatedImports: 0,
    createdDirectories: [],
    removedDirectories: [],
    errors: []
  };
  
  // Process files in batches
  const totalBatches = Math.ceil(files.length / batchSize);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min(startIndex + batchSize, files.length);
    const batch = files.slice(startIndex, endIndex);
    
    if (verbose) {
      console.log(chalk.yellow(`📦 Processing batch ${batchIndex + 1}/${totalBatches} (${batch.length} files)`));
    }
    
    try {
      const batchResult = await processBatch(batch, destination, options, batchIndex + 1, totalBatches);
      
      // Accumulate results
      allResults.movedFiles = [...allResults.movedFiles, ...batchResult.movedFiles];
      allResults.updatedImports += batchResult.updatedImports;
      allResults.createdDirectories = [...allResults.createdDirectories, ...batchResult.createdDirectories];
      allResults.removedDirectories = [...allResults.removedDirectories, ...batchResult.removedDirectories];
      allResults.errors = [...allResults.errors, ...batchResult.errors];
      
      if (verbose) {
        console.log(chalk.green(`✅ Batch ${batchIndex + 1} completed: ${batchResult.movedFiles.length} files moved, ${batchResult.updatedImports} imports updated`));
      }
      
      // Force garbage collection between batches if possible
      if (global.gc) {
        global.gc();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`❌ Error processing batch ${batchIndex + 1}: ${errorMessage}`));
      allResults.errors = [...allResults.errors, `Batch ${batchIndex + 1}: ${errorMessage}`];
    }
  }
  
  if (verbose) {
    console.log(chalk.green(`🎉 Streaming processing complete: ${allResults.movedFiles.length} files moved, ${allResults.updatedImports} imports updated`));
  }
  
  return {
    movedFiles: allResults.movedFiles,
    updatedImports: allResults.updatedImports,
    createdDirectories: Array.from(new Set(allResults.createdDirectories)),
    removedDirectories: Array.from(new Set(allResults.removedDirectories)),
    errors: allResults.errors
  };
};

/**
 * Process a single batch of files with isolated ts-morph project
 */
const processBatch = async (
  batch: readonly string[],
  destination: string,
  options: StreamingOptions,
  batchNumber: number,
  totalBatches: number
): Promise<BatchProcessingResult> => {
  const verbose = options.verbose ?? false;
  
  // Create isolated project for this batch to minimize memory usage
  let project: Project;
  
  try {
    if (options.tsConfigPath && fs.existsSync(options.tsConfigPath)) {
      try {
        project = new Project({
          tsConfigFilePath: options.tsConfigPath,
          useInMemoryFileSystem: true, // Use in-memory for better performance
          compilerOptions: {
            // Minimal compiler options for faster processing
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            noEmit: true
          }
        });
        
        if (verbose) {
          console.log(`  📄 Batch ${batchNumber}: Initialized ts-morph with tsconfig: ${options.tsConfigPath}`);
        }
      } catch (tsConfigError) {
        if (verbose) {
          console.warn(`  ⚠️ Batch ${batchNumber}: Failed to load tsconfig ${options.tsConfigPath}, using fallback: ${tsConfigError}`);
        }
        // Fall through to fallback configuration
        throw tsConfigError;
      }
    } else {
      throw new Error('No tsconfig path provided or file does not exist');
    }
  } catch (error) {
    // Fallback configuration for batches
    project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: 99, // Latest
        module: 99, // ESNext
        moduleResolution: 2, // Node
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        strict: false,
        jsx: 4, // Preserve
        noEmit: true
      }
    });
    
    if (verbose) {
      console.log(`  📄 Batch ${batchNumber}: Initialized ts-morph with fallback config (tsconfig issue: ${error instanceof Error ? error.message : error})`);
    }
  }
    
  // Add only essential files for this batch
  // 1. Add the files being moved in this batch
  for (const file of batch) {
    if (fs.existsSync(file)) {
      try {
        project.addSourceFileAtPath(file);
      } catch (error) {
        if (verbose) {
          console.warn(`  ⚠️ Batch ${batchNumber}: Failed to add file ${file}: ${error}`);
        }
      }
    }
  }
    
  // 2. Add critical dependency files (files that import from or are imported by batch files)
  const criticalDependencies = await findCriticalDependencies(batch, options.tsConfigPath);
  for (const depFile of criticalDependencies) {
    if (fs.existsSync(depFile) && !project.getSourceFile(depFile)) {
      try {
        project.addSourceFileAtPath(depFile);
      } catch (error) {
        if (verbose) {
          console.warn(`  ⚠️ Batch ${batchNumber}: Failed to add dependency ${depFile}: ${error}`);
        }
      }
    }
  }
    
  if (verbose) {
    const sourceFileCount = project.getSourceFiles().length;
    console.log(`  📊 Batch ${batchNumber}: Loaded ${sourceFileCount} source files (${batch.length} primary + ${sourceFileCount - batch.length} dependencies)`);
  }
    
  // Execute file move operations for this batch
  const result = executeFileMove(project, [...batch], destination, {
    force: options.force ?? false,
    sourceDirRoot: options.sourceDirRoot
  });
    
  // Explicitly clean up project resources
  try {
    // Clear all source files from memory
    project.getSourceFiles().forEach(sourceFile => {
      sourceFile.forget();
    });
  } catch (error) {
    // Ignore cleanup errors
  }
    
  return result;
};

/**
 * Find critical dependency files that need to be loaded for accurate import resolution
 * This is a lightweight analysis to identify files that import from or are imported by the batch files
 */
const findCriticalDependencies = async (
  batchFiles: readonly string[],
  tsConfigPath?: string
): Promise<string[]> => {
  const dependencies = new Set<string>();
  
  // For streaming mode, we limit dependency scanning to avoid loading too many files
  // We focus on immediate dependencies only
  
  for (const file of batchFiles) {
    if (!fs.existsSync(file)) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Find import statements using simple regex (faster than full AST parsing)
      const importMatches = content.match(/import\s+.*?\s+from\s+['"](.*?)['"];?/g) || [];
      const requireMatches = content.match(/require\s*\(\s*['"](.*?)['"]\s*\)/g) || [];
      
      const allImports = [...importMatches, ...requireMatches];
      
      for (const importMatch of allImports) {
        const pathMatch = importMatch.match(/['"](.*?)['"]/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          
          // Only process relative imports (absolute imports don't need file resolution for moves)
          if (importPath.startsWith('.')) {
            const resolvedPath = path.resolve(path.dirname(file), importPath);
            
            // Try common TypeScript extensions
            const possiblePaths = [
              resolvedPath + '.ts',
              resolvedPath + '.tsx',
              resolvedPath + '.js',
              resolvedPath + '.jsx',
              path.join(resolvedPath, 'index.ts'),
              path.join(resolvedPath, 'index.tsx')
            ];
            
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                dependencies.add(possiblePath);
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  return Array.from(dependencies);
};

/**
 * Calculate optimal batch size based on file count and available memory
 */
export const calculateOptimalBatchSize = (
  fileCount: number,
  availableMemoryMB: number = 512
): number => {
  // Base batch size calculation
  // Assume each file uses roughly 1-2MB when loaded with dependencies
  const estimatedMemoryPerFile = 1.5; // MB
  const maxBatchByMemory = Math.floor(availableMemoryMB / estimatedMemoryPerFile);
  
  // Scale batch size based on total file count
  let batchSize: number;
  
  if (fileCount <= 50) {
    batchSize = Math.min(10, maxBatchByMemory);
  } else if (fileCount <= 100) {
    batchSize = Math.min(8, maxBatchByMemory);
  } else if (fileCount <= 200) {
    batchSize = Math.min(6, maxBatchByMemory);
  } else {
    batchSize = Math.min(5, maxBatchByMemory);
  }
  
  // Ensure minimum batch size
  return Math.max(3, batchSize);
};

/**
 * Get memory usage statistics for monitoring
 */
export const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
    rss: Math.round(usage.rss / 1024 / 1024), // MB
  };
};