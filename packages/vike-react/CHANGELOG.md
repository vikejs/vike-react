## [0.4.7](https://github.com/vikejs/vike-react/compare/vike-react@0.4.6...vike-react@0.4.7) (2024-04-17)


### Bug Fixes

* add eco stamp ([ca46452](https://github.com/vikejs/vike-react/commit/ca46452992a7ea94e8f58e40f5062ba56a0b56eb))
* improve JSDoc ([74daf53](https://github.com/vikejs/vike-react/commit/74daf53297c7bd0bc8956414011dc3f3926d3f90))
* improve JSDocs ([251be5d](https://github.com/vikejs/vike-react/commit/251be5df6dba64f839e4191cf392cbe02b3534eb))
* improve streaming error messages ([24c5d1c](https://github.com/vikejs/vike-react/commit/24c5d1cf0ce5177c5a6f19c5bd0f97647d857967))


### Features

* impl onAfterRenderClient() hook ([ddbbdaa](https://github.com/vikejs/vike-react/commit/ddbbdaae953a133d1d705bfbab142655defbeb2e))



## [0.4.6](https://github.com/vikejs/vike-react/compare/vike-react@0.4.5...vike-react@0.4.6) (2024-02-14)


### Bug Fixes

* set Vike extension name ([02f529e](https://github.com/vikejs/vike-react/commit/02f529eae721f4976fe55ca21ead1bb13e4374e9))



## [0.4.5](https://github.com/vikejs/vike-react/compare/vike-react@0.4.4...vike-react@0.4.5) (2024-02-12)


### Bug Fixes

* update react-streaming ([382e638](https://github.com/vikejs/vike-react/commit/382e638d1e11f2dbe08fecac7920ca7c4853c3c3))



## [0.4.4](https://github.com/vikejs/vike-react/compare/vike-react@0.4.3...vike-react@0.4.4) (2024-01-23)


### Bug Fixes

* improve deprecation warning ([4ab380a](https://github.com/vikejs/vike-react/commit/4ab380a9a365c149f31e6edd3fd336fd28ba0dde))



## [0.4.3](https://github.com/vikejs/vike-react/compare/vike-react@0.4.2...vike-react@0.4.3) (2024-01-23)


### Bug Fixes

* enforce vike@0.4.160 ([e2bed96](https://github.com/vikejs/vike-react/commit/e2bed9616712d8fa5234ef59ad4c91f85cfeaca0))
* export config at `/config` instead of `/` ([4111cd8](https://github.com/vikejs/vike-react/commit/4111cd87fc7e5b83e8283df8990933f894d4d35f))


### BREAKING CHANGES

* Update Vike to `0.4.160` or above.
* Replace `import vikeReact from 'vike-react'` with `import vikeReact from 'vike-react/config'`. (Typically in your `/pages/+config.js`.)


## [0.4.2](https://github.com/vikejs/vike-react/compare/vike-react@0.4.1...vike-react@0.4.2) (2024-01-21)


### Bug Fixes

* fix $$typeof workaround ([cb9ffa3](https://github.com/vikejs/vike-react/commit/cb9ffa310533e4a1ddb06e247df1361ef2a87a1a))



## [0.4.1](https://github.com/vikejs/vike-react/compare/vike-react@0.4.0...vike-react@0.4.1) (2024-01-21)


### Bug Fixes

* workaround dev tool issue (fix [#25](https://github.com/vikejs/vike-react/issues/25)) ([bce4a81](https://github.com/vikejs/vike-react/commit/bce4a81ddd00965a070d1941cff2540ec1778d13))



# [0.4.0](https://github.com/vikejs/vike-react/compare/vike-react@0.3.9...vike-react@0.4.0) (2024-01-21)


### Bug Fixes

* deprecate pageContext.title ([2c05738](https://github.com/vikejs/vike-react/commit/2c05738f80db0d1f2a0638e38d338ac72071b8f4))
* deprecate pageProps usage ([cb1a14f](https://github.com/vikejs/vike-react/commit/cb1a14fe57e58685b14fbe423cb0fc8c2862e669))
* improve bug error message ([21bdb82](https://github.com/vikejs/vike-react/commit/21bdb82269b5e1c603bb9f2f6835bcb4c1bffb89))
* simplify `<head>` management ([572d71d](https://github.com/vikejs/vike-react/commit/572d71d5b0531342025546b09688359729c9eaae))


### BREAKING CHANGES

* Setting the page's title using `pageContext.title`
is deprecated (`pageContext.description` and `pageContext.lang` are
also deprecated), use the settings `title` and `Head` instead,
see https://vike.dev/head
* Fetching data using `pageContext.pageProps` is
deprecated, use `data()` and `useData()` instead,
see https://vike.dev/data-fetching
* Replace `import vikeReact from 'vike-react'` with `import vikeReact from 'vike-react/config'`. (Typically in your `/pages/+config.js`.)
* Update Vike to `0.4.160` or above.



## [0.3.9](https://github.com/vikejs/vike-react/compare/vike-react@0.3.8...vike-react@0.3.9) (2024-01-17)


### Bug Fixes

* Update `lang` on client-side navigation ([#61](https://github.com/vikejs/vike-react/pull/61))



## [0.3.8](https://github.com/vikejs/vike-react/compare/vike-react@0.3.7...vike-react@0.3.8) (2023-12-24)


### Features

* `useData()` ([dbb9bf2](https://github.com/vikejs/vike-react/commit/dbb9bf2c9cada87e48e27657fb2296fc02bebac7))



## [0.3.7](https://github.com/vikejs/vike-react/compare/vike-react@0.3.6...vike-react@0.3.7) (2023-12-07)


### Bug Fixes

* improve ClientOnly performance and fix SSR fallback ([3577255](https://github.com/vikejs/vike-react/commit/357725502328d7570f8441c9382efedfb0e638e0))



## [0.3.6](https://github.com/vikejs/vike-react/compare/v0.3.5...vike-react@0.3.6) (2023-12-06)


### Features

* add `stream` setting ([#40](https://github.com/vikejs/vike-react/pull/40))



## [0.3.5](https://github.com/vikejs/vike-react/compare/v0.3.4...v0.3.5) (2023-11-30)


### Bug Fixes

* fix `useId()` when using SSR ([#36](https://github.com/vikejs/vike-react/issues/36))


### Features

* add `<ClientOnly>` component ([#35](https://github.com/vikejs/vike-react/pull/35))



## [0.3.4](https://github.com/vikejs/vike-react/compare/v0.3.3...v0.3.4) (2023-11-18)


### Bug Fixes

* don't use react-streaming when SSR is disabled ([#34](https://github.com/vikejs/vike-react/issues/34)) ([6c7c38a](https://github.com/vikejs/vike-react/commit/6c7c38a462ed1348676a61b60a0e25f30d2e8ffe))



## [0.3.3](https://github.com/vikejs/vike-react/compare/v0.3.2...v0.3.3) (2023-11-17)


### Features

* support HTML streaming ([e349788](https://github.com/vikejs/vike-react/commit/e349788627cdb3e6cae0b40daca5b283f5b4f5ea))



## [0.3.2](https://github.com/vikejs/vike-react/compare/v0.3.1...v0.3.2) (2023-11-17)


### Bug Fixes

* merge conflict ([9440f22](https://github.com/vikejs/vike-react/commit/9440f22cfe3e0f5aebf098c6f7ce80c26456a8ec))
* possibly unset document title on client routing ([dc12493](https://github.com/vikejs/vike-react/commit/dc12493e1e6fc034edbdb58598439ca67518c40c))


### Features

* add link to repo to SSR shell ([d53c74d](https://github.com/vikejs/vike-react/commit/d53c74dd361979587149c29fbbdb3f299713235f))



## [0.3.1](https://github.com/vikejs/vike-react/compare/v0.3.0...v0.3.1) (2023-11-17)


### Bug Fixes

* use latest version of the Vike V1 design ([3ddf5e2](https://github.com/vikejs/vike-react/commit/3ddf5e2dd5b4cb072af3e774f9f29d7a5fa99344))



# [0.3.0](https://github.com/vikejs/vike-react/compare/v0.2.1...v0.3.0) (2023-09-23)


### Bug Fixes

* migrate to `vike` ([d82713b](https://github.com/vikejs/vike-react/commit/d82713b5de0c28abfc58adb81b282b4a18f292d0))


### BREAKING CHANGES

* use npm package `vike` instead of `vite-plugin-ssr`,
see https://vite-plugin-ssr.com/vike



## [0.2.1](https://github.com/vikejs/vike-react/compare/v0.2.0...v0.2.1) (2023-09-22)


### Bug Fixes

* use Vike.PageContext ([33a8be1](https://github.com/vikejs/vike-react/commit/33a8be12bb62f885108cc0e6d8870cfe060a946b))



# [0.2.0](https://github.com/vikejs/vike-react/compare/v0.1.6...v0.2.0) (2023-09-20)


### Bug Fixes

* remove now useless type re-exports ([93b8383](https://github.com/vikejs/vike-react/commit/93b83833338db424ad0f0d82b63364ee4e6298c6))
* use interface merging ([2db9bbd](https://github.com/vikejs/vike-react/commit/2db9bbd5819baddcc37848c6336a01738fdd5a6c))


### BREAKING CHANGES

* Import `Config` from `vike` instead of `vike-react`.
  ```diff
  - import type { Config } from 'vike-react'
  + import type { Config } from 'vike/types'
  ```



## [0.1.6](https://github.com/vikejs/vike-react/compare/v0.1.5...v0.1.6) (2023-06-24)

### Bug Fixes

- fix 'vike-react' type ([9fe6825](https://github.com/vikejs/vike-react/commit/9fe68251585646a6233465bc8ba5bed58b941439))
- keep concrete types of vike-react config ([07a811f](https://github.com/vikejs/vike-react/commit/07a811fc885a8b13b97818dc35902de33dcd8d0f))
- simplify type `Config` ([2fe1dcc](https://github.com/vikejs/vike-react/commit/2fe1dcca47a6ee16c1623280a21e91941b100850))

## [0.1.5](https://github.com/vikejs/vike-react/compare/v0.1.4...v0.1.5) (2023-05-26)

### Bug Fixes

- use latest vps version ([f35836e](https://github.com/vikejs/vike-react/commit/f35836e98f48b9eeb2d0aad3252afbc8f1d77aa0))

## [0.1.4](https://github.com/vikejs/vike-react/compare/v0.1.3...v0.1.4) (2023-05-26)

### Bug Fixes

- use latest vps commit ([d08e03d](https://github.com/vikejs/vike-react/commit/d08e03dd07e47014fe00a879761c676fad813ef7))

## [0.1.3](https://github.com/vikejs/vike-react/compare/v0.1.2...v0.1.3) (2023-05-24)

### Bug Fixes

- fix type pointer ([c7841f2](https://github.com/vikejs/vike-react/commit/c7841f2a3385aede9dccdb7aefa338a0274fc7fc))

## [0.1.2](https://github.com/vikejs/vike-react/compare/v0.1.1...v0.1.2) (2023-05-24)

### Bug Fixes

- fix ESM import paths - 2 ([5c881e5](https://github.com/vikejs/vike-react/commit/5c881e55d7834d00a3af99ad15db488a0b77a2d1))

## [0.1.1](https://github.com/vikejs/vike-react/compare/v0.1.0...v0.1.1) (2023-05-24)

### Bug Fixes

- fix ESM import paths ([60c4423](https://github.com/vikejs/vike-react/commit/60c44231d3d39c12dd1443b000c9f2466bde7597))

## 0.1.0 (2023-05-24)
