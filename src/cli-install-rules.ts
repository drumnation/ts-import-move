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
 * Find the project root by looking for package.json upwards from current directory
 */
function findProjectRoot(startDir: string = process.cwd()): string {
  // Start from the current directory and go up until we find package.json
  let currentDir = startDir;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    // Go up one level
    currentDir = path.dirname(currentDir);
  }
  // If no package.json found, fall back to current working directory
  return process.cwd();
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

    // Find project root directory
    const projectRoot = findProjectRoot();
    
    // Ask user if they want to install globally or locally
    const rl = createPrompt();
    console.log('\n🛠️  ts-import-move Cursor Rules Installer\n');
    
    console.log('Where would you like to install the rules?\n');
    console.log('1. Locally (to current project) - for use in this project only');
    console.log(`   Path: ${projectRoot}/.cursor/rules/`);
    console.log('2. Globally (to user home directory) - for use in all projects');
    console.log('   Path: ~/.cursor/rules/\n');
    
    const locationAnswer = await new Promise<string>(resolve => {
      rl.question('Enter your choice (1-2) [1]: ', (answer) => {
        // Default to option 1 (local) if empty
        resolve(answer || '1');
      });
    });
    
    let cursorRulesDir: string;
    let isGlobalInstall = false;
    
    if (locationAnswer === '2') {
      // Global installation to user home directory
      isGlobalInstall = true;
      const homeDir = os.homedir();
      cursorRulesDir = path.join(homeDir, '.cursor', 'rules');
      console.log('Installing globally to user home directory...');
    } else {
      // Local installation to project directory (default)
      cursorRulesDir = path.join(projectRoot, '.cursor', 'rules');
      console.log(`Installing locally to project directory: ${projectRoot}`);
    }
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(cursorRulesDir)) {
      console.log('Creating Cursor rules directory...');
      fs.mkdirSync(cursorRulesDir, { recursive: true });
    }
    
    // Target file paths
    const targetSimpleRulePath = path.join(cursorRulesDir, 'ts-import-move-simple.rules.mdc');
    const targetAdvancedRulePath = path.join(cursorRulesDir, 'ts-import-move-advanced.rules.mdc');
    
    // Now ask which rules they want to install
    console.log('\nWhich rules would you like to install?\n');
    console.log('1. Simple Rules - Basic rules for replacing mv with ts-import-move');
    console.log('   (Best for basic usage, smaller context size for AI agents)');
    console.log('2. Advanced Rules - More comprehensive rules with additional patterns and examples');
    console.log('   (Best for complex refactoring needs, larger context size for AI agents)');
    console.log('3. Both\n');
    
    const rulesAnswer = await new Promise<string>(resolve => {
      rl.question('Enter your choice (1-3) [1]: ', (answer) => {
        rl.close();
        // Default to option 1 (simple rules) if empty
        resolve(answer || '1');
      });
    });
    
    const installSimple = ['1', '3'].includes(rulesAnswer);
    const installAdvanced = ['2', '3'].includes(rulesAnswer);
    
    if (!installSimple && !installAdvanced) {
      console.log('Invalid choice. Please run the command again and select options 1-3.');
      process.exit(1);
    }
    
    // Install selected rules
    if (installSimple) {
      console.log('Copying simple rule...');
      try {
        fs.copyFileSync(simpleRulePath, targetSimpleRulePath);
        console.log('Copy succeeded for simple rule');
      } catch (err) {
        console.error('Error copying simple rule:', err);
        throw err;
      }
      console.log(`Installed simple rules to: ${targetSimpleRulePath}`);
    }
    
    if (installAdvanced) {
      console.log('Copying advanced rule...');
      try {
        fs.copyFileSync(advancedRulePath, targetAdvancedRulePath);
        console.log('Copy succeeded for advanced rule');
      } catch (err) {
        console.error('Error copying advanced rule:', err);
        throw err;
      }
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
    
    if (isGlobalInstall) {
      console.log('\nOr enable them in Cursor through the Command Palette: "Cursor: Load Rule"');
    } else {
      // If local install, offer to create/update .cursorrules file
      const cursorrules = path.join(projectRoot, '.cursorrules');
      const createCursorRules = await new Promise<boolean>(resolve => {
        const innerRl = createPrompt();
        innerRl.question('\nWould you like to create/update .cursorrules file in this project? (y/n) [y]: ', (answer) => {
          innerRl.close();
          resolve(answer.toLowerCase() !== 'n');
        });
      });
      
      if (createCursorRules) {
        try {
          let cursorrulesContent: { rules?: string[] } = {};
          
          // Try to read existing file
          if (fs.existsSync(cursorrules)) {
            cursorrulesContent = JSON.parse(fs.readFileSync(cursorrules, 'utf8'));
          }
          
          // Ensure rules array exists
          if (!cursorrulesContent.rules) {
            cursorrulesContent.rules = [];
          }
          
          // Add rules if not already there
          if (installSimple && !cursorrulesContent.rules.includes('ts-import-move-simple.rules.mdc')) {
            cursorrulesContent.rules.push('ts-import-move-simple.rules.mdc');
          }
          
          if (installAdvanced && !cursorrulesContent.rules.includes('ts-import-move-advanced.rules.mdc')) {
            cursorrulesContent.rules.push('ts-import-move-advanced.rules.mdc');
          }
          
          // Write back to file
          fs.writeFileSync(cursorrules, JSON.stringify(cursorrulesContent, null, 2), 'utf8');
          console.log(`\nUpdated ${cursorrules} with installed rules.`);
        } catch (err) {
          console.error('Error updating .cursorrules file:', err);
        }
      }
    }
    
  } catch (error) {
    console.error('Error installing Cursor rules:', error);
    process.exit(1);
  }
}

// Export the function for direct import
// When used as a CLI tool, this will be run through the bin file 