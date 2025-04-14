# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.8] - 2025-04-14

### Fixed
- Fixed critical bug where CLI argument order was reversed, causing source and destination parameters to be swapped
- Added test case to verify correct parameter order processing

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
