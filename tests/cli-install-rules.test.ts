import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock modules
vi.mock('fs');
vi.mock('path');
vi.mock('os');

// Import the function to test
import { installCursorRules } from '../src/cli-install-rules.js';

describe('install-cursor-rules CLI command', () => {
  // Mock data
  const mockHomeDir = '/mock/home/dir';
  const mockPackageDir = '/mock/package/dir';
  const mockCursorRulesDir = `${mockHomeDir}/.cursor/rules`;
  const mockSimpleRulePath = `${mockPackageDir}/rules/ts-import-move-simple.rules.mdc`;
  const mockAdvancedRulePath = `${mockPackageDir}/rules/ts-import-move-advanced.rules.mdc`;
  const mockTargetSimpleRulePath = `${mockCursorRulesDir}/ts-import-move-simple.rules.mdc`;
  const mockTargetAdvancedRulePath = `${mockCursorRulesDir}/ts-import-move-advanced.rules.mdc`;

  // Mocks for fs methods
  const mockExistsSync = vi.fn();
  const mockMkdirSync = vi.fn();
  const mockCopyFileSync = vi.fn();
  
  // Mock for console methods
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  // Mock for process.exit
  const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup mock implementations
    mockExistsSync.mockImplementation((filepath) => {
      if (filepath === mockSimpleRulePath || filepath === mockAdvancedRulePath) {
        return true; // Source rule files exist
      }
      if (filepath === mockCursorRulesDir) {
        return false; // Cursor rules directory doesn't exist
      }
      return false;
    });
    
    // Assign mocks to the appropriate methods
    vi.spyOn(os, 'homedir').mockReturnValue(mockHomeDir);
    vi.spyOn(path, 'dirname').mockReturnValue(mockPackageDir);
    vi.spyOn(path, 'join').mockImplementation((...args: string[]) => args.join('/'));
    vi.spyOn(fs, 'existsSync').mockImplementation(mockExistsSync);
    vi.spyOn(fs, 'mkdirSync').mockImplementation(mockMkdirSync);
    vi.spyOn(fs, 'copyFileSync').mockImplementation(mockCopyFileSync);
  });

  it('should create the Cursor rules directory if it does not exist', async () => {
    // Call the function directly
    await installCursorRules();
    
    // Verify directory existence was checked
    expect(fs.existsSync).toHaveBeenCalledWith(mockCursorRulesDir);
    
    // Verify directory was created
    expect(fs.mkdirSync).toHaveBeenCalledWith(mockCursorRulesDir, { recursive: true });
  });

  it('should copy the rule files to the Cursor rules directory', async () => {
    // Call the function directly
    await installCursorRules();
    
    // Verify files were copied
    expect(fs.copyFileSync).toHaveBeenCalledWith(mockSimpleRulePath, mockTargetSimpleRulePath);
    expect(fs.copyFileSync).toHaveBeenCalledWith(mockAdvancedRulePath, mockTargetAdvancedRulePath);
  });

  it('should handle error when source files do not exist', async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Override mock to simulate missing source files
    mockExistsSync.mockImplementation((filepath) => {
      return false; // No files exist
    });
    
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