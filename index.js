'use strict';

const Compiler = require('google-closure-compiler').compiler;
const {getNativeImagePath} = require('google-closure-compiler/lib/utils');
const Promise = require('bluebird');
const childProcess = require('child_process');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const pythonCmd = 'python';

const closureLibPath = path.dirname(require.resolve(path.join('google-closure-library', 'package.json'), {
  // try cwd first to get the version required by the application
  paths: [process.cwd(), __dirname]
}));
const closureSrcPath = path.join(closureLibPath, 'closure', 'goog');
const closureBinPath = path.join(closureLibPath, 'closure', 'bin', 'build');
const closureBuilder = path.join(closureBinPath, 'closurebuilder.py');
const depsWriter = path.join(closureBinPath, 'depswriter.py');

/**
 * Run the Closure Compiler with the provided options.
 * @param {Object} options The compiler options.
 * @return {Promise} A promise that resolves when compilation is finished.
 */
const compile = function(options) {
  const gccPackage = require('google-closure-compiler/package.json');
  console.log(`Closure Compiler version: ${gccPackage.version}`);

  const compiler = new Compiler(options);

  // use native versions so we don't have a dep on Java
  compiler.JAR_PATH = null;
  compiler.javaPath = getNativeImagePath();

  if (!compiler.javaPath) {
    const platformMap = {
      'linux': 'linux',
      'darwin': 'osx',
      'win32': 'windows'
    };

    const platform = platformMap[process.platform];
    throw new Error(`Could not find google-closure-compiler-${platform}/compiler`);
  }

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
    return Promise.reject('Could not locate closurebuilder.py!');
  }

  const roots = options.js.filter(notExclude).map(mapRoot);
  const namespaces = options.entry_point.map(mapNamespace);
  const args = [closureBuilder, ...roots, ...namespaces];

  console.log('Creating file manifest with Closure builder...');

  return execPythonCmd(args).then(function(output) {
    let files = output.split('\n').filter(function(file) {
      return Boolean(file);
    });

    if (basePath) {
      files = files.map(function(file) {
        // resolve links in the file path
        file = fs.realpathSync(file);

        return path.relative(basePath, file);
      });
    }

    return files;
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
  let files = fileToLines(manifestPath);

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
    return Promise.reject('Could not locate depswriter.py!');
  }

  const roots = options.js.filter(notExclude).filter(notGoog).map(mapRootWithPrefix);
  const args = [depsWriter, ...roots];

  console.log('Creating debug application loader...');

  return execPythonCmd(args).then(function(output) {
    // bootstrap each entry_point namespace to load the application
    const bootstrapNamespaces = options.entry_point.map(mapBootstrapNamespace).join(',');

    // TODO: remove when https://github.com/google/closure-library/issues/1004 is addressed
    const depLoadThrottleMixin = `(function() {
goog.DebugLoader_.prototype.maxLoading_ = 500;

var origLoadDeps = goog.DebugLoader_.prototype.loadDeps_;
goog.DebugLoader_.prototype.loadDeps_ = function() {
  origLoadDeps.call(this);

  if (this.loadingDeps_.length >= this.maxLoading_) {
    this.pause_();
  }
};

var origLoaded = goog.DebugLoader_.prototype.loaded_;
goog.DebugLoader_.prototype.loaded_ = function(dep) {
  origLoaded.call(this, dep);

  if (this.paused_ && this.loadingDeps_.length < this.maxLoading_) {
    this.resume_();
  }
};
})();`;

    //
    // If the module namespace already exists on window, goog.module.declareLegacyNamespace will cause the loader to
    // replace the existing object with the module's exports. This will drop anything previously loaded in the
    // namespace. To fix this problem, use the existing object from window as the module exports.
    //
    const assignExportsMixin = `(function() {
var getExistingExports = function() {
  if (goog.moduleLoaderState_.moduleName) {
    var moduleParts = goog.moduleLoaderState_.moduleName.split('.');
    var current = window;
    while (moduleParts.length && current.hasOwnProperty(moduleParts[0])) {
      current = current[moduleParts.shift()];
      if (!moduleParts.length) {
        return current;
      }
    }
  }
  return undefined;
};

goog.loadModuleFromSource_ = /** @type {function(string):?} */ (function() {
  'use strict';
  var exports = {};
  eval(arguments[0]);

  // if declareLegacyNamespace was called, the module's exports will be set at the module's namespace on the global
  // window object. if that object already exists, merge the exports into it and set that as the exports.
  var __existingExports__ = getExistingExports();
  if (goog.moduleLoaderState_.declareLegacyNamespace && __existingExports__ &&
      Object.getPrototypeOf(exports) === Object.prototype) {
    Object.assign(__existingExports__, exports);
    exports = __existingExports__;
  }

  return exports;
});
})();`;

    const bootstrapJs = `goog.bootstrap([${bootstrapNamespaces}]);`;

    const fileContent = [
      output,
      depLoadThrottleMixin,
      assignExportsMixin,
      // force goog.modules to wait for legacy goog.provide files to load
      'goog.Dependency.defer_ = true;',
      bootstrapJs
    ];

    console.log('Writing ' + outputFile);

    return fs.writeFileAsync(outputFile, fileContent.join('\n'));
  });
};

/**
 * Turns a file into an array of lines
 *
 * @param {string} path The path to the file
 * @return {Array<string>} The file split into lines
 */
const fileToLines = function(path) {
  const manifest = fs.readFileSync(path, 'utf8');

  return manifest.split(/[\r\n]+/).filter(function(item) {
    return Boolean(item);
  });
};

/**
 * Filter out exclusion glob patterns.
 * @param {string} pattern The pattern
 * @return {boolean} If the pattern is an exclusion
 */
const notExclude = function(pattern) {
  return !pattern.startsWith('!');
};

/**
 * Filter out exclusion glob patterns.
 * @param {string} pattern The pattern
 * @return {boolean} If the pattern is an exclusion
 */
const notGoog = function(pattern) {
  return pattern.indexOf('google-closure-library') === -1;
};

/**
 * Convert an entry point to a namespace string for `goog.bootstrap`.
 * @param {string} entry The entry point
 * @return {boolean} The argument
 */
const mapBootstrapNamespace = function(entry) {
  return `'${entry.replace(/^goog:/, '')}'`;
};

/**
 * Convert an entry point to a `--namespace` argument for `closurebuilder.py`.
 * @param {string} entry The entry point
 * @return {boolean} The argument
 */
const mapNamespace = function(entry) {
  return '--namespace=' + entry.replace(/^goog:/, '');
};

/**
 * Convert a glob pattern to a `--root` argument for `closurebuilder.py`.
 * @param {string} pattern The pattern
 * @return {boolean} The argument
 */
const mapRoot = function(pattern) {
  return '--root=' + pattern.replace(/\*\*\.js$/, '');
};

/**
 * Convert a glob pattern to a `--root_with_prefix` argument for `depswriter.py`.
 * @param {string} pattern The pattern
 * @return {boolean} The argument
 */
const mapRootWithPrefix = function(pattern) {
  pattern = pattern.replace(/\*\*\.js$/, '');

  const relPath = path.relative(closureSrcPath, pattern);
  return `--root_with_prefix=${pattern} ${relPath}`;
};

/**
 * Execute a Python command.
 * @param {Array} args The arguments.
 * @return {Promise} A promise that resolves to the command output, or is rejected if there is an error.
 */
const execPythonCmd = function(args) {
  return new Promise(function(resolve, reject) {
    console.log(pythonCmd, args);

    const process = childProcess.spawn(pythonCmd, args);
    let errorData = '';
    let outputData = '';

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
      reject(err.code === 'ENOENT' ? 'Python not found in path.' : (err.message || 'Command failed.'));
    });

    // handle python script complete
    process.on('exit', function(code) {
      if (code) {
        reject(errorData);
      } else {
        resolve(outputData);
      }
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
