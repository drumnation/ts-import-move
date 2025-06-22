import path from 'path';
import type { Project } from 'ts-morph';
import type { CircularDependencyResult } from '@/lib/syntax-aware-import-updater/syntax-aware-import-updater.types.js';
import { resolveRelativeImport, getResolvedPath } from '@/lib/syntax-aware-import-updater/import-resolver.service.js';

/**
 * Circular dependency detection service
 * Implements ARC-7 Protocol Section 3.3: Circular Dependency Detection
 * 
 * Pure functional implementation for detecting circular dependencies
 */

/**
 * Build adjacency list from moved files
 */
const buildAdjacencyList = (project: Project, moveMap: Map<string, string>): Map<string, Set<string>> => {
  const adjacencyList = new Map<string, Set<string>>();
  
  for (const [, newPath] of moveMap.entries()) {
    const sourceFile = project.getSourceFile(newPath);
    if (!sourceFile) continue;
    
    const dependencies = new Set<string>();
    
    for (const importDecl of sourceFile.getImportDeclarations()) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      if (moduleSpecifier.startsWith('.')) {
        const currentDir = path.dirname(newPath);
        const resolvedResult = resolveRelativeImport(moduleSpecifier, currentDir);
        const resolvedPath = getResolvedPath(resolvedResult);
        
        // Only track dependencies on moved files
        if (moveMap.has(resolvedPath) || Array.from(moveMap.values()).includes(resolvedPath)) {
          dependencies.add(resolvedPath);
        }
      }
    }
    
    adjacencyList.set(newPath, dependencies);
  }
  
  return adjacencyList;
};

/**
 * Perform DFS to detect cycles
 */
const detectCycleInGraph = (
  adjacencyList: Map<string, Set<string>>,
  moveMap: Map<string, string>
): string[] | null => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
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
        return cyclePath;
      }
    }
  }
  
  return null;
};

/**
 * Convert file paths to base names for display
 */
const convertPathsToBaseNames = (paths: string[]): string[] => {
  return paths.map(p => path.basename(p));
};

/**
 * Detect circular dependencies in the moved files
 */
export const detectCircularDependencies = (
  project: Project, 
  moveMap: Map<string, string>
): CircularDependencyResult => {
  const adjacencyList = buildAdjacencyList(project, moveMap);
  const cyclePath = detectCycleInGraph(adjacencyList, moveMap);
  
  if (cyclePath) {
    return {
      hasCircularDependency: true,
      cyclePath: convertPathsToBaseNames(cyclePath)
    };
  }
  
  return { hasCircularDependency: false };
};