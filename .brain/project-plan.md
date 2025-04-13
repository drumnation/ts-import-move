Below is an expanded plan that builds on your existing outline, offering more depth in architecture, edge-case handling, and integration details. You can present this plan to an agent (or development team) to guide the implementation of **`ts-import-move`**.

---

## 1. **Project Structure**

A suggested folder layout for clarity and maintainability:

```
ts-import-move
├── bin
│   └── index.ts          // CLI entry point
├── src
│   ├── commands
│   │   ├── move.ts       // Core "move" command logic
│   │   └── utils.ts      // Shared helpers for commands
│   ├── lib
│   │   ├── fileHandler.ts // Handles file system interactions
│   │   ├── pathUpdater.ts // Core logic using ts-morph to update imports
│   │   └── index.ts       // Central export of library
│   └── types
│       └── index.d.ts     // (Optional) Shared types/interfaces
├── tests
│   ├── unit
│   ├── integration
│   └── e2e
├── package.json
├── tsconfig.json
└── README.md
```

### Key Directories

- **`bin/`**  
  - **`index.ts`**: Minimal logic that loads the CLI (via `commander`) and delegates all behavior to the `src/` library.
  
- **`src/commands/`**  
  - **`move.ts`**: Exposes the `ts-import-move` command, parsing arguments and invoking the necessary library functions.  
  - **`utils.ts`**: Shared helper functions for command-related tasks, such as generating usage output or handling CLI prompts.

- **`src/lib/`**  
  - **`fileHandler.ts`**: Manages direct file operations (copying, moving, renaming), including overwriting checks or verifying if a destination exists.  
  - **`pathUpdater.ts`**: Houses all `ts-morph` logic—resolving references, updating imports, and saving changed files.  
  - **`index.ts`**: Aggregates and exports library-level functions, so the commands can import them cleanly.

- **`tests/`**  
  - **`unit/`**: Fine-grained tests for individual modules (`fileHandler`, `pathUpdater`).  
  - **`integration/`**: Tests that ensure multiple modules work together (e.g., a small TS project simulating a multi-file move).  
  - **`e2e/`**: CLI-level tests using real or mocked file systems to confirm correct behavior on actual commands.

---

## 2. **Detailed Workflow**

1. **CLI Initialization**  
   - Use `commander` to define the `ts-import-move` command, options, and help text.  
   - Parse arguments (sources, destination, flags like `--recursive`, `--dry-run`, etc.).

2. **Source File Resolution**  
   - If wildcard patterns (`"src/components/*.tsx"`) are provided, use `fast-glob` to expand them into a concrete list of file paths.  
   - For multi-source moves (`src/a.ts src/b.ts src/c.ts targetFolder/`), accumulate all paths into an array.

3. **Project Setup**  
   - Locate `tsconfig.json` (use command-line override if specified, else auto-detect in the current working directory or parent directories).  
   - Initialize a `ts-morph` `Project` using the discovered `tsconfig.json`.  
   - Add relevant files to the project, ensuring they’re recognized by `ts-morph`.

4. **Validation & Confirmation**  
   - If `--interactive` is set, display a summary of the move operations (source → destination) and ask the user to confirm.  
   - If `--force` is set, skip confirmations and overwrite any existing files in the destination.

5. **Core Move and Import Update**  
   - For each file:
     1. **Check Destination**: Determine if the target path is valid. If it’s a directory move, maintain filenames; if it’s a rename, adopt the new name.  
     2. **Move File**: Physically move the file (via `fs.renameSync` or `fs-extra.moveSync`) in `fileHandler.ts`.  
     3. **Update Imports**:  
        - Let `ts-morph` automatically track the old location and the new location.  
        - Invoke a function in `pathUpdater.ts` that updates all references in the project. This typically involves:
          - Finding nodes that reference the old path (e.g., `import { X } from '../../old/path';`).  
          - Updating them to reference the new path (`import { X } from '../../new/path';`).  
        - Save the modified files to disk (`sourceFile.save()` or a batch `project.save()` call).
     4. **Log Results**: Use `chalk` (or a similar library) to display success or error messages.

6. **Dry Run Mode**  
   - If `--dry-run` is active, skip the actual file move and only show what *would* be changed.  
   - Generate a console report of paths that would be moved or renamed and the imports that would be updated.

7. **Post-Processing**  
   - If multiple moves are performed, re-synchronize the project model to ensure the final references are correct.  
   - Optionally run a quick check for broken imports if desired (e.g., verifying no file references result in `FileNotFoundError`).

---

## 3. **Handling Edge Cases**

1. **Circular Imports**  
   - If the project has circular imports, `ts-morph` should still handle path rewrites. However, final verification via a compile check (`project.getPreEmitDiagnostics()`) can catch any newly introduced issues.

2. **Multiple `tsconfig.json` Files**  
   - In monorepos, you might have multiple TS configs. Decide whether to:
     - Load the root `tsconfig.json` for all references (simpler, but must cover all subprojects).  
     - Or detect local `tsconfig.json` files per package. This can be an optional advanced feature (e.g., `--multi-tsconfig`).

3. **Symlinks**  
   - By default, `fast-glob` sees actual files unless told otherwise. If symlinks exist, consider how you want to handle them:
     - Follow symlinks and move the real files.  
     - Or detect symlinks and skip them (or provide a warning).  

4. **Non-TS Files**  
   - By default, you might only want to move `.ts` and `.tsx` files. If the user wants to move other files (like `.json`, `.js`), that’s possible, but the tool only updates imports for TS references. Provide a note in the docs.

5. **Import Aliases**  
   - If the user’s `tsconfig.json` uses paths aliases (e.g., `paths` in `compilerOptions`), ensure you respect them when updating imports. `ts-morph` can handle this if you provide the correct `tsconfig.json` with the path mappings.

---

## 4. **Code Snippets**

Below are illustrative (not production-ready) snippets for key parts:

### 4.1. CLI Setup (`bin/index.ts`)

```ts
#!/usr/bin/env node

import { Command } from 'commander';
import { moveAction } from '../src/commands/move';

const program = new Command();

program
  .name('ts-import-move')
  .description('Safely move TypeScript files/folders and update imports.')
  .version('0.1.0');

program
  .argument('[sources...]', 'One or more source files/folders')
  .argument('<destination>', 'Destination folder or file path')
  .option('-r, --recursive', 'Recursively move directories')
  .option('-n, --dry-run', 'Preview changes without modifying files')
  .option('-f, --force', 'Force overwrite without prompt')
  .option('-i, --interactive', 'Prompt for confirmation before overwriting')
  .option('--extensions <ext>', 'Comma-separated file extensions (e.g. .ts,.tsx)', '.ts,.tsx')
  .option('--tsconfig <path>', 'Path to tsconfig.json')
  .action(moveAction);

program.parse(process.argv);
```

### 4.2. Move Command (`src/commands/move.ts`)

```ts
import { MoveOptions } from '../types';
import { moveFiles } from '../lib';

export async function moveAction(
  sources: string[],
  destination: string,
  options: MoveOptions
) {
  // 1. Validate user input
  if (!sources.length || !destination) {
    console.error('Error: Please specify one or more source paths and a destination.');
    process.exit(1);
  }

  // 2. Execute move
  try {
    await moveFiles(sources, destination, options);
  } catch (err) {
    console.error('Move operation failed:', err);
    process.exit(1);
  }
}
```

### 4.3. `moveFiles` Implementation (`src/lib/index.ts`)

```ts
import { Project } from 'ts-morph';
import { globSync } from 'fast-glob';
import { MoveOptions } from '../types';
import { handleFileMove } from './fileHandler';
import { updateImports } from './pathUpdater';

export async function moveFiles(
  sources: string[],
  destination: string,
  opts: MoveOptions
) {
  // 1. Resolve all file paths
  const files = sources.flatMap(src => globSync(src, { dot: true }));

  // 2. Initialize ts-morph project
  const project = new Project({
    tsConfigFilePath: opts.tsconfig ?? findTsConfig(),
    skipFileDependencyResolution: false,
  });

  // 3. Optional interactive confirmation or forced overwrites
  //    (Implementation depends on your approach: inquirer prompts, etc.)

  // 4. Perform move operations
  for (const filePath of files) {
    if (opts.dryRun) {
      console.log(`[Dry Run] Would move ${filePath} → ${destination}`);
    } else {
      const newFilePath = await handleFileMove(filePath, destination, opts);
      // Update AST references in the project
      updateImports(project, filePath, newFilePath);
    }
  }

  // 5. Save changes if not a dry run
  if (!opts.dryRun) {
    await project.save();
    console.log('All imports updated successfully!');
  }
}
```

### 4.4. Updating Imports with `ts-morph` (`src/lib/pathUpdater.ts`)

```ts
import { Project } from 'ts-morph';

export function updateImports(
  project: Project,
  oldPath: string,
  newPath: string
) {
  // If you have a path mapping or relative path transformation:
  // convert oldPath/newPath to project-relative or TS-config relative paths as needed.

  const sourceFile = project.getSourceFile(oldPath);
  if (!sourceFile) {
    // Possibly a non-TS file or something not in the project. Return early or handle error.
    return;
  }

  // Let ts-morph re-locate the file
  sourceFile.move(newPath);

  // By moving the file via ts-morph, all references in *other* files that import oldPath
  // will automatically update. If you want more granular control, you can do:
  //   project.getSourceFiles().forEach(sf => {
  //     sf.getImportDeclarations().forEach(decl => { ... })
  //   });
  // but typically .move() handles it.

  // Optionally, re-import the new source file in the project after the move:
  project.addSourceFileAtPathIfExists(newPath);
}
```

---

## 5. **Integration and AI Agent Considerations**

1. **Simple Integration**  
   - For AI agents that reorganize codebases, ensure the CLI accepts multiple sources with wildcards. This allows an agent to provide a single command to rearrange an entire directory.

2. **Zero-Interaction Mode**  
   - Support a fully headless mode (e.g., `--force`, `--no-prompt`) to ensure the agent never gets stuck on confirmations.

3. **Monorepo / Multi-Repo**  
   - Provide a config file or environment variable that AI agents can set to specify multiple `tsconfig.json` locations or custom alias paths.

4. **Post-Move Verification**  
   - Agents can optionally run `tsc --noEmit` to confirm no broken imports remain.

---

## 6. **Testing Approach**

1. **Unit Tests**  
   - **`fileHandler.test.ts`**: Validate file copying, renaming, overwriting, error handling on non-existent paths.  
   - **`pathUpdater.test.ts`**: Mock up a small in-memory TS project with `ts-morph` and check if imports are updated correctly.

2. **Integration Tests**  
   - **`moveMultipleFiles.test.ts`**: Move a set of files (e.g., `Button.tsx`, `Input.tsx`) to a new folder and verify the import references in a sample project.  
   - **`aliasPaths.test.ts`**: For a `tsconfig` with path aliases, confirm that the new paths remain valid.

3. **E2E Tests**  
   - Use a temporary directory or fixture-based approach: copy a small TS project into a temp folder, run the CLI (via a Node child process call), and verify outcomes (final files, final `import` statements).  
   - Example assertion: `grep` or parse each file to ensure references are updated.

---

## 7. **Deployment & Release**

1. **Build**  
   - Use a single build step (e.g., `tsc` or `esbuild`) to create a compiled Node script.  
   - Optionally wrap in a binary using `pkg` if you want a stand-alone executable.

2. **Versioning & Tagging**  
   - Adopt Semantic Versioning (`1.0.0`, `1.1.0`, etc.).  
   - Generate changelogs automatically (e.g., via `auto-changelog` or `standard-version`).

3. **Publishing**  
   - Release on npm (`npm publish`), so users can install with `npm i -g ts-import-move` or `yarn global add ts-import-move`.

---

## 8. **Future Enhancements**

- **Undo/Rollback**  
  - Provide a flag or separate command to revert the last move operation by storing a manifest of changes.
- **Interactive File-Tree GUI**  
  - Possibly integrate `blessed` or a TUI library for a more visual approach to selecting files to move.
- **VSCode Plugin**  
  - Wrap this functionality in a VSCode extension that does “move + import update” with a single drag-and-drop.

---

### Wrap-Up

With these details—expanded project structure, step-by-step architecture, and an extended testing strategy—your agent (or team) will have a clear roadmap to implement **`ts-import-move`** effectively. If you have any specific questions or want to dive into implementation details, let me know!
