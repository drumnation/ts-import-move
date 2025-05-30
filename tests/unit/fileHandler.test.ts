import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import { handleFileMove } from '../../src/lib/fileHandler.js';
import type { MovedFilesMap } from '../../src/types/index.d.js';
import child_process from 'child_process';

// Define expected function types for casting
type ExistsSyncFn = (path: fs.PathLike) => boolean;
type StatSyncFn = (path: fs.PathLike) => fs.Stats;
type MkdirSyncFn = (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => string | undefined;
type RenameSyncFn = (oldPath: fs.PathLike, newPath: fs.PathLike) => void;
type UnlinkSyncFn = (path: fs.PathLike) => void;
type RmdirSyncFn = (path: fs.PathLike) => void;
type ReaddirSyncFn = (path: fs.PathLike) => string[];

// Mock specific fs functions
vi.mock('fs', () => {
  // Helper function to create a mock Stat object
  const createMockStat = (isDirectory: boolean) => ({
    isDirectory: () => isDirectory,
    isFile: () => !isDirectory,
    // Add other fs.Stats properties/methods if needed by tests
  });

  return {
    default: {
      existsSync: vi.fn() as ExistsSyncFn,
      statSync: vi.fn() as StatSyncFn,
      mkdirSync: vi.fn() as MkdirSyncFn,
      renameSync: vi.fn() as RenameSyncFn,
      unlinkSync: vi.fn() as UnlinkSyncFn,
      rmdirSync: vi.fn() as RmdirSyncFn,
      readdirSync: vi.fn() as ReaddirSyncFn,
      createMockStat, // Export helper for potential use in tests
    },
    existsSync: vi.fn() as ExistsSyncFn,
    statSync: vi.fn() as StatSyncFn,
    mkdirSync: vi.fn() as MkdirSyncFn,
    renameSync: vi.fn() as RenameSyncFn,
    unlinkSync: vi.fn() as UnlinkSyncFn,
    rmdirSync: vi.fn() as RmdirSyncFn,
    readdirSync: vi.fn() as ReaddirSyncFn,
    createMockStat, // Export helper
  };
});

describe('fileHandler', () => {
  const sourcePath = '/path/to/source.ts';
  const destinationDir = '/path/to/destination';
  const destinationFile = '/path/to/destination/source.ts';
  
  // Helper to create mock stats
  const mockIsDir = { isDirectory: () => true, isFile: () => false } as fs.Stats;
  const mockIsFile = { isDirectory: () => false, isFile: () => true } as fs.Stats;

  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementations
    (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((path: fs.PathLike) => {
      if (path === sourcePath) return true;
      if (path === destinationDir) return true;
      return false;
    });
    
    (fs.statSync as ReturnType<typeof vi.fn>).mockImplementation((path: fs.PathLike) => {
      return path === destinationDir ? mockIsDir : mockIsFile;
    });
  });
  
  it('should move a file to a target directory', async () => {
    const options = { force: true };
    
    const result = await handleFileMove(sourcePath, destinationDir, options);
    
    expect(result).toBe(destinationFile);
    expect(fs.renameSync).toHaveBeenCalledWith(sourcePath, destinationFile);
  });
  
  it('should throw an error if source does not exist', async () => {
    (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const options = {};
    
    await expect(handleFileMove(sourcePath, destinationFile, options))
      .rejects.toThrow('Source file does not exist');
  });
  
  it('should throw an error if destination exists and force is not set', async () => {
    (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((/* _path: fs.PathLike */) => true);
    const options = {};
    
    await expect(handleFileMove(sourcePath, destinationFile, options))
      .rejects.toThrow('Destination already exists');
  });
  
  it('should create destination directory if it does not exist', async () => {
    (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((path: fs.PathLike) => {
      if (path === sourcePath) return true;
      return false;
    });
    
    const options = { force: true };
    
    await handleFileMove(sourcePath, destinationFile, options);
    
    // Use string manipulation instead of path.dirname
    const calculatedDestinationDir = destinationFile.substring(0, destinationFile.lastIndexOf('/'));
    expect(fs.mkdirSync).toHaveBeenCalledWith(calculatedDestinationDir, { recursive: true });
  });
});

describe('MovedFilesMap', () => {
  it('should map old file paths to new file paths correctly', () => {
    const movedFiles: MovedFilesMap = {
      '/src/old/FileA.ts': '/src/new/FileA.ts',
      '/src/old/FileB.ts': '/src/new/FileB.ts',
    };
    expect(movedFiles['/src/old/FileA.ts']).toBe('/src/new/FileA.ts');
    expect(movedFiles['/src/old/FileB.ts']).toBe('/src/new/FileB.ts');
    expect(Object.keys(movedFiles)).toHaveLength(2);
  });
});

describe('execMoveCommand', () => {
  // Mock child_process using vi.doMock within the describe block
  const execSyncMock = vi.fn();
  vi.doMock('child_process', () => ({
    __esModule: true, // Indicate it's an ES module mock
    ...child_process, // Spread original module properties (like constants)
    execSync: execSyncMock, // Override execSync
  }));

  const src = 'src/old/FileA.ts';
  const dest = 'src/new/FileA.ts';

  beforeEach(async () => {
    // Reset the mock before each test
    execSyncMock.mockReset();
    // Re-import the module under test to get the mocked version
    // This is often necessary when using vi.doMock
    // We don't actually need the return value here, just the side effect of re-importing
    await import('../../src/lib/execMoveCommand.js'); 
  });

  it('should call mv with correct arguments', async () => {
    execSyncMock.mockImplementation(() => {}); // Simulate success
    const { execMoveCommand } = await import('../../src/lib/execMoveCommand.js'); // Import again to ensure mocked version is used
    execMoveCommand(src, dest, { force: true, verbose: true });
    expect(execSyncMock).toHaveBeenCalledWith(
      `mv -f "${src}" "${dest}"`,
      { stdio: 'inherit' }
    );
    expect(execSyncMock).toHaveBeenCalledTimes(1);
  });

  it('should throw and log error if mv fails', async () => {
    const mockError = new Error('Command failed: mv -f "src/old/FileA.ts" "src/new/FileA.ts"');
    // Add properties that execSync error usually has
    Object.assign(mockError, { status: 1, signal: null, output: [null, null, null], pid: 123, stdout: null, stderr: 'mv: rename ...'});
    execSyncMock.mockImplementation(() => { throw mockError; }); // Simulate failure

    const { execMoveCommand } = await import('../../src/lib/execMoveCommand.js'); // Import again
    
    // We need to assert the properties of the error, not just the object itself, 
    // because the dynamic import might return a slightly different error instance.
    expect(() => execMoveCommand(src, dest, { force: true, verbose: true }))
      .toThrowError(expect.objectContaining({ message: mockError.message, status: 1 })); 

    expect(execSyncMock).toHaveBeenCalledTimes(1);
  });
}); 