#!/usr/bin/env node

// This is just a wrapper script that loads the compiled version
const { installCursorRules } = require('../dist/cli-install-rules.js');
installCursorRules(); 