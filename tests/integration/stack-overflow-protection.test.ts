import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { moveFiles } from '../../src/lib/index.js';
import { tmpdir } from 'os';

describe('Stack Overflow Protection Tests', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    
    // Create unique temporary directory for each test
    const testId = Math.random().toString(36).substring(7);
    testDir = path.join(tmpdir(), `ts-import-move-stack-${testId}`);
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
    
    // Create tsconfig.json
    fs.writeFileSync(path.join(testDir, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "jsx": "react-jsx"
  },
  "include": ["**/*"]
}`);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should handle deeply nested JSX without stack overflow (CRITICAL BUG)', async () => {
    // Create deeply nested JSX structure (the exact pattern that caused stack overflow)
    const sourceDir = path.join(testDir, 'src/components');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Generate 150 levels of nested JSX (known to cause stack overflow in v1.0.0)
    const deepJSX = Array(150).fill(0).reduce((acc, _, i) => 
      `<div className="level-${i}" key="${i}">${acc}</div>`, 
      '<span className="deep-content">Deep nested content</span>'
    );
    
    const complexComponent = `
import React from 'react';
import { DeepLogic } from './DeepComponent.logic';

export interface DeepComponentProps {
  depth: number;
  content: string;
}

export const DeepComponent: React.FC<DeepComponentProps> = ({ depth, content }) => {
  const logic = DeepLogic({ depth, content });
  
  return (
    <div className="deep-component">
      <h1>Deep Component (Depth: {depth})</h1>
      ${deepJSX}
      <footer>Component rendered with {logic.stats.nodeCount} nodes</footer>
    </div>
  );
};
`;

    const complexLogic = `
import { DeepComponentProps } from './DeepComponent';

export const DeepLogic = (props: DeepComponentProps) => {
  const calculateStats = () => {
    const nodeCount = props.depth * 150; // Complex calculation
    const memoryUsage = nodeCount * 0.1; // KB estimate
    
    return {
      nodeCount,
      memoryUsage,
      isDeep: nodeCount > 1000
    };
  };
  
  return {
    stats: calculateStats(),
    render: () => 'Deep component logic executed'
  };
};
`;
    
    fs.writeFileSync(path.join(sourceDir, 'DeepComponent.tsx'), complexComponent);
    fs.writeFileSync(path.join(sourceDir, 'DeepComponent.logic.ts'), complexLogic);

    // This should NOT crash with stack overflow
    const destDir = path.join(testDir, 'src/moved');
    
    // Use try-catch to detect stack overflow
    let moveSucceeded = false;
    let errorMessage = '';
    
    try {
      await moveFiles([path.join(sourceDir, 'DeepComponent.tsx'), path.join(sourceDir, 'DeepComponent.logic.ts')], destDir, {
        force: true,
        verbose: false
      });
      moveSucceeded = true;
    } catch (error: any) {
      errorMessage = error.message || String(error);
    }
    
    // Verify no stack overflow occurred
    expect(moveSucceeded).toBe(true);
    expect(errorMessage).not.toContain('Maximum call stack');
    expect(errorMessage).not.toContain('stack overflow');
    expect(errorMessage).not.toContain('RangeError');
    
    // Verify files were moved successfully
    expect(fs.existsSync(path.join(destDir, 'DeepComponent.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(destDir, 'DeepComponent.logic.ts'))).toBe(true);
    
    // Verify imports were updated correctly despite complex JSX
    const movedComponent = fs.readFileSync(path.join(destDir, 'DeepComponent.tsx'), 'utf8');
    expect(movedComponent).toContain("from './DeepComponent.logic'");
  });

  it('should handle complex object literals and nested expressions', async () => {
    // Create component with complex object literals that could cause parsing issues
    const sourceDir = path.join(testDir, 'src/config');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Generate deeply nested object configuration
    const deepConfig = Array(100).fill(0).reduce((acc, _, i) => ({
      [`level${i}`]: {
        id: i,
        nested: acc,
        data: Array(50).fill(0).map((_, j) => ({
          item: j,
          value: `value-${i}-${j}`,
          meta: { deep: true, level: i }
        }))
      }
    }), { base: 'value' });
    
    const complexConfigFile = `
import { ConfigValidator } from './ConfigValidator';

export const COMPLEX_CONFIG = ${JSON.stringify(deepConfig, null, 2)};

export const ConfigManager = {
  validate: (config: typeof COMPLEX_CONFIG) => {
    return ConfigValidator.validateDeepConfig(config);
  },
  
  process: (config: typeof COMPLEX_CONFIG) => {
    const processed = Object.keys(config).reduce((acc, key) => {
      if (key.startsWith('level')) {
        acc[key] = {
          ...config[key],
          processed: true,
          timestamp: Date.now()
        };
      }
      return acc;
    }, {} as any);
    
    return processed;
  }
};
`;

    const validatorFile = `
export const ConfigValidator = {
  validateDeepConfig: (config: any): boolean => {
    try {
      JSON.stringify(config);
      return true;
    } catch {
      return false;
    }
  }
};
`;
    
    fs.writeFileSync(path.join(sourceDir, 'ComplexConfig.ts'), complexConfigFile);
    fs.writeFileSync(path.join(sourceDir, 'ConfigValidator.ts'), validatorFile);

    // Move files with complex object literals
    const destDir = path.join(testDir, 'src/shared/config');
    
    let moveSucceeded = false;
    let errorMessage = '';
    
    try {
      await moveFiles([sourceDir], path.dirname(destDir), {
        force: true,
        recursive: true,
        verbose: false
      });
      moveSucceeded = true;
    } catch (error: any) {
      errorMessage = error.message || String(error);
    }
    
    // Verify no parsing errors occurred
    expect(moveSucceeded).toBe(true);
    expect(errorMessage).not.toContain('Maximum call stack');
    expect(errorMessage).not.toContain('Parse error');
    expect(errorMessage).not.toContain('SyntaxError');
    
    // Verify files were moved and imports updated
    const movedConfigFile = path.join(destDir, 'ComplexConfig.ts');
    expect(fs.existsSync(movedConfigFile)).toBe(true);
    
    const configContent = fs.readFileSync(movedConfigFile, 'utf8');
    expect(configContent).toContain("from './ConfigValidator'");
  });

  it('should handle files with moderately complex expressions without stack overflow', async () => {
    // Create component with moderately complex expressions (realistic but could cause stack issues)
    const sourceDir = path.join(testDir, 'src/utils');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Generate moderately complex expression (realistic length that shouldn't break)
    const complexExpression = Array(50).fill(0).reduce((expr, _, i) => 
      `${expr}.map(x => x + ${i}).filter(x => x > 0)`,
      'data'
    );
    
    const processorFile = `
import { DataValidator } from './DataValidator';

export const DataProcessor = {
  processComplexData: (data: number[]): number[] => {
    const validator = DataValidator.create();
    
    if (!validator.isValid(data)) {
      throw new Error('Invalid data');
    }
    
    // Moderately complex expression that should not cause stack overflow
    const result = ${complexExpression}.slice(0, 100);
    
    return result;
  },
  
  processNestedData: (datasets: number[][]): number[][] => {
    return datasets
      .map(dataset => DataProcessor.processComplexData(dataset))
      .filter(result => result.length > 0)
      .sort((a, b) => a.length - b.length)
      .slice(0, 10);
  }
};
`;

    const validatorFile = `
export const DataValidator = {
  create: () => ({
    isValid: (data: unknown[]): boolean => {
      return Array.isArray(data) && data.length > 0;
    }
  })
};
`;
    
    fs.writeFileSync(path.join(sourceDir, 'DataProcessor.ts'), processorFile);
    fs.writeFileSync(path.join(sourceDir, 'DataValidator.ts'), validatorFile);

    // Move files with complex expressions
    const destDir = path.join(testDir, 'src/shared/utils');
    
    let moveSucceeded = false;
    let errorMessage = '';
    
    try {
      await moveFiles([sourceDir], path.dirname(destDir), {
        force: true,
        recursive: true,
        verbose: false
      });
      moveSucceeded = true;
    } catch (error: unknown) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }
    
    // Verify no stack overflow from complex expression parsing
    expect(moveSucceeded).toBe(true);
    expect(errorMessage).not.toContain('Maximum call stack');
    expect(errorMessage).not.toContain('stack overflow');
    
    // Verify files moved successfully (directory move preserves structure)
    const movedProcessorFile = path.join(destDir, 'DataProcessor.ts');
    expect(fs.existsSync(movedProcessorFile)).toBe(true);
    
    const processorContent = fs.readFileSync(movedProcessorFile, 'utf8');
    expect(processorContent).toContain("from './DataValidator'");
  });
}); 