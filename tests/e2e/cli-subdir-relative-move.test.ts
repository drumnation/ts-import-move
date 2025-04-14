import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('CLI E2E: move from subdirectory with relative paths', () => {
  const testRoot = path.join(process.cwd(), 'test-e2e-cli');
  const subdir = path.join(testRoot, 'src/components');
  const destDir = path.join(subdir, 'Accordion');
  const fileName = 'Accordion.tsx';
  const filePath = path.join(subdir, fileName);
  const movedFilePath = path.join(destDir, fileName);
  let originalCwd: string;

  beforeAll(() => {
    originalCwd = process.cwd();
    fs.mkdirSync(subdir, { recursive: true });
    fs.writeFileSync(filePath, '// test');
  });

  afterAll(() => {
    process.chdir(originalCwd);
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  it('should move file using built CLI from subdir with relative paths', () => {
    // Build CLI before running this test (ensure dist/index.js exists)
    const cliPath = path.relative(subdir, path.join(originalCwd, 'dist/index.js'));
    process.chdir(subdir);
    execSync(`node ${cliPath} ${fileName} Accordion/ --force --verbose`, { stdio: 'inherit' });
    expect(fs.existsSync(movedFilePath)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(false);
  });
}); 