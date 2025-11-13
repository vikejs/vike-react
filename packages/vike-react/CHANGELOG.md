## [0.6.13](https://github.com/vikejs/vike-react/compare/vike-react@0.6.12...vike-react@0.6.13) (2025-11-13)


### Bug Fixes

* more robust usage of globalThis.__VIKE__IS_CLIENT instead of import.meta.env.SSR ([d694642](https://github.com/vikejs/vike-react/commit/d694642ea585e70ff0aa28c7a3b1125eb063b0a5))


### MINOR BREAKING CHANGES

> [!NOTE]
> We recommend ignoring `MINOR BREAKING CHANGES` unless this version breaks your app, see [Vike Versioning](https://vike.dev/versioning).

* Update Vike to `0.4.242` or above



## [0.6.12](https://github.com/vikejs/vike-react/compare/vike-react@0.6.11...vike-react@0.6.12) (2025-11-07)


### Bug Fixes

* rename ConfigFromHook => ConfigViaHook ([#197](https://github.com/vikejs/vike-react/issues/197)) ([b357ecc](https://github.com/vikejs/vike-react/commit/b357ecc14eeaafb2bfc31923995b22e899211bf7))



## [0.6.11](https://github.com/vikejs/vike-react/compare/vike-react@0.6.10...vike-react@0.6.11) (2025-11-06)


### Features

* +headHtmlBegin / +headHtmlEnd ([#195](https://github.com/vikejs/vike-react/issues/195)) ([4b8bded](https://github.com/vikejs/vike-react/commit/4b8bded5351be65300c19856ca6d15ad3e404a8a))



## [0.6.10](https://github.com/vikejs/vike-react/compare/vike-react@0.6.9...vike-react@0.6.10) (2025-10-21)


### Bug Fixes

* react-streaming@^0.4.11 ([29b4c5b](https://github.com/vikejs/vike-react/commit/29b4c5bbd2800e6f0e0fab2e2687f53e5c4d82e6))


### MINOR BREAKING CHANGES

> [!NOTE]
> We recommend ignoring `MINOR BREAKING CHANGES` unless this version breaks your app, see [Vike Versioning](https://vike.dev/versioning).

* If your app is CJS then update Node.js to v23 or above (or v22 with the `--experimental-require-module` flag) in order to [be able to `require(esm)`](https://nodejs.org/en/blog/announcements/v22-release-announce#support-requireing-synchronous-esm-graphs) . If your app is ESM then you can keep using older Node.js versions.



## [0.6.9](https://github.com/vikejs/vike-react/compare/vike-react@0.6.8...vike-react@0.6.9) (2025-10-10)


### Bug Fixes

* improve component stack injection ([5c7b6c2](https://github.com/vikejs/vike-react/commit/5c7b6c2b37d744b6978b5d86f87f2d1bc0d0ed04))
* react-streaming@^0.4.10 ([092271b](https://github.com/vikejs/vike-react/commit/092271b6be472b724ca056dc2b5b989a83e8f421))



## [0.6.8](https://github.com/vikejs/vike-react/compare/vike-react@0.6.7...vike-react@0.6.8) (2025-10-06)


### Bug Fixes

* react-streaming@^0.4.6 ([fdd3ec1](https://github.com/vikejs/vike-react/commit/fdd3ec142b9fa96391c57d3402d61188c98300b4))



## [0.6.7](https://github.com/vikejs/vike-react/compare/vike-react@0.6.6...vike-react@0.6.7) (2025-10-01)


### Bug Fixes

* inject component stack to stack traces ([#191](https://github.com/vikejs/vike-react/issues/191)) ([0ac8bbf](https://github.com/vikejs/vike-react/commit/0ac8bbfd486eeef9ef9b0a48f1956483af8b196f))
* react-streaming@^0.4.5 ([c435518](https://github.com/vikejs/vike-react/commit/c43551869f3e054db5f9fa2b2a5a51a3a635c49e))



## [0.6.6](https://github.com/vikejs/vike-react/compare/vike-react@0.6.5...vike-react@0.6.6) (2025-09-16)


### Bug Fixes

* ensure root is singleton ([b91ddb5](https://github.com/vikejs/vike-react/commit/b91ddb545069a9f7d2f8e8a76095ee48c0f87018))
* improve React error handling ([#186](https://github.com/vikejs/vike-react/issues/186)) ([a2baf4b](https://github.com/vikejs/vike-react/commit/a2baf4b37ec8c56e929cac61d333e3d2f8d66e4b))
* react-streaming@^0.4.4 ([6420a27](https://github.com/vikejs/vike-react/commit/6420a277e86d0cf829de21f2a22fcf070f1075cd))
* use `<style>` instead `.css` for `+Loading` ([#184](https://github.com/vikejs/vike-react/issues/184)) ([b8ba930](https://github.com/vikejs/vike-react/commit/b8ba930b5a3ef1728dac0c90743704396f5dae0d))



## [0.6.5](https://github.com/vikejs/vike-react/compare/vike-react@0.6.4...vike-react@0.6.5) (2025-07-18)


### Bug Fixes

* react-streaming@^0.4.3 ([66c564c](https://github.com/vikejs/vike-react/commit/66c564c68a239fd8f7a9512391bd5752cb65d8be))



## [0.6.4](https://github.com/vikejs/vike-react/compare/vike-react@0.6.3...vike-react@0.6.4) (2025-05-29)


### Features

* +stream.enable ([#173](https://github.com/vikejs/vike-react/issues/173)) ([858d050](https://github.com/vikejs/vike-react/commit/858d0505b4ba5bbd52fbf00c14bc97614482f280))



## [0.6.3](https://github.com/vikejs/vike-react/compare/vike-react@0.6.2...vike-react@0.6.3) (2025-05-16)


### Bug Fixes

* import CSS onl on the client-side (fix vikejs/vike[#2460](https://github.com/vikejs/vike-react/issues/2460)) ([43a5cc1](https://github.com/vikejs/vike-react/commit/43a5cc1ebd30c619fbfb59f3dbbba09b9d4a30c4))



## [0.6.2](https://github.com/vikejs/vike-react/compare/vike-react@0.6.1...vike-react@0.6.2) (2025-05-16)


### Bug Fixes

* fix providePageContext usage ([#172](https://github.com/vikejs/vike-react/issues/172)) ([a9afa2d](https://github.com/vikejs/vike-react/commit/a9afa2de5d01b18a21d48c2f0cc8c8f3e22bb23a))



## [0.6.1](https://github.com/vikejs/vike-react/compare/vike-react@0.6.0...vike-react@0.6.1) (2025-03-16)


### Bug Fixes

* allow user to override pageContext.{pageHtmlString,pageHtmlStream} (vikejs/vike[#389](https://github.com/vikejs/vike-react/issues/389), https://github.com/vikejs/vike/issues/389#issuecomment-2725260763) ([95cf570](https://github.com/vikejs/vike-react/commit/95cf5706c962d6ed6a13860630d9fc65275a2a2b)), closes [/github.com/vikejs/vike/issues/389#issuecomment-2725260763](https://github.com//github.com/vikejs/vike/issues/389/issues/issuecomment-2725260763)



# [0.6.0](https://github.com/vikejs/vike-react/compare/vike-react@0.5.13...vike-react@0.6.0) (2025-03-11)


### Bug Fixes

* update react-streaming to `^0.4.2` ([#168](https://github.com/vikejs/vike-react/issues/168)) ([9ae0bfb](https://github.com/vikejs/vike-react/commit/9ae0bfbc974be8421a672ed485ebba484a8c1153))


### BREAKING CHANGES

* Update React to `19.0.0` or above.



## [0.5.13](https://github.com/vikejs/vike-react/compare/vike-react@0.5.12...vike-react@0.5.13) (2025-02-16)


### Bug Fixes

* support `stream: false` ([702d05e](https://github.com/vikejs/vike-react/commit/702d05ee163a981f882fec88c93491b3c6e4302e))


### Features

* +react.{client,server}.js ([#165](https://github.com/vikejs/vike-react/issues/165)) ([831e451](https://github.com/vikejs/vike-react/commit/831e451aadf5b2798ec2ffc9c310562ec6184dff))



## [0.5.12](https://github.com/vikejs/vike-react/compare/vike-react@0.5.11...vike-react@0.5.12) (2025-01-22)


### Bug Fixes

* align ReactNode types ([840a114](https://github.com/vikejs/vike-react/commit/840a1143b8d46d6112726517a32b35baf7f65c22))
* update react-streaming ([79b8240](https://github.com/vikejs/vike-react/commit/79b8240f297475e9e3e5db3137c3bd61b9ecd23e))



## [0.5.11](https://github.com/vikejs/vike-react/compare/vike-react@0.5.10...vike-react@0.5.11) (2024-12-26)


### Bug Fixes

* workaround error `Cannot find namespace JSX` ([076f42a](https://github.com/vikejs/vike-react/commit/076f42acef1fb82918b47a173fba1077e0533e04))



## [0.5.10](https://github.com/vikejs/vike-react/compare/vike-react@0.5.9...vike-react@0.5.10) (2024-12-10)


### Bug Fixes

* simplify JSDocs for stream setting ([d7615f0](https://github.com/vikejs/vike-react/commit/d7615f030aefac8797ace0b354589c5e14200ab4))



## [0.5.9](https://github.com/vikejs/vike-react/compare/vike-react@0.5.8...vike-react@0.5.9) (2024-11-30)


### Bug Fixes

* add `ImportString` type to `onBeforeRenderHtml` & `onAfterRenderHtml` ([b102b72](https://github.com/vikejs/vike-react/commit/b102b72e4da3dbbad3813007bba9b31dfb610464))
* add eject.config.js ([0070495](https://github.com/vikejs/vike-react/commit/00704957fcf374ad0c7ebb0645a36b8d2035d2d2))
* rename +config.js to config.js ([fcac4b0](https://github.com/vikejs/vike-react/commit/fcac4b0ac9076925f6a874d05fd6129fd7c787ac))



## [0.5.8](https://github.com/vikejs/vike-react/compare/vike-react@0.5.7...vike-react@0.5.8) (2024-11-20)


### Bug Fixes

* improve JSDoc ([d45d142](https://github.com/vikejs/vike-react/commit/d45d1422323ed07f4816e35d449fff618f07823d))
* set pageContext.page also on the server-side ([958d8da](https://github.com/vikejs/vike-react/commit/958d8da948d01ed78cdbbe7045a4cf68d5460177))


### Features

* new hook onBeforeRenderHtml() ([#87](https://github.com/vikejs/vike-react/issues/87)) ([04ca5b8](https://github.com/vikejs/vike-react/commit/04ca5b8fc0ae267728687cc8d36069ee56776fee))



## [0.5.7](https://github.com/vikejs/vike-react/compare/vike-react@0.5.6...vike-react@0.5.7) (2024-09-21)


### Bug Fixes

* await rendering before apply head settings ([9261c4b](https://github.com/vikejs/vike-react/commit/9261c4b183efd6a8ce783eb2645db774eaaea6f9))



## [0.5.6](https://github.com/vikejs/vike-react/compare/vike-react@0.5.5...vike-react@0.5.6) (2024-09-10)


### Bug Fixes

* properly export config (vikejs/vike-vue[#194](https://github.com/vikejs/vike-react/issues/194)) ([4fb2251](https://github.com/vikejs/vike-react/commit/4fb22517c3da62f0e361fcf7eb9d106b5cde127d))
* return undefined instead of throw error upon missing pageContext (fix [#147](https://github.com/vikejs/vike-react/issues/147)) ([68b6dc0](https://github.com/vikejs/vike-react/commit/68b6dc0b5b8933ca94f186dff02dc5b7df7ee18e))



## [0.5.5](https://github.com/vikejs/vike-react/compare/vike-react@0.5.4...vike-react@0.5.5) (2024-08-30)


### Features

* add bodyHtmlBegin, bodyHtmlEnd ([#146](https://github.com/vikejs/vike-react/issues/146)) ([6fbf795](https://github.com/vikejs/vike-react/commit/6fbf795c4422039c42c6cf0911dc9efe37df9cad))



## [0.5.4](https://github.com/vikejs/vike-react/compare/vike-react@0.5.3...vike-react@0.5.4) (2024-08-24)


### Bug Fixes

* add JSDocs ([9dfd4ab](https://github.com/vikejs/vike-react/commit/9dfd4abe6cfd8fa6ed199acdb736fc8a644f2474))
* make useConfig() work for vike-react hooks ([5d21040](https://github.com/vikejs/vike-react/commit/5d2104013956197cd367eb147bdc347ae964969c))
* use vike@0.4.191 ([9d9342f](https://github.com/vikejs/vike-react/commit/9d9342ff496a0d507819eb178cc332a69b2da039))


### Features

* new hook onAfterRenderHtml() ([acd5466](https://github.com/vikejs/vike-react/commit/acd54666c4c391690224a11b8f08521e2df42dbd))


### BREAKING CHANGES

* Update to `vike@0.4.191` or above.



## [0.5.3](https://github.com/vikejs/vike-react/compare/vike-react@0.5.2...vike-react@0.5.3) (2024-08-17)


### Bug Fixes

* enable useConfig() after hydration ([c1e0c83](https://github.com/vikejs/vike-react/commit/c1e0c8327aca1f06999b104432ead562c8eec8c4))
* fix `useConfig()` for `{body,html}Attributes` (vikejs/vike-vue[#180](https://github.com/vikejs/vike-react/issues/180)) ([653b808](https://github.com/vikejs/vike-react/commit/653b808846446182e7d7b51fddc247ad8bc722af))
* fix callable cumulative configs ([a6c82a2](https://github.com/vikejs/vike-react/commit/a6c82a27ec5a2e916a1fdc93dae5a9465286f93b))
* support callable cumulative configs ([a53b7c1](https://github.com/vikejs/vike-react/commit/a53b7c17dfa2e03e816e33db5295b7c019ee1f7d))
* update lang upon useConfig() ([405af64](https://github.com/vikejs/vike-react/commit/405af647a524de7901f3a2c1ae12b7c87083931f))



## [0.5.2](https://github.com/vikejs/vike-react/compare/vike-react@0.5.1...vike-react@0.5.2) (2024-08-12)


### Bug Fixes

* add `null` and `undefined` to head settings type ([8acc892](https://github.com/vikejs/vike-react/commit/8acc8922e404930c86f5fa5fc033283876ca1955))
* make `null` override previous value ([7777570](https://github.com/vikejs/vike-react/commit/77775708a9c757bce41d03ce203d4baaaf77cbcf))


### Features

* add `useConfig()` support for `lang` and `favicon` settings ([a0d1520](https://github.com/vikejs/vike-react/commit/a0d1520ec75c0ecfb78dfd4e3bf613b02c078917))
* support setting `{body,html}Attributes` based on `pageContext` ([41fd399](https://github.com/vikejs/vike-react/commit/41fd3995fea74347eb125de304b5fbbc22126209))
* support setting viewport based on `pageContext` ([540e91d](https://github.com/vikejs/vike-react/commit/540e91ddd4cfc75f20a5537fb24b64739ed5bda7))



## [0.5.1](https://github.com/vikejs/vike-react/compare/vike-react@0.5.0...vike-react@0.5.1) (2024-08-06)


### Bug Fixes

* fix cumulative Head handling ([9ae756b](https://github.com/vikejs/vike-react/commit/9ae756bf74ebcf7f2f21ec2b1a0fcc6458577852))
* improve <head> tags order ([ba1cfd3](https://github.com/vikejs/vike-react/commit/ba1cfd3f374d36db132d5c37fae0642d59732ecf))
* improve JSDocs ([def8c09](https://github.com/vikejs/vike-react/commit/def8c0920dca2ddb9a7c70f74361bf3992392e39))
* make hooks `onBeforeRenderClient()` and `onAfterRenderClient()` cumulative ([dc4d944](https://github.com/vikejs/vike-react/commit/dc4d944a677f8ffc834aa827d8ab2fc24cdb83f4))
* more accurate pageContext type for setting getters ([43f6421](https://github.com/vikejs/vike-react/commit/43f64216ce5ed61529e42b75919468f2ee5c8423))



# [0.5.0](https://github.com/vikejs/vike-react/compare/vike-react@0.4.18...vike-react@0.5.0) (2024-08-01)


### Bug Fixes

* avoid overriding Head setting (fix [#135](https://github.com/vikejs/vike-react/issues/135)) ([#136](https://github.com/vikejs/vike-react/issues/136)) ([5c88c7b](https://github.com/vikejs/vike-react/commit/5c88c7b4aa47b01ab66c46eb5c67571298004104))
* clearer (and maybe more accurate) condition for updating document properties ([6784bac](https://github.com/vikejs/vike-react/commit/6784bac6fa3c4cf9f4d0b9661a45097a38d2880a))
* make favicon setting global ([28f1c2b](https://github.com/vikejs/vike-react/commit/28f1c2b4bea348ece352136ee3da51c25d59dfe2))


### Features

* [`useConfig()`](https://vike.dev/useConfig) ([#128](https://github.com/vikejs/vike-react/issues/128)) ([8d0245c](https://github.com/vikejs/vike-react/commit/8d0245ca2a84e7b3768b335df6fd39545df0e256))
* new setting [`description`](https://vike.dev/description) ([60ffecd](https://github.com/vikejs/vike-react/commit/60ffecd9dcfdaa50d5dea02a8b081eeb2b684188))
* new setting [`image`](https://vike.dev/image) ([41ec933](https://github.com/vikejs/vike-react/commit/41ec933aeb8d0ba5334c10377e67ef68fdc0334e))
* new setting [`viewport`](https://vike.dev/viewport) ([bebaf38](https://github.com/vikejs/vike-react/commit/bebaf386aa0cf1ac06351eadf84e1ab69d5da00d))
* new settings [`htmlAttributes`](https://vike.dev/htmlAttributes) and [`bodyAttributes`](https://vike.dev/bodyAttributes) ([427c7cf](https://github.com/vikejs/vike-react/commit/427c7cf2595a8e19fc0f9a4fd6ce4dc05bd3f058))


### BREAKING CHANGES

* The responsive viewport tag is now injected by default (`<meta name="viewport" content="width=device-width,initial-scale=1">`). If you already inject `<meta name="viewport">` then remove it or set the `viewport` setting to `null`, see https://vike.dev/viewport.
* The setting `favicon` now only accepts one global
value, see https://vike.dev/favicon#global
* update vike to `0.4.182` or above
* The `Head` setting is now cumulative https://vike.dev/Head#cumulative



## [0.4.18](https://github.com/vikejs/vike-react/compare/vike-react@0.4.17...vike-react@0.4.18) (2024-07-16)


### Bug Fixes

* add og:title tag (fix vikejs/vike[#1732](https://github.com/vikejs/vike-react/issues/1732)) ([024b6ad](https://github.com/vikejs/vike-react/commit/024b6ad7527425389d0e06577609979e9803779d))
* fix document setting types ([7fe7b04](https://github.com/vikejs/vike-react/commit/7fe7b045ce8c7af93910948df1b7f9d72da8dd37))
* remove pageContext.userAgent type in favor of ([079886d](https://github.com/vikejs/vike-react/commit/079886de727d76638accf20322fd2b286621261a))
* update react-streaming ([c0679d6](https://github.com/vikejs/vike-react/commit/c0679d68c7a1d21752f2f7d57396bf1c77fd412e))


### Features

* Loading config ([#133](https://github.com/vikejs/vike-react/issues/133)) ([2737f03](https://github.com/vikejs/vike-react/commit/2737f03cf09d3e2649672001902f8254b3864272))



## [0.4.17](https://github.com/vikejs/vike-react/compare/vike-react@0.4.16...vike-react@0.4.17) (2024-07-06)


### Bug Fixes

* update react-streaming ([c98d97b](https://github.com/vikejs/vike-react/commit/c98d97b298cd42c0cfc7f23a43f4a020a34d5a08))


### Features

* add clientOnly helper ([#127](https://github.com/vikejs/vike-react/issues/127)) ([dfa586c](https://github.com/vikejs/vike-react/commit/dfa586c40454aaece3415b4454e3a4d94ceec3af))



## [0.4.16](https://github.com/vikejs/vike-react/compare/vike-react@0.4.15...vike-react@0.4.16) (2024-07-03)


### Bug Fixes

* use react-streaming >=0.3.36 and vike >=0.4.178 ([cac8d49](https://github.com/vikejs/vike-react/commit/cac8d49ec4f3903b75e39c82b2f1091c8540794e))



## [0.4.15](https://github.com/vikejs/vike-react/compare/vike-react@0.4.14...vike-react@0.4.15) (2024-06-25)


### Features

* Add support for manual override of stream type ([#122](https://github.com/vikejs/vike-react/issues/122)) ([7a1e9f2](https://github.com/vikejs/vike-react/commit/7a1e9f24212bf2d6a1ff91e7cb36f44f8201ee94))



## [0.4.14](https://github.com/vikejs/vike-react/compare/vike-react@0.4.13...vike-react@0.4.14) (2024-06-13)


### Features

* make `Layout` setting cumulative ([92f8da4](https://github.com/vikejs/vike-react/commit/92f8da478dbfd60af8a89201065811a59d81b2eb))


### BREAKING CHANGES

* The `Layout` setting cannot be overriden anymore because it's now cumulative, see:
 - https://vike.dev/Layout#multiple-layouts
 - https://vike.dev/Layout#nested-layouts



## [0.4.13](https://github.com/vikejs/vike-react/compare/vike-react@0.4.12...vike-react@0.4.13) (2024-06-06)


### Bug Fixes

* make `<Wrapper>` cumulative ([#118](https://github.com/vikejs/vike-react/issues/118)) ([b3a7de1](https://github.com/vikejs/vike-react/commit/b3a7de15e29d5aed9c881648fc929d5a29fe65ca))



## [0.4.12](https://github.com/vikejs/vike-react/compare/vike-react@0.4.11...vike-react@0.4.12) (2024-06-05)


### Bug Fixes

* enforce peer dependencies ([e56df6e](https://github.com/vikejs/vike-react/commit/e56df6e0f24541507cec96a506e255d7e862c43b))
* optimistic peerDependencies ([7c6adb0](https://github.com/vikejs/vike-react/commit/7c6adb0eaf36b442a606954f5270988d468818d5))
* use pageContext.headers[user-agent] ([53fcec7](https://github.com/vikejs/vike-react/commit/53fcec7d18aae902cc968126c5d7df54673f42bc))


### Features

* make streamIsRequired public ([262bf96](https://github.com/vikejs/vike-react/commit/262bf963cdd1e66b63db1986f9a333354b574a3a))


### BREAKING CHANGES

* Update all vike-react(-*) packages to their latest
versions, and update Vike to 0.4.173 or above.



## [0.4.11](https://github.com/vikejs/vike-react/compare/vike-react@0.4.10...vike-react@0.4.11) (2024-05-30)


### Bug Fixes

* improve `usePageContext()` JSDoc ([0f83834](https://github.com/vikejs/vike-react/commit/0f83834ebe27c99eb519be9aad231ef07c181dd2))
* remove counterproductive assert() (fix [#115](https://github.com/vikejs/vike-react/issues/115)) ([2cc16cf](https://github.com/vikejs/vike-react/commit/2cc16cfa7a5b434031c528604d3c10c758678a31))



## [0.4.10](https://github.com/vikejs/vike-react/compare/vike-react@0.4.9...vike-react@0.4.10) (2024-05-17)


### Bug Fixes

* add links to JSDocs ([b0e4441](https://github.com/vikejs/vike-react/commit/b0e4441f47d724dd5a1abc3fd76116f30256d0a4))
* rename root ID `#react-root` => `#root` ([843151d](https://github.com/vikejs/vike-react/commit/843151d987e7ccdad7380c90515d91eb0ff3a512))



## [0.4.9](https://github.com/vikejs/vike-react/compare/vike-react@0.4.8...vike-react@0.4.9) (2024-05-12)


### Features

* `onBeforeRenderClient()` (closes [#110](https://github.com/vikejs/vike-react/issues/110)) ([#111](https://github.com/vikejs/vike-react/issues/111)) ([68be831](https://github.com/vikejs/vike-react/commit/68be8317420ce25aa280a58fb1dcf1a5337fb4ab))
* new setting `reactStrictMode` (closes [#109](https://github.com/vikejs/vike-react/issues/109)) ([67ba4e7](https://github.com/vikejs/vike-react/commit/67ba4e778c4272a17a109278edebadc8c810002f))



## [0.4.8](https://github.com/vikejs/vike-react/compare/vike-react@0.4.7...vike-react@0.4.8) (2024-04-18)


### Bug Fixes

* update react-streaming ([11e64ef](https://github.com/vikejs/vike-react/commit/11e64efb359308c853c17a26397b6d913fc65761))


### Features

* allow user to use vike-react-query and disable streaming (closes [#106](https://github.com/vikejs/vike-react/issues/106)) ([0891b60](https://github.com/vikejs/vike-react/commit/0891b60a4da6c277179f0092cab882a50b6a9de5))



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
