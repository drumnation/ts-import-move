# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.14] - 2025-04-14

### Changed
- Version bump for release. No user-facing changes since 0.2.13, but ensures all dependencies and metadata are up to date.

## [0.2.13] - 2025-04-14

### Fixed
- Fixed a critical bug where the CLI, when run globally or from a published package, failed to move files using relative paths from a subdirectory ("No files matched the provided patterns"). The CLI now correctly passes original arguments to the main logic, preserving expected behavior for all path types and working directories.

### Added
- Added an end-to-end (E2E) test that runs the built CLI from a subdirectory using relative paths, ensuring this regression is caught in the future.

## [0.2.12] - 2025-04-15

### Fixed
- Fixed a bug with moving files using local relative paths when executed from subdirectories
- Enhanced directory structure preservation when moving files to ensure proper path resolution
- Improved handling of file paths to maintain relative paths correctly during moves

## [0.2.11] - 2025-04-14

### Fixed
- Fixed critical bug where moving a directory into another directory with `-r` would flatten the directory structure and cause file collisions. The tool now preserves the full hierarchy by creating a subfolder in the destination matching the source directory name, just like standard `mv` behavior.
- The original source directory is now removed after a successful move, matching expected CLI semantics.

### Added
- Added an integration test to ensure directory structure is preserved when moving a directory with subfolders into another directory. This prevents regressions for this critical behavior.

### Changed
- Improved move logic to handle single-directory moves robustly and safely, with better error handling and verbose output for debugging.

## [0.2.10] - 2025-04-14

### Fixed
- Fixed Commander.js CLI definition to use a single variadic argument (`<args...>`) and parse sources/destination in code, resolving the "only the last argument can be variadic" error for all users.
- Ensured CLI works with all argument patterns and passes all e2e tests.

## [0.2.9] - 2025-04-14

### Changed
- Upgraded Vitest to v3.1.1 for improved concurrency and stability.
- Refactored test scripts to remove unsupported CLI concurrency flags; concurrency is now set in `vitest.config.ts`.
- Removed unsupported `project.dispose()` call from ts-morph usage for compatibility.
- Fixed all ESLint and TypeScript errors in `src/lib/index.ts` (unused variables, quote style).
- All core CLI, integration, and e2e tests now pass reliably.
- Isolated memory issues to a single non-critical test (`cli-install-rules`).
- Split memory-intensive test from main suite for reliable CI and publishing.

### Fixed
- Memory issues in test suite by splitting test runs and optimizing project usage.
- Test failures due to missing log output in CLI.

## [0.2.8] - 2025-04-14

### Fixed
- Fixed critical bug where CLI argument order was reversed, causing source and destination parameters to be swapped
- Added test case to verify correct parameter order processing
- Fixed Commander.js constraint violation that prevented the CLI from working when variadic parameters weren't last
- Implemented smart parameter handling to allow multiple source files while maintaining the correct source-to-destination semantics

## [0.2.7] - 2025-04-14

### Fixed
- Fixed critical bug where file movement commands completed silently without actually moving files
- Connected CLI commands to the actual implementation in the moveAction function
- Fixed E2E CLI test for `install-rules` command by using direct mock instead of trying to import the unexported `program` variable from index.ts
- Fixed verbose CLI test by ensuring destination directory exists before test

## [0.2.6] - 2025-04-13

### Added
- Added project root detection for more accurate local rule installation
- Made local installation (project-specific) the default installation option

## [0.2.5] - 2025-04-13

### Added
- Added CONTRIBUTING.md with guidelines for project contributions
- Added interactive mode for rules installation, allowing users to choose between simple, advanced, or both rules
- Improved rules installer with context size guidance for AI-powered tools

### Fixed
- Fixed ESM compatibility issue in rules installation command (`__dirname` not defined)

## [0.2.4] - 2025-04-13

### Fixed
- Fixed CLI argument ordering to ensure compatibility with Commander.js
- Improved CLI usability by making destination first, followed by sources
- Fixed binary script to correctly handle global installation

## [0.2.3] - 2025-04-13

### Fixed
- Fixed ESM compatibility issue with `__dirname` not being defined in ES modules
- Updated code to use `import.meta.url` for path resolution in ES modules

## [0.2.2] - 2025-04-13

### Changed
- Simplified bin configuration to use a single entry point
- Improved module loading to support both ESM and CommonJS environments
- Updated build script to output both ESM and CommonJS formats

### Fixed
- Fixed installation issues when using npm install -g

## [0.2.1] - 2025-04-13

### Changed
- Version bump to resolve npm publishing issues
- Fixed package script configuration to avoid recursive publishing

## [0.2.0] - 2025-04-13

### Changed
- Fixed recursive publishing issue in package.json scripts
- Enhanced README with prominent warning for AI agents at the very top
- Improved documentation to clearly explain the critical importance of this tool for AI-assisted refactoring
- Updated to minor version to indicate significant documentation improvements

## [0.1.3] - 2025-04-13

### Changed

- Further enhanced README with more prominent warning section for AI agents at the very top
- Improved documentation to clarify the critical importance of using this tool for AI-assisted refactoring
- Updated date formatting in changelog to follow project standards

## [0.1.2] - 2025-04-13

### Changed

- Further enhanced README with more prominent warning section for AI agents at the very top
- Improved documentation to clarify the critical importance of using this tool for AI-assisted refactoring

## [0.1.1] - 2025-04-13

### Changed

- Updated package name to `@drumnation/ts-import-move` to better reflect its purpose
- Enhanced README with prominent warning for AI agents about using this tool instead of standard `mv` command
- Fixed documentation to emphasize the importance of this tool for AI-assisted refactoring

## [0.1.0] - 2025-04-13

### Added

- Initial release of tsmove
- CLI tool for safely moving TypeScript files/folders and updating imports
- Support for recursive directory moves
- Force and interactive modes for file operations
- Dry run mode to preview changes without applying them
- Pattern matching for selecting files to move
- Install-rules command for Cursor AI integration

### Changed

- Package initially published as `@drumnation/tsmove`

### Fixed

- Fixed E2E CLI test for `install-rules` command by using direct mock instead of trying to import the unexported `program` variable from index.ts
