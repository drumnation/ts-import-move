import path from 'path';
import fs from 'fs';
import { Project } from 'ts-morph';

/**
 * Represents a file move operation for tracking global movement state
 */
interface FileMoveMapping {
  originalPath: string;
  newPath: string;
  timestamp: number;
}

/**
 * Circular dependency detection result
 */
interface CircularDependencyResult {
  hasCircularDependency: boolean;
  cyclePath?: string[];
}

/**
 * Configuration for the syntax-aware import updater
 */
interface SyntaxAwareImportUpdaterConfig {
  verbose?: boolean;
  debugImports?: boolean;
}

/**
 * Global movement tracker to handle batch operations and cross-operation dependencies
 * Implements ARC-7 Protocol Section 3.2: Batch Operation State Management
 */
class GlobalMoveTracker {
  private static instance: GlobalMoveTracker;
  private moveHistory: FileMoveMapping[] = [];
  
  static getInstance(): GlobalMoveTracker {
    if (!GlobalMoveTracker.instance) {
      GlobalMoveTracker.instance = new GlobalMoveTracker();
    }
    return GlobalMoveTracker.instance;
  }
  
  recordMove(originalPath: string, newPath: string): void {
    this.moveHistory.push({
      originalPath,
      newPath,
      timestamp: Date.now()
    });
  }
  
  getMoveHistory(): FileMoveMapping[] {
    return [...this.moveHistory];
  }
  
  clearHistory(): void {
    this.moveHistory = [];
  }
  
  findNewLocation(originalPath: string): string | null {
    const moveRecord = this.moveHistory.find(record => record.originalPath === originalPath);
    return moveRecord ? moveRecord.newPath : null;
  }
}

/**
 * Syntax-aware import updater that fixes the core ts-morph refresh issue
 */
class SyntaxAwareImportUpdater {
  private verbose: boolean;
  private debugImports: boolean;
  private moveTracker: GlobalMoveTracker;
  
  constructor(config: SyntaxAwareImportUpdaterConfig = {}) {
    this.verbose = config.verbose ?? false;
    this.debugImports = config.debugImports ?? false;
    this.moveTracker = GlobalMoveTracker.getInstance();
  }
  
  private log(message: string): void {
    if (this.verbose) {
      console.log(message);
    }
  }
  
  private debugLog(message: string): void {
    if (this.debugImports) {
      console.log(`🔍 [DEBUG] ${message}`);
    }
  }
  
  /**
   * The core fix: properly refresh ts-morph project after file moves
   */
  updateImportsInMovedFiles(project: Project, movedFiles: Map<string, string>): void {
    this.log('🔄 Starting syntax-aware import updates...');
    this.log(`📊 Processing ${movedFiles.size} moved files`);
    
    // CRITICAL FIX: Refresh the project to recognize moved files
    this.debugLog('Refreshing ts-morph project to recognize moved files...');
    project.getSourceFiles().forEach(sourceFile => {
      try {
        sourceFile.refreshFromFileSystemSync();
      } catch {
        // File might have been moved, which is expected
        this.debugLog(`File no longer exists at original location: ${sourceFile.getFilePath()}`);
      }
    });
    
    // Add the new files to the project
    for (const [, newPath] of movedFiles.entries()) {
      if (fs.existsSync(newPath)) {
        try {
          project.addSourceFileAtPath(newPath);
          this.debugLog(`Added moved file to project: ${newPath}`);
        } catch {
          this.debugLog(`File already in project or error adding: ${newPath}`);
        }
      }
    }
    
    // Record all moves in the global tracker
    this.log('🗺️  Building complete move map...');
    for (const [originalPath, newPath] of movedFiles.entries()) {
      this.moveTracker.recordMove(originalPath, newPath);
      const originalName = path.basename(originalPath);
      const newName = path.basename(newPath);
      this.log(`  📍 ${originalName} → ${newName}`);
    }
    
    // Build move map for path resolution
    const moveMap = new Map<string, string>();
    for (const [originalPath, newPath] of movedFiles.entries()) {
      moveMap.set(originalPath, newPath);
    }
    
    this.log('🔍 Detecting circular dependencies...');
    const circularResult = this.detectCircularDependencies(project, moveMap);
    if (circularResult.hasCircularDependency) {
      console.warn('⚠️  Circular dependency detected:', circularResult.cyclePath?.join(' → '));
    }
    
    // Now update imports in ALL files that reference the moved files
    this.log(`🔗 Updating external references in ${project.getSourceFiles().length} files...`);
    
    let updatedFileCount = 0;
    
    for (const sourceFile of project.getSourceFiles()) {
      let fileModified = false;
      
      // Get import declarations
      const importDeclarations = sourceFile.getImportDeclarations();
      
      for (const importDecl of importDeclarations) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        if (moduleSpecifier.startsWith('.')) {
          // This is a relative import - check if it needs updating
          const currentDir = path.dirname(sourceFile.getFilePath());
          const resolvedImportPath = this.resolveRelativeImport(moduleSpecifier, currentDir);
          
          // Check if this resolved path matches any of our moved files
          for (const [originalPath, newPath] of movedFiles.entries()) {
            if (this.pathsMatch(resolvedImportPath, originalPath)) {
              // Calculate new relative path
              const newRelativePath = this.calculateRelativePath(currentDir, newPath);
              
              this.debugLog(`Updating import in ${sourceFile.getFilePath()}:`);
              this.debugLog(`  From: ${moduleSpecifier}`);
              this.debugLog(`  To: ${newRelativePath}`);
              
              importDecl.setModuleSpecifier(newRelativePath);
              fileModified = true;
            }
          }
        }
      }
      
      if (fileModified) {
        try {
          sourceFile.saveSync();
          updatedFileCount++;
          this.debugLog(`✅ Updated imports in: ${sourceFile.getFilePath()}`);
        } catch (error) {
          console.error(`❌ Failed to save ${sourceFile.getFilePath()}: ${error}`);
        }
      }
    }
    
    this.log(`✅ Updated imports in ${updatedFileCount} files`);
  }
  
  /**
   * Check if two paths refer to the same file
   */
  private pathsMatch(path1: string, path2: string): boolean {
    const normalized1 = path.resolve(path1);
    const normalized2 = path.resolve(path2);
    return normalized1 === normalized2;
  }
  
  /**
   * Calculate relative path from one directory to a file
   */
  private calculateRelativePath(fromDir: string, toFile: string): string {
    let relativePath = path.relative(fromDir, toFile);
    
    // Remove file extension for TypeScript imports
    const ext = path.extname(relativePath);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      relativePath = relativePath.slice(0, -ext.length);
    }
    
    // Ensure relative path starts with ./
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    return relativePath;
  }
  
  /**
   * Resolve a relative import to an absolute path
   */
  private resolveRelativeImport(importPath: string, fromDir: string): string {
    // Handle TypeScript file extensions
    const resolvedPath = path.resolve(fromDir, importPath);
    
    // Try common TypeScript extensions if the path doesn't have one
    if (!path.extname(resolvedPath)) {
      const extensions = ['.ts', '.tsx', '.js', '.jsx'];
      for (const ext of extensions) {
        const withExt = resolvedPath + ext;
        if (fs.existsSync(withExt)) {
          return withExt;
        }
      }
      
      // Check for index files
      const indexFile = path.join(resolvedPath, 'index.ts');
      if (fs.existsSync(indexFile)) {
        return indexFile;
      }
    }
    
    return resolvedPath;
  }
  
  /**
   * Detect circular dependencies in the moved files
   * Implements ARC-7 Protocol Section 3.3: Circular Dependency Detection
   */
  private detectCircularDependencies(project: Project, moveMap: Map<string, string>): CircularDependencyResult {
    const adjacencyList = new Map<string, Set<string>>();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    // Build adjacency list from moved files
    for (const [, newPath] of moveMap.entries()) {
      const sourceFile = project.getSourceFile(newPath);
      if (!sourceFile) continue;
      
      const dependencies = new Set<string>();
      
      for (const importDecl of sourceFile.getImportDeclarations()) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        
        if (moduleSpecifier.startsWith('.')) {
          const currentDir = path.dirname(newPath);
          const resolvedPath = this.resolveRelativeImport(moduleSpecifier, currentDir);
          
          // Only track dependencies on moved files
          if (moveMap.has(resolvedPath) || Array.from(moveMap.values()).includes(resolvedPath)) {
            dependencies.add(resolvedPath);
          }
        }
      }
      
      adjacencyList.set(newPath, dependencies);
    }
    
    // DFS to detect cycles
    const detectCycle = (node: string, path: string[]): string[] | null => {
      if (recursionStack.has(node)) {
        return [...path, node];
      }
      
      if (visited.has(node)) {
        return null;
      }
      
      visited.add(node);
      recursionStack.add(node);
      
      const dependencies = adjacencyList.get(node);
      if (dependencies) {
        for (const dependency of dependencies) {
          const cyclePath = detectCycle(dependency, [...path, node]);
          if (cyclePath) {
            return cyclePath;
          }
        }
      }
      
      recursionStack.delete(node);
      return null;
    };
    
    for (const [, newPath] of moveMap.entries()) {
      if (!visited.has(newPath)) {
        const cyclePath = detectCycle(newPath, []);
        if (cyclePath) {
          return {
            hasCircularDependency: true,
            cyclePath: cyclePath.map(p => path.basename(p))
          };
        }
      }
    }
    
    return { hasCircularDependency: false };
  }
}

/**
 * Factory function to create a syntax-aware import updater
 * Following functional isolated concerns principles
 */
export const createSyntaxAwareImportUpdater = (config: SyntaxAwareImportUpdaterConfig = {}): SyntaxAwareImportUpdater => {
  return new SyntaxAwareImportUpdater(config);
}; 