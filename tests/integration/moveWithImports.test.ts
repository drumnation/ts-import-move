import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { moveFiles } from '@/lib/index.js';

describe('moveFiles integration test', () => {
  const testDir = path.join(process.cwd(), 'test-temp-integration');
  const srcDir = path.join(testDir, 'src');
  const utilsDir = path.join(srcDir, 'utils');
  const componentsDir = path.join(srcDir, 'components');
  const sharedDir = path.join(srcDir, 'shared');
  
  // Set up test files
  beforeAll(() => {
    // Create test directory structure
    fs.mkdirSync(utilsDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.mkdirSync(sharedDir, { recursive: true });
    
    // Create utils/helpers.ts
    fs.writeFileSync(path.join(utilsDir, 'helpers.ts'), `
/**
 * Formats a string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\\w\\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
`);

    // Create component that imports from utils
    fs.writeFileSync(path.join(componentsDir, 'Button.ts'), `
import { toTitleCase, generateId } from '../utils/helpers';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  const buttonId = generateId();
  
  return {
    id: buttonId,
    label: toTitleCase(label),
    handleClick: onClick
  };
}
`);

    // Create tsconfig.json
    fs.writeFileSync(path.join(testDir, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}`);
  });
  
  // Clean up after tests
  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });
  
  it('should move a file and update imports', async () => {
    // Move the helpers.ts file to shared directory
    await moveFiles(
      [path.join(utilsDir, 'helpers.ts')],
      sharedDir,
      { force: true, verbose: false }
    );
    
    // Verify the file was moved
    expect(fs.existsSync(path.join(sharedDir, 'helpers.ts'))).toBe(true);
    expect(fs.existsSync(path.join(utilsDir, 'helpers.ts'))).toBe(false);
    
    // Read the component file to verify imports were updated
    const buttonContent = fs.readFileSync(path.join(componentsDir, 'Button.ts'), 'utf-8');
    expect(buttonContent).toContain("import { toTitleCase, generateId } from '@/shared/helpers'");
    expect(buttonContent).not.toContain("import { toTitleCase, generateId } from '../utils/helpers'");
  });
}); 