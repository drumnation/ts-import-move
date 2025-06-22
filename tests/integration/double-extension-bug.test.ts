import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { moveFiles } from '../../src/lib/index.js';
import { tmpdir } from 'os';

describe('Double Extension Bug Tests', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    
    // Create unique temporary directory for each test
    const testId = Math.random().toString(36).substring(7);
    testDir = path.join(tmpdir(), `ts-import-move-extension-${testId}`);
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
    
    // Create tsconfig.json
    fs.writeFileSync(path.join(testDir, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
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

  it('should not create double extensions in import paths (CRITICAL BUG)', async () => {
    // Setup: Create the exact scenario that caused stringUtils.ts/strings
    const sourceDir = path.join(testDir, 'src/utils');
    const componentsDir = path.join(testDir, 'src/components');
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });
    
    // Create stringUtils.ts file
    fs.writeFileSync(path.join(sourceDir, 'stringUtils.ts'), `
export const strings = {
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
  lowercase: (str: string) => str.toLowerCase(),
  trim: (str: string) => str.trim()
};

export function formatString(input: string): string {
  return strings.capitalize(strings.trim(input));
}
`);
    
    // Create component that imports from stringUtils
    fs.writeFileSync(path.join(componentsDir, 'TextDisplay.tsx'), `
import React from 'react';
import { strings, formatString } from '../utils/stringUtils';

export const TextDisplay: React.FC<{ text: string }> = ({ text }) => {
  const formattedText = formatString(text);
  const capitalizedText = strings.capitalize(text);
  
  return (
    <div>
      <p>Formatted: {formattedText}</p>
      <p>Capitalized: {capitalizedText}</p>
    </div>
  );
};
`);

    // Move stringUtils.ts to shared directory with rename
    const destDir = path.join(testDir, 'src/shared');
    await moveFiles(
      [path.join(sourceDir, 'stringUtils.ts')],
      path.join(destDir, 'stringHelpers.ts'),
      { force: true }
    );

    // CRITICAL: Verify import paths do NOT have double extensions
    const movedComponent = fs.readFileSync(path.join(componentsDir, 'TextDisplay.tsx'), 'utf8');
    
    // Should be updated to new location and name
    expect(movedComponent).toContain("from '../shared/stringHelpers'");
    
    // Should NOT have double extensions
    expect(movedComponent).not.toContain("stringHelpers.ts/strings");
    expect(movedComponent).not.toContain("stringHelpers.ts.ts");
    expect(movedComponent).not.toContain("stringUtils.ts/strings");
    expect(movedComponent).not.toContain("stringUtils.ts.ts");
    
    // Should NOT have malformed paths
    expect(movedComponent).not.toContain("/stringHelpers.ts");
    expect(movedComponent).not.toContain("\\stringHelpers.ts");
  });

  it('should handle file-to-file moves without extension corruption', async () => {
    // Test moving individual files with different extensions
    const sourceDir = path.join(testDir, 'src/types');
    const utilsDir = path.join(testDir, 'src/utils');
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(utilsDir, { recursive: true });
    
    // Create type definitions
    fs.writeFileSync(path.join(sourceDir, 'UserTypes.ts'), `
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}
`);
    
    // Create utility that imports types
    fs.writeFileSync(path.join(utilsDir, 'userHelpers.ts'), `
import { User, UserPreferences } from '../types/UserTypes';

export const userHelpers = {
  createUser: (data: Partial<User>): User => ({
    id: Math.random().toString(),
    name: '',
    email: '',
    ...data
  }),
  
  getDefaultPreferences: (): UserPreferences => ({
    theme: 'light',
    notifications: true
  })
};
`);

    // Move UserTypes.ts to shared/types/User.ts (rename during move)
    const destFile = path.join(testDir, 'src/shared/types/User.ts');
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    
    await moveFiles(
      [path.join(sourceDir, 'UserTypes.ts')],
      destFile,
      { force: true }
    );

    // Verify import path updated correctly without extension issues
    const helperContent = fs.readFileSync(path.join(utilsDir, 'userHelpers.ts'), 'utf8');
    
    expect(helperContent).toContain("from '../shared/types/User'");
    expect(helperContent).not.toContain("User.ts/User");
    expect(helperContent).not.toContain("User.ts.ts");
    expect(helperContent).not.toContain("UserTypes.ts/");
  });

  it('should handle directory moves without corrupting nested file imports', async () => {
    // Test moving directories containing files with imports
    const sourceDir = path.join(testDir, 'src/features/auth');
    const servicesDir = path.join(sourceDir, 'services');
    const typesDir = path.join(sourceDir, 'types');
    
    fs.mkdirSync(servicesDir, { recursive: true });
    fs.mkdirSync(typesDir, { recursive: true });
    
    // Create auth types
    fs.writeFileSync(path.join(typesDir, 'auth.types.ts'), `
export interface AuthUser {
  id: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
`);
    
    // Create auth service that imports types
    fs.writeFileSync(path.join(servicesDir, 'auth.service.ts'), `
import { AuthUser, LoginCredentials } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    // Mock login
    return {
      id: '123',
      token: 'mock-token'
    };
  },
  
  logout: async (user: AuthUser): Promise<void> => {
    // Mock logout
    console.log('Logged out user:', user.id);
  }
};
`);
    
    // Create main auth module
    fs.writeFileSync(path.join(sourceDir, 'index.ts'), `
export { authService } from './services/auth.service';
export type { AuthUser, LoginCredentials } from './types/auth.types';
`);

    // Move entire auth feature to shared location
    const destDir = path.join(testDir, 'src/shared/auth');
    await moveFiles([sourceDir], path.dirname(destDir), {
      force: true,
      recursive: true
    });

    // Verify all internal imports preserved correctly
    const movedServiceFile = path.join(destDir, 'services/auth.service.ts');
    const movedIndexFile = path.join(destDir, 'index.ts');
    
    const serviceContent = fs.readFileSync(movedServiceFile, 'utf8');
    const indexContent = fs.readFileSync(movedIndexFile, 'utf8');
    
    // Internal imports should remain relative
    expect(serviceContent).toContain("from '../types/auth.types'");
    expect(indexContent).toContain("from './services/auth.service'");
    expect(indexContent).toContain("from './types/auth.types'");
    
    // No extension corruption
    expect(serviceContent).not.toContain("auth.types.ts/");
    expect(indexContent).not.toContain("auth.service.ts/");
    expect(indexContent).not.toContain("auth.types.ts/");
  });

  it('should handle glob pattern moves without extension corruption', async () => {
    // Test moving multiple files using patterns
    const sourceDir = path.join(testDir, 'src/components');
    const buttonsDir = path.join(sourceDir, 'buttons');
    
    fs.mkdirSync(buttonsDir, { recursive: true });
    
    // Create multiple button components
    fs.writeFileSync(path.join(buttonsDir, 'PrimaryButton.tsx'), `
import { ButtonBase } from './ButtonBase';
export const PrimaryButton = () => <ButtonBase variant="primary" />;
`);
    
    fs.writeFileSync(path.join(buttonsDir, 'SecondaryButton.tsx'), `
import { ButtonBase } from './ButtonBase';
export const SecondaryButton = () => <ButtonBase variant="secondary" />;
`);
    
    fs.writeFileSync(path.join(buttonsDir, 'ButtonBase.tsx'), `
export const ButtonBase = ({ variant }: { variant: string }) => (
  <button className={variant}>Button</button>
);
`);

    // Move all button files to UI directory
    const destDir = path.join(testDir, 'src/ui/buttons');
    fs.mkdirSync(destDir, { recursive: true });
    
    // Move all .tsx files
    const buttonFiles = fs.readdirSync(buttonsDir)
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.join(buttonsDir, file));
    
    await moveFiles(buttonFiles, destDir, { force: true });

    // Verify imports updated correctly without extension issues
    const primaryContent = fs.readFileSync(path.join(destDir, 'PrimaryButton.tsx'), 'utf8');
    const secondaryContent = fs.readFileSync(path.join(destDir, 'SecondaryButton.tsx'), 'utf8');
    
    expect(primaryContent).toContain("from './ButtonBase'");
    expect(secondaryContent).toContain("from './ButtonBase'");
    
    // No extension corruption in any file
    expect(primaryContent).not.toContain("ButtonBase.tsx/");
    expect(secondaryContent).not.toContain("ButtonBase.tsx/");
    expect(primaryContent).not.toContain("ButtonBase.tsx.tsx");
    expect(secondaryContent).not.toContain("ButtonBase.tsx.tsx");
  });
}); 