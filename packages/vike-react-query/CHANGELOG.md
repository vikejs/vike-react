## [0.0.3](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.2...vike-react-query@0.0.3) (2024-01-31)


### Bug Fixes

* deprecate pageContext.title ([2c05738](https://github.com/vikejs/vike-react/commit/2c05738f80db0d1f2a0638e38d338ac72071b8f4))
* deprecate pageProps usage ([cb1a14f](https://github.com/vikejs/vike-react/commit/cb1a14fe57e58685b14fbe423cb0fc8c2862e669))
* enforce vike@0.4.160 ([e2bed96](https://github.com/vikejs/vike-react/commit/e2bed9616712d8fa5234ef59ad4c91f85cfeaca0))
* export config at `/config` instead of `/` ([4111cd8](https://github.com/vikejs/vike-react/commit/4111cd87fc7e5b83e8283df8990933f894d4d35f))
* fix $$typeof workaround ([cb9ffa3](https://github.com/vikejs/vike-react/commit/cb9ffa310533e4a1ddb06e247df1361ef2a87a1a))
* improve bug error message ([21bdb82](https://github.com/vikejs/vike-react/commit/21bdb82269b5e1c603bb9f2f6835bcb4c1bffb89))
* improve deprecation warning ([4ab380a](https://github.com/vikejs/vike-react/commit/4ab380a9a365c149f31e6edd3fd336fd28ba0dde))
* simplify `<head>` management ([572d71d](https://github.com/vikejs/vike-react/commit/572d71d5b0531342025546b09688359729c9eaae))
* workaround dev tool issue (fix [#25](https://github.com/vikejs/vike-react/issues/25)) ([bce4a81](https://github.com/vikejs/vike-react/commit/bce4a81ddd00965a070d1941cff2540ec1778d13))


### Features

* useData() ([dbb9bf2](https://github.com/vikejs/vike-react/commit/dbb9bf2c9cada87e48e27657fb2296fc02bebac7))


### BREAKING CHANGES

* Setting the page's title using `pageContext.title`
is deprecated (`pageContext.description` and `pageContext.lang` are
also deprecated), use the settings `title` and `Head` instead,
see https://vike.dev/head
* Fetching data using `pageContext.pageProps` is
deprecated, use `data()` and `useData()` instead,
see https://vike.dev/data-fetching



## [0.0.2](https://github.com/vikejs/vike-react/compare/vike-react-query@0.0.1...vike-react-query@0.0.2) (2023-12-14)


### Bug Fixes

* don't rely on import.meta.env ([5b7ceb7](https://github.com/vikejs/vike-react/commit/5b7ceb769c43a60f9c10978f989099972b6ac6cc))
* fix vike-react-query ESM build (fix [#49](https://github.com/vikejs/vike-react/issues/49)) ([12ca0c3](https://github.com/vikejs/vike-react/commit/12ca0c3c5ca673cf179078b5ddb57982b0a20ebc))



## [0.0.1](https://github.com/vikejs/vike-react/releases/tag/vike-react-query@0.0.1) (2023-12-12)
