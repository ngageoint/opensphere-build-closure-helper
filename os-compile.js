#!/usr/bin/env node

'use strict';

const ClosureCompiler = require('google-closure-compiler').compiler;
const childProcess = require('child_process');
const Promise = require('bluebird');

let args;
if (process.argv.length < 3) {
  console.error('Please provide the compiler arguments');
  process.exit(1);
} else {
  args = process.argv.slice(2);
}

const compile = function(args) {
  return new Promise(function(resolve, reject) {
    let javaArgs = ['-jar', ClosureCompiler.COMPILER_PATH].concat(args);

    const javaProcess = childProcess.spawn('java', javaArgs);
    javaProcess.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    javaProcess.stderr.on('data', function(data) {
      console.log(data.toString());
    });

    javaProcess.on('error', function(err) {
      throw new Error('Closure Compiler failed: ' + (err.message || 'Unspecified error'));
    });

    javaProcess.on('exit', function(code) {
      if (code) {
        process.exit(code);
      }

      resolve();
    });
  });
};

compile(args);
