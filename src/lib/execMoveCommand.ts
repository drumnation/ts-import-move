import { execSync } from 'child_process';

interface ExecMoveOptions {
  force?: boolean;
  verbose?: boolean;
}

/**
 * Executes a Unix mv command to move files or directories.
 * @param source Source file or directory path
 * @param destination Destination path
 * @param options Options for force/verbose
 */
export function execMoveCommand(
  source: string,
  destination: string,
  options: ExecMoveOptions = {}
): void {
  let cmd = 'mv';
  if (options.force) cmd += ' -f';
  cmd += ` "${source}" "${destination}"`;
  if (options.verbose) {
    // eslint-disable-next-line no-console
    console.log(`[execMoveCommand] Executing: ${cmd}`);
  }
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    if (options.verbose) {
      // eslint-disable-next-line no-console
      console.error(`[execMoveCommand] Error:`, err);
    }
    throw err;
  }
} 