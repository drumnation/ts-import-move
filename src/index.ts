#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import fastGlob from 'fast-glob';
import { Project } from 'ts-morph';
import { installCursorRules } from './cli-install-rules.js';

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

// Add the move command (main functionality)
const moveCommand = program
  .command('move')
  .description('Move TypeScript files/folders and update imports')
  .argument('<sources...>', 'Source file(s) or directory')
  .argument('<destination>', 'Destination file or directory')
  .option('-r, --recursive', 'Recursively move directories')
  .option('-i, --interactive', 'Prompt before overwrite')
  .option('-f, --force', 'Force overwrite without prompt')
  .option('-n, --dry-run', 'Show what would be moved without making changes')
  .option('-v, --verbose', 'Display detailed operation logs')
  .option('--extensions <ext>', 'Specify file extensions to consider (comma separated)', '.ts,.tsx')
  .option('--tsconfig <path>', 'Path to tsconfig.json')
  .action(async (sources, destination, options) => {
    // Implementation will go here
    console.log('Moving files...');
    console.log('Sources:', sources);
    console.log('Destination:', destination);
    console.log('Options:', options);
    
    // This is a placeholder for actual implementation
    console.log('Not fully implemented yet. This is a test version for the command infrastructure.');
  });

// Add the install-rules command
program
  .command('install-rules')
  .description('Install Cursor AI rules to help agents use this tool correctly')
  .action(async () => {
    await installCursorRules();
  });

// Handle direct arguments for default command
program
  .arguments('<sources...> <destination>')
  .option('-r, --recursive', 'Recursively move directories')
  .option('-i, --interactive', 'Prompt before overwrite')
  .option('-f, --force', 'Force overwrite without prompt')
  .option('-n, --dry-run', 'Show what would be moved without making changes')
  .option('-v, --verbose', 'Display detailed operation logs')
  .option('--extensions <ext>', 'Specify file extensions to consider (comma separated)', '.ts,.tsx')
  .option('--tsconfig <path>', 'Path to tsconfig.json')
  .action(async (sources, destination, options) => {
    // Just delegate to the move command's action handler
    // @ts-ignore - Action expects different parameters when called directly
    await moveCommand.action(sources, destination, options);
  });

program.parse(process.argv); 