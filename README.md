# ts-import-move

Safely move TypeScript files/folders and update imports automatically. This CLI tool is designed to emulate the versatility of the Unix `mv` command, tailored specifically for TypeScript projects.

## Features

- **TypeScript-Aware** - Uses `ts-morph` to handle file moves while ensuring all imports are updated
- **Multiple Files** - Move multiple files at once with glob pattern support
- **Interactive Mode** - Prompt before overwriting files with `-i` flag
- **Dry Run** - Preview changes without modifying files with `-n` flag
- **Cross-Platform** - Works on any OS where Node.js runs

## Installation

```bash
# Install globally
npm install -g ts-import-move

# Or with pnpm
pnpm add -g ts-import-move
```

## Usage

```bash
ts-import-move [options] <sources...> <destination>
```

### Examples

Move a single file:

```bash
ts-import-move src/utils/helpers.ts src/shared/helpers.ts
```

Move multiple files to a directory:

```bash
ts-import-move src/components/Button.tsx src/components/Input.tsx src/ui/
```

Move with wildcard patterns:

```bash
ts-import-move "src/components/*.tsx" src/ui/
```

Preview changes without moving files:

```bash
ts-import-move -n src/old/ src/new/
```

### Options

- `-r, --recursive` - Recursively move directories
- `-i, --interactive` - Prompt before overwriting files
- `-f, --force` - Force overwrite without prompt
- `-n, --dry-run` - Show what would be moved without making changes
- `-v, --verbose` - Display detailed operation logs
- `--extensions <ext>` - Specify file extensions to consider (default: `.ts,.tsx`)
- `--tsconfig <path>` - Path to tsconfig.json (default: auto-detect)

## For AI Agents

This tool is designed to be easily used by AI agents for programmatically reorganizing TypeScript projects:

### Agent Integration Examples

Reorganizing components in a React project:

```bash
ts-import-move -f "src/components/*.tsx" src/ui/components/
```

Moving multiple utility files:

```bash
ts-import-move -f --verbose src/utils/format.ts src/utils/validation.ts src/shared/
```

Moving an entire directory with recursive flag:

```bash
ts-import-move -f -r src/services/ src/api/services/
```

Moving files based on a pattern match:

```bash
ts-import-move -f "src/components/forms/**/*.tsx" src/features/forms/
```

Dry run to preview changes without applying them:

```bash
ts-import-move -n "src/hooks/*.ts" src/common/hooks/
```

The tool will automatically:

1. Move the specified files/directories to the new location
2. Update all import statements across the project to reflect the new paths
3. Preserve any comments and formatting in the updated files

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/ts-import-move.git
cd ts-import-move

# Install dependencies
pnpm install

# Run in development mode
pnpm dev -- src/file.ts src/newlocation/

# Run tests
pnpm test
```

## How It Works

1. CLI arguments are parsed using `commander`
2. Source files are resolved using `fast-glob` (including wildcard patterns)
3. A TypeScript project is initialized using `ts-morph` with the nearest `tsconfig.json`
4. Files are moved to their destinations
5. Import paths are automatically updated using the TypeScript AST
6. All modified files are saved, preserving original formatting

## License

MIT
