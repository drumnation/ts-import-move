#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

/**
 * Install ts-import-move rules to the Cursor rules folder
 */
export async function installCursorRules(): Promise<void> {
  try {
    // Source files in the package
    const packageDir = path.dirname(__dirname);
    const simpleRulePath = path.join(packageDir, 'rules', 'ts-import-move-simple.rules.mdc');
    const advancedRulePath = path.join(packageDir, 'rules', 'ts-import-move-advanced.rules.mdc');
    
    // Check if source files exist
    if (!fs.existsSync(simpleRulePath) || !fs.existsSync(advancedRulePath)) {
      console.error('Error: Rule files not found in the package.');
      console.error('Expected files:', simpleRulePath, advancedRulePath);
      process.exit(1);
    }

    // Target directory (.cursor/rules in user's home directory)
    const homeDir = os.homedir();
    const cursorRulesDir = path.join(homeDir, '.cursor', 'rules');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(cursorRulesDir)) {
      console.log('Creating Cursor rules directory...');
      fs.mkdirSync(cursorRulesDir, { recursive: true });
    }
    
    // Target file paths
    const targetSimpleRulePath = path.join(cursorRulesDir, 'ts-import-move-simple.rules.mdc');
    const targetAdvancedRulePath = path.join(cursorRulesDir, 'ts-import-move-advanced.rules.mdc');
    
    // Copy the files
    fs.copyFileSync(simpleRulePath, targetSimpleRulePath);
    fs.copyFileSync(advancedRulePath, targetAdvancedRulePath);
    
    console.log('\x1b[32m%s\x1b[0m', '✅ Successfully installed ts-import-move rules to your Cursor rules folder!');
    console.log('\nRule files installed:');
    console.log(`  - ${targetSimpleRulePath}`);
    console.log(`  - ${targetAdvancedRulePath}`);
    console.log('\nYou can now use these rules in Cursor by referencing them in your .cursorrules file:');
    console.log('\x1b[36m%s\x1b[0m', '{\n  "rules": [\n    "ts-import-move-simple.rules.mdc"\n  ]\n}');
    console.log('\nOr enable them in Cursor through the Command Palette: "Cursor: Load Rule"');
    
  } catch (error) {
    console.error('Error installing Cursor rules:', error);
    process.exit(1);
  }
}

// Export the function for direct import
// When used as a CLI tool, this will be run through the bin file 