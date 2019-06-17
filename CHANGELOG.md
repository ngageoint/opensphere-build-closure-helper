# [3.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v2.0.0...v3.0.0) (2019-06-17)


### Features

* **compile:** Use the compiler's JS API instead of invoking a Java process. ([1ceb89f](https://github.com/ngageoint/opensphere-build-closure-helper/commit/1ceb89f))


### BREAKING CHANGES

* **compile:** The os-compile executable now requires a path to the Closure Compiler options as a JSON file, instead of a list of arguments for the Java compiler.

# [2.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.3.1...v2.0.0) (2019-05-01)


### Features

* **compiler:** Upgrade compiler/library to 20190415. ([81baa0b](https://github.com/ngageoint/opensphere-build-closure-helper/commit/81baa0b))


### BREAKING CHANGES

* **compiler:** Projects must be compliant with compiler checks for v20190415.0.0.

## [1.3.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.3.0...v1.3.1) (2019-05-01)


### Bug Fixes

* **compiler:** Pin compiler version. ([0fd58cf](https://github.com/ngageoint/opensphere-build-closure-helper/commit/0fd58cf))

# [1.3.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.2.1...v1.3.0) (2019-04-30)


### Features

* **compiler:** upgrade compiler and library ([8a8539d](https://github.com/ngageoint/opensphere-build-closure-helper/commit/8a8539d))

<a name="1.2.1"></a>
## [1.2.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.2.0...v1.2.1) (2018-01-05)


### Bug Fixes

* **gcc:** Exit the process when os-compile fails. ([998351f](https://github.com/ngageoint/opensphere-build-closure-helper/commit/998351f))

<a name="1.2.0"></a>
# [1.2.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.1.0...v1.2.0) (2018-01-04)


### Features

* **node_modules:** Resolve node_modules paths with require. ([ef724b6](https://github.com/ngageoint/opensphere-build-closure-helper/commit/ef724b6))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v1.0.0...v1.1.0) (2018-01-04)


### Features

* **closure:** Update Closure library to v20171203. ([4ebca2d](https://github.com/ngageoint/opensphere-build-closure-helper/commit/4ebca2d))

<a name="0.2.0"></a>
# 0.2.0 (2016-11-30)

### Features

* **manifest:** Create a closure file manifest using the closurebuilder.py script ([b59aa58](https://gitlab.devops.geointservices.io/uncanny-cougar/bits-closure-helper/commit/b59aa58))



<a name="0.1.2"></a>
## [0.1.2](http://git.stwan.bits:7999/wv/bits-closure-helper/compare/v0.1.1...v0.1.2) (2016-12-06)


### Bug Fixes

* **manifest:** Resolve symlinks in paths returned by closurebuilder.py ([7c69609](http://git.stwan.bits:7999/wv/bits-closure-helper/commits/7c69609))



<a name="0.1.1"></a>
## 0.1.1 (2016-12-01)


### Bug Fixes

* **manifest:** Search additional locations for google-closure-library ([1093855](http://git.stwan.bits:7999/wv/bits-closure-helper/commits/1093855))


<a name="0.1.0"></a>
# 0.1.0 (2016-11-10)
