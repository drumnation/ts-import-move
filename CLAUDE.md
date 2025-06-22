# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ts-import-move** is a TypeScript-aware CLI tool that safely moves TypeScript files and folders while automatically updating all import references throughout the project. It's designed as a drop-in replacement for the Unix `mv` command specifically for TypeScript projects, with special focus on AI agent workflows.

## Essential Commands

### Development

```bash
npm run dev          # Watch mode development
npm run build        # Clean and build for production
npm run clean        # Remove dist directory
```

### Testing (Critical - Always run before commits)

```bash
npm test            # Run all tests (unit + integration + e2e)
npm run test:unit   # Unit tests only
npm run test:e2e    # End-to-end CLI tests only
npm run test:watch  # Watch mode testing
```

### Code Quality

```bash
npm run lint        # Check linting
npm run lint:fix    # Fix linting issues
npm run format      # Format with Prettier
```

### Single Test Execution

```bash
npx vitest run tests/unit/fileHandler.test.ts           # Run specific unit test
npx vitest run tests/integration/moveWithImports.test.ts # Run specific integration test
npx vitest run tests/e2e/cli.test.ts                    # Run specific e2e test
```

## Architecture Overview

### Functional Architecture (Post-Refactoring)

The codebase follows a **pure functional architecture** with isolated services:

- **`move-files.service.ts`**: Main orchestrator - coordinates the entire move operation
- **`dry-run.service.ts`**: Preview operations with NO side effects - shows what would happen
- **`import-path.service.ts`**: Pure functional import path resolution logic
- **`safe-parser.service.ts`**: Stack-overflow-safe AST processing for complex TypeScript files
- **`file-operations.service.ts`**: Pure functional file system operations
- **`absolute-imports.service.ts`**: Converts relative imports to absolute imports

### TypeScript AST Processing Modes

The tool automatically selects processing modes based on project size:

- **Standard Mode** (< 10 files): Full TypeScript project context
- **Surgical Mode** (10-50 files): Selective file loading for performance
- **Chunked Mode** (30-50 files): Balanced processing approach
- **Streaming Mode** (50+ files): Memory-efficient processing for large codebases

### CLI Architecture

- **Dual Entry Points**: `/bin/index.ts` (CLI) and `/src/index.ts` (library)
- **Commander.js**: Unix `mv` compatible command parsing
- **Command Structure**: Supports both `ts-import-move move` and direct arguments

## Key Testing Patterns

### Test Structure (100% Pass Rate Required)

- **Unit Tests**: Mock-based testing with extensive fs and child_process mocking
- **Integration Tests**: Real file system operations using temporary directories
- **E2E Tests**: Full CLI binary execution using `child_process.execSync`

### Critical Test Files

- `tests/integration/moveWithImports.test.ts`: Core functionality validation
- `tests/e2e/cli.test.ts`: CLI interface validation
- `tests/complex-document-editor-migration/`: Large-scale migration testing (189+ files)

### Test Execution Requirements

- All tests must pass before any commits
- E2E tests validate the actual compiled CLI binary
- Integration tests use real file operations for authentic scenarios

## Special Considerations

### AI Agent Integration

- **Cursor Rules**: Comprehensive AI training files in `/rules` directory
- **Install-Rules Command**: Use `npx ts-import-move install-rules` to train AI assistants
- **Absolute Imports**: The `--absolute-imports` flag converts relative to absolute imports for AI-friendly patterns

### Performance and Safety

- **Memory Management**: Handles large codebases efficiently (500+ files tested)
- **Stack Overflow Protection**: Safe AST parsing prevents crashes on complex JSX/object literals
- **Dry-Run Mode**: Always available with `--dry-run` flag for safe preview

### TypeScript Configuration

- **Module System**: NodeNext with ESM support
- **Path Aliases**: `@/*` mapped to `src/*` (maintained in build output)
- **Strict Mode**: Enabled - maintain type safety in all contributions

## Development Workflow

1. **Before Changes**: Run `npm test` to ensure current state is clean
2. **During Development**: Use `npm run dev` for watch mode
3. **Before Commit**: Always run `npm run lint:fix && npm test`
4. **Build Validation**: Run `npm run build` to ensure distribution builds correctly

## Important Implementation Notes

- **Pure Functions Only**: All services must remain side-effect free
- **Mock Strategy**: Unit tests extensively mock fs operations and child_process
- **Error Handling**: Graceful degradation with informative error messages
- **Cross-Platform**: Maintain Windows, macOS, and Linux compatibility
- **Memory Efficiency**: Monitor memory usage in large codebase scenarios

---

A consolidated rule file offers numerous advantages by creating a single source of truth, which simplifies maintenance and ensures consistency. Below is the combined and optimized version of all your `.mdc` rules.

### **Methodology for Consolidation**

To ensure the combined rules are efficient and do not conflict, the following steps were taken:

1. **Logical Grouping:** Rules were categorized into logical sections: Documentation, Git & Workflow, Code Quality, and Testing. This makes the file easier to navigate and understand.
2. **Metadata Preservation:** For each original rule set, the `description` and applicable `globs` from its frontmatter have been preserved in a blockquote. This maintains the context and intended scope of each rule.
3. **De-duplication and Merging:** Redundant or overlapping rules, particularly in the testing section, have been merged into a single, cohesive set of principles.
4. **Conflict Resolution:** Notes on precedence have been added where general and specific rules might overlap (e.g., general code standards vs. framework-specific standards). This guides the user or an AI agent on which rule to apply in a given context.
5. **Enhanced Readability:** The entire document has been formatted with consistent Markdown for clarity and ease of use.

---

### **Consolidated Project Rules**

````mdc
---
description: A consolidated set of project rules covering documentation, git workflow, code quality, and testing to ensure consistency and efficiency.
alwaysApply: true
globs: ["**/*"]
---

# Consolidated Project Rules

This file contains a comprehensive set of rules for the project. The rules are organized into logical categories for ease of reference.

## 1. Documentation

This section outlines the standards for creating and maintaining project documentation.

### 1.1. Agent Use of Project Documentation

> **Original File:** `agent-use-project-docs.rules.mdc`
> **Description:** Ensure that agents actively reference existing project documentation during planning, implementation, and debugging.
> **Globs:** `n/a`

**Purpose:** To reinforce architecture decisions, prevent duplication, and leverage prior domain knowledge.

**When to Read Docs:**
Agents MUST consult relevant documentation:
- Before implementing or planning a new feature.
- Before debugging a non-trivial issue.
- When using or modifying any shared component, service, or utility.
- When setting up a new app, package, or configuration.
- When unsure about naming, architecture, or design patterns.

**What to Read:**
- `docs/features/`: Feature implementation and rationale.
- `docs/architecture/adr/`: Architectural decisions.
- `docs/concepts/`: Core patterns and abstractions.
- `docs/packages/[name]/`: Workspace-specific details.
- `README.md`, `ONBOARDING.md`, `CONTRIBUTING.md`: Setup and standards.
- Use index files (`*.index.md`) to navigate efficiently.

**Usage Expectations:**
- Reference relevant documents in the plan or task file.
- Reuse prior design decisions and avoid re-debating settled architecture.
- Cross-link helpful docs in responses where appropriate.
- Load related `.md` files into memory when working on relevant code.
- If unclear, run the `consult-documentation-index` process to search.

### 1.2. Project Documentation Structure

> **Original File:** `project-documentation-structure.rules.mdc`
> **Description:** Defines the workflow for creating and maintaining discoverable project documentation.
> **Globs:** `n/a`

**Documentation Workflow:**

1.  **Capture Domain Knowledge:** While working, capture significant design decisions, implementation details, and rationales that are not obvious from the code.
2.  **Create and Enhance Files for Discoverability:**
    * Create new Markdown (`.md`) files in the appropriate `docs/` subfolder.
    * **Include Structured Metadata (YAML Frontmatter):** At the top of EVERY new or significantly updated document, include a YAML frontmatter block.
        ```yaml
        ---
        title: "[Clear, Descriptive Title]"
        description: "[One-sentence summary]"
        keywords:
          - "[primary topic]"
          - "[technology]"
          - "[feature name]"
        related_features: ["[feature-folder-name]"]
        last_updated: "[YYYY-MM-DD]"
        ---
        ```
    * **Write a Concise Summary:** Follow the frontmatter with a short summary paragraph.
    * **Use Descriptive Headings:** Structure content with clear Markdown headings.
    * **Embed Cross-Links:** Link to other relevant documentation or code files.
3.  **Update Index Files:** After adding or modifying a document, update the corresponding `[foldername].index.md` and the `last_updated` field in the document itself.
4.  **Review Existing Docs:** Before creating new documentation, search for existing information to avoid duplication.

### 1.3. Auto-Generated Documentation (`README`, `CHANGELOG`, `CONTRIBUTING`, etc.)

This section combines rules for files that should be kept up-to-date with the project's current state.

#### 1.3.1. README Maintenance

> **Original File:** `readme.rules.mdc`
> **Description:** Rules for maintaining the root README.md.
> **Globs:** `n/a`

The root `README.md` must be reviewed and updated after any **major changes**, including:
- Adding a new package/app.
- Implementing a major feature.
- Changing build, run, or test commands.
- Modifying installation or setup steps.
- Significant architectural shifts.
- Deprecating or removing a feature.

#### 1.3.2. Changelog Management

> **Original File:** `changelog.rules.mdc`
> **Description:** Rules for managing changelog files.
> **Globs:** `n/a`

- **Format:** Must follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- **Workflow:**
    1.  Add new changes to the `[Unreleased]` section first.
    2.  During a release, move `[Unreleased]` content to a new version section with the date (`date +'%Y-%m-%d'`).
    3.  Update the `package.json` version to match the new release version using `npm version [major|minor|patch] --no-git-tag-version`.
    4.  Commit `CHANGELOG.md` and `package.json` together.

#### 1.3.3. Contributing, Onboarding, and Project Guidelines

> **Original Files:** `contributing.rules.mdc`, `onboarding.rules.mdc`, `project-guidelines.rules.mdc`
> **Description:** These files should be automatically maintained to reflect the current state of the project.
> **Globs:** `n/a`

-   **`CONTRIBUTING.md`:** Update when development workflows, testing, or linting tools change.
-   **`ONBOARDING.md`:** Update when environment requirements (e.g., Node version, `.env` variables) or setup commands change.
-   **`PROJECT_GUIDELINES.md`:** Update when new packages are added, naming conventions change, or architectural decisions are made.

## 2. Git & Workflow

This section covers rules related to version control and development workflow.

### 2.1. Automatic Git Commits

> **Original File:** `automatic-git-commit.rules.mdc`
> **Description:** Automatically commit staged changes at logical points.
> **Globs:** `n/a`

**Trigger Conditions:**
- A feature, function, test, or refactor is logically complete.
- Total changed lines exceed 300.
- More than 8 files are staged.
- A previously failing test now passes.
- A `.rules`, `README.md`, or config file has been modified.

**Commit Message Structure:**
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- `commitSubject`: `feat: add login screen` (max 50 chars).
- `commitBody`: Summarize key changes.
- `commitFooter`: For breaking changes or issue references.

**Process:**
1.  Generate a structured commit message.
2.  Stage all changes.
3.  Commit the changes.
4.  After commit, log metadata to a `.brain/git/commits/[xx]/[hash].json` file.

### 2.2. Moving TypeScript Files

> **Original File:** `ts-import-move-simple.rules.mdc`
> **Description:** Use `ts-import-move` instead of `mv` for TypeScript files to prevent broken imports.
> **Globs:** `n/a`

When moving or renaming TypeScript files (`.ts`, `.tsx`), use `ts-import-move` to automatically update all import paths.

**Example:**
```bash
# Correct:
ts-import-move src/components/Button.tsx src/ui/Button.tsx

# Incorrect:
mv src/components/Button.tsx src/ui/Button.tsx
````

## 3\. Code Quality

This section defines the standards for writing clean, maintainable, and consistent code.

**Note on Precedence:** The rules are presented from general to specific. In cases of overlap, the more specific rule (e.g., framework-specific) takes precedence over the general one.

### 3.1. General Code Standards

> **Original File:** `code-standards.rules.mdc`
> **Description:** Core principles for readable, maintainable, and testable code.
> **Globs:** `**/*.ts`, `**/*.js`

- **Readability & Maintainability:** Prioritize clear and understandable code.
- **Modularity:** Break down large components into smaller, focused modules.
- **File Length:** Refactor files that exceed 500 lines.
- **Single Responsibility:** Functions and classes should have a single purpose.
- **Error Handling:** Use `try...catch` blocks and custom error classes.
- **Async Operations:** Prefer `async/await`.
- **Documentation:** Document code using JSDoc comments.

### 3.2. TypeScript Standards

> **Original File:** `typescript-standards.rules.mdc`
> **Description:** TypeScript formatting, linting, and best practices.
> **Globs:** `**/*.ts`, `**/*.tsx`

- **Formatting (Prettier):**
  - `maxLineLength`: 100
  - `indentSize`: 2
- **Linting (ESLint):**
  - `noUnusedVars`: error
  - `noExplicitAny`: warn
- **Best Practices:**
  - Avoid using `any`. Prefer explicit types.
  - Organize and remove unused imports.
  - Use `useCallback` for event handlers and `useMemo` for expensive computations in React.

### 3.3. Node.js Functional & Isolated Concerns

> **Original File:** `node.functional-isolated-concerns.rules.mdc`
> **Description:** A strict architectural pattern for Node.js projects emphasizing functional programming and separation of concerns.
> **Globs:** `*.ts`

**This is a high-level summary of a very detailed rule set. When this rule is active, it takes precedence over other code style guidelines for the specified `globs`.**

- **Core Principles:**
  - **ALWAYS** use functional programming patterns (NO CLASSES, except for framework requirements).
  - **ALWAYS** organize code into isolated concern files (e.g., `.service.ts`, `.repository.ts`, `.controller.ts`).
- **Refactoring:**
  - When encountering class-based or monolithic code, refactor it in a single pass into functional, concern-based modules.
  - Update all imports throughout the codebase after refactoring.
  - Delete the original file.
- **Forbidden Anti-patterns:**
  - Do not create backward-compatible class wrappers.
  - Do not create "function bag" objects that mimic classes.

### 3.4. File Organization

> **Original File:** `file-organization.mdc`
> **Description:** Defines the file organization structure for TypeScript projects.
> **Globs:** `**/*.ts`

- Group related functionality into modules.
- Use `index.ts` files to simplify imports.
- Separate concerns: keep business logic, UI components, and utilities in different directories.

## 4\. Testing

This section provides a unified set of principles for testing. It combines the core ideas from `functional-test-principals.rules.mdc` and `tdd-tom-testing-rules.mdc`.

### 4.1. Core Testing Philosophy

- **Test-Driven Development (TDD):** All new features MUST be implemented using TDD. Follow the Red-Green-Refactor cycle.
- **Test Real Behavior, Not Implementation:** Tests should validate real, end-to-end or integration-level functionality. If the tests pass, the app should work.
- **Avoid Mocking Internal Logic:**
  - Mock only external APIs or uncontrollable globals (e.g., time, environment).
  - NEVER mock internal application logic just to make a test work.
- **One-to-One Principle:** If a test passes, the feature works. If it fails, something meaningful is broken.
- **Tests as Self-Validation:** Use tests to confirm that changes are correct before considering a task complete.
- **Prefer Integration Tests:** Favor integration and functional tests for most features. Use unit tests primarily for pure functions or small, reusable utilities.
- **Don't Delete Failing Tests:** If a test fails, investigate and fix the underlying issue or update the test with intention.

### 4.2. Test Planning and Strategy

- **Include Test Planning in Feature Design:** When planning a task, define what needs to be tested, how it can be tested with minimal mocks, and what defines success.
- **Choose the Right Testing Strategy:** Before writing tests, decide if a UNIT or INTEGRATION test is more effective. Document the reasoning.

### 4.3. Date and Time Handling

> **Original File:** `date-time.rules.mdc`
> **Description:** Specifies the correct usage of the `date` command for generating timestamps.
> **Globs:** `n/a`

To ensure consistency, always use the `date` command to generate timestamps. Do not hardcode dates.

- **Full Timestamp (for document headers):** `date +'%A, %B %d, %Y at %I:%M:%S %p'`
- **Date-Only:** `date +'%Y-%m-%d'`
- **Log Timestamp:** `date +'%Y-%m-%d %H:%M:%S'`

<!-- end list -->
