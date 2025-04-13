import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { handleFileMove } from '../../src/lib/fileHandler.js';

// Mock specific fs functions
vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      statSync: vi.fn(),
      mkdirSync: vi.fn(),
      renameSync: vi.fn(),
      unlinkSync: vi.fn(),
      rmdirSync: vi.fn(),
      readdirSync: vi.fn()
    },
    existsSync: vi.fn(),
    statSync: vi.fn(),
    mkdirSync: vi.fn(),
    renameSync: vi.fn(),
    unlinkSync: vi.fn(),
    rmdirSync: vi.fn(),
    readdirSync: vi.fn()
  };
});

describe('fileHandler', () => {
  const sourcePath = '/path/to/source.ts';
  const destinationDir = '/path/to/destination';
  const destinationFile = '/path/to/destination/source.ts';
  
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementations
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === sourcePath) return true;
      if (path === destinationDir) return true;
      return false;
    });
    
    (fs.statSync as any).mockImplementation((path: string) => ({
      isDirectory: () => path === destinationDir
    }));
  });
  
  it('should move a file to a target directory', async () => {
    const options = { force: true };
    
    const result = await handleFileMove(sourcePath, destinationDir, options);
    
    expect(result).toBe(destinationFile);
    expect(fs.renameSync).toHaveBeenCalledWith(sourcePath, destinationFile);
  });
  
  it('should throw an error if source does not exist', async () => {
    (fs.existsSync as any).mockReturnValue(false);
    const options = {};
    
    await expect(handleFileMove(sourcePath, destinationFile, options))
      .rejects.toThrow('Source file does not exist');
  });
  
  it('should throw an error if destination exists and force is not set', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => true);
    const options = {};
    
    await expect(handleFileMove(sourcePath, destinationFile, options))
      .rejects.toThrow('Destination already exists');
  });
  
  it('should create destination directory if it does not exist', async () => {
    (fs.existsSync as any).mockImplementation((path: string) => {
      if (path === sourcePath) return true;
      return false;
    });
    
    const options = { force: true };
    
    await handleFileMove(sourcePath, destinationFile, options);
    
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(destinationFile), { recursive: true });
  });
}); 