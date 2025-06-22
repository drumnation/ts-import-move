import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { moveFiles } from '../../src/lib/index.js';
import { tmpdir } from 'os';

describe('Self-Import Preservation Tests', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    
    // Create unique temporary directory for each test
    const testId = Math.random().toString(36).substring(7);
    testDir = path.join(tmpdir(), `ts-import-move-self-import-${testId}`);
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

  it('should preserve relative imports within moved directory (CRITICAL BUG)', async () => {
    // Setup: Create directory with internal imports (the exact ARC-7 failure pattern)
    const sourceDir = path.join(testDir, 'src/components/App');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    // Create App component with internal imports
    fs.writeFileSync(path.join(sourceDir, 'App.tsx'), `
import React from 'react';
import { appLogic } from './App.logic';
import { AppProps } from './App.types';
import './App.styles.css';

export const App: React.FC<AppProps> = (props) => {
  const logic = appLogic(props);
  return <div>{logic.render()}</div>;
};
`);
    
    fs.writeFileSync(path.join(sourceDir, 'App.logic.ts'), `
import { AppProps } from './App.types';

export const appLogic = (props: AppProps) => ({
  render: () => 'App Content'
});
`);
    
    fs.writeFileSync(path.join(sourceDir, 'App.types.ts'), `
export interface AppProps {
  title: string;
}
`);
    
    fs.writeFileSync(path.join(sourceDir, 'App.styles.css'), `
.app { color: blue; }
`);

    // Move the entire directory to a new location
    const destDir = path.join(testDir, 'src/shared/components/3-organisms/App');
    await moveFiles([sourceDir], path.dirname(destDir), {
      force: true,
      verbose: true
    });

    // CRITICAL: Verify internal imports remain relative (not corrupted)
    const movedAppFile = path.join(destDir, 'App.tsx');
    const movedLogicFile = path.join(destDir, 'App.logic.ts');
    
    expect(fs.existsSync(movedAppFile)).toBe(true);
    expect(fs.existsSync(movedLogicFile)).toBe(true);
    
    const appContent = fs.readFileSync(movedAppFile, 'utf8');
    const logicContent = fs.readFileSync(movedLogicFile, 'utf8');
    
    // These imports should remain EXACTLY the same (relative within directory)
    expect(appContent).toContain("from './App.logic'");
    expect(appContent).toContain("from './App.types'");
    expect(appContent).toContain("'./App.styles.css'");
    expect(logicContent).toContain("from './App.types'");
    
    // These imports should NOT be corrupted to absolute or wrong relative paths
    expect(appContent).not.toContain("from '../App/App.logic'");
    expect(appContent).not.toContain("from '../../App/App.logic'");
    expect(appContent).not.toContain("from '../../../App/App.logic'");
    expect(logicContent).not.toContain("from '../App/App.types'");
  });

  it('should preserve nested internal imports in complex directory structures', async () => {
    // Setup: Create complex nested structure with multiple levels of internal imports
    const sourceDir = path.join(testDir, 'src/features/DocumentEditor');
    const componentsDir = path.join(sourceDir, 'components');
    const utilsDir = path.join(sourceDir, 'utils');
    
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.mkdirSync(utilsDir, { recursive: true });
    
    // Create main feature file importing from subdirectories
    fs.writeFileSync(path.join(sourceDir, 'DocumentEditor.tsx'), `
import React from 'react';
import { EditorComponent } from './components/EditorComponent';
import { documentUtils } from './utils/documentUtils';

export const DocumentEditor = () => {
  return <EditorComponent utils={documentUtils} />;
};
`);
    
    // Create component that imports from utils in same feature
    fs.writeFileSync(path.join(componentsDir, 'EditorComponent.tsx'), `
import React from 'react';
import { formatDocument } from '../utils/documentUtils';

export const EditorComponent = ({ utils }: any) => {
  return <div>{formatDocument('test')}</div>;
};
`);
    
    // Create utility that imports from another utility in same feature
    fs.writeFileSync(path.join(utilsDir, 'documentUtils.ts'), `
import { validateDocument } from './documentValidator';

export const documentUtils = {
  format: formatDocument
};

export function formatDocument(content: string): string {
  if (!validateDocument(content)) return '';
  return content.trim();
}
`);
    
    fs.writeFileSync(path.join(utilsDir, 'documentValidator.ts'), `
export function validateDocument(content: string): boolean {
  return content.length > 0;
}
`);

    // Move the entire feature to a new location
    const destDir = path.join(testDir, 'src/shared/features/DocumentEditor');
    await moveFiles([sourceDir], path.dirname(destDir), {
      force: true,
      recursive: true,
      verbose: true
    });

    // Verify all internal imports are preserved correctly
    const movedMainFile = path.join(destDir, 'DocumentEditor.tsx');
    const movedComponentFile = path.join(destDir, 'components/EditorComponent.tsx');
    const movedUtilsFile = path.join(destDir, 'utils/documentUtils.ts');
    
    const mainContent = fs.readFileSync(movedMainFile, 'utf8');
    const componentContent = fs.readFileSync(movedComponentFile, 'utf8');
    const utilsContent = fs.readFileSync(movedUtilsFile, 'utf8');
    
    // Main file: imports from subdirectories should remain relative
    expect(mainContent).toContain("from './components/EditorComponent'");
    expect(mainContent).toContain("from './utils/documentUtils'");
    
    // Component: import from sibling directory should remain relative
    expect(componentContent).toContain("from '../utils/documentUtils'");
    
    // Utils: import from same directory should remain relative
    expect(utilsContent).toContain("from './documentValidator'");
    
    // No corrupted paths
    expect(mainContent).not.toContain("from '../DocumentEditor/components");
    expect(componentContent).not.toContain("from '../../DocumentEditor/utils");
    expect(utilsContent).not.toContain("from '../DocumentEditor/utils");
  });

  it('should handle mixed internal and external imports correctly', async () => {
    // Setup: Create component with both internal and external imports
    const sourceDir = path.join(testDir, 'src/components/Button');
    const sharedDir = path.join(testDir, 'src/shared');
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(sharedDir, { recursive: true });
    
    // Create external dependency
    fs.writeFileSync(path.join(sharedDir, 'theme.ts'), `
export const theme = { primaryColor: 'blue' };
`);
    
    // Create Button with mixed imports
    fs.writeFileSync(path.join(sourceDir, 'Button.tsx'), `
import React from 'react';
import { theme } from '../../shared/theme';  // External import
import { ButtonLogic } from './Button.logic';  // Internal import
import { ButtonProps } from './Button.types';  // Internal import

export const Button: React.FC<ButtonProps> = (props) => {
  const logic = ButtonLogic(props);
  return <button style={{ color: theme.primaryColor }}>{logic.text}</button>;
};
`);
    
    fs.writeFileSync(path.join(sourceDir, 'Button.logic.ts'), `
import { ButtonProps } from './Button.types';  // Internal import

export const ButtonLogic = (props: ButtonProps) => ({
  text: props.children || 'Click me'
});
`);
    
    fs.writeFileSync(path.join(sourceDir, 'Button.types.ts'), `
export interface ButtonProps {
  children?: string;
}
`);

    // Move Button to new location (deeper nesting)
    const destDir = path.join(testDir, 'src/ui/components/atoms/Button');
    await moveFiles([sourceDir], path.dirname(destDir), {
      force: true,
      recursive: true,
      verbose: true
    });

    // Verify mixed import handling
    const movedButtonFile = path.join(destDir, 'Button.tsx');
    const movedLogicFile = path.join(destDir, 'Button.logic.ts');
    
    const buttonContent = fs.readFileSync(movedButtonFile, 'utf8');
    const logicContent = fs.readFileSync(movedLogicFile, 'utf8');
    
    // External import should be updated (more ../ levels)
    expect(buttonContent).toContain("from '../../../../shared/theme'");
    
    // Internal imports should remain relative
    expect(buttonContent).toContain("from './Button.logic'");
    expect(buttonContent).toContain("from './Button.types'");
    expect(logicContent).toContain("from './Button.types'");
    
    // No corrupted internal imports
    expect(buttonContent).not.toContain("from '../Button/Button.logic'");
    expect(logicContent).not.toContain("from '../Button/Button.types'");
  });
}); 