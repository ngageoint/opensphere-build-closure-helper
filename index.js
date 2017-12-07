'use strict';

const Promise = require('bluebird');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const pythonCmd = 'python';
const closureBuilder = path.join('google-closure-library', 'closure', 'bin',
    'build', 'closurebuilder.py');

/**
 * Create a Closure manifest.
 * @param {Object} options The Closure compiler options
 * @param {string} basePath The base path
 * @return {Promise} A promise that resolves to the generated manifest
 */
const createManifest = function(options, basePath) {
  basePath = basePath || options.basePath;

  // if installed as a dependency, google-closure-library may be up a directory
  var searchPaths = [
    path.resolve(__dirname, 'node_modules', closureBuilder),
    path.resolve(__dirname, '..', closureBuilder)
  ];

  var gcbPath = searchPaths.find(function(searchPath) {
    return fs.existsSync(searchPath);
  });

  if (!gcbPath) {
    console.error('ERROR: Could not locate closurebuilder.py!');
    return Promise.resolve();
  }

  var args = [gcbPath];
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
      if (data.startsWith(gcbPath)) {
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

module.exports = {
  createManifest: createManifest,
  fileToLines: fileToLines,
  readManifest: readManifest
};
