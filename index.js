'use strict';

const Compiler = require('google-closure-compiler').compiler;
const Promise = require('bluebird');
const childProcess = require('child_process');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const pythonCmd = 'python';

const closureLibPath = path.dirname(require.resolve(path.join('google-closure-library', 'package.json')));
const closureSrcPath = path.join(closureLibPath, 'closure', 'goog');
const closureBuilder = path.join(closureLibPath, 'closure', 'bin', 'build', 'closurebuilder.py');
const depsWriter = path.join(closureLibPath, 'closure', 'bin', 'build', 'depsWriter.py');

/**
 * Run the Closure Compiler with the provided options.
 * @param {Object} options The compiler options.
 * @return {Promise} A promise that resolves when compilation is finished.
 */
const compile = function(options) {
  const compiler = new Compiler(options);
  return new Promise(function(resolve, reject) {
    compiler.run((exitCode, stdOut, stdErr) => {
      if (exitCode) {
        process.stderr.write(stdErr, () => reject(exitCode));
      } else {
        process.stderr.write(stdErr);
        process.stdout.write(stdOut);
        resolve();
      }
    });
  });
};

/**
 * Create a Closure manifest.
 * @param {Object} options The Closure compiler options
 * @param {string} basePath The base path
 * @return {Promise} A promise that resolves to the generated manifest
 */
const createManifest = function(options, basePath) {
  basePath = basePath || options.basePath;

  if (!closureBuilder || !fs.existsSync(closureBuilder)) {
    console.error('ERROR: Could not locate closurebuilder.py!');
    return Promise.resolve();
  }

  var args = [closureBuilder];
  args = args.concat(options.js.filter(function(path) {
    return path.indexOf('!') !== 0;
  }).map(function(path) {
    return '--root=' + path.replace(/\*\*\.js$/, '');
  }));

  args = args.concat(options.entry_point.map(function(entry) {
    return '--namespace=' + entry.replace(/^goog:/, '');
  }));

  return new Promise(function(resolve, reject) {
    console.log('Creating file manifest with Closure builder...');
    console.log(pythonCmd, args);

    var process = childProcess.spawn(pythonCmd, args);
    var errorData = '';
    var outputData = '';

    // listen for source files
    process.stdout.on('data', function(data) {
      outputData += data.toString();
    });

    // listen for source files
    process.stderr.on('data', function(data) {
      data = data.toString().trim();

      // the Python logging module logs to stderr by default, so even info
      // messages will appear in stderr. detect these and write them to the
      // console
      if (data.startsWith(closureBuilder)) {
        console.log(data);
      } else {
        errorData += data;
      }
    });

    process.on('error', function(err) {
      console.error('ERROR: Failed creating manifest:');

      if (err.code === 'ENOENT') {
        console.error('Python not found in path.');
      } else {
        console.error(err.message || 'Closure builder process failed.');
      }

      reject();
    });

    // handle python script complete
    process.on('exit', function(code) {
      if (code) {
        console.error('ERROR: failed to create manifest');
        console.error(errorData);
        reject();
      }

      var files = outputData.split('\n').filter(function(file) {
        return Boolean(file);
      });

      if (basePath) {
        files = files.map(function(file) {
          // resolve links in the file path
          file = fs.realpathSync(file);

          return path.relative(basePath, file);
        });
      }

      resolve(files);
    });
  });
};

/**
 * Turns a file into an array of lines
 *
 * @param {string} path The path to the file
 * @return {Array<string>} The file split into lines
 */
const fileToLines = function(path) {
  var manifest = fs.readFileSync(path, 'utf8');

  return manifest.split(/[\r\n]+/).filter(function(item) {
    return Boolean(item);
  });
};

/**
 * Reads a manifest file from the Google Closure Compiler and converts each
 * path to a relative path from the given base path
 *
 * @param {string} manifestPath The path to the GCC manifest file
 * @param {string=} optBasePath Optional base path. If not set, the file paths will be unchanged.
 * @return {Array<string>} The array of file paths listed in the manifest
 */
const readManifest = function(manifestPath, optBasePath) {
  var files = fileToLines(manifestPath);

  if (optBasePath) {
    files = files.map(function(file) {
      return path.relative(optBasePath, file);
    });
  }

  return files;
};

/**
 * Writes a debug application loader that defines Closure dependencies and bootstraps the application.
 * @param {Object} options The Closure compiler options.
 * @param {string} outputFile The output file.
 * @return {Promise} A promise that resolves when the file is written.
 */
const writeDebugLoader = function(options, outputFile) {
  if (!depsWriter || !fs.existsSync(depsWriter)) {
    console.error('ERROR: Could not locate depswriter.py!');
    return Promise.resolve();
  }

  var args = [depsWriter];
  args = args.concat(options.js.filter(function(jsPath) {
    // the closure library provides its own deps file
    return jsPath.indexOf('!') !== 0 && jsPath.indexOf('google-closure-library') === -1;
  }).map(function(jsPath) {
    jsPath = jsPath.replace(/\*\*\.js$/, '');

    const relPath = path.relative(closureSrcPath, jsPath);
    return `--root_with_prefix=${jsPath} ${relPath}`;
  }));

  return new Promise(function(resolve, reject) {
    console.log('Creating debug application loader...');
    console.log(pythonCmd, args);

    var process = childProcess.spawn(pythonCmd, args);
    var errorData = '';
    var outputData = '';

    // listen for source files
    process.stdout.on('data', function(data) {
      outputData += data.toString();
    });

    // listen for source files
    process.stderr.on('data', function(data) {
      data = data.toString().trim();

      // the Python logging module logs to stderr by default, so even info
      // messages will appear in stderr. detect these and write them to the
      // console
      if (data.startsWith(depsWriter)) {
        console.log(data);
      } else {
        errorData += data;
      }
    });

    process.on('error', function(err) {
      console.error('ERROR: Failed creating debug application loader:');

      if (err.code === 'ENOENT') {
        console.error('Python not found in path.');
      } else {
        console.error(err.message || 'Deps writer process failed.');
      }

      reject();
    });

    // handle python script complete
    process.on('exit', function(code) {
      if (code) {
        console.error('ERROR: failed to create debug application loader');
        console.error(errorData);
        reject();
      }

      // bootstrap each entry_point namespace to load the application
      var bootstrapNamespaces = options.entry_point.map(function(entry) {
        return `'${entry.replace(/^goog:/, '')}'`;
      }).join(',');
      var bootstrapJs = `goog.bootstrap([${bootstrapNamespaces}]);`;

      var fileContent = [
        outputData,
        // force goog.modules to wait for legacy goog.provide files to load
        'goog.Dependency.defer_ = true;',
        bootstrapJs
      ];

      console.log('Writing ' + outputFile);
      fs.writeFileAsync(outputFile, fileContent.join('\n')).then(resolve, reject);
    });
  });
};

module.exports = {
  compile: compile,
  writeDebugLoader: writeDebugLoader,
  createManifest: createManifest,
  fileToLines: fileToLines,
  readManifest: readManifest
};
