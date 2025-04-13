#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

/**
 * Create an interactive readline interface
 */
function createPrompt(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Install ts-import-move rules to the Cursor rules folder
 */
export async function installCursorRules(): Promise<void> {
  try {
    // Create __dirname equivalent for ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
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
    
    // Create interactive prompt
    const rl = createPrompt();
    console.log('\n🛠️  ts-import-move Cursor Rules Installer\n');
    console.log('Which rules would you like to install?\n');
    console.log('1. Simple Rules - Basic rules for replacing mv with ts-import-move');
    console.log('   (Best for basic usage, smaller context size for AI agents)');
    console.log('2. Advanced Rules - More comprehensive rules with additional patterns and examples');
    console.log('   (Best for complex refactoring needs, larger context size for AI agents)');
    console.log('3. Both (Install both but use selectively)\n');
    
    const answer = await new Promise<string>(resolve => {
      rl.question('Enter your choice (1-3) [1]: ', (answer) => {
        rl.close();
        // Default to option 1 (simple rules) if empty
        resolve(answer || '1');
      });
    });
    
    const installSimple = ['1', '3'].includes(answer);
    const installAdvanced = ['2', '3'].includes(answer);
    
    if (!installSimple && !installAdvanced) {
      console.log('Invalid choice. Please run the command again and select options 1-3.');
      process.exit(1);
    }
    
    // Install selected rules
    if (installSimple) {
      fs.copyFileSync(simpleRulePath, targetSimpleRulePath);
      console.log(`Installed simple rules to: ${targetSimpleRulePath}`);
    }
    
    if (installAdvanced) {
      fs.copyFileSync(advancedRulePath, targetAdvancedRulePath);
      console.log(`Installed advanced rules to: ${targetAdvancedRulePath}`);
    }
    
    console.log('\n\x1b[32m%s\x1b[0m', '✅ Successfully installed ts-import-move rules to your Cursor rules folder!');
    console.log('\nRule files installed:');
    if (installSimple) console.log(`  - ${targetSimpleRulePath}`);
    if (installAdvanced) console.log(`  - ${targetAdvancedRulePath}`);
    console.log('\nYou can now use these rules in Cursor by referencing them in your .cursorrules file:');
    
    // Show example JSON based on installed rules
    let exampleJson = '{\n  "rules": [';
    if (installSimple) exampleJson += '\n    "ts-import-move-simple.rules.mdc"';
    if (installSimple && installAdvanced) exampleJson += ',';
    if (installAdvanced) exampleJson += '\n    "ts-import-move-advanced.rules.mdc"';
    exampleJson += '\n  ]\n}';
    
    console.log('\x1b[36m%s\x1b[0m', exampleJson);
    console.log('\nOr enable them in Cursor through the Command Palette: "Cursor: Load Rule"');
    
  } catch (error) {
    console.error('Error installing Cursor rules:', error);
    process.exit(1);
  }
}

// Export the function for direct import
// When used as a CLI tool, this will be run through the bin file 