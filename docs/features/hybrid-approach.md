---
title: "Hybrid Approach for Safe TypeScript File Moves"
description: "Design rationale and architecture for combining Unix mv and ts-morph to move files and update imports."
keywords:
  - "ts-import-move"
  - "TypeScript"
  - "file moving"
  - "import updating"
  - "mv command"
  - "ts-morph"
  - "cross-platform"
  - "CLI tools"
related_features: ["ts-import-move"]
related_concepts: ["reliable-file-matching-and-globbing-in-nodejs-cli-tools"]
related_adr: []
last_updated: "2024-06-09"
---

This document describes the rationale, architecture, and compatibility requirements for the hybrid approach to moving TypeScript files: using the Unix `mv` command (or platform equivalent) for file operations, and `ts-morph` for updating imports. This approach is designed to maximize reliability, performance, and cross-platform support for the `ts-import-move` tool.

## Rationale

Moving TypeScript files with the standard `mv` command breaks import paths, leading to compilation and runtime errors. The [FOR_AI_AGENTS.md](../FOR_AI_AGENTS.md) and [Hybrid Approach Implementation Plan](../hybrid-approach-implementation-plan.md) both emphasize the need for a tool that safely moves files and updates all relevant imports. By combining the speed and reliability of native file operations (`mv`) with the AST-based import updating of `ts-morph`, we achieve:

- Fast, atomic file moves (leveraging the OS)
- Accurate, project-wide import updates
- Robust handling of globs, directories, and edge cases
- Cross-platform support (with platform-specific move logic)

## Responsibilities

- **Unix `mv` (or platform equivalent):**
  - Handles all file and directory move operations
  - Supports globs, recursive moves, and force/overwrite flags
  - Ensures atomicity and performance
- **ts-morph:**
  - Scans the project for import statements referencing moved files
  - Updates import paths to reflect new file locations
  - Handles TypeScript-specific edge cases (e.g., extensions, tsconfig paths)

## API Compatibility Requirements

- The CLI interface must remain compatible with previous versions (see [implementation plan](../hybrid-approach-implementation-plan.md)).
- All existing flags and options should be supported, with clear error messages for any breaking changes.
- The tool must work from any working directory, with both absolute and relative paths, and support glob patterns.
- Platform-specific behavior (e.g., Windows move command) must be documented and tested.

## References

- [Hybrid Approach Implementation Plan](../hybrid-approach-implementation-plan.md)
- [FOR_AI_AGENTS.md](../FOR_AI_AGENTS.md)
- [Reliable File Matching and Globbing in Node.js CLI Tools](../concepts/reliable-file-matching-and-globbing-in-nodejs-cli-tools.md)

## Error Handling Approach

Robust error handling is critical for both file move operations and import updates:

- **Move Operation Errors:**
  - If a source file or directory does not exist, the tool throws an error and aborts the operation.
  - If the destination exists and overwrite is not allowed (no --force), an error is thrown.
  - Permission errors, file system errors, and OS-level failures are surfaced with clear messages.
  - All move errors are logged with context (source, destination, error type).
- **Import Update Errors:**
  - If import updating fails (e.g., file not found in tsconfig, parse error), the tool logs the error and continues, but reports all failures at the end.
  - The tool never leaves the project in a partially updated state: if import updates fail, the user is notified to review changes.
  - All import update errors are logged with affected file paths and suggested recovery steps.

This approach ensures users are never left with silent failures or broken projects, in line with [project error handling standards](../../.cursorrules).

## Path Resolution Logic Review

- **Components to Keep:**
  - Glob expansion for source file selection (using fast-glob or similar)
  - Path normalization and comparison (using Node.js path utilities)
  - Handling of both absolute and relative paths, as described in [project path resolution best practices](../../.cursorrules)
- **Components to Replace:**
  - File moving and directory creation logic is now delegated to the OS (`mv` or platform equivalent)
  - Directory recursion and structure preservation are handled by the OS and glob logic
- **Cross-Platform Compatibility Plan:**
  - On Unix-like systems, use `mv` for file and directory moves
  - On Windows, use `move` or a Node.js equivalent, with path separator normalization
  - Platform detection is performed at runtime; all path operations use Node.js path utilities for consistency
  - All platform-specific behaviors are documented and tested (see [implementation plan](../hybrid-approach-implementation-plan.md))

---

**Next:** Implement the core Unix `mv` handler (`execMoveCommand`) and write tests for it. 