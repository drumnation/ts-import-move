#!/usr/bin/env node
/**
* Entry point for the ts-import-move CLI tool
*/

import { Command } from 'commander';
import { moveAction } from '@/commands/move.js';

const program = new Command();

program
  .name('ts-import-move')
  .description('Safely move TypeScript files/folders and update imports.')
  .version('0.1.0');

program
  .option('-r, --recursive', 'Recursively move directories')
  .option('-n, --dry-run', 'Preview changes without modifying files')
  .option('-f, --force', 'Force overwrite without prompt')
  .option('-i, --interactive', 'Prompt for confirmation before overwriting')
  .option('-v, --verbose', 'Display detailed operation logs')
  .option('--extensions <ext>', 'Comma-separated file extensions (e.g. .ts,.tsx)', '.ts,.tsx')
  .option('--tsconfig <path>', 'Path to tsconfig.json')
  .option('--no-absolute-imports', 'Keep relative imports instead of converting to absolute imports')
  .option('--alias-prefix <prefix>', 'Alias prefix for absolute imports', '@')
  .parse(process.argv);

// Extract non-option arguments
const args = program.args;
if (args.length < 2) {
  console.error('Error: Missing source or destination arguments');
  process.exit(1);
}

// Last argument is the destination
const destination = args.pop();
// All remaining arguments are sources
const sources = args;

// Ensure destination is defined
if (!destination) {
  console.error('Error: Destination argument is missing or invalid');
  process.exit(1);
}

// Execute the move action
moveAction(sources, destination, program.opts());