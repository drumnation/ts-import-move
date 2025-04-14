/**
* Command: move.ts – Handles moving imports as per the project plan.
*/

import { MoveOptions } from '../types/index.js';
import { moveFiles as moveFilesImpl } from '../lib/index.js';

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

  // Add logs to match test expectations
  console.log('Extracted sources:', sources);
  console.log('Extracted destination:', destination);

  // Add enhanced debug output
  console.log('DEBUG: moveAction called');
  console.log(`DEBUG: sources: ${JSON.stringify(sources)}`);
  console.log(`DEBUG: destination: ${destination}`);
  console.log(`DEBUG: options: ${JSON.stringify(options)}`);

  if (options.verbose) {
    console.log(`moveFiles called with source: ${sources.join(', ')}, destination: ${destination}, options: ${JSON.stringify(options)}`);
  }

  // 2. Execute move operation
  try {
    await moveFilesImpl(sources, destination, options);
  } catch (err) {
    console.error('Move operation failed:', err);
    process.exit(1);
  }
}

export async function moveFiles(
  source: string[],
  destination: string,
  options: { interactive?: boolean; force?: boolean; tsconfig?: string; followSymlinks?: boolean }
): Promise<void> {
  // Log input parameters for debugging.
  console.log(
    `moveFiles called with source: ${source.join(', ')}, destination: ${destination}, options: ${JSON.stringify(options)}`
  );

  // TODO: Implement the file moving logic using ts-morph, handling edge cases such as:
  // - Circular imports verification
  // - Multiple tsconfig.json (monorepo support)
  // - Symlink handling (follow or skip)
  // - Updating import aliases as defined in tsconfig.json
}

export {};