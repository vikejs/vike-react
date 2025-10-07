## [0.1.9](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.8...vike-react-query@0.1.9) (2025-10-06)


### Bug Fixes

* also unsubscribe upon stream failure ([c3555ee](https://github.com/vikejs/vike-react/commit/c3555eefda8d2ff62f9b1a10fe434590cb11758a))



## [0.1.8](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.7...vike-react-query@0.1.8) (2025-10-06)


### Bug Fixes

* unsubscribe query cache ([#193](https://github.com/vikejs/vike-react/issues/193)) ([2913ebe](https://github.com/vikejs/vike-react/commit/2913ebe284c8312f7d941c8c9730cd7a72c25524))


### MINOR BREAKING CHANGES

> [!NOTE]
> We recommend ignoring `MINOR BREAKING CHANGES` unless this version breaks your app, see [Vike Versioning](https://vike.dev/versioning).

* update vike-react to `0.6.8` or above



## [0.1.7](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.6...vike-react-query@0.1.7) (2025-10-06)


### Bug Fixes

* also send pre-fetched queries to client ([#192](https://github.com/vikejs/vike-react/issues/192)) ([953930c](https://github.com/vikejs/vike-react/commit/953930cecd3baa1ec2ac5f0f8408e1151c915506))



## [0.1.6](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.5...vike-react-query@0.1.6) (2025-09-16)


### Bug Fixes

* react-streaming@^0.4.4 ([6420a27](https://github.com/vikejs/vike-react/commit/6420a277e86d0cf829de21f2a22fcf070f1075cd))



## [0.1.5](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.4...vike-react-query@0.1.5) (2025-07-01)


### Bug Fixes

* fix repo link on npm ([7a85501](https://github.com/vikejs/vike-react/commit/7a85501148774c871a342881cbe9f06678378754))



## [0.1.4](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.3...vike-react-query@0.1.4) (2025-05-29)


### Bug Fixes

* update +stream usage ([#175](https://github.com/vikejs/vike-react/issues/175)) ([7a3d1d6](https://github.com/vikejs/vike-react/commit/7a3d1d601f0ff2ff45409d92b3226f544eaf24c7))



## [0.1.3](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.2...vike-react-query@0.1.3) (2024-12-04)


### Bug Fixes

* fix infinite requests for useSuspenseQuery ([#157](https://github.com/vikejs/vike-react/issues/157)) ([56e646e](https://github.com/vikejs/vike-react/commit/56e646e643bfd957970dcef10e03c5841ee7955a))



## [0.1.2](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.1...vike-react-query@0.1.2) (2024-11-25)


### Bug Fixes

* use vike@0.4.191 ([9d9342f](https://github.com/vikejs/vike-react/commit/9d9342ff496a0d507819eb178cc332a69b2da039))


### Features

* add ability to create react query client options based on page context ([#154](https://github.com/vikejs/vike-react/issues/154)) ([7e50f90](https://github.com/vikejs/vike-react/commit/7e50f907c42e7e7553e3aca22e6f73034fed8c38))


### BREAKING CHANGES

* Update to `vike@0.4.191` or above.



## [0.1.1](https://github.com/vikejs/vike-react/compare/vike-react-query@0.1.0...vike-react-query@0.1.1) (2024-08-05)


### Bug Fixes

* withFallback bug ([aa51a93](https://github.com/vikejs/vike-react/commit/aa51a93d40cbd5fc04225a56d2be546b794c1fb2))



# [0.1.0](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.7...vike-react-query@0.1.0) (2024-06-16)


### Bug Fixes

* simplify peerDependencies ([d452995](https://github.com/vikejs/vike-react/commit/d4529953ebc403be454f1f443601dbb059b63b62))



## [0.0.7](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.6...vike-react-query@0.0.7) (2024-06-06)


### Bug Fixes

* make `<Wrapper>` cumulative ([#118](https://github.com/vikejs/vike-react/issues/118)) ([b3a7de1](https://github.com/vikejs/vike-react/commit/b3a7de15e29d5aed9c881648fc929d5a29fe65ca))
* require vike-react 0.4.13 ([47cebca](https://github.com/vikejs/vike-react/commit/47cebca5a875dc75ec50ccdfc10650054503a219))


### BREAKING CHANGES

* Update vike-react to 0.4.13 or above.



## [0.0.6](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.5...vike-react-query@0.0.6) (2024-06-05)


### Bug Fixes

* enforce peer dependencies ([e56df6e](https://github.com/vikejs/vike-react/commit/e56df6e0f24541507cec96a506e255d7e862c43b))
* optimistic peerDependencies ([7c6adb0](https://github.com/vikejs/vike-react/commit/7c6adb0eaf36b442a606954f5270988d468818d5))
* require vike-react >=0.4.12 ([cc66263](https://github.com/vikejs/vike-react/commit/cc66263d47842d1d2b975f9489f9bbdc05120695))


### BREAKING CHANGES

* Update all vike-react(-*) packages to their latest
versions, and update Vike to 0.4.173 or above.



## [0.0.5](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.4...vike-react-query@0.0.5) (2024-04-18)


### Bug Fixes

* improve streaming error messages ([24c5d1c](https://github.com/vikejs/vike-react/commit/24c5d1cf0ce5177c5a6f19c5bd0f97647d857967))
* react-query: add name, stack, cause to error ([7a99687](https://github.com/vikejs/vike-react/commit/7a99687d07cfc3338575117a27a8dd9947e61269))
* update react-streaming ([11e64ef](https://github.com/vikejs/vike-react/commit/11e64efb359308c853c17a26397b6d913fc65761))


### Features

* allow user to use vike-react-query and disable streaming (closes [#106](https://github.com/vikejs/vike-react/issues/106)) ([0891b60](https://github.com/vikejs/vike-react/commit/0891b60a4da6c277179f0092cab882a50b6a9de5))



## [0.0.4](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.3...vike-react-query@0.0.4) (2024-02-14)


### Bug Fixes

* set Vike extension name ([02f529e](https://github.com/vikejs/vike-react/commit/02f529eae721f4976fe55ca21ead1bb13e4374e9))



## [0.0.3](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.2...vike-react-query@0.0.3) (2024-01-31)


### BREAKING CHANGES

* Renamed `withFallback` options ([#58](https://github.com/vikejs/vike-react/pull/58))



## [0.0.2](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.1...vike-react-query@0.0.2) (2023-12-14)


### Bug Fixes

* don't rely on import.meta.env ([5b7ceb7](https://github.com/vikejs/vike-react/commit/5b7ceb769c43a60f9c10978f989099972b6ac6cc))
* fix vike-react-query ESM build (fix [#49](https://github.com/vikejs/vike-react/issues/49)) ([12ca0c3](https://github.com/vikejs/vike-react/commit/12ca0c3c5ca673cf179078b5ddb57982b0a20ebc))



## [0.0.1](https://github.com/vikejs/vike-react/releases/tag/vike-react-query@0.0.1) (2023-12-12)
