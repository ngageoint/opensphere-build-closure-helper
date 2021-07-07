## [7.1.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v7.1.0...v7.1.1) (2021-07-07)


### Bug Fixes

* **closure:** detect multiline goog.require statements ([965f163](https://github.com/ngageoint/opensphere-build-closure-helper/commit/965f163bfbda4ee4960c2ae9bfd7a9fc63387fe5))

# [7.1.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v7.0.0...v7.1.0) (2021-07-06)


### Features

* **closure:** copy closurebuilder.py so it works with es modules ([46fcc7e](https://github.com/ngageoint/opensphere-build-closure-helper/commit/46fcc7e20c636a497e87476a834fcc71452660c3))

# [7.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v6.1.1...v7.0.0) (2021-04-21)


### Features

* **gcc:** update closure compiler to 20210406 ([339dd1c](https://github.com/ngageoint/opensphere-build-closure-helper/commit/339dd1c58b06c85e202f7567868b5081dabf82b0))
* **goog:** update closure library to 20210406 ([8cdb5f8](https://github.com/ngageoint/opensphere-build-closure-helper/commit/8cdb5f8580389c980c5b478bdd4b40ee6769f2e0))


### BREAKING CHANGES

* **gcc:** The updated compiler will find additional errors from previous
versions, and is not compatible with old versions of the Closure library.
Projects will need to update the library and resolve build errors.

## [6.1.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v6.1.0...v6.1.1) (2021-01-18)


### Bug Fixes

* **deps:** only add prefixes for directories that exist ([b7fa44a](https://github.com/ngageoint/opensphere-build-closure-helper/commit/b7fa44a210ba332f9f995f9884b78f4c6aab8703))

# [6.1.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v6.0.0...v6.1.0) (2021-01-12)


### Features

* **es6:** detect es6 modules declaring a Closure namespace ([012238a](https://github.com/ngageoint/opensphere-build-closure-helper/commit/012238a452eb0e74171c0714ee97e78139f154d6))

# [6.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v5.2.0...v6.0.0) (2020-09-08)


### Features

* **gcc:** update closure compiler to 20200830.0.0 ([151599d](https://github.com/ngageoint/opensphere-build-closure-helper/commit/151599d077dad22fd7635f9fa9786d21a0a8d5a3))


### BREAKING CHANGES

* **gcc:** The latest Closure Compiler has removed the useOfGoogBase error
group, and changed the API for some Angular externs.

# [5.2.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v5.1.0...v5.2.0) (2020-09-03)


### Features

* **deps:** add script to write closure deps ([80c32ea](https://github.com/ngageoint/opensphere-build-closure-helper/commit/80c32ea02e50a69abd5d5c54da49937f023817bf))

# [5.1.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v5.0.1...v5.1.0) (2020-05-07)


### Features

* gate native compiler use on env ([7c47d29](https://github.com/ngageoint/opensphere-build-closure-helper/commit/7c47d292bd7de3e47fca8895fec9e88fa16ec806))

## [5.0.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v5.0.0...v5.0.1) (2020-04-28)


### Bug Fixes

* keep java version as fallback ([4bcb237](https://github.com/ngageoint/opensphere-build-closure-helper/commit/4bcb2373818bfee8b92c1540a2e2ea1cb2a1d812))

# [5.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.5...v5.0.0) (2020-02-03)


### Features

* **gcc:** display compiler version when compiling ([e892fd0](https://github.com/ngageoint/opensphere-build-closure-helper/commit/e892fd0660cafbd7ae4b51a66f48dc3411102e14))
* **goog:** update closure compiler to latest ([c16642a](https://github.com/ngageoint/opensphere-build-closure-helper/commit/c16642a54fed48efe7e68477ef58d631f0b3e5b9))


### BREAKING CHANGES

* **goog:** The Closure Compiler update changes available error
groups. This requires opensphere-build-resolver@7.0.0. The compiler
update may also report new errors in compiled code.

## [4.0.5](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.4...v4.0.5) (2020-01-31)


### Bug Fixes

* **goog:** resolve the closure library from the cwd first ([a2a8589](https://github.com/ngageoint/opensphere-build-closure-helper/commit/a2a85894ec8694536b6baf695d33b6463029c5cd))

## [4.0.4](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.3...v4.0.4) (2020-01-27)


### Bug Fixes

* **goog:** only merge exports if declareLegacyNamespace called ([dec8cee](https://github.com/ngageoint/opensphere-build-closure-helper/commit/dec8ceeb142ed827a5c34bfc845f40c5d73a1d05))

## [4.0.3](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.2...v4.0.3) (2020-01-20)


### Bug Fixes

* **goog:** prevent modules from replacing an existing legacy namespace ([0ab60c2](https://github.com/ngageoint/opensphere-build-closure-helper/commit/0ab60c2724a2fc47e2ce2dd7d9099ba97e860fc8))

## [4.0.2](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.1...v4.0.2) (2020-01-02)


### Bug Fixes

* **debug:** patch goog debug loader to throttle dependencies ([975c1e5](https://github.com/ngageoint/opensphere-build-closure-helper/commit/975c1e556be31c7307d7e5d80d2bb27c3923bde1))

## [4.0.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v4.0.0...v4.0.1) (2019-12-09)


### Bug Fixes

* **debug:** allow the caller to handle debug loader rejection ([01e9a89](https://github.com/ngageoint/opensphere-build-closure-helper/commit/01e9a89ad460dfd1aba0fcaa8d889f9f578abb1c))

# [4.0.0](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v3.0.1...v4.0.0) (2019-11-27)


### Bug Fixes

* **goog:** reject promise if closure scripts cannot be found ([c05b35c](https://github.com/ngageoint/opensphere-build-closure-helper/commit/c05b35c1cfaaafb3dfc9abdab510a149def0c758))


### Features

* **debug:** create an app loader that uses the gcc debug loader ([f7afbf7](https://github.com/ngageoint/opensphere-build-closure-helper/commit/f7afbf71fcfdbf8f267397e824003dd5904e4511))


### BREAKING CHANGES

* **goog:** Builds will now fail if they attempt to run closurebuilder.py
or depswriter.py and the script cannot be found.

## [3.0.1](https://github.com/ngageoint/opensphere-build-closure-helper/compare/v3.0.0...v3.0.1) (2019-07-04)


### Bug Fixes

* **compile:** Exit the process when the compiler fails. ([ae9f68a](https://github.com/ngageoint/opensphere-build-closure-helper/commit/ae9f68a))

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
