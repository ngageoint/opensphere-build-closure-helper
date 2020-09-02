#!/usr/bin/env node

'use strict';

const path = require('path');
const {writeDeps} = require('./index.js');

if (process.argv.length < 4) {
  console.error('Usage: os-gendeps <gcc opts> <output>');
  process.exit(1);
}

const depsDirs = require(path.resolve(process.cwd(), process.argv[2]));
const outputFile = path.resolve(process.cwd(), process.argv[3]);
writeDeps(depsDirs, outputFile);
