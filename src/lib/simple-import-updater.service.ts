import fs from 'fs';
import path from 'path';

interface SimpleImportUpdaterConfig {
  verbose?: boolean;
  debugImports?: boolean;
}

/**
 * Simple, functional import updater that works by string replacement
 * Following functional isolated concerns principles - each function has one responsibility
 */

/**
 * Recursively find all TypeScript files in a directory
 */
const findTypeScriptFiles = (baseDir: string): string[] => {
  const allFiles: string[] = [];
  
  const scanDirectory = (dir: string): void => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip common directories that don't contain source files
        if (entry.isDirectory()) {
          if (!['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name)) {
            scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          // Include TypeScript and JavaScript files
          if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
            allFiles.push(fullPath);
          }
        }
      }
    } catch {
      // Ignore permission errors and continue
    }
  };
  
  scanDirectory(baseDir);
  return allFiles;
};

/**
 * Calculate the new relative import path
 */
const calculateNewImportPath = (
  fromFile: string, 
  originalTarget: string, 
  newTarget: string
): string => {
  const fromDir = path.dirname(fromFile);
  let newRelativePath = path.relative(fromDir, newTarget);
  
  // Remove file extension for TypeScript imports
  const ext = path.extname(newRelativePath);
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    newRelativePath = newRelativePath.slice(0, -ext.length);
  }
  
  // Ensure relative path starts with ./
  if (!newRelativePath.startsWith('.')) {
    newRelativePath = './' + newRelativePath;
  }
  
  // Normalize path separators
  return newRelativePath.replace(/\\/g, '/');
};

/**
 * Check if an import path resolves to a specific file
 */
const doesImportResolveToFile = (
  importPath: string, 
  fromFile: string, 
  targetFile: string
): boolean => {
  // Only process relative imports
  if (!importPath.startsWith('.')) {
    return false;
  }
  
  const fromDir = path.dirname(fromFile);
  const resolvedPath = path.resolve(fromDir, importPath);
  const normalizedTarget = path.resolve(targetFile);
  
  // Try with different extensions
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
  for (const ext of extensions) {
    if (path.resolve(resolvedPath + ext) === normalizedTarget) {
      return true;
    }
  }
  
  // Check for index files
  const indexPath = path.join(resolvedPath, 'index.ts');
  if (path.resolve(indexPath) === normalizedTarget) {
    return true;
  }
  
  return false;
};

/**
 * Update imports in a single file
 */
const updateImportsInFile = (
  filePath: string,
  movedFiles: Map<string, string>,
  config: SimpleImportUpdaterConfig
): boolean => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Simple regex to find import statements
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    if (config.debugImports) {
      console.log(`🔍 [DEBUG] Checking import: "${importPath}" in ${path.basename(filePath)}`);
    }
    
    // Check if this import resolves to any moved file
    for (const [originalPath, newPath] of movedFiles.entries()) {
      if (doesImportResolveToFile(importPath, filePath, originalPath)) {
        const newImportPath = calculateNewImportPath(filePath, originalPath, newPath);
        
        if (config.debugImports) {
          console.log(`🔍 [DEBUG] Updating import in ${path.basename(filePath)}:`);
          console.log(`🔍 [DEBUG]   From: "${importPath}"`);
          console.log(`🔍 [DEBUG]   To: "${newImportPath}"`);
        }
        
        modified = true;
        return match.replace(importPath, newImportPath);
      }
    }
    
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    if (config.verbose) {
      console.log(`✅ Updated imports in: ${path.basename(filePath)}`);
    }
  }
  
  return modified;
};

/**
 * Main function to update imports in all files
 */
export const updateImportsInProject = async (
  movedFiles: Map<string, string>,
  config: SimpleImportUpdaterConfig = {}
): Promise<void> => {
  if (config.verbose) {
    console.log('🔄 Starting simple import updates...');
    console.log(`📊 Processing ${movedFiles.size} moved files`);
  }
  
  // Find project root (look for tsconfig.json or package.json)
  let projectRoot = process.cwd();
  while (projectRoot !== path.dirname(projectRoot)) {
    if (fs.existsSync(path.join(projectRoot, 'tsconfig.json')) || 
        fs.existsSync(path.join(projectRoot, 'package.json'))) {
      break;
    }
    projectRoot = path.dirname(projectRoot);
  }
  
  if (config.verbose) {
    console.log(`📂 Project root: ${projectRoot}`);
  }
  
  // Find all TypeScript files
  const allFiles = findTypeScriptFiles(projectRoot);
  
  if (config.verbose) {
    console.log(`🔍 Found ${allFiles.length} TypeScript files to check`);
  }
  
  let updatedCount = 0;
  
  // Update imports in each file
  for (const file of allFiles) {
    try {
      if (updateImportsInFile(file, movedFiles, config)) {
        updatedCount++;
      }
    } catch (error) {
      if (config.debugImports) {
        console.log(`⚠️ Error processing ${file}: ${error}`);
      }
    }
  }
  
  if (config.verbose) {
    console.log(`✅ Updated imports in ${updatedCount} files`);
  }
}; 