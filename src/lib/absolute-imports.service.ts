import path from 'path';
import fs from 'fs';
import { SourceFile } from 'ts-morph';

/**
 * Interface for path alias configuration
 */
export interface PathAliasConfig {
  readonly prefix: string;          // e.g., '@'
  readonly baseUrl: string;         // e.g., './src'
  readonly paths: ReadonlyMap<string, string>;  // e.g., '@/*' -> './src/*'
}

/**
 * Parse tsconfig.json to extract path aliases
 */
export const parsePathAliases = (
  tsConfigPath: string | null,
  aliasPrefix: string = '@'
): PathAliasConfig => {
  const defaultConfig: PathAliasConfig = {
    prefix: aliasPrefix,
    baseUrl: './src',
    paths: new Map([
      [`${aliasPrefix}/*`, './src/*'],
      [`${aliasPrefix}/shared/*`, './src/shared/*'],
      [`${aliasPrefix}/features/*`, './src/features/*'],
      [`${aliasPrefix}/components/*`, './src/components/*'],
      [`${aliasPrefix}/utils/*`, './src/utils/*'],
    ])
  };

  if (!tsConfigPath || !fs.existsSync(tsConfigPath)) {
    return defaultConfig;
  }

  try {
    const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf8');
    const tsConfig = JSON.parse(tsConfigContent);
    
    const compilerOptions = tsConfig.compilerOptions || {};
    const baseUrl = compilerOptions.baseUrl || './src';
    const paths = compilerOptions.paths || {};
    
    const pathsMap = new Map<string, string>();
    
    // Convert tsconfig paths to our format
    for (const [alias, pathArray] of Object.entries(paths)) {
      if (Array.isArray(pathArray) && pathArray.length > 0) {
        pathsMap.set(alias, pathArray[0] as string);
      }
    }
    
    // If no paths defined, use defaults
    if (pathsMap.size === 0) {
      return defaultConfig;
    }
    
    return {
      prefix: aliasPrefix,
      baseUrl,
      paths: pathsMap
    };
  } catch (error) {
    console.warn(`Failed to parse tsconfig for path aliases: ${error}`);
    return defaultConfig;
  }
};

/**
 * Convert a relative import path to an absolute import using aliases
 */
export const convertToAbsoluteImport = (
  relativeImportPath: string,
  sourceFilePath: string,
  aliasConfig: PathAliasConfig,
  projectRoot: string,
  verbose: boolean = false
): string => {
  // Skip if already absolute (starts with alias prefix)
  if (relativeImportPath.startsWith(aliasConfig.prefix)) {
    return relativeImportPath;
  }
  
  // Skip node_modules imports
  if (!relativeImportPath.startsWith('.')) {
    return relativeImportPath;
  }
  
  try {
    // Resolve the actual file path being imported
    const sourceDir = path.dirname(sourceFilePath);
    const resolvedImportPath = path.resolve(sourceDir, relativeImportPath);
    
    // Make it relative to project root
    const relativeToProject = path.relative(projectRoot, resolvedImportPath);
    
    // Normalize path separators
    const normalizedPath = relativeToProject.replace(/\\/g, '/');
    
    // Find matching alias pattern
    for (const [aliasPattern, targetPattern] of aliasConfig.paths.entries()) {
      const targetTemplate = targetPattern.replace('*', '$1');
      
      // Remove leading ./ from target template for comparison
      const cleanTargetTemplate = targetTemplate.replace(/^\.\//, '');
      
      if (normalizedPath.startsWith(cleanTargetTemplate)) {
        const matchedPart = normalizedPath.substring(cleanTargetTemplate.length);
        const absoluteImport = aliasPattern.replace('*', matchedPart);
        
        if (verbose) {
          console.log(`  Converted: ${relativeImportPath} → ${absoluteImport}`);
        }
        
        return absoluteImport;
      }
    }
    
    // If no specific pattern matches, try the general prefix pattern
    const srcRelativePath = normalizedPath.startsWith('src/') 
      ? normalizedPath.substring(4) 
      : normalizedPath;
      
    const absoluteImport = `${aliasConfig.prefix}/${srcRelativePath}`;
    
    if (verbose) {
      console.log(`  Converted (general): ${relativeImportPath} → ${absoluteImport}`);
    }
    
    return absoluteImport;
  } catch (error) {
    if (verbose) {
      console.warn(`  Failed to convert import ${relativeImportPath}: ${error}`);
    }
    return relativeImportPath; // Return original if conversion fails
  }
};

/**
 * Update all relative imports in a source file to absolute imports
 */
export const updateImportsToAbsolute = (
  sourceFile: SourceFile,
  aliasConfig: PathAliasConfig,
  projectRoot: string,
  verbose: boolean = false
): number => {
  let updatedCount = 0;
  const filePath = sourceFile.getFilePath();
  
  if (verbose) {
    console.log(`Processing imports in: ${path.relative(projectRoot, filePath)}`);
  }
  
  // Update import declarations
  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDecl of importDeclarations) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const absoluteImport = convertToAbsoluteImport(
      moduleSpecifier,
      filePath,
      aliasConfig,
      projectRoot,
      verbose
    );
    
    if (absoluteImport !== moduleSpecifier) {
      importDecl.setModuleSpecifier(absoluteImport);
      updatedCount++;
    }
  }
  
  // Update export declarations (re-exports)
  const exportDeclarations = sourceFile.getExportDeclarations();
  for (const exportDecl of exportDeclarations) {
    const moduleSpecifier = exportDecl.getModuleSpecifierValue();
    if (moduleSpecifier) {
      const absoluteImport = convertToAbsoluteImport(
        moduleSpecifier,
        filePath,
        aliasConfig,
        projectRoot,
        verbose
      );
      
      if (absoluteImport !== moduleSpecifier) {
        exportDecl.setModuleSpecifier(absoluteImport);
        updatedCount++;
      }
    }
  }
  
  if (verbose && updatedCount > 0) {
    console.log(`  Updated ${updatedCount} imports to absolute paths`);
  }
  
  return updatedCount;
};

/**
 * Process all source files to convert relative imports to absolute imports
 */
export const convertProjectToAbsoluteImports = (
  sourceFiles: readonly SourceFile[],
  tsConfigPath: string | null,
  aliasPrefix: string = '@',
  projectRoot: string,
  verbose: boolean = false
): number => {
  const aliasConfig = parsePathAliases(tsConfigPath, aliasPrefix);
  let totalUpdated = 0;
  
  if (verbose) {
    console.log('\n🔄 Converting relative imports to absolute imports:');
    console.log(`  Alias prefix: ${aliasConfig.prefix}`);
    console.log(`  Base URL: ${aliasConfig.baseUrl}`);
    console.log('  Path mappings:');
    for (const [alias, target] of aliasConfig.paths.entries()) {
      console.log(`    ${alias} → ${target}`);
    }
    console.log(`  Processing ${sourceFiles.length} files...\n`);
  }
  
  for (const sourceFile of sourceFiles) {
    const updated = updateImportsToAbsolute(sourceFile, aliasConfig, projectRoot, verbose);
    totalUpdated += updated;
  }
  
  if (verbose) {
    console.log(`\n✅ Converted ${totalUpdated} imports to absolute paths`);
  }
  
  return totalUpdated;
}; 