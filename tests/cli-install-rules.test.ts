import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

// Mock modules
vi.mock('fs');
vi.mock('path');
vi.mock('os');
vi.mock('readline');

// Import the function to test
import { installCursorRules } from '@/cli-install-rules.js';

describe('install-cursor-rules CLI command', () => {
  // Mock data
  const mockHomeDir = '/mock/home/dir';
  const mockProjectRoot = '/mock/project/root';
  const mockPackageDir = '/mock/package/dir';
  const mockCursorRulesDir = `${mockProjectRoot}/.cursor/rules`; // Default to local install
  const mockSimpleRulePath = `${mockPackageDir}/rules/ts-import-move-simple.rules.mdc`;
  const mockAdvancedRulePath = `${mockPackageDir}/rules/ts-import-move-advanced.rules.mdc`;
  const mockTargetSimpleRulePath = `${mockCursorRulesDir}/ts-import-move-simple.rules.mdc`;
  const mockTargetAdvancedRulePath = `${mockCursorRulesDir}/ts-import-move-advanced.rules.mdc`;

  // Mocks for fs methods
  const mockExistsSync = vi.fn();
  const mockMkdirSync = vi.fn();
  const mockCopyFileSync = vi.fn();
  const mockReadFileSync = vi.fn().mockReturnValue('{}');
  const mockWriteFileSync = vi.fn();
  
  // Mock for console methods
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  // Mock for process.exit
  const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  
  // Mock for process.cwd
  vi.spyOn(process, 'cwd').mockReturnValue(mockProjectRoot);
  
  // Mock readline interface
  const mockReadlineInterface = {
    question: vi.fn((question, callback) => callback('1')), // default to option 1
    close: vi.fn()
  };
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup mock implementations
    mockExistsSync.mockImplementation((filepath: string) => {
      if (filepath === mockSimpleRulePath || filepath === mockAdvancedRulePath) {
        return true; // Source rule files exist
      }
      if (filepath === mockCursorRulesDir) {
        return false; // Cursor rules directory doesn't exist initially
      }
      if (filepath === `${mockProjectRoot}/package.json`) {
        return true; // package.json exists in project root
      }
      return false;
    });
    
    // Setup readline mock
    vi.spyOn(readline, 'createInterface').mockReturnValue(mockReadlineInterface as unknown as readline.Interface);
    
    // Assign mocks to the appropriate methods
    vi.spyOn(os, 'homedir').mockReturnValue(mockHomeDir);
    vi.spyOn(path, 'dirname').mockReturnValue(mockPackageDir);
    vi.spyOn(path, 'join').mockImplementation((...args: string[]) => args.join('/'));
    vi.spyOn(path, 'parse').mockImplementation(() => ({ root: '/' } as path.ParsedPath));
    vi.spyOn(fs, 'existsSync').mockImplementation(mockExistsSync);
    vi.spyOn(fs, 'mkdirSync').mockImplementation(mockMkdirSync);
    vi.spyOn(fs, 'copyFileSync').mockImplementation(mockCopyFileSync);
    vi.spyOn(fs, 'readFileSync').mockImplementation(mockReadFileSync);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(mockWriteFileSync);
  });

  it('should create the Cursor rules directory if it does not exist', async () => {
    // Call the function directly
    await installCursorRules();
    
    // Verify project root was detected
    expect(process.cwd).toHaveBeenCalled();
    
    // Verify directory existence was checked
    expect(fs.existsSync).toHaveBeenCalledWith(mockCursorRulesDir);
    
    // Verify directory was created
    expect(fs.mkdirSync).toHaveBeenCalledWith(mockCursorRulesDir, { recursive: true });
  });

  it('should copy the rule files to the Cursor rules directory', async () => {
    // Call the function directly
    await installCursorRules();
    
    // Verify readline was used for prompting
    expect(readline.createInterface).toHaveBeenCalled();
    expect(mockReadlineInterface.question).toHaveBeenCalled();
    
    // Verify files were copied (simple rule by default for option 1)
    expect(fs.copyFileSync).toHaveBeenCalledWith(mockSimpleRulePath, mockTargetSimpleRulePath);
    
    // Advanced rule should not be copied with option 1
    expect(fs.copyFileSync).not.toHaveBeenCalledWith(mockAdvancedRulePath, mockTargetAdvancedRulePath);
  });

  it('should handle error when source files do not exist', async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Override mock to simulate missing source files
    mockExistsSync.mockImplementation(() => false); // No files exist
    
    // Call the function directly
    await installCursorRules();
    
    // Verify error was logged and process.exit was called
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should display success message after installation', async () => {
    // Call the function directly
    await installCursorRules();
    
    // Verify success message was logged
    expect(consoleLogSpy.mock.calls.some(call => 
      call.some(arg => typeof arg === 'string' && arg.includes('Successfully installed'))
    )).toBe(true);
  });
}); 