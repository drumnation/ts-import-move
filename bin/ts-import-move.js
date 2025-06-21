#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'module';
import { moveAction } from '../dist/exports.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('ts-import-move')
  .description('Drop-in replacement for mv that automatically updates TypeScript imports')
  .version(pkg.version);

// Match standard mv syntax: mv [OPTION]... SOURCE... DIRECTORY
program
  .arguments('<sources...>')
  .option('-f, --force', 'do not prompt before overwriting', false)
  .option('-n, --no-clobber', 'do not overwrite an existing file', false)
  .option('-v, --verbose', 'explain what is being done', false)
  .option('--debug-imports', 'enable detailed import analysis debugging', false)
  .option('-r, --recursive', 'move directories recursively', false)
  .option('-i, --interactive', 'prompt before overwrite', false)
  .option('--tsconfig <path>', 'path to tsconfig.json file')
  .option('--extensions <exts>', 'file extensions to process', '.ts,.tsx,.js,.jsx')
  .action(async (sources, options) => {
    if (sources.length < 2) {
      console.error('ts-import-move: missing destination file operand after', sources[0] || 'source');
      console.error('Usage: ts-import-move [OPTION]... SOURCE... DEST');
      process.exit(1);
    }
    
    // Last argument is destination, everything else is sources (like standard mv)
    const destination = sources[sources.length - 1];
    const sourceFiles = sources.slice(0, -1);
    
    const moveOptions = {
      force: options.force,
      dryRun: false,
      verbose: options.verbose,
      debugImports: options.debugImports,
      recursive: options.recursive,
      interactive: options.interactive && !options.force,
      tsConfigPath: options.tsconfig,
      extensions: options.extensions,
      noClobber: options.noClobber
    };
    
    try {
      await moveAction(sourceFiles, destination, moveOptions);
    } catch (error) {
      console.error('ts-import-move:', error.message);
      process.exit(1);
    }
  });

// Add dry-run subcommand for testing
program
  .command('dry-run')
  .arguments('<sources...>')
  .description('show what would be moved without actually moving')
  .option('-v, --verbose', 'explain what is being done', false)
  .option('--debug-imports', 'enable detailed import analysis debugging', false)
  .action(async (sources, options) => {
    if (sources.length < 2) {
      console.error('ts-import-move: missing destination file operand');
      process.exit(1);
    }
    
    const destination = sources[sources.length - 1];
    const sourceFiles = sources.slice(0, -1);
    
    const moveOptions = {
      force: false,
      dryRun: true,
      verbose: options.verbose,
      debugImports: options.debugImports,
      recursive: false,
      interactive: false,
      extensions: '.ts,.tsx,.js,.jsx'
    };
    
    try {
      await moveAction(sourceFiles, destination, moveOptions);
    } catch (error) {
      console.error('ts-import-move:', error.message);
      process.exit(1);
    }
  });

program.parse(); 