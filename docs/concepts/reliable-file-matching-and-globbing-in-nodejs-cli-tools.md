# This guide addresses critical failures in Node.js CLI tools—like `ts-import-move`—where files disappear or aren't properly located due to inconsistent path resolution, particularly when tools are run from different working directories. It provides actionable strategies for implementing robust path handling to prevent data loss and ensure reliable operation.

## Understanding Path Types in Node.js

There are three main types of paths you'll encounter:

1. **Absolute paths**: Start with `/` (Unix) or drive letter (Windows), representing a complete path from the filesystem root
2. **Relative paths**: Start with `.`, `..`, or a directory/file name, representing a path relative to the current working directory
3. **Glob patterns**: May contain wildcards like `*` or `**`, used for matching multiple files

Each type requires specific handling to ensure consistent behavior across different working directories.

## Best Practices for Path Resolution

### 1. Check if a path is absolute before resolving it

```javascript
const resolveInputPath = (input, cwd) => {
  // Absolute paths should be used as-is
  if (path.isAbsolute(input)) return input;
  
  // For relative paths, resolve against the current working directory
  return path.resolve(cwd, input);
};
```

### 2. Implement a robust path resolution function

```javascript
function safeResolve(inputPath, cwd) {
  if (path.isAbsolute(inputPath)) return inputPath;
  
  // Check if the path exists as-is relative to cwd
  const asGiven = path.join(cwd, inputPath);
  if (fs.existsSync(asGiven)) return asGiven;
  
  // Try with just the basename as a fallback
  const baseName = path.basename(inputPath);
  const baseNamePath = path.join(cwd, baseName);
  if (fs.existsSync(baseNamePath)) return baseNamePath;
  
  // Last resort: standard resolution
  return path.resolve(cwd, inputPath);
}
```

### 3. Always normalize paths before comparison

```javascript
const normalizedA = path.normalize(pathA);
const normalizedB = path.normalize(pathB);
if (normalizedA === normalizedB) {
  // Paths are equivalent
}
```

### 4. Preserve the original command-line arguments

```javascript
// In CLI entry point
const originalArgs = process.argv.slice(2);

// Pass these to your main logic
moveFiles(originalArgs[0], originalArgs[1], options);
```

## Cross-Platform Path Handling

For tools that need to work on both Windows and Unix-like systems:

### 1. Use the `upath` library for consistent path handling

```javascript
const upath = require('upath');

// Always produces forward slashes, even on Windows
const normalized = upath.normalize(somePath);
```

### 2. Watch out for path separator differences

```javascript
// Convert Windows backslashes to forward slashes
const normalizeSeparators = (p) => p.replace(/\\/g, '/');
```

## Debugging and Logging for Path Operations

### 1. Log resolved paths for debugging

```javascript
if (options.verbose) {
  console.log(`Original input: ${input}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Resolved path: ${resolvedPath}`);
  console.log(`File exists: ${fs.existsSync(resolvedPath)}`);
}
```

### 2. Always validate file existence before operations

```javascript
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source path does not exist: ${sourcePath}`);
  process.exit(1);
}
```

### 3. Check permissions before file operations

```javascript
try {
  fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  console.error(`Error: No permission to access ${filePath}`);
  process.exit(1);
}
```

## Testing Strategy for Path Resolution

### 1. Create tests that run the CLI from different directories

```javascript
it('should move files when run from a subdirectory', () => {
  // Change to a subdirectory
  const originalDir = process.cwd();
  process.chdir('./test/fixtures/subdir');
  
  // Run the command with relative paths
  const result = execSync('../../bin/cli.js ../file.txt ../destination/');
  
  // Check the result
  expect(fs.existsSync('../destination/file.txt')).toBe(true);
  expect(fs.existsSync('../file.txt')).toBe(false);
  
  // Restore the original directory
  process.chdir(originalDir);
});
```

### 2. Test with various path formats

- Absolute paths
- Relative paths from the project root
- Relative paths from a subdirectory
- Paths with `./` and `../` components
- Paths with glob patterns

## Comprehensive E2E Testing Strategy

While the unit testing strategies above are valuable, ensuring the long-term stability of path-dependent CLI tools like `ts-import-move` requires a dedicated and comprehensive End-to-End (E2E) testing strategy. This approach validates the built CLI binary as a whole, simulating real-world usage and preventing regressions that might be missed by more isolated tests.

**Goal:** Create a suite of E2E tests that systematically cover all identified edge cases and common pitfalls related to path resolution and file handling.

**Methodology:**

1. **Use `child_process`:** Employ Node.js's `child_process.execSync` or `spawnSync` to execute the *built* CLI binary (e.g., `node dist/cli.js ...` or the globally linked binary name) from within your test files.
2. **Simulate Environments:** Programmatically create temporary directory structures (`test/fixtures/`) for each test case. Use `process.chdir()` to change the current working directory within tests to simulate running the CLI from various locations (project root, subdirectories, unrelated directories).
3. **Diverse Path Inputs:** Feed the CLI various combinations of path arguments:
    - Absolute source and destination paths.
    - Relative source and destination paths (from different `cwd`s).
    - Mixed absolute and relative paths.
    - Paths including `.` and `..`.
    - Glob patterns for sources.
    - Paths targeting files vs. directories.
    - Paths on different simulated drives (if testing cross-platform concerns rigorously).
4. **Assert File System State:** After executing the CLI command, use `fs` methods (`existsSync`, `statSync`, `readdirSync`) to rigorously assert the final state of the file system. Verify:
    - Source files/directories were moved/renamed correctly.
    - Original source files/directories no longer exist at the old location.
    - Destination directory contains the expected files/directories.
    - No unexpected files were created or deleted.
5. **Cover Known Pitfalls:** Design specific tests based on the 'Common Pitfalls' section:
    - Test cases ensuring absolute paths are never re-resolved.
    - Test cases confirming behavior when run from deep subdirectories.
    - Tests validating error handling for non-existent paths or permission issues.
    - (If applicable) Tests confirming consistent path separator handling.
6. **Organize Tests:** Structure your E2E tests clearly, perhaps in a dedicated `tests/e2e/` directory, with descriptive filenames for each scenario (e.g., `cli-subdir-relative-move.test.ts`, `cli-absolute-paths.test.ts`).

By implementing these comprehensive E2E tests, you build a strong safety net that directly validates the user-facing behavior of the CLI across the diverse and often tricky scenarios involving path resolution, significantly increasing confidence and preventing future regressions.

## Implementing the Solution in CLI Architecture

### 1. Separate CLI argument parsing from path resolution

```javascript
// In CLI layer
const { sources, destination } = parseArguments(process.argv.slice(2));

// Pass the raw arguments to the main logic
moveFiles(sources, destination, options);

// In the implementation layer, handle path resolution
function moveFiles(sources, destination, options) {
  const cwd = process.cwd();
  const resolvedSources = sources.map(src => resolveInputPath(src, cwd));
  const resolvedDest = resolveInputPath(destination, cwd);
  
  // Proceed with the operation
  // ...
}
```

### 2. Use a logger to track path resolution

```javascript
const logger = options.verbose
  ? console.log
  : () => {};
  
logger(`CWD: ${process.cwd()}`);
logger(`Resolving source: ${source} -> ${resolvedSource}`);
logger(`Resolving destination: ${destination} -> ${resolvedDest}`);
```

## Example: Complete Path Resolution Implementation

```javascript
const fs = require('fs');
const path = require('path');

function moveFiles(sources, destination, options = {}) {
  const initialCwd = process.cwd();
  const logger = options.verbose ? console.log : () => {};
  
  // Resolve paths correctly based on whether they're absolute or relative
  const resolvedSources = sources.map(src => 
    path.isAbsolute(src) ? src : path.resolve(initialCwd, src)
  );
  const resolvedDestination = path.isAbsolute(destination) 
    ? destination 
    : path.resolve(initialCwd, destination);
  
  logger(`Current working directory: ${initialCwd}`);
  logger(`Resolved sources: ${JSON.stringify(resolvedSources)}`);
  logger(`Resolved destination: ${resolvedDestination}`);
  
  // Validate the destination
  if (!fs.existsSync(resolvedDestination)) {
    if (options.createDestination) {
      fs.mkdirSync(resolvedDestination, { recursive: true });
      logger(`Created destination directory: ${resolvedDestination}`);
    } else {
      throw new Error(`Destination does not exist: ${resolvedDestination}`);
    }
  }
  
  // Process each resolved source
  for (const resolvedSource of resolvedSources) {
    if (fs.existsSync(resolvedSource)) {
      const stats = fs.statSync(resolvedSource);
      const basename = path.basename(resolvedSource);
      const targetPath = path.join(resolvedDestination, basename);
      
      logger(`Moving: ${resolvedSource} -> ${targetPath}`);
      
      // Ensure we don't lose data
      if (fs.existsSync(targetPath) && !options.force) {
        throw new Error(`Target already exists: ${targetPath}`);
      }
      
      // Perform the move operation safely
      fs.renameSync(resolvedSource, targetPath);
      logger(`Successfully moved: ${basename}`);
    } else {
      logger(`Source does not exist: ${resolvedSource}`);
      throw new Error(`Source path not found: ${resolvedSource}`);
    }
  }
  
  return {
    success: true,
    movedFiles: resolvedSources.map(src => path.basename(src))
  };
}
```

## Common Pitfalls to Avoid

1. **Double path resolution**: Never resolve an already resolved path again
2. **Ignoring absolute paths**: Always check `path.isAbsolute()` before resolving
3. **Losing the working directory context**: Store `process.cwd()` at the beginning of your operation
4. **Silent failures**: Always provide clear error messages when paths aren't found
5. **Inconsistent path separators**: Use `path.normalize()` or `upath` to handle separators consistently

## Conclusion

Robust path resolution is essential for CLI tools that manipulate files. By implementing the patterns and practices in this guide, you can ensure that your tools work correctly regardless of:

- The current working directory
- The format of paths provided by users
- The operating system where the tool runs

This prevents the frustrating experience of lost files and silent failures that can occur with naive path resolution approaches.
