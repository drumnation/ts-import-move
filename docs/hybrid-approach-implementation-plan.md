# Hybrid Approach Implementation Plan: Unix `mv` + ts-morph for Imports

## Phase 1: Design & Architecture

- [ ] **1.1 Document design decisions and architecture**
  - [ ] Create design doc outlining hybrid approach rationale
  - [ ] Define responsibilities: Unix `mv` for file operations, ts-morph for imports only
  - [ ] Identify API compatibility requirements

- [ ] **1.2 Define core data structures**
  - [ ] Design `movedFiles` mapping structure (oldPath → newPath)
  - [ ] Plan error handling approach for move operations vs import operations

- [ ] **1.3 Review existing path resolution logic**
  - [ ] Identify components to keep (glob expansion, path normalization)
  - [ ] Identify components to replace (file moving, directory creation)
  - [ ] Plan cross-platform compatibility approach (Windows vs Unix)

## Phase 2: Core Implementation

- [ ] **2.1 Create new move handler using Unix `mv`**
  - [ ] Implement `execMoveCommand` function using `child_process.execSync`
  - [ ] Add force/overwrite flag support
  - [ ] Add verbose logging option
  - [ ] Handle errors from `mv` command

- [ ] **2.2 Refactor path resolution**
  - [ ] Separate path resolution from file operations
  - [ ] Simplify path normalization for `mv` command
  - [ ] Preserve glob pattern expansion for multiple file moves

- [ ] **2.3 Implement file tracking system**
  - [ ] Create `movedFiles` map to track old → new paths
  - [ ] Develop accurate absolute path resolution for ts-morph

- [ ] **2.4 Update the import update logic**
  - [ ] Modify to work with `movedFiles` map
  - [ ] Ensure ts-morph projects are created correctly
  - [ ] Handle import path updates based on file movement

- [ ] **2.5 Integrate directory handling**
  - [ ] Implement recursive directory moving using Unix commands
  - [ ] Track all files moved within directories
  - [ ] Preserve directory structure at destination

## Phase 3: Cross-Platform Support

- [ ] **3.1 Windows compatibility**
  - [ ] Create Windows-specific move command implementation
  - [ ] Test path separator handling
  - [ ] Implement platform detection and command switching

- [ ] **3.2 Platform-agnostic API**
  - [ ] Create abstraction layer for file operations
  - [ ] Ensure consistent behavior across platforms
  - [ ] Document platform-specific limitations

## Phase 4: Test Suite Updates

- [ ] **4.1 Fix existing unit tests**
  - [ ] Update file handler tests for new Unix `mv` approach
  - [ ] Mock `child_process.execSync` for predictable testing
  - [ ] Add platform-specific test variations

- [ ] **4.2 Update integration tests**
  - [ ] Modify test cases that assume specific move implementation
  - [ ] Add tests for new error cases
  - [ ] Ensure directory structure preservation tests pass

- [ ] **4.3 Add end-to-end tests**
  - [ ] Create real-world scenario tests
  - [ ] Test from project root and subdirectories
  - [ ] Verify both file moves and import updates work together

- [ ] **4.4 Create specific tests for problematic cases**
  - [ ] Test for moving directories with preserving structure
  - [ ] Test for glob pattern expansion edge cases
  - [ ] Test for absolute vs relative path handling

## Phase 5: CLI and API Updates

- [ ] **5.1 Update CLI interface**
  - [ ] Add any new flags needed for hybrid approach
  - [ ] Ensure backward compatibility
  - [ ] Update help text and documentation

- [ ] **5.2 Enhance error reporting**
  - [ ] Distinguish between move errors and import update errors
  - [ ] Provide clear, actionable error messages
  - [ ] Add recovery suggestions for common failures

- [ ] **5.3 Improve verbose output**
  - [ ] Show exact `mv` commands being executed
  - [ ] Log before/after paths for each moved file
  - [ ] Display import update operations clearly

## Phase 6: Documentation and Release

- [ ] **6.1 Update documentation**
  - [ ] Update README with new architecture information
  - [ ] Document platform-specific behavior
  - [ ] Add examples for common use cases

- [ ] **6.2 Create migration guide**
  - [ ] Document any breaking changes
  - [ ] Provide upgrade instructions
  - [ ] Address common questions/issues

- [ ] **6.3 Release preparation**
  - [ ] Update version number
  - [ ] Write changelog
  - [ ] Prepare npm package

## Phase 7: Validation and Launch

- [ ] **7.1 Final validation**
  - [ ] Test on real-world projects
  - [ ] Verify performance characteristics
  - [ ] Check for any regressions

- [ ] **7.2 Release**
  - [ ] Publish to npm
  - [ ] Announce release
  - [ ] Monitor for feedback

## Next Steps Recommendation

**Start with**: Implementing the core Unix `mv` handler (2.1) and its tests (4.1), to validate the hybrid approach works as expected. Once that's stable, build out the remaining components, focusing on test coverage throughout.

**Success criteria**: The tool should work reliably from any directory, with any common path format, and across platforms, with comprehensive test coverage proving it. 