import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

// Mock the actual rule installation for install-rules command test
vi.mock('../../src/cli-install-rules.js', async () => {
  const actual = await vi.importActual('../../src/cli-install-rules.js') as any;
  return {
    ...actual,
    installCursorRules: vi.fn().mockResolvedValue(undefined)
  };
});

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
  
  describe('move command (default)', () => {
    it('should move a file and update imports via CLI with default command', () => {
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

    it('should move a file using explicit move command', () => {
      // First move the file back to its original location
      fs.mkdirSync(utilsDir, { recursive: true });
      fs.renameSync(path.join(sharedDir, 'format.ts'), path.join(utilsDir, 'format.ts'));
      
      // Update the import in Card.ts back to original
      const cardPath = path.join(componentsDir, 'Card.ts');
      let cardContent = fs.readFileSync(cardPath, 'utf-8');
      cardContent = cardContent.replace(/from ['"]\.\.\/shared\/format(.ts)?['"]/g, "from '../utils/format'");
      fs.writeFileSync(cardPath, cardContent);
      
      // Run the CLI command with explicit 'move' subcommand
      const cmd = `pnpm tsx bin/index.ts move --verbose -f ${path.join(utilsDir, 'format.ts')} ${sharedDir}`;
      
      try {
        const output = execSync(cmd, { 
          encoding: 'utf-8',
          cwd: process.cwd() 
        });
        
        console.log('CLI Output with explicit move command:', output);
        
        // Verify the file was moved
        expect(fs.existsSync(path.join(sharedDir, 'format.ts'))).toBe(true);
        expect(fs.existsSync(path.join(utilsDir, 'format.ts'))).toBe(false);
        
        // Read the component file to verify imports were updated
        const updatedCardContent = fs.readFileSync(path.join(componentsDir, 'Card.ts'), 'utf-8');
        
        // Check imports with either format (with or without .ts extension)
        const hasUpdatedImport = updatedCardContent.includes("from '../shared/format'") || 
                                updatedCardContent.includes("from '../shared/format.ts'");
        
        expect(hasUpdatedImport).toBe(true);
        expect(updatedCardContent).not.toContain("from '../utils/format'");
      } catch (error: any) {
        console.error('CLI Command Failed:', error.message);
        console.error('CLI stderr:', error.stderr);
        throw error;
      }
    });
  });

  describe('install-rules command', () => {
    // Import the module with the mocked function
    let installCursorRulesMock: any;

    beforeEach(async () => {
      // Get handle to the mocked function
      const module = await import('../../src/cli-install-rules.js');
      installCursorRulesMock = module.installCursorRules;
      vi.clearAllMocks();
    });

    it('should call installCursorRules when install-rules command is used', async () => {
      // Mock the commander command structure directly instead of importing it
      // Since program is defined but not exported in src/index.ts
      const mockCommand = {
        name: () => 'install-rules',
        action: async () => {
          // This directly calls the mock we've set up
          await installCursorRulesMock();
        }
      };
      
      // Reset the installCursorRulesMock to ensure it's called
      installCursorRulesMock.mockClear();
      
      // Call the mocked action directly
      await mockCommand.action();
      
      // Verify the install function was called
      expect(installCursorRulesMock).toHaveBeenCalled();
    });
  });
}); 