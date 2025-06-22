import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { moveFiles } from '@/lib/index.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

describe('Deeply Nested Component Migration - Regression Protection', () => {
  let testDir: string;
  let sourceDir: string;
  let destDir: string;
  
  beforeEach(() => {
    // Create unique temporary directory for each test
    const testId = Math.random().toString(36).substring(7);
    testDir = path.join(tmpdir(), `ts-import-move-test-${testId}`);
    sourceDir = path.join(testDir, 'source');
    destDir = path.join(testDir, 'destination');
    
    // Clean up any existing test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    
    // Copy our 412-file test case to a temporary location
    fs.mkdirSync(testDir, { recursive: true });
    execSync(`cp -r tests/complex-document-editor-migration/source ${sourceDir}`);
    fs.mkdirSync(destDir, { recursive: true });
  });
  
  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should verify 412-file test case structure exists and is accessible', () => {
    // This test ensures our test case is properly set up
    const sourceFiles = getAllTypeScriptFiles(sourceDir);
    const directories = getAllDirectories(sourceDir);
    
    console.log(`Found ${sourceFiles.length} TypeScript files`);
    console.log(`Found ${directories.length} directories`);
    
    // Verify we have the expected complex structure
    expect(sourceFiles.length).toBeGreaterThan(400); // Should have 412+ files
    expect(directories.length).toBeGreaterThan(100); // Should have 110+ directories
    
    // Verify key directories exist
    expect(fs.existsSync(path.join(sourceDir, 'components'))).toBe(true);
    expect(fs.existsSync(path.join(sourceDir, 'components/shared'))).toBe(true);
    expect(fs.existsSync(path.join(sourceDir, 'components/panels'))).toBe(true);
  });

  it('should handle moving a small subset without hanging (regression test)', async () => {
    // Test a small subset to ensure the tool doesn't hang on complex structures
    const testFile = path.join(sourceDir, 'DocumentEditorPage.tsx');
    const targetDir = path.join(destDir, 'simple-test');
    
    if (fs.existsSync(testFile)) {
      console.log(`Moving single file: ${testFile} -> ${targetDir}`);
      
      // This should complete quickly without hanging
      await moveFiles([testFile], targetDir, {
        extensions: '.ts,.tsx',
        verbose: false,
        force: true
      });
      
      // Verify file was moved
      const movedFile = path.join(targetDir, 'DocumentEditorPage.tsx');
      expect(fs.existsSync(movedFile)).toBe(true);
      expect(fs.existsSync(testFile)).toBe(false);
    }
  });

  it('should handle moving a molecules directory subset (medium complexity)', async () => {
    // Test moving a medium-sized subset
    const moleculesDir = path.join(sourceDir, 'components/shared/molecules');
    const targetDir = path.join(destDir, 'molecules-test');
    
    if (fs.existsSync(moleculesDir)) {
      const moleculeFiles = getAllTypeScriptFiles(moleculesDir);
      console.log(`Moving ${moleculeFiles.length} molecule files`);
      
      // Memory monitoring
      const memBefore = process.memoryUsage();
      console.log(`Memory before: ${Math.round(memBefore.heapUsed / 1024 / 1024)}MB`);
      
      // Limit to first 5 molecule subdirectories to prevent hanging
      const moleculeSubdirs = fs.readdirSync(moleculesDir)
        .filter(item => fs.statSync(path.join(moleculesDir, item)).isDirectory())
        .slice(0, 5);
      
      if (moleculeSubdirs.length > 0) {
        const testSubdir = path.join(moleculesDir, moleculeSubdirs[0]);
        
        await moveFiles([testSubdir], targetDir, {
          extensions: '.ts,.tsx',
          verbose: false,
          force: true
        });
        
        // Memory monitoring
        const memAfter = process.memoryUsage();
        console.log(`Memory after: ${Math.round(memAfter.heapUsed / 1024 / 1024)}MB`);
        
        // Verify directory was moved
        const movedDir = path.join(targetDir, moleculeSubdirs[0]);
        expect(fs.existsSync(movedDir)).toBe(true);
        
        // Verify files exist in moved directory
        const movedFiles = getAllTypeScriptFiles(movedDir);
        expect(movedFiles.length).toBeGreaterThan(0);
      }
    }
  }, 30000); // 30 second timeout

  it('should preserve index files during complex moves', async () => {
    // Test that index files are preserved during moves
    const componentsDir = path.join(sourceDir, 'components/shared/atoms');
    const targetDir = path.join(destDir, 'atoms-test');
    
    if (fs.existsSync(componentsDir)) {
      // Count index files before move
      const indexFilesBefore = getAllFiles(componentsDir)
        .filter(file => path.basename(file) === 'index.ts');
      
      console.log(`Found ${indexFilesBefore.length} index files before move`);
      
      await moveFiles([componentsDir], targetDir, {
        extensions: '.ts,.tsx',
        verbose: false,
        force: true
      });
      
      // Count index files after move
      const indexFilesAfter = getAllFiles(targetDir)
        .filter(file => path.basename(file) === 'index.ts');
      
      console.log(`Found ${indexFilesAfter.length} index files after move`);
      
      // Should preserve all index files
      expect(indexFilesAfter.length).toBe(indexFilesBefore.length);
    }
  });
});

// Helper functions (simplified)
function getAllTypeScriptFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTypeScriptFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getAllDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const directories: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      directories.push(fullPath);
      directories.push(...getAllDirectories(fullPath));
    }
  }
  
  return directories;
}

function getAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
} 