Contributions welcome!

**1. Install**

```shell
git clone git@github.com:vikejs/vike-react
cd vike-react/
pnpm install
```

> [!NOTE]
> See [System requirements](#system-requirements) for how to install pnpm.

**2. Build**

Build all `packages/*`:

```shell
pnpm build
```

**3. Develop**

Watch & re-build upon modifications:

```shell
cd packages/vike-react # or any other packages/*
pnpm dev
```

In a second shell:

```shell
cd examples/full/ # or any other examples/*
pnpm dev
```

That's it. You can now view and test your modifications.

> [!Warning]
> After changing the source code of `vike-react(-*)`, make sure to **always clear Vite's client cache** with `$ rm -rf examples/full/node_modules/.vite/`. Otherwise you'll get a version mismatch between the server (using the latest build) and the client (using the previous cached build).

> [!Warning]
> When switching Git branches, make sure to **run `pnpm reset`** at the monorepo root: it will re-install and re-build everything. It's required when swtiching to a branch that, for example, requires another Vike version.

<br/>

## System requirements

- Node.js `>=16.0.0`
- pnpm `>=9.0.0`

> [!NOTE]
> To install [pnpm](https://pnpm.io) run:
> ```shell
> npm install -g pnpm
> ```
> (Or see [pnpm.io > Installation](https://pnpm.io/installation#using-npm) for alternative methods.)
