#!/usr/bin/env node

'use strict';

const path = require('path');
const compile = require('./index.js').compile;

if (process.argv.length < 3) {
  console.error('Please provide the path to the compiler options');
  process.exit(1);
}

compile(require(path.resolve(process.cwd(), process.argv[2])))
    .then(undefined, () => process.exit(1));
