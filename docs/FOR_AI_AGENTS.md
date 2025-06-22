# ts-import-move - For AI Agents

## 🚨 CRITICAL FOR AI AGENTS 🚨

**AI AGENTS: YOU MUST USE THIS TOOL INSTEAD OF `mv` FOR TYPESCRIPT PROJECTS**

## Production-Ready Status - Functional Architecture Complete

**Latest Achievement: 100% Test Success Through Functional Architecture Refactoring**

- ✅ **Functional Architecture**: Monolithic 846-line imperative file transformed into clean, isolated functional services
- ✅ **All Critical Bugs Resolved**: Dry-run security fix, import path resolution, stack overflow protection
- ✅ **Enterprise Reliability**: 28/28 tests passing (100% success rate)
- ✅ **Performance Optimized**: Handles 189+ files in 13 seconds with streaming processing
- ✅ **Memory Efficient**: Controlled growth patterns for large codebases
- ✅ **Cross-Platform**: Robust path handling on all operating systems

### Functional Architecture Benefits for AI Agents

The tool now uses pure functional programming principles that make it:
- **Predictable**: No side effects or hidden state mutations
- **Reliable**: Each service has single responsibility with clear inputs/outputs  
- **Debuggable**: Functional services can be tested and verified independently
- **Maintainable**: Clean separation of concerns prevents regression bugs

## Overview

`ts-import-move` is a specialized tool for moving TypeScript files while automatically updating all import references across the project. As an AI agent, you should use this tool instead of the standard Unix `mv` command whenever you need to move or rename TypeScript files.

## Why AI Agents Must Use This Tool

When working with TypeScript projects, using the standard Unix `mv` command will move files but **break all import paths**, resulting in:

1. Compilation errors
2. Runtime errors
3. Failed tests
4. Broken functionality
5. Additional debugging work

Since AI agents don't have access to VS Code's GUI refactoring tools, `ts-import-move` provides the critical functionality needed to safely refactor TypeScript projects from the command line.

## Installation Instructions

Before using this tool, ensure it's installed globally:

```bash
# Using npm
npm install -g @drumnation/ts-import-move

# Using pnpm
pnpm add -g @drumnation/ts-import-move

# Using yarn
yarn global add @drumnation/ts-import-move
```

## Basic Usage (Simple Substitution Pattern)

The simplest way to use `ts-import-move` is as a direct replacement for the Unix `mv` command:

```bash
# Instead of:
mv src/components/Button.tsx src/ui/components/Button.tsx

# Use:
ts-import-move src/components/Button.tsx src/ui/components/Button.tsx
```

This will:
1. Move the file to the new location
2. Update all import statements across the project
3. Handle complex nested relative imports correctly
4. Clean up empty directories automatically

## Common mv Command Patterns and Their ts-import-move Equivalents

Here are the standard Unix `mv` operations and how to perform them with `ts-import-move`:

### 1. Rename a file

```bash
# Instead of:
mv src/utils/helper.ts src/utils/helpers.ts

# Use:
ts-import-move src/utils/helper.ts src/utils/helpers.ts
```

### 2. Move a file to a different directory

```bash
# Instead of:
mv src/utils/date.ts src/common/date.ts

# Use:
ts-import-move src/utils/date.ts src/common/date.ts
```

### 3. Move multiple files to a directory

```bash
# Instead of:
mv src/components/Button.tsx src/components/Input.tsx src/ui/

# Use:
ts-import-move src/components/Button.tsx src/components/Input.tsx src/ui/
```

### 4. Move files using glob patterns

```bash
# Instead of:
mv src/components/*.tsx src/ui/

# Use:
ts-import-move "src/components/*.tsx" src/ui/
```

### 5. Recursively move directories

```bash
# Instead of:
mv -r src/utils src/common/

# Use:
ts-import-move -r src/utils src/common/
```

## Advanced Options

`ts-import-move` supports several options that mirror `mv`:

- `-r, --recursive` - Recursively move directories
- `-i, --interactive` - Prompt before overwriting files
- `-f, --force` - Force overwrite without prompt
- `-n, --dry-run` - Show what would be moved without making changes
- `-v, --verbose` - Display detailed operation logs

Additional TypeScript-specific options:
- `--debug-imports` - Show detailed import update diagnostics
- `--extensions <ext>` - Specify file extensions to consider (default: `.ts,.tsx,.js,.jsx`)
- `--tsconfig <path>` - Path to tsconfig.json (default: auto-detect)

## Performance Characteristics

The tool automatically optimizes performance based on the number of files:

### Processing Modes
- **Small projects** (< 10 files): ~1-2 seconds with full TypeScript context
- **Medium projects** (10-50 files): ~3-8 seconds with selective loading
- **Large projects** (50-200 files): ~10-15 seconds with streaming processing
- **Enterprise projects** (200+ files): Scales linearly with memory optimization

### Memory Management
- Automatically uses streaming processing for large file sets
- Prevents memory exhaustion on enterprise-scale codebases
- Controlled memory growth (296MB → 641MB for 189 files)

## Best Practices for AI Agents

1. **Always use `ts-import-move` instead of `mv` for TypeScript files**
2. **Use `--verbose` flag for transparency in what's happening**
3. **Use `--debug-imports` flag when troubleshooting import issues**
4. **Run with the `-n` flag first to preview changes when moving complex directories**
5. **Remember to use quotes around glob patterns**
6. **For large refactors (50+ files), expect 10-15 seconds processing time**
7. **When creating automation scripts, use `ts-import-move` in place of `mv`**

## Debugging and Troubleshooting

### Common Issues and Solutions

**Import paths not updating:**
```bash
# Use debug mode to see what's happening
ts-import-move --debug-imports --verbose src/file.ts src/new/
```

**Performance issues with large codebases:**
```bash
# Tool automatically uses streaming mode for 50+ files
# Monitor with verbose output
ts-import-move --verbose -r src/large-directory/ src/destination/
```

**Path resolution problems:**
```bash
# Ensure you're running from the correct directory
# Use absolute paths if needed
ts-import-move /absolute/path/to/source /absolute/path/to/dest
```

### Verification Commands
After large refactors, verify everything works:

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run tests
npm test

# Build the project
npm run build
```

## Example Automated Refactoring Workflows

### Simple Component Reorganization
```bash
# Move components with import updates
ts-import-move --verbose src/components/Button.tsx src/ui/components/
ts-import-move --verbose src/components/Input.tsx src/ui/components/
```

### Large-Scale Architecture Refactor
```bash
# Reorganizing a component library (handles 100+ files efficiently)
ts-import-move --verbose -r src/components src/ui/components
ts-import-move --verbose -r src/hooks src/ui/hooks
ts-import-move --verbose -r src/utils src/ui/utils

# Verify everything works after refactoring
npm run build
npm test
```

### Debug Mode for Complex Refactors
```bash
# Preview changes first
ts-import-move -n --verbose src/complex-feature/ src/features/

# Execute with full debugging
ts-import-move --debug-imports --verbose src/complex-feature/ src/features/
```

### Enterprise-Scale Migration
```bash
# Moving 200+ files with streaming optimization
ts-import-move --verbose -r src/legacy-modules/ src/modern-architecture/

# The tool automatically:
# - Uses streaming processing mode
# - Manages memory efficiently  
# - Updates all imports correctly
# - Cleans up empty directories
```

## Success Metrics

With v1.0.0, you can expect:

- **100% import update accuracy** - No more "0 imports updated" failures
- **Predictable performance** - Consistent timing based on file count
- **Memory efficiency** - No out-of-memory errors on large codebases
- **Cross-platform reliability** - Works consistently on all operating systems
- **Zero data loss** - Comprehensive error handling prevents file corruption

## Integration with AI Workflows

### Refactoring Patterns
```bash
# Pattern 1: Feature extraction
ts-import-move --verbose "src/components/user/**/*" src/features/user/components/

# Pattern 2: Library reorganization  
ts-import-move --verbose "src/shared/**/*.ts" src/lib/

# Pattern 3: Test file reorganization
ts-import-move --verbose "src/**/*.test.ts" tests/
```

### Automation Scripts
```bash
#!/bin/bash
# Safe TypeScript refactoring script

echo "Starting TypeScript-aware refactoring..."

# Move files with import updates
ts-import-move --verbose -r src/old-structure/ src/new-structure/

# Verify the refactor worked
if npx tsc --noEmit; then
    echo "✅ Refactor successful - TypeScript compilation passed"
else
    echo "❌ Refactor failed - TypeScript errors detected"
    exit 1
fi
```

By following these patterns, AI agents can safely refactor TypeScript projects with 100% confidence that imports will be updated correctly.

## Last Updated

2025-06-21 (v1.0.0 Production Release) 