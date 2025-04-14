#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
// These imports will be used in the full implementation
// import fastGlob from 'fast-glob';
// import { Project } from 'ts-morph';
import { installCursorRules } from './cli-install-rules.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { moveAction } from './commands/move.js';

// Create __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

// Initialize the CLI
const program = new Command();

program
  .name('ts-import-move')
  .description('Safely move TypeScript files/folders and update imports')
  .version(packageJson.version);

// Define common options
const addCommonOptions = (cmd: Command) => {
  return cmd
    .option('-r, --recursive', 'Recursively move directories')
    .option('-i, --interactive', 'Prompt before overwrite')
    .option('-f, --force', 'Force overwrite without prompt')
    .option('-n, --dry-run', 'Show what would be moved without making changes')
    .option('-v, --verbose', 'Display detailed operation logs')
    .option('--extensions <ext>', 'Specify file extensions to consider (comma separated)', '.ts,.tsx')
    .option('--tsconfig <path>', 'Path to tsconfig.json');
};

// Add the move command (main functionality)
const moveCommand = program
  .command('move')
  .description('Move TypeScript files/folders and update imports');

// Apply common options
addCommonOptions(moveCommand);

// Add arguments and action
moveCommand
  .argument('<source...>', 'Source file(s) or directory')
  .argument('<destination>', 'Destination file or directory')
  .action(async (source, destination, options) => {
    await moveAction(source, destination, options);
  });

// Add the install-rules command
program
  .command('install-rules')
  .description('Install Cursor AI rules to help agents use this tool correctly')
  .action(async () => {
    await installCursorRules();
  });

// Handle direct arguments for default command
const defaultCommand = program;

// Apply common options
addCommonOptions(defaultCommand);

// Add arguments and action
defaultCommand
  .argument('<source...>', 'Source file(s) or directory')
  .argument('<destination>', 'Destination file or directory')
  .action(async (source, destination, options) => {
    await moveAction(source, destination, options);
  });

program.parse(process.argv); 