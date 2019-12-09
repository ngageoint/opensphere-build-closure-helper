/* eslint-disable */
/**
 * Loads any queued dependencies until they are all loaded or paused.
 *
 * Modified from the original to limit concurrent script loads.
 *
 * @private
 */
goog.debugLoader_.loadDeps_ = function() {
  var loader = this;
  var paused = this.paused_;

  while (this.depsToLoad_.length && !paused) {
    (function() {
      //
      // Limit how many scripts can be loaded at once to avoid connection reset errors in Chrome.
      //
      if (loader.loadingDeps_.length >= 500) {
        setTimeout(loader.resume_.bind(loader), 500);
        paused = true;
        return;
      }

      var loadCallDone = false;
      var dep = loader.depsToLoad_.shift();

      var loaded = false;
      loader.loading_(dep);

      var controller = {
        pause: function() {
          if (loadCallDone) {
            throw new Error('Cannot call pause after the call to load.');
          } else {
            paused = true;
          }
        },
        resume: function() {
          if (loadCallDone) {
            loader.resume_();
          } else {
            // Some dep called pause and then resume in the same load call.
            // Just keep running this same loop.
            paused = false;
          }
        },
        loaded: function() {
          if (loaded) {
            throw new Error('Double call to loaded.');
          }

          loaded = true;
          loader.loaded_(dep);
        },
        pending: function() {
          // Defensive copy.
          var pending = [];
          for (var i = 0; i < loader.loadingDeps_.length; i++) {
            pending.push(loader.loadingDeps_[i]);
          }
          return pending;
        },
        /**
         * @param {goog.ModuleType} type
         */
        setModuleState: function(type) {
          goog.moduleLoaderState_ = {
            type: type,
            moduleName: '',
            declareLegacyNamespace: false
          };
        },
        /** @type {function(string, string, string=)} */
        registerEs6ModuleExports: function(
            path, exports, opt_closureNamespace) {
          if (opt_closureNamespace) {
            goog.loadedModules_[opt_closureNamespace] = {
              exports: exports,
              type: goog.ModuleType.ES6,
              moduleId: opt_closureNamespace || ''
            };
          }
        },
        /** @type {function(string, ?)} */
        registerGoogModuleExports: function(moduleId, exports) {
          goog.loadedModules_[moduleId] = {
            exports: exports,
            type: goog.ModuleType.GOOG,
            moduleId: moduleId
          };
        },
        clearModuleState: function() {
          goog.moduleLoaderState_ = null;
        },
        defer: function(callback) {
          if (loadCallDone) {
            throw new Error(
                'Cannot register with defer after the call to load.');
          }
          loader.defer_(dep, callback);
        },
        areDepsLoaded: function() {
          return loader.areDepsLoaded_(dep.requires);
        }
      };

      try {
        dep.load(controller);
      } finally {
        loadCallDone = true;
      }
    })();
  }

  if (paused) {
    this.pause_();
  }
};
