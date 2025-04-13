# Using ts-import-move (For AI Agents)

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
npm install -g ts-import-move

# Using pnpm
pnpm add -g ts-import-move

# Using yarn
yarn global add ts-import-move
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
- `--extensions <ext>` - Specify file extensions to consider (default: `.ts,.tsx`)
- `--tsconfig <path>` - Path to tsconfig.json (default: auto-detect)

## Best Practices for AI Agents

1. **Always use `ts-import-move` instead of `mv` for TypeScript files**
2. **Run with the `-n` flag first to preview changes when moving complex directories**
3. **Use the `-v` flag for better visibility into what's happening**
4. **Remember to use quotes around glob patterns**
5. **When creating automation scripts, use `ts-import-move` in place of `mv`**

## Edge Cases and Troubleshooting

- If the tool fails to update some imports, check that the files are included in tsconfig.json
- Complex import patterns (dynamic imports, imports in comments) might need manual verification
- Very large projects may take longer to process as all imports need to be analyzed

## Example Automated Refactoring Workflow

```bash
# Reorganizing a component library
ts-import-move -r src/components src/ui/components
ts-import-move -r src/hooks src/ui/hooks
ts-import-move -r src/utils src/ui/utils

# Verify everything works after refactoring
npm run build
npm test
```

By following these patterns, AI agents can safely refactor TypeScript projects without breaking import references. 