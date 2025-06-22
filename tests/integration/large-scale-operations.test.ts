import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { moveFiles } from '@/lib/move-files.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Large-Scale File Operations (100+ files)', () => {
  let tempDir: string;
  let sourceDir: string;
  let destDir: string;

  beforeEach(() => {
    // Create unique temporary directory for each test
    tempDir = path.join(__dirname, 'temp', `large-scale-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    sourceDir = path.join(tempDir, 'src');
    destDir = path.join(tempDir, 'dest');
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
    
    // Create tsconfig.json for proper TypeScript context
    fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: false,
        jsx: 'preserve',
        baseUrl: './src',
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['src/**/*']
    }, null, 2));
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const createLargeTestSet = (fileCount: number) => {
    const files: string[] = [];
    
    // Create utility files that will be imported
    const utilsDir = path.join(sourceDir, 'utils');
    fs.mkdirSync(utilsDir, { recursive: true });
    
    for (let i = 0; i < 10; i++) {
      const utilFile = path.join(utilsDir, `util${i}.ts`);
      fs.writeFileSync(utilFile, `
export const util${i}Function = () => {
  return 'utility ${i}';
};

export const UTIL_${i}_CONSTANT = 'UTIL_${i}';
`);
    }
    
    // Create component files with imports
    const componentsDir = path.join(sourceDir, 'components');
    fs.mkdirSync(componentsDir, { recursive: true });
    
    for (let i = 0; i < fileCount; i++) {
      const componentFile = path.join(componentsDir, `Component${i}.tsx`);
      const utilIndex = i % 10;
      
      fs.writeFileSync(componentFile, `
import React from 'react';
import { util${utilIndex}Function, UTIL_${utilIndex}_CONSTANT } from '../utils/util${utilIndex}';
import { Component${Math.max(0, i - 1)} } from './Component${Math.max(0, i - 1)}';

export interface Component${i}Props {
  id: string;
  name: string;
}

export const Component${i}: React.FC<Component${i}Props> = ({ id, name }) => {
  const utilValue = util${utilIndex}Function();
  
  return (
    <div data-testid="component-${i}">
      <h1>{name}</h1>
      <p>ID: {id}</p>
      <p>Util: {utilValue}</p>
      <p>Constant: {UTIL_${utilIndex}_CONSTANT}</p>
      {i > 0 && <Component${Math.max(0, i - 1)} id="child" name="Child Component" />}
    </div>
  );
};

export default Component${i};
`);
      
      files.push(componentFile);
    }
    
    return files;
  };

  const getMemoryUsage = () => {
    const usage = process.memoryUsage();
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    };
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  it('should handle 50 files in streaming mode efficiently', async () => {
    const fileCount = 50;
    const files = createLargeTestSet(fileCount);
    
    const initialMemory = getMemoryUsage();
    const startTime = Date.now();
    
    // Change directory to temp directory for proper path resolution
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    
    try {
      const result = await moveFiles(
        ['src/components'],
        'dest/components',
        {
          recursive: true,
          verbose: true,
          force: true,
          tsConfigPath: path.join(tempDir, 'tsconfig.json') // Explicitly provide tsconfig path
        }
      );
      
      const endTime = Date.now();
      const finalMemory = getMemoryUsage();
      
      // Verify files were moved
      expect(result.movedFiles.length).toBe(fileCount);
      
      // Check performance metrics
      const duration = endTime - startTime;
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`50 files processed in ${duration}ms (streaming mode)`);
      console.log(`Memory increase: ${formatBytes(memoryIncrease)}`);
      
      // Performance expectations for streaming mode
      expect(duration).toBeLessThan(30000); // 30 seconds max
      expect(memoryIncrease).toBeLessThan(150 * 1024 * 1024); // 150MB max increase (should be efficient)
      
      // Verify import updates worked
      expect(result.updatedImports).toBeGreaterThan(0);
      
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should handle 100 files in streaming mode with memory efficiency', async () => {
    const fileCount = 100;
    const files = createLargeTestSet(fileCount);
    
    const initialMemory = getMemoryUsage();
    const startTime = Date.now();
    
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    
    try {
      const result = await moveFiles(
        ['src/components'],
        'dest/components',
        {
          recursive: true,
          verbose: true,
          force: true,
          tsConfigPath: path.join(tempDir, 'tsconfig.json') // Explicitly provide tsconfig path
        }
      );
      
      const endTime = Date.now();
      const finalMemory = getMemoryUsage();
      
      // Verify files were moved
      expect(result.movedFiles.length).toBe(fileCount);
      
      // Check performance metrics
      const duration = endTime - startTime;
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`100 files processed in ${duration}ms (streaming mode)`);
      console.log(`Memory increase: ${formatBytes(memoryIncrease)}`);
      
      // Performance expectations for streaming mode
      expect(duration).toBeLessThan(60000); // 60 seconds max
      expect(memoryIncrease).toBeLessThan(150 * 1024 * 1024); // 150MB max increase (should be less than chunked)
      
      // Verify import updates worked
      expect(result.updatedImports).toBeGreaterThan(0);
      
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should handle 200 files in streaming mode with controlled memory growth', async () => {
    const fileCount = 200;
    const files = createLargeTestSet(fileCount);
    
    const initialMemory = getMemoryUsage();
    const startTime = Date.now();
    
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    
    try {
      const result = await moveFiles(
        ['src/components'],
        'dest/components',
        {
          recursive: true,
          verbose: true,
          force: true,
          tsConfigPath: path.join(tempDir, 'tsconfig.json') // Explicitly provide tsconfig path
        }
      );
      
      const endTime = Date.now();
      const finalMemory = getMemoryUsage();
      
      // Verify files were moved
      expect(result.movedFiles.length).toBe(fileCount);
      
      // Check performance metrics
      const duration = endTime - startTime;
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`200 files processed in ${duration}ms (streaming mode)`);
      console.log(`Memory increase: ${formatBytes(memoryIncrease)}`);
      
      // Performance expectations for streaming mode with large file set
      expect(duration).toBeLessThan(120000); // 2 minutes max
      expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024); // 200MB max increase (should scale sub-linearly)
      
      // Verify import updates worked
      expect(result.updatedImports).toBeGreaterThan(0);
      
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should process files in batches during streaming mode', async () => {
    const fileCount = 75; // Should trigger streaming mode
    const files = createLargeTestSet(fileCount);
    
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    
    try {
      // Mock console.log to capture batch processing logs
      const consoleLogs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        consoleLogs.push(args.join(' '));
        originalLog(...args);
      };
      
      const result = await moveFiles(
        ['src/components'],
        'dest/components',
        {
          recursive: true,
          verbose: true,
          force: true,
          tsConfigPath: path.join(tempDir, 'tsconfig.json') // Explicitly provide tsconfig path
        }
      );
      
      console.log = originalLog;
      
      // Verify streaming mode was used
      const streamingModeLog = consoleLogs.find(log => log.includes('streaming processing mode'));
      expect(streamingModeLog).toBeTruthy();
      
      // Verify batch processing occurred
      const batchLogs = consoleLogs.filter(log => log.includes('Processing batch'));
      expect(batchLogs.length).toBeGreaterThan(1); // Should have multiple batches
      
      // Verify files were moved
      expect(result.movedFiles.length).toBe(fileCount);
      
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should maintain import accuracy across all processing modes', async () => {
    const testSizes = [5, 15, 35, 75]; // standard, surgical, chunked, streaming
    
    for (const fileCount of testSizes) {
      const testDir = path.join(tempDir, `test-${fileCount}`);
      const testSrcDir = path.join(testDir, 'src');
      const testDestDir = path.join(testDir, 'dest');
      
      fs.mkdirSync(testSrcDir, { recursive: true });
      fs.mkdirSync(testDestDir, { recursive: true });
      
      // Create tsconfig for this test
      fs.writeFileSync(path.join(testDir, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          skipLibCheck: true,
          strict: false,
          jsx: 'preserve',
          baseUrl: './src',
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['src/**/*']
      }, null, 2));
      
      // Create test files
      const originalCwd = process.cwd();
      process.chdir(testDir);
      
      try {
        // Create utility file
        const utilsDir = path.join(testSrcDir, 'utils');
        fs.mkdirSync(utilsDir, { recursive: true });
        fs.writeFileSync(path.join(utilsDir, 'helper.ts'), `
export const helperFunction = () => 'helper';
`);
        
        // Create component files
        const componentsDir = path.join(testSrcDir, 'components');
        fs.mkdirSync(componentsDir, { recursive: true });
        
        for (let i = 0; i < fileCount; i++) {
          fs.writeFileSync(path.join(componentsDir, `Component${i}.tsx`), `
import { helperFunction } from '../utils/helper';

export const Component${i} = () => {
  return <div>{helperFunction()}</div>;
};
`);
        }
        
        const result = await moveFiles(
          ['src/components'],
          'dest/components',
          {
            recursive: true,
            verbose: false,
            force: true,
            tsConfigPath: path.join(testDir, 'tsconfig.json') // Explicitly provide tsconfig path
          }
        );
        
        // Verify all files were moved and imports updated
        expect(result.movedFiles.length).toBe(fileCount);
        expect(result.updatedImports).toBeGreaterThan(0);
        
        // Verify destination files exist and have correct imports
        for (let i = 0; i < fileCount; i++) {
          const destFile = path.join(testDestDir, 'components', `Component${i}.tsx`);
          expect(fs.existsSync(destFile)).toBe(true);
          
          const content = fs.readFileSync(destFile, 'utf8');
          // Import should be updated to account for new relative path
          expect(content).toContain("from '../../utils/helper'");
        }
        
      } finally {
        process.chdir(originalCwd);
      }
    }
  });
});