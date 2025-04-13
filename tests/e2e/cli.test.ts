import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('CLI End-to-End Test', () => {
  const testDir = path.join(process.cwd(), 'test-temp-e2e');
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
    
    // Create utils/format.ts
    fs.writeFileSync(path.join(utilsDir, 'format.ts'), `
/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a date as a string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
`);

    // Create component that imports from utils
    fs.writeFileSync(path.join(componentsDir, 'Card.ts'), `
import { formatCurrency, formatDate } from '../utils/format';

interface CardProps {
  title: string;
  price: number;
  date: Date;
}

export function Card({ title, price, date }: CardProps) {
  return {
    title,
    formattedPrice: formatCurrency(price),
    formattedDate: formatDate(date)
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
  
  it('should move a file and update imports via CLI', () => {
    // Run the CLI command (with force flag to overwrite if needed)
    const cmd = `pnpm tsx bin/index.ts --verbose -f ${path.join(utilsDir, 'format.ts')} ${sharedDir}`;
    
    try {
      const output = execSync(cmd, { 
        encoding: 'utf-8',
        cwd: process.cwd() 
      });
      
      console.log('CLI Output:', output);
      
      // Verify the file was moved
      expect(fs.existsSync(path.join(sharedDir, 'format.ts'))).toBe(true);
      expect(fs.existsSync(path.join(utilsDir, 'format.ts'))).toBe(false);
      
      // Read the component file to verify imports were updated
      const cardContent = fs.readFileSync(path.join(componentsDir, 'Card.ts'), 'utf-8');
      
      // Check imports with either format (with or without .ts extension)
      const hasUpdatedImport = cardContent.includes("from '../shared/format'") || 
                               cardContent.includes("from '../shared/format.ts'");
      
      expect(hasUpdatedImport).toBe(true);
      expect(cardContent).not.toContain("from '../utils/format'");
    } catch (error: any) {
      console.error('CLI Command Failed:', error.message);
      console.error('CLI stderr:', error.stderr);
      throw error;
    }
  });
}); 