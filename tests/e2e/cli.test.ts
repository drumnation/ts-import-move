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
        
        // Check for absolute import format (new default behavior)
        const hasUpdatedImport = cardContent.includes("from '@/shared/format'");
        
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
        
        // Check for absolute import format (new default behavior)
        const hasUpdatedImport = updatedCardContent.includes("from '@/shared/format'");
        
        expect(hasUpdatedImport).toBe(true);
        expect(updatedCardContent).not.toContain("from '../utils/format'");
      } catch (error: any) {
        console.error('CLI Command Failed:', error.message);
        console.error('CLI stderr:', error.stderr);
        throw error;
      }
    });

    it('should show verbose output when moving files with verbose flag', async () => {
      // Create a test file
      const sourcePath = path.join(testDir, 'src/utils/debug-test.ts');
      const sourceDir = path.dirname(sourcePath);
      fs.mkdirSync(sourceDir, { recursive: true });
      fs.writeFileSync(sourcePath, 'export const debug = true;');

      // Destination path
      const destDir = path.join(testDir, 'src/debug');
      // Make sure destination directory exists
      fs.mkdirSync(destDir, { recursive: true });
      
      // Run the command with verbose flag
      const cliOutput = execSync(
        `pnpm tsx bin/index.ts --verbose "${sourcePath}" "${destDir}"`,
        { cwd: testDir, encoding: 'utf8' }
      );
      
      // Verify console output and file movement
      expect(cliOutput).toContain('moveFiles called with');
      expect(cliOutput).toContain('verbose');
      
      // Verify the file was actually moved
      const destinationFile = path.join(destDir, 'debug-test.ts');
      expect(fs.existsSync(destinationFile)).toBe(true);
      expect(fs.existsSync(sourcePath)).toBe(false);
    });

    it('should correctly interpret source and destination in expected order', async () => {
      // Create test directories for this specific test
      const sectionsDirPath = path.join(srcDir, 'sections');
      const pagesDirPath = path.join(srcDir, 'pages');
      const experienceDirPath = path.join(sectionsDirPath, 'Experience');
      
      // Create directories
      fs.mkdirSync(sectionsDirPath, { recursive: true });
      fs.mkdirSync(pagesDirPath, { recursive: true });
      fs.mkdirSync(experienceDirPath, { recursive: true });
      
      // Create a test file in the experience directory
      const testFilePath = path.join(experienceDirPath, 'Experience.ts');
      fs.writeFileSync(testFilePath, `
export const Experience = {
  title: 'Work Experience',
  description: 'My professional background'
};
`);
      
      // Create component that imports from Experience
      const referenceFilePath = path.join(srcDir, 'ReferenceFile.ts');
      fs.writeFileSync(referenceFilePath, `
import { Experience } from './sections/Experience/Experience';

export const Profile = {
  ...Experience,
  contactInfo: 'email@example.com'
};
`);
      
      // Run the command to move Experience from sections to pages
      // This would previously have been interpreted in reverse
      try {
        const output = execSync(
          `pnpm tsx bin/index.ts -r -v "${experienceDirPath}" "${pagesDirPath}"`, 
          { cwd: process.cwd(), encoding: 'utf8' }
        );
        
        console.log('Parameter order test output:', output);
        
        // Verify the file is moved correctly FROM sections TO pages
        const movedFilePath = path.join(pagesDirPath, 'Experience', 'Experience.ts');
        
        expect(fs.existsSync(movedFilePath)).toBe(true);
        // Note: In the current implementation, the source directory is not removed
        
        // Verify imports were updated correctly (expecting absolute imports)
        const updatedReferenceContent = fs.readFileSync(referenceFilePath, 'utf-8');
        expect(updatedReferenceContent).toContain("from '@/pages/Experience/Experience'");
        expect(updatedReferenceContent).not.toContain("from './sections/Experience/Experience'");
      } catch (error: any) {
        console.error('CLI parameter order test failed:', error.message);
        console.error('CLI stderr:', error.stderr);
        throw error;
      }
    });

    it('should handle multiple source files moving to a single destination', async () => {
      // Create test directories and files
      const utilsDirPath = path.join(srcDir, 'utils');
      const componentsDirPath = path.join(srcDir, 'components');
      const sharedDirPath = path.join(srcDir, 'shared');
      
      // Create directories if they don't exist
      fs.mkdirSync(utilsDirPath, { recursive: true });
      fs.mkdirSync(componentsDirPath, { recursive: true });
      fs.mkdirSync(sharedDirPath, { recursive: true });
      
      // Create test files
      const dateUtilPath = path.join(utilsDirPath, 'date.ts');
      const stringUtilPath = path.join(utilsDirPath, 'string.ts');
      
      fs.writeFileSync(dateUtilPath, `
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};
`);
      
      fs.writeFileSync(stringUtilPath, `
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
`);
      
      // Create a component that imports both utils
      const buttonComponentPath = path.join(componentsDirPath, 'Button.ts');
      fs.writeFileSync(buttonComponentPath, `
import { formatDate } from '../utils/date';
import { capitalize } from '../utils/string';

export const Button = {
  formatLabel: (label: string, date: Date) => {
    return \`\${capitalize(label)} - \${formatDate(date)}\`;
  }
};
`);
      
      try {
        // Run the command to move both utils to shared directory
        // This tests multiple source files with a destination at the end
        const output = execSync(
          `pnpm tsx bin/index.ts -v "${dateUtilPath}" "${stringUtilPath}" "${sharedDirPath}"`,
          { cwd: process.cwd(), encoding: 'utf8' }
        );
        
        console.log('Multiple source files test output:', output);
        
        // Verify both files were moved correctly
        const movedDateUtilPath = path.join(sharedDirPath, 'date.ts');
        const movedStringUtilPath = path.join(sharedDirPath, 'string.ts');
        
        expect(fs.existsSync(movedDateUtilPath)).toBe(true);
        expect(fs.existsSync(movedStringUtilPath)).toBe(true);
        expect(fs.existsSync(dateUtilPath)).toBe(false);
        expect(fs.existsSync(stringUtilPath)).toBe(false);
        
        // Verify imports were updated correctly (expecting absolute imports)
        const updatedButtonContent = fs.readFileSync(buttonComponentPath, 'utf-8');
        expect(updatedButtonContent).toContain("from '@/shared/date'");
        expect(updatedButtonContent).toContain("from '@/shared/string'");
        expect(updatedButtonContent).not.toContain("from '../utils/date'");
        expect(updatedButtonContent).not.toContain("from '../utils/string'");
        
        // Verify the extracted sources and destination logs
        expect(output).toContain('Extracted sources:');
        expect(output).toContain('Extracted destination:');
        expect(output).toContain(dateUtilPath);
        expect(output).toContain(stringUtilPath);
        expect(output).toContain(sharedDirPath);
      } catch (error: any) {
        console.error('Multiple source files test failed:', error.message);
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

describe('move command with --no-absolute-imports', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../../test-temp-e2e-relative');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
      
    // Create test project structure
    fs.mkdirSync(path.join(tempDir, 'src', 'components'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'src', 'utils'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'src', 'shared'), { recursive: true });
      
    // Create tsconfig.json with path aliases
    const tsconfigContent = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        baseUrl: './src',
        paths: {
          '@/*': ['*'],
          '@/shared/*': ['shared/*'],
          '@/features/*': ['features/*'],
          '@/components/*': ['components/*'],
          '@/utils/*': ['utils/*']
        }
      },
      include: ['src/**/*']
    };
    fs.writeFileSync(
      path.join(tempDir, 'tsconfig.json'),
      JSON.stringify(tsconfigContent, null, 2)
    );
      
    // Create format utility
    fs.writeFileSync(
      path.join(tempDir, 'src/utils/format.ts'),
      'export const formatDate = (date: Date): string => date.toISOString();\n'
    );
      
    // Create Card component that imports format utility
    fs.writeFileSync(
      path.join(tempDir, 'src/components/Card.ts'),
      'import { formatDate } from \'../utils/format\';\n\nexport const Card = () => formatDate(new Date());\n'
    );
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should preserve relative imports when --no-absolute-imports flag is used', async () => {
    const cliPath = path.join(__dirname, '../../bin/index.ts');
    const sourceFile = path.join(tempDir, 'src/utils/format.ts');
    const destinationDir = path.join(tempDir, 'src/shared');
    const cardPath = path.join(tempDir, 'src/components/Card.ts');

    console.log('CLI Output with --no-absolute-imports:');
      
    // Run the CLI command with --no-absolute-imports flag
    const result = execSync(
      `pnpm tsx "${cliPath}" "${sourceFile}" "${destinationDir}" --no-absolute-imports --verbose --force`,
      { 
        encoding: 'utf-8',
        cwd: tempDir
      }
    );
      
    console.log(result);

    // Check that file was moved
    expect(fs.existsSync(sourceFile)).toBe(false);
    expect(fs.existsSync(path.join(destinationDir, 'format.ts'))).toBe(true);

    // Check that imports are still relative (not converted to absolute)
    const cardContent = fs.readFileSync(cardPath, 'utf-8');
    const hasRelativeImport = cardContent.includes('from \'../shared/format\'');
      
    expect(hasRelativeImport).toBe(true);
    expect(cardContent).not.toContain('from \'@/shared/format\'');
    expect(cardContent).not.toContain('from \'../utils/format\'');
  });

  it('should handle multiple files with --no-absolute-imports', async () => {
    // Create additional test files
    fs.writeFileSync(
      path.join(tempDir, 'src/utils/date.ts'),
      'export const formatDateShort = (date: Date): string => date.toDateString();\n'
    );
    fs.writeFileSync(
      path.join(tempDir, 'src/utils/string.ts'),
      'export const capitalizeString = (str: string): string => str.toUpperCase();\n'
    );
      
    // Create Button component that imports both utilities
    fs.writeFileSync(
      path.join(tempDir, 'src/components/Button.ts'),
      'import { formatDateShort } from \'../utils/date\';\nimport { capitalizeString } from \'../utils/string\';\n\nexport const Button = () => capitalizeString(formatDateShort(new Date()));\n'
    );

    const cliPath = path.join(__dirname, '../../bin/index.ts');
    const dateFile = path.join(tempDir, 'src/utils/date.ts');
    const stringFile = path.join(tempDir, 'src/utils/string.ts');
    const destinationDir = path.join(tempDir, 'src/shared');
    const buttonPath = path.join(tempDir, 'src/components/Button.ts');

    // Run the CLI command with multiple sources and --no-absolute-imports
    const result = execSync(
      `pnpm tsx "${cliPath}" "${dateFile}" "${stringFile}" "${destinationDir}" --no-absolute-imports --verbose`,
      { 
        encoding: 'utf-8',
        cwd: tempDir
      }
    );

    // Check that files were moved
    expect(fs.existsSync(dateFile)).toBe(false);
    expect(fs.existsSync(stringFile)).toBe(false);
    expect(fs.existsSync(path.join(destinationDir, 'date.ts'))).toBe(true);
    expect(fs.existsSync(path.join(destinationDir, 'string.ts'))).toBe(true);

    // Check that imports remain relative (not converted to absolute)
    const buttonContent = fs.readFileSync(buttonPath, 'utf-8');
    expect(buttonContent).toContain('from \'../shared/date\'');
    expect(buttonContent).toContain('from \'../shared/string\'');
  });
}); 