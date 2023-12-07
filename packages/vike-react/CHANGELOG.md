## [0.3.7](https://github.com/vikejs/vike-react/compare/v0.3.5...v0.3.7) (2023-12-07)


### Bug Fixes

* improve ClientOnly performance and fix SSR fallback ([3577255](https://github.com/vikejs/vike-react/commit/357725502328d7570f8441c9382efedfb0e638e0))



## [0.3.6](https://github.com/vikejs/vike-react/compare/v0.3.5...v0.3.6) (2023-12-06)


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
