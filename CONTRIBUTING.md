# Contributing

## Building

Build `vike-react`:

```bash
git clone git@github.com:vikejs/vike-react
cd vike-react/ && pnpm install
pnpm build
cd ../
```

> Note that:
>
> - You'll need [pnpm](https://pnpm.io/) which you can install with `$ npm install -g pnpm`.
> - Windows may or may not work.
>
> These requirements only hold for developing `vike-react`: the npm package `vike-react` can be used with Windows and any package manager.

## Validating

### Running the examples

You can then test your modifications against an example, e.g. `examples/basic/`:

```bash
cd examples/basic/
pnpm dev
cd ../../
```

## Releasing

Choose the next version number according to the rules of
[Semantic Versioning](https://semver.org/). Let's assume you are releasing
version `1.2.3`, run:

```bash
cd vike-react/
pnpm exec release-me v1.2.3
cd ../
```

This will:

- update the version number and dependencies in `package.json`,
- extend [`CHANGELOG.md`](CHANGELOG.md),
- update the `pnpm-lock.yaml` file,
- create a `release: v1.2.3` git commit and push it,
- create a `v1.2.3` git tag and push it,
- build the package and publish it to npm.

Extend [`CHANGELOG.md`](CHANGELOG.md) if anything is missing, as the release
script only picks up commits
[that match the pattern of "Feature", "Fix", "Performance Improvement" or "Breaking Changes"](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli).
