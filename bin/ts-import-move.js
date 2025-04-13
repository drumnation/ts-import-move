#!/usr/bin/env node

// Simple wrapper script for dynamic import
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the ESM version
const modulePath = resolve(__dirname, '../dist/index.js');
const child = spawn(process.execPath, [modulePath, ...process.argv.slice(2)], { 
  stdio: 'inherit'
});

child.on('close', code => {
  process.exit(code);
}); 