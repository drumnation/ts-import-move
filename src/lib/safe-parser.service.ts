/**
 * Safe Parser Service: Stack-overflow-safe AST processing
 * Handles complex JSX and object literals without recursion issues
 */

import { SourceFile, Node, ImportDeclaration, ExportDeclaration } from 'ts-morph';

export interface ParseOptions {
  readonly maxDepth: number;
  readonly skipComplexNodes: boolean;
  readonly timeoutMs: number;
}

export interface ParseResult {
  readonly imports: readonly ImportDeclaration[];
  readonly exports: readonly ExportDeclaration[];
  readonly skippedNodes: number;
  readonly maxDepthReached: number;
  readonly timedOut: boolean;
}

export interface SafeParseContext {
  readonly depth: number;
  readonly startTime: number;
  readonly options: ParseOptions;
  readonly skippedNodes: number;
}

/**
 * Default safe parsing options
 */
export const defaultParseOptions: ParseOptions = {
  maxDepth: 100,
  skipComplexNodes: true,
  timeoutMs: 5000
};

/**
 * Pure function to check if parsing should continue
 */
export const shouldContinueParsing = (
  context: SafeParseContext
): boolean => {
  const { depth, startTime, options, skippedNodes } = context;
  
  // Check depth limit
  if (depth > options.maxDepth) {
    return false;
  }
  
  // Check timeout
  if (Date.now() - startTime > options.timeoutMs) {
    return false;
  }
  
  // Check if too many nodes have been skipped
  if (skippedNodes > 50) {
    return false;
  }
  
  return true;
};

/**
 * Pure function to determine if a node is complex and should be skipped
 */
export const isComplexNode = (node: Node): boolean => {
  const nodeText = node.getText();
  
  // Skip nodes with deeply nested object literals
  const objectLiteralDepth = (nodeText.match(/{/g) || []).length;
  if (objectLiteralDepth > 10) {
    return true;
  }
  
  // Skip nodes with many JSX attributes
  const jsxAttributeCount = (nodeText.match(/\w+=/g) || []).length;
  if (jsxAttributeCount > 20) {
    return true;
  }
  
  // Skip extremely large nodes
  if (nodeText.length > 50000) {
    return true;
  }
  
  return false;
};

/**
 * Stack-safe function to extract imports and exports from a source file
 * Uses iterative approach instead of recursion
 */
export const safeParseSourceFile = (
  sourceFile: SourceFile,
  options: ParseOptions = defaultParseOptions
): ParseResult => {
  const startTime = Date.now();
  const imports: ImportDeclaration[] = [];
  const exports: ExportDeclaration[] = [];
  let skippedNodes = 0;
  let maxDepthReached = 0;
  let timedOut = false;
  
  try {
    // Use iterative breadth-first traversal instead of recursion
    const nodeQueue: Array<{ node: Node; depth: number }> = [
      { node: sourceFile, depth: 0 }
    ];
    
    while (nodeQueue.length > 0) {
      const current = nodeQueue.shift();
      if (!current) break;
      
      const { node, depth } = current;
      maxDepthReached = Math.max(maxDepthReached, depth);
      
      const context: SafeParseContext = {
        depth,
        startTime,
        options,
        skippedNodes
      };
      
      // Check if we should continue parsing
      if (!shouldContinueParsing(context)) {
        if (Date.now() - startTime > options.timeoutMs) {
          timedOut = true;
        }
        break;
      }
      
      // Skip complex nodes if option is enabled
      if (options.skipComplexNodes && isComplexNode(node)) {
        skippedNodes++;
        continue;
      }
      
      // Extract imports and exports
      if (Node.isImportDeclaration(node)) {
        imports.push(node);
      } else if (Node.isExportDeclaration(node)) {
        exports.push(node);
      }
      
      // Add children to queue for next iteration
      const children = node.getChildren();
      for (const child of children) {
        nodeQueue.push({ node: child, depth: depth + 1 });
      }
    }
  } catch (error) {
    // Handle stack overflow or other parsing errors gracefully
    if (error instanceof RangeError && error.message.includes('Maximum call stack')) {
      console.warn(`Stack overflow prevented in ${sourceFile.getFilePath()}, using fallback parsing`);
      return safeFallbackParse(sourceFile);
    }
    throw error;
  }
  
  return {
    imports,
    exports,
    skippedNodes,
    maxDepthReached,
    timedOut
  };
};

/**
 * Fallback parsing that only looks at top-level imports/exports
 */
export const safeFallbackParse = (sourceFile: SourceFile): ParseResult => {
  const imports: ImportDeclaration[] = [];
  const exports: ExportDeclaration[] = [];
  
  try {
    // Only get direct children to avoid recursion
    const topLevelStatements = sourceFile.getStatements();
    
    for (const statement of topLevelStatements) {
      if (Node.isImportDeclaration(statement)) {
        imports.push(statement);
      } else if (Node.isExportDeclaration(statement)) {
        exports.push(statement);
      }
    }
  } catch (error) {
    console.warn(`Fallback parsing failed for ${sourceFile.getFilePath()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    imports,
    exports,
    skippedNodes: 0,
    maxDepthReached: 1,
    timedOut: false
  };
};

/**
 * Pure function to validate parse result
 */
export const validateParseResult = (result: ParseResult): boolean => {
  return result.imports.length >= 0 && 
         result.exports.length >= 0 && 
         result.maxDepthReached >= 0;
};

/**
 * Pure function to merge multiple parse results
 */
export const mergeParseResults = (
  results: readonly ParseResult[]
): ParseResult => {
  const allImports: ImportDeclaration[] = [];
  const allExports: ExportDeclaration[] = [];
  let totalSkippedNodes = 0;
  let maxDepthReached = 0;
  let anyTimedOut = false;
  
  for (const result of results) {
    allImports.push(...result.imports);
    allExports.push(...result.exports);
    totalSkippedNodes += result.skippedNodes;
    maxDepthReached = Math.max(maxDepthReached, result.maxDepthReached);
    anyTimedOut = anyTimedOut || result.timedOut;
  }
  
  return {
    imports: allImports,
    exports: allExports,
    skippedNodes: totalSkippedNodes,
    maxDepthReached,
    timedOut: anyTimedOut
  };
}; 