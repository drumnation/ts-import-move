import path from 'path';
import fs from 'fs';
import type { Project, SourceFile } from 'ts-morph';
import type { SyntaxAwareImportUpdaterConfig } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';
import { recordMove } from '@/lib/syntax-aware-import-updater/global-move-tracker.service.js';
import { detectCircularDependencies } from '@/lib/syntax-aware-import-updater/circular-dependency-detector.service.js';
import { 
  pathsMatch, 
  calculateRelativePath, 
  resolveRelativeImport, 
  getResolvedPath 
} from '@/lib/syntax-aware-import-updater/import-resolver.service.js';

/**
 * Syntax-aware import updater service
 * Pure functional implementation that fixes the core ts-morph refresh issue
 */

/**
 * Logger function type
 */
type LogFunction = (message: string) => void;

/**
 * Create logger functions based on configuration
 */
const createLoggers = (config: SyntaxAwareImportUpdaterConfig) => {
  const log: LogFunction = (message: string) => {
    if (config.verbose) {
      console.log(message);
    }
  };
  
  const debugLog: LogFunction = (message: string) => {
    if (config.debugImports) {
      console.log(`🔍 [DEBUG] ${message}`);
    }
  };
  
  return { log, debugLog };
};

/**
 * Refresh ts-morph project to recognize moved files
 */
const refreshProjectFiles = (project: Project, debugLog: LogFunction): void => {
  debugLog('Refreshing ts-morph project to recognize moved files...');
  project.getSourceFiles().forEach(sourceFile => {
    try {
      sourceFile.refreshFromFileSystemSync();
    } catch {
      // File might have been moved, which is expected
      debugLog(`File no longer exists at original location: ${sourceFile.getFilePath()}`);
    }
  });
};

/**
 * Add moved files to the ts-morph project
 */
const addMovedFilesToProject = (
  project: Project, 
  movedFiles: Map<string, string>, 
  debugLog: LogFunction
): void => {
  for (const [, newPath] of movedFiles.entries()) {
    if (fs.existsSync(newPath)) {
      try {
        project.addSourceFileAtPath(newPath);
        debugLog(`Added moved file to project: ${newPath}`);
      } catch {
        debugLog(`File already in project or error adding: ${newPath}`);
      }
    }
  }
};

/**
 * Record all file moves in the global tracker
 */
const recordAllMoves = (movedFiles: Map<string, string>, log: LogFunction): void => {
  log('🗺️  Building complete move map...');
  for (const [originalPath, newPath] of movedFiles.entries()) {
    recordMove(originalPath, newPath);
    const originalName = path.basename(originalPath);
    const newName = path.basename(newPath);
    log(`  📍 ${originalName} → ${newName}`);
  }
};

/**
 * Update imports in a single source file
 */
const updateImportsInFile = (
  sourceFile: SourceFile,
  movedFiles: Map<string, string>,
  debugLog: LogFunction
): boolean => {
  let fileModified = false;
  const importDeclarations = sourceFile.getImportDeclarations();
  
  for (const importDecl of importDeclarations) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    
    if (moduleSpecifier.startsWith('.')) {
      // This is a relative import - check if it needs updating
      const currentDir = path.dirname(sourceFile.getFilePath());
      const resolvedResult = resolveRelativeImport(moduleSpecifier, currentDir);
      const resolvedImportPath = getResolvedPath(resolvedResult);
      
      // Check if this resolved path matches any of our moved files
      for (const [originalPath, newPath] of movedFiles.entries()) {
        if (pathsMatch(resolvedImportPath, originalPath)) {
          // Calculate new relative path
          const newRelativePath = calculateRelativePath(currentDir, newPath);
          
          debugLog(`Updating import in ${sourceFile.getFilePath()}:`);
          debugLog(`  From: ${moduleSpecifier}`);
          debugLog(`  To: ${newRelativePath}`);
          
          importDecl.setModuleSpecifier(newRelativePath);
          fileModified = true;
        }
      }
    }
  }
  
  return fileModified;
};

/**
 * Save a source file with error handling
 */
const saveSourceFile = (sourceFile: SourceFile, debugLog: LogFunction): boolean => {
  try {
    sourceFile.saveSync();
    debugLog(`✅ Updated imports in: ${sourceFile.getFilePath()}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to save ${sourceFile.getFilePath()}: ${error}`);
    return false;
  }
};

/**
 * Update imports in all project files that reference moved files
 */
const updateAllImportReferences = (
  project: Project,
  movedFiles: Map<string, string>,
  log: LogFunction,
  debugLog: LogFunction
): number => {
  log(`🔗 Updating external references in ${project.getSourceFiles().length} files...`);
  
  let updatedFileCount = 0;
  
  for (const sourceFile of project.getSourceFiles()) {
    const fileModified = updateImportsInFile(sourceFile, movedFiles, debugLog);
    
    if (fileModified && saveSourceFile(sourceFile, debugLog)) {
      updatedFileCount++;
    }
  }
  
  return updatedFileCount;
};

/**
 * The core fix: properly refresh ts-morph project after file moves
 * Main entry point for updating imports in moved files
 */
export const updateImportsInMovedFiles = (
  project: Project,
  movedFiles: Map<string, string>,
  config: SyntaxAwareImportUpdaterConfig = {}
): void => {
  const { log, debugLog } = createLoggers(config);
  
  log('🔄 Starting syntax-aware import updates...');
  log(`📊 Processing ${movedFiles.size} moved files`);
  
  // CRITICAL FIX: Refresh the project to recognize moved files
  refreshProjectFiles(project, debugLog);
  
  // Add the new files to the project
  addMovedFilesToProject(project, movedFiles, debugLog);
  
  // Record all moves in the global tracker
  recordAllMoves(movedFiles, log);
  
  // Build move map for path resolution
  const moveMap = new Map<string, string>();
  for (const [originalPath, newPath] of movedFiles.entries()) {
    moveMap.set(originalPath, newPath);
  }
  
  log('🔍 Detecting circular dependencies...');
  const circularResult = detectCircularDependencies(project, moveMap);
  if (circularResult.hasCircularDependency) {
    console.warn('⚠️  Circular dependency detected:', circularResult.cyclePath?.join(' → '));
  }
  
  // Now update imports in ALL files that reference the moved files
  const updatedFileCount = updateAllImportReferences(project, movedFiles, log, debugLog);
  
  log(`✅ Updated imports in ${updatedFileCount} files`);
};